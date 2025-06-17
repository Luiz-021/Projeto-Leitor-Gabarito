from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status, mixins, viewsets
from django.core.files.storage import default_storage

from .serializers import (
    UploadLeituraSerializer,
    ConfirmarLeituraSerializer,
    LeituraGabaritoSerializer,
    LeituraReportSerializer,
    LeituraEditSerializer,
)
from .services.leitor import ler_por_caminho
from .services.nota import calcular_nota
from .models import LeituraGabarito
from registro.models import Prova, Participante

class UploadLeituraAPIView(APIView):
    """
    Recebe imagem, salva temp, faz leitura pela lib em C
    e cruza com o DB para retornar nome/escola imediatamente.
    """
    def post(self, request):
        ser = UploadLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        
        img   = ser.validated_data['arquivo']
        path  = default_storage.save(f"temp/{img.name}", img)
        abs_p = default_storage.path(path)
        r     = ler_por_caminho(abs_p)  # retorna dict com id_prova, id_participante, leitura, erro

        
        externo_prova_id = r["id_prova"]
        try:
            prova = Prova.objects.get(externo_id=externo_prova_id)
        except Prova.DoesNotExist:
            raise ValidationError({
                "prova_id": f"Prova externa {externo_prova_id} não cadastrada."
            })

        
        externo_part_id = r["id_participante"]
        participante = Participante.objects.filter(externo_id=externo_part_id).first()
        nome_aluno = participante.nome  if participante else ""
        escola_aluno = participante.escola if participante else ""

       
        return Response({
            "prova_id":          externo_prova_id,
            "participante_id":   externo_part_id,
            "nome_aluno":        nome_aluno,
            "escola_aluno":      escola_aluno,
            "leitura_respostas": r["leitura"],
            "erro":              r["erro"],
            "temp_path":         path,
            "modalidade":        "",
            "fase":              "",
            "data":              None,
        })

class ConfirmarLeituraAPIView(APIView):
    def post(self, request):
        ser = ConfirmarLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data

        # Validação para prova deve existir
        try:
            prova = Prova.objects.get(externo_id=d['prova_id'])
        except Prova.DoesNotExist:
            raise ValidationError({
                "prova_id": f"Prova externa {d['prova_id']} não cadastrada."})
        
        part, _ = Participante.objects.get_or_create(
            externo_id=d['participante_id'],
            defaults={'nome':f"Aluno {d['participante_id']}", 'escola':''}
        )

        nota, acertos = calcular_nota(d['leitura_respostas'], prova)
        lg = LeituraGabarito.objects.create(
            prova=prova,
            participante=part,
            externo_prova_id=d['prova_id'],
            externo_participante_id=d['participante_id'],
            leitura_respostas=d['leitura_respostas'],
            erro=d.get('erro', 0),
            nota=nota,
            acertos=acertos,
            status='confirmado',
            caminho_imagem=d.get('temp_path',''),
            numero_inscricao=   d['participante_id'],
            nome_aluno=         d.get('nome_aluno',''),
            escola_aluno=       d.get('escola_aluno',''),
            modalidade=         d.get('modalidade',''),
            fase=               d.get('fase',''),
            data=               d.get('data',   None),
        )
        return Response({
            'id': lg.id,
            'nota': lg.nota,
            'acertos': lg.acertos
        }, status=201)

class LeituraGabaritoViewSet(viewsets.ModelViewSet):
    queryset = LeituraGabarito.objects.all()
    serializer_class = LeituraGabaritoSerializer

@api_view(['GET'])
def report_leituras(request):
    qs = LeituraGabarito.objects.order_by('id')
    ser = LeituraReportSerializer(qs, many=True)
    return Response(ser.data)

class EditLeituraAPIView(APIView):
    """
    PUT /api/upload/leituras/{id}/edit/
    Permite editar apenas os campos manuais.
    """
    def put(self, request, pk):
        lg = LeituraGabarito.objects.filter(pk=pk).first()
        if not lg:
            return Response({"detail":"Não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        if not lg.participante and lg.numero_inscricao:
            part, _ = Participante.objects.get_or_create(
                externo_id=lg.numero_inscricao,
                defaults={'nome':'','escola':''}
            )
            lg.participante = part

        ser = LeituraEditSerializer(lg, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()

        
        nome = ser.validated_data.get('nome_aluno')
        esc  = ser.validated_data.get('escola_aluno')
        if nome or esc:
            part = lg.participante
            if part:
                if nome: part.nome = nome
                if esc:  part.escola = esc
                part.save()

        return Response(LeituraReportSerializer(lg).data)
