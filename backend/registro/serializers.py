from rest_framework import serializers
from .models import Participante, Prova

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = ['id', 'externo_id', 'nome', 'escola']


class ProvaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prova
        fields = fields = ['id', 'externo_id', 'respostas_corretas']
