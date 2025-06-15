import csv
from django.core.management.base import BaseCommand
from registro.models import Prova, Participante

class Command(BaseCommand):
    help = "Importa provas e participantes de CSV."

    def add_arguments(self, parser):
        parser.add_argument(
            '--provas', help='Caminho para provas.csv', required=True)
        parser.add_argument(
            '--participantes', help='Caminho para participantes.csv', required=True)

    def handle(self, *args, **opts):
        p_csv = opts['provas']
        pa_csv = opts['participantes']

        with open(p_csv, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            objs = []
            for row in reader:
                objs.append(Prova(
                    externo_id=int(row['Prova']),
                    respostas_corretas=row['Gabarito']
                ))
            Prova.objects.bulk_create(objs, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'Importadas {len(objs)} provas.'))

        with open(pa_csv, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            objs = []
            for row in reader:
                objs.append(Participante(
                    externo_id=int(row['id']),
                    nome=row['nome'],
                    escola=row['escola']
                ))
            Participante.objects.bulk_create(objs, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'Importados {len(objs)} participantes.'))
