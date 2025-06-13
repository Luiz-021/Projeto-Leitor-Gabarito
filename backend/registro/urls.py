from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParticipanteViewSet, ProvaViewSet

router = DefaultRouter()
router.register(r'participantes', ParticipanteViewSet, basename='participante')
router.register(r'provas',        ProvaViewSet,        basename='prova')

urlpatterns = [ path('', include(router.urls)) ]