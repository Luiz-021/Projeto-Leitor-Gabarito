from django.db import models
from registro.models import Prova, Participante

class LeituraGabarito(models.Model):
    ERRO_CHOICES = [
        (0, "Nenhum"),
        (1, "Erro Aztec"),
        (2, "Imprecisão"),
        (3, "Erro fatal"),
    ]

    prova          = models.ForeignKey(Prova, on_delete=models.PROTECT)
    participante   = models.ForeignKey(Participante, on_delete=models.PROTECT)
    data_hora      = models.DateTimeField(auto_now_add=True)
    leitura_respostas  = models.TextField(help_text="String retornada pela leitura automática")
    erro           = models.IntegerField(choices=ERRO_CHOICES)
    nota           = models.FloatField(blank=True, null=True)
    acertos        = models.CharField(max_length=20, blank=True)
    status         = models.CharField(max_length=20, default="pendente")
    caminho_imagem = models.CharField(max_length=500)

    def __str__(self):
        return f"Leitura(id={self.id}, prova={self.prova.id}, part={self.participante.id})"