import ctypes
import os
import sys


class Reading(ctypes.Structure):
    _fields_ = [
        ("erro", ctypes.c_int),
        ("id_prova", ctypes.c_int),
        ("id_participante", ctypes.c_int),
        ("leitura", ctypes.c_char_p),
    ]


LIB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'libs')

LIB_NAME = 'libleitor.so' 
LIB_PATH = os.path.join(LIB_DIR, LIB_NAME)

_lib = None 

try:
    _lib = ctypes.CDLL(LIB_PATH)
    
    _lib.read_image_path.argtypes = [ctypes.c_char_p] 
    _lib.read_image_path.restype = Reading 

except OSError as e:
    _lib = None 
    print(f"ERRO CRÍTICO: Não foi possível carregar a biblioteca C '{LIB_PATH}'. Possíveis causas:\n"
          f"1. A biblioteca '{LIB_NAME}' não existe no caminho '{LIB_DIR}'.\n"
          f"2. As dependências (libraylib.so.550, libZXing.so.3) não estão no '{LIB_DIR}' ou não estão no LD_LIBRARY_PATH.\n"
          f"Detalhes do erro: {e}")


def ler_por_caminho(image_path: str) -> dict:
    if _lib is None:
        return {"erro": 3, "leitura": "Erro: Biblioteca C não carregada no backend. Verifique os logs do servidor."}

    c_path = image_path.encode('utf-8')
    
    try:
        result_c = _lib.read_image_path(c_path)
        
        leitura_str = result_c.leitura.decode('utf-8') if result_c.leitura else ""
        
    
        
        return {
            "erro": result_c.erro,
            "id_prova": result_c.id_prova,
            "id_participante": result_c.id_participante,
            "leitura": leitura_str,
        }
    except Exception as e:
        print(f"Erro inesperado ao chamar função C read_image_path: {e}")
        return {"erro": 3, "leitura": f"Erro inesperado ao processar imagem: {e}"}
