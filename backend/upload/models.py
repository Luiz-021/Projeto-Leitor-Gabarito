from django.db import models
from registro.models import Participante, Prova

class GabaritoUpload(models.Model):
    participante = models.ForeignKey(
        Participante,
        on_delete=models.CASCADE,
        related_name='gabaritos_enviados',
        help_text="Participante associado a este gabarito enviado."
    )
    prova = models.ForeignKey(
        Prova,
        on_delete=models.CASCADE,
        related_name='gabaritos_recebidos',
        help_text="Prova a que este gabarito se refere."
    )
    arquivo_gabarito = models.FileField(
        upload_to='gabaritos/',
        help_text="Arquivo do gabarito enviado (ex: imagem escaneada)."
    )
    respostas_lidas = models.TextField(
        blank=True,
        default='',
        help_text="String das respostas lidas do gabarito (ex: 'ABCDE...')"
    )
    data_upload = models.DateTimeField(
        auto_now_add=True,
        help_text="Data e hora do upload do gabarito."
    )
    processado = models.BooleanField(
        default=False,
        help_text="Indica se o gabarito já foi processado (respostas extraídas, etc.)."
    )

    def __str__(self):
        return f"Gabarito de {self.participante.nome} para {self.prova}"

    class Meta:
        verbose_name = "Gabarito Enviado"
        verbose_name_plural = "Gabaritos Enviados"
        unique_together = ('participante', 'prova')
