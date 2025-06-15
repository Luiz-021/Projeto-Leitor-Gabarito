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

    # IDs externos
    externo_prova_id        = models.BigIntegerField(null=True, blank=True)
    externo_participante_id = models.BigIntegerField(null=True, blank=True)

    # dados de leitura
    leitura_respostas  = models.TextField()
    erro               = models.IntegerField(choices=ERRO_CHOICES)
    nota               = models.FloatField(blank=True, null=True)
    acertos            = models.CharField(max_length=20, blank=True)
    status             = models.CharField(max_length=20, default="pendente")
    caminho_imagem     = models.CharField(max_length=500)

    # campos para edição manual
    numero_inscricao   = models.BigIntegerField(null=True, blank=True)
    nome_aluno         = models.CharField(max_length=200, blank=True)
    escola_aluno       = models.CharField(max_length=200, blank=True)
    modalidade         = models.CharField(max_length=100, blank=True)
    fase               = models.CharField(max_length=100, blank=True)
    data               = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Leitura(id={self.id}, inscr={self.numero_inscricao or self.externo_participante_id})"
