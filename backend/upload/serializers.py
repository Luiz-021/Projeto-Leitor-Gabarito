from rest_framework import serializers
from .models import GabaritoUpload
from registro.serializers import ParticipanteSerializer, ProvaSerializer

class GabaritoUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = GabaritoUpload
        fields = [
            'id',
            'participante',
            'prova',
            'arquivo_gabarito',
            'respostas_lidas',
            'data_upload',
            'processado'
        ]
        read_only_fields = ['data_upload', 'respostas_lidas', 'processado']