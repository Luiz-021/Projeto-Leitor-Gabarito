from rest_framework import serializers
from .models import LeituraGabarito

class UploadLeituraSerializer(serializers.Serializer):
    arquivo = serializers.ImageField()

class ConfirmarLeituraSerializer(serializers.Serializer):
    prova_id          = serializers.IntegerField()
    participante_id   = serializers.IntegerField()
    leitura_respostas = serializers.CharField()
    erro              = serializers.IntegerField(required=True)
    temp_path         = serializers.CharField(required=False)
    nome_aluno        = serializers.CharField(required=False, allow_blank=True)
    escola_aluno      = serializers.CharField(required=False, allow_blank=True)
    modalidade        = serializers.CharField(required=False, allow_blank=True)
    fase              = serializers.CharField(required=False, allow_blank=True)
    data              = serializers.DateField(required=False, input_formats=['%Y-%m-%d','%d-%m-%Y'])

class LeituraGabaritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeituraGabarito
        fields = '__all__'
        read_only_fields = (
            'id','externo_prova_id','externo_participante_id',
            'prova','participante',
            'erro','nota','acertos','status','caminho_imagem',
        )

class LeituraReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeituraGabarito
        fields = [
            'caminho_imagem','erro',
            'externo_prova_id','externo_participante_id',
            'leitura_respostas','acertos','nota',
            'numero_inscricao','nome_aluno','escola_aluno',
            'modalidade','fase','data',
        ]
        read_only_fields = fields

class LeituraEditSerializer(serializers.ModelSerializer):
    """
    Serializer usado na tela de edição de leitura para
    permitir alterar apenas os campos manuais.
    """
    class Meta:
        model = LeituraGabarito
        fields = [
            'leitura_respostas',
            'numero_inscricao',
            'nome_aluno',
            'escola_aluno',
            'modalidade',
            'fase',
            'data',
        ]
        
