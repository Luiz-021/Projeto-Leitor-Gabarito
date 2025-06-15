from django.db import models

class Participante(models.Model):
    externo_id = models.BigIntegerField(
        unique=True,
        null=True,
        blank=True,
        help_text="ID externo usado pelo leitor de gabaritos"
    )
    nome = models.CharField(max_length=200)
    escola = models.CharField(
       max_length=200,
       blank=True,
       null=True,
       default='', 
   )

    def __str__(self):
        return f"{self.nome} ({self.escola})"

class Prova(models.Model):
    externo_id = models.BigIntegerField(
        unique=True,
        null=True,
        blank=True,
        help_text="ID externo da prova (do scanner)"
    )
    respostas_corretas = models.TextField(help_text="String ex: 'ABCDA...'")

    def __str__(self):
        return f"Prova {self.id}"
