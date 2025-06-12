from rest_framework import serializers
from .models import Escola, Participante, Prova, PesoQuestao

class EscolaSerializer(serializers.ModelSerializer):
    class Meta: model = Escola; fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta: model = Participante; fields = '__all__'

class PesoQuestaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PesoQuestao; fields = '__all__'

# Serializer aninhado (para criar/atualizar provas)
class PesoNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PesoQuestao
        fields = ('numero_questao','peso')  

class ProvaSerializer(serializers.ModelSerializer):
    pesos = PesoNestedSerializer(many=True, required=False)
    class Meta:
        model = Prova
        fields = ['id','nome','data','numero_questoes','respostas_corretas','pesos']

    def create(self, validated_data):
        pesos_data = validated_data.pop('pesos', [])
        prova = Prova.objects.create(**validated_data)
        for peso in pesos_data:
            PesoQuestao.objects.create(prova=prova, **peso)
        return prova

    def update(self, instance, validated_data):
        pesos_data = validated_data.pop('pesos', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if pesos_data is not None:
            # apaga pesos antigos e recria
            instance.pesos.all().delete()
            for peso in pesos_data:
                PesoQuestao.objects.create(prova=instance, **peso)
        return instance
