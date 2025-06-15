from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
    def post(self, request):
        ser = UploadLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        img  = ser.validated_data['arquivo']
        path = default_storage.save(f"temp/{img.name}", img)
        abs_path = default_storage.path(path)
        r = ler_por_caminho(abs_path)
        return Response({
            "prova_id":          r["id_prova"],
            "participante_id":   r["id_participante"],
            "leitura_respostas": r["leitura"],
            "temp_path":         path,
            "erro":              r["erro"],
        })

class ConfirmarLeituraAPIView(APIView):
    def post(self, request):
        ser = ConfirmarLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data

        # prova deve existir
        prova = Prova.objects.get(externo_id=d['prova_id'])
        # participante on the fly
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
            erro=0,
            nota=nota,
            acertos=acertos,
            status='confirmado',
            caminho_imagem=d.get('temp_path',''),
            numero_inscricao=d['participante_id']
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

        # se não há participante, tenta criar para manter integridade
        if not lg.participante and lg.numero_inscricao:
            part, _ = Participante.objects.get_or_create(
                externo_id=lg.numero_inscricao,
                defaults={'nome':'','escola':''}
            )
            lg.participante = part

        ser = LeituraEditSerializer(lg, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()

        # também atualiza participante com nome/escola se presente
        nome = ser.validated_data.get('nome_aluno')
        esc  = ser.validated_data.get('escola_aluno')
        if nome or esc:
            part = lg.participante
            if part:
                if nome: part.nome = nome
                if esc:  part.escola = esc
                part.save()

        return Response(LeituraReportSerializer(lg).data)
