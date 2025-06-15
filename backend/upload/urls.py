from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EditLeituraAPIView, UploadLeituraAPIView, ConfirmarLeituraAPIView, LeituraGabaritoViewSet
from .views import report_leituras

router = DefaultRouter()
router.register(r'leituras', LeituraGabaritoViewSet, basename='leituras')

urlpatterns = [
    path('leitura/upload/',    UploadLeituraAPIView.as_view(),    name='upload-leitura'),
    path('leitura/confirmar/', ConfirmarLeituraAPIView.as_view(), name='confirmar-leitura'),
    path('leituras/report/',   report_leituras,                   name='report-leituras'),
    path('leituras/<int:pk>/edit/', EditLeituraAPIView.as_view(), name='edit-leitura'),
    path('', include(router.urls)),
]