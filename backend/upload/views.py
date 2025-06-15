from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.db import IntegrityError, transaction 

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
    def post(self, request, *args, **kwargs):
        ser = UploadLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        img = ser.validated_data['arquivo']
        try:
            path = default_storage.save(f"temp/{img.name}", img)
            abs_path = default_storage.path(path)
        except Exception as e:
            return Response({"detail": f"Erro interno ao salvar a imagem: {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        resultado_leitura_c = ler_por_caminho(abs_path)

        if resultado_leitura_c['erro'] == 3:
            return Response({"detail": f"Erro fatal na leitura do gabarito: {resultado_leitura_c['leitura']}"},
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response({**resultado_leitura_c, 'temp_path': path}, status=status.HTTP_200_OK)

class ConfirmarLeituraAPIView(APIView):
    def post(self, request, *args, **kwargs):
        ser = ConfirmarLeituraSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        d = ser.validated_data

        with transaction.atomic(): 
            try:
                prova = Prova.objects.get(externo_id=d['prova_id'])
            except Prova.DoesNotExist:
                return Response({"detail": f"Prova com externo_id '{d['prova_id']}' não encontrada."},
                                status=status.HTTP_404_NOT_FOUND)
            try:
                part = Participante.objects.get(externo_id=d['participante_id'])
            except Participante.DoesNotExist:
                return Response({"detail": f"Participante com externo_id '{d['participante_id']}' não encontrado."},
                                status=status.HTTP_404_NOT_FOUND)

            nota, acertos = calcular_nota(d['leitura_respostas'], prova)

            try:
                lg = LeituraGabarito.objects.create(
                    prova=prova,
                    participante=part,
                    leitura_respostas=d['leitura_respostas'],
                    erro=d['erro'], 
                    nota=nota,
                    acertos=acertos,
                    status='confirmado',
                    caminho_imagem=d.get('temp_path','')
                )
            except IntegrityError as e:
                return Response({"detail": f"Erro de integridade ao salvar leitura: {e}"},
                                status=status.HTTP_409_CONFLICT)
            except Exception as e:
                return Response({"detail": f"Erro inesperado ao salvar leitura de gabarito: {e}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'id': lg.id,
            'nota': lg.nota,
            'acertos': lg.acertos,
            'data_hora': lg.data_hora,
            'erro': lg.erro, 
            'erro_display': lg.get_erro_display(),
            'caminho_imagem': lg.caminho_imagem
        }, status=status.HTTP_201_CREATED)

class LeituraGabaritoViewSet(ModelViewSet):
    serializer_class = LeituraGabaritoSerializer
    def get_queryset(self):
        return LeituraGabarito.objects.select_related('prova', 'participante').all()