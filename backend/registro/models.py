from django.db import models

class Escola(models.Model):
    nome = models.CharField(max_length=200)
    def __str__(self): return self.nome

class Participante(models.Model):
    nome = models.CharField(max_length=200)
    identificador = models.CharField(max_length=50, unique=True)
    escola = models.ForeignKey(Escola, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self): return f"{self.nome} ({self.identificador})"

class Prova(models.Model):
    nome = models.CharField(max_length=200)
    data = models.DateField()
    numero_questoes = models.PositiveIntegerField()
    respostas_corretas = models.TextField(help_text="ex: 'ABCDA...'")
    def __str__(self): return f"{self.nome} - {self.data}"

class PesoQuestao(models.Model):
    prova = models.ForeignKey(Prova, on_delete=models.CASCADE, related_name='pesos')
    numero_questao = models.PositiveIntegerField()
    peso = models.FloatField()
    class Meta: unique_together = ('prova','numero_questao')
    def __str__(self): return f"P{self.prova.id}-Q{self.numero_questao}: {self.peso}"
