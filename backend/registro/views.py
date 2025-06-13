from rest_framework import viewsets
from .models import Participante, Prova
from .serializers import ParticipanteSerializer, ProvaSerializer

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer

class ProvaViewSet(viewsets.ModelViewSet):
    queryset = Prova.objects.all()
    serializer_class = ProvaSerializer
