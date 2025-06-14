from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.core.files.storage import default_storage

from .serializers import (
    UploadLeituraSerializer,
    ConfirmarLeituraSerializer,
    LeituraGabaritoSerializer
)
from .services.leitor import ler_por_caminho
from .services.nota import calcular_nota
from .models import LeituraGabarito
from registro.models import Prova, Participante

class UploadLeituraAPIView(APIView):
    """
    Recebe imagem, salva temp e retorna dados brutos da leitura.
    """
    def post(self, request):
        ser = UploadLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        img  = ser.validated_data['arquivo']
        path = default_storage.save(f"temp/{img.name}", img)
        abs_path = default_storage.path(path)
        resultado = ler_por_caminho(abs_path)
        return Response({**resultado, 'temp_path': path})

class ConfirmarLeituraAPIView(APIView):
    """
    Recebe leitura bruta, cruza com DB, calcula nota e salva no modelo.
    """
    def post(self, request):
        ser = ConfirmarLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data
        prova = Prova.objects.get(externo_id=d['prova_id'])
        part  = Participante.objects.get(externo_id=d['participante_id'])
        nota, acertos = calcular_nota(d['leitura_respostas'], prova)
        lg = LeituraGabarito.objects.create(
            prova=prova,
            participante=part,
            leitura_respostas=d['leitura_respostas'],
            erro=0,
            nota=nota,
            acertos=acertos,
            status='confirmado',
            caminho_imagem=d.get('temp_path','')
        )
        return Response({
            'id': lg.id,
            'nota': lg.nota,
            'acertos': lg.acertos,
            'data_hora': lg.data_hora
        }, status=201)

class LeituraGabaritoViewSet(ModelViewSet):
    queryset = LeituraGabarito.objects.all()
    serializer_class = LeituraGabaritoSerializer