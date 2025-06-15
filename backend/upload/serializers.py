from rest_framework import serializers
from .models import LeituraGabarito
from registro.serializers import ProvaSerializer, ParticipanteSerializer

class UploadLeituraSerializer(serializers.Serializer):
    arquivo = serializers.ImageField()

class ConfirmarLeituraSerializer(serializers.Serializer):
    prova_id        = serializers.IntegerField()
    participante_id = serializers.IntegerField()
    leitura_respostas = serializers.CharField()
    erro            = serializers.IntegerField() 
    temp_path       = serializers.CharField(required=False, allow_blank=True) 

class LeituraGabaritoSerializer(serializers.ModelSerializer):
    
    prova_details = ProvaSerializer(source='prova', read_only=True)
    participante_details = ParticipanteSerializer(source='participante', read_only=True)

 
    erro_display = serializers.CharField(source='get_erro_display', read_only=True)

    class Meta:
        model = LeituraGabarito
       
        fields = [
            'id', 'prova', 'participante', 'leitura_respostas', 'erro', 'nota',
            'acertos', 'status', 'caminho_imagem', 'numero_inscricao', 'nome_aluno',
            'escola_aluno', 'modalidade', 'fase', 'data', 'data_hora_registro',
            'prova_details', 'participante_details', 'erro_display' # <-- Adicionados
        ]
       
        read_only_fields = (
            'id', 'prova', 'participante', 'erro', 'nota', 'acertos', 'status',
            'caminho_imagem', 'data_hora_registro',
            'prova_details', 'participante_details', 'erro_display'
        )

class LeituraReportSerializer(serializers.ModelSerializer):
    
    prova_nome = serializers.CharField(source='prova.nome', read_only=True)
    participante_nome = serializers.CharField(source='participante.nome', read_only=True)
    erro_display = serializers.CharField(source='get_erro_display', read_only=True)

    class Meta:
        model = LeituraGabarito
        
        fields = [
            'id', 'caminho_imagem', 'erro', 'erro_display', 
            'leitura_respostas', 'acertos', 'nota',
            'numero_inscricao', 'nome_aluno', 'escola_aluno',
            'modalidade', 'fase', 'data',
            'prova_nome', 'participante_nome',
            'status', 'data_hora_registro'
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
            
            'numero_inscricao',
            'nome_aluno',
            'escola_aluno',
            'modalidade',
            'fase',
            'data',
        ]