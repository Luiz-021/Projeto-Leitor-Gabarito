from rest_framework import viewsets
from .models import Escola, Participante, Prova, PesoQuestao
from .serializers import EscolaSerializer, ParticipanteSerializer, ProvaSerializer, PesoQuestaoSerializer

class EscolaViewSet(viewsets.ModelViewSet):
    queryset = Escola.objects.all()
    serializer_class = EscolaSerializer

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer

class ProvaViewSet(viewsets.ModelViewSet):
    queryset = Prova.objects.all()
    serializer_class = ProvaSerializer

class PesoQuestaoViewSet(viewsets.ModelViewSet):
    queryset = PesoQuestao.objects.all()
    serializer_class = PesoQuestaoSerializer
