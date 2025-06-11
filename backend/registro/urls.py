from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EscolaViewSet, ParticipanteViewSet, ProvaViewSet, PesoQuestaoViewSet

router = DefaultRouter()
router.register(r'escolas', EscolaViewSet)
router.register(r'participantes', ParticipanteViewSet)
router.register(r'provas', ProvaViewSet)
router.register(r'pesos', PesoQuestaoViewSet)

urlpatterns = [ path('', include(router.urls)) ]
