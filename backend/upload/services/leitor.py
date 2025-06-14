import os
from ctypes import CDLL, Structure, c_int, c_char_p

LIB_PATH = os.getenv('LIBLEITOR_PATH', '/app/libs/libleitor.so')

class Reading(Structure):
    _fields_ = [
        ('erro', c_int),
        ('id_prova', c_int),
        ('id_participante', c_int),
        ('leitura', c_char_p),
    ]


def ler_por_caminho(path: str) -> dict:
    lib = CDLL(LIB_PATH)
    lib.read_image_path.argtypes = [c_char_p]
    lib.read_image_path.restype = Reading
    r = lib.read_image_path(path.encode('utf-8'))
    return {
        'erro': r.erro,
        'id_prova': r.id_prova,
        'id_participante': r.id_participante,
        'leitura': r.leitura.decode('utf-8') if r.leitura else ''
    }