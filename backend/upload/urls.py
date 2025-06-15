from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadLeituraAPIView, ConfirmarLeituraAPIView, LeituraGabaritoViewSet

router = DefaultRouter()
router.register(r'leituras', LeituraGabaritoViewSet, basename='leituras')

urlpatterns = [
    path('leitura/upload/',    UploadLeituraAPIView.as_view(),    name='upload-leitura'),
    path('leitura/confirmar/', ConfirmarLeituraAPIView.as_view(), name='confirmar-leitura'),
    path('', include(router.urls)),
]