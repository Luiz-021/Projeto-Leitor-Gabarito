from rest_framework import serializers
from .models import LeituraGabarito

class UploadLeituraSerializer(serializers.Serializer):
    arquivo = serializers.ImageField()

class ConfirmarLeituraSerializer(serializers.Serializer):
    prova_id        = serializers.IntegerField()
    participante_id = serializers.IntegerField()
    leitura_respostas   = serializers.CharField()
    temp_path       = serializers.CharField(required=False)

class LeituraGabaritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeituraGabarito
        fields = '__all__'
        read_only_fields = (
            'id','data_hora','erro','nota','acertos','status',
            'leitura_respostas','caminho_imagem'
        )