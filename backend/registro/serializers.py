from rest_framework import serializers
from .models import Escola, Participante, Prova, PesoQuestao

class EscolaSerializer(serializers.ModelSerializer):
    class Meta: model = Escola; fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta: model = Participante; fields = '__all__'

class PesoQuestaoSerializer(serializers.ModelSerializer):
    class Meta: model = PesoQuestao; fields = '__all__'

class ProvaSerializer(serializers.ModelSerializer):
    pesos = PesoQuestaoSerializer(many=True, required=False)
    class Meta:
        model = Prova
        fields = ['id','nome','data','numero_questoes','respostas_corretas','pesos']
    def create(self, data):
        pesos = data.pop('pesos',[])
        p = Prova.objects.create(**data)
        for x in pesos: PesoQuestao.objects.create(prova=p,**x)
        return p
    def update(self, inst, data):
        pesos = data.pop('pesos',None)
        for k,v in data.items(): setattr(inst,k,v)
        inst.save()
        if pesos is not None:
            inst.pesos.all().delete()
            for x in pesos: PesoQuestao.objects.create(prova=inst,**x)
        return inst
