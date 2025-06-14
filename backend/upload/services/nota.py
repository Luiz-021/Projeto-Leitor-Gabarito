def calcular_nota(leitura: str, prova) -> (float, str):
    """
    Compara cada caractere de `leitura` com o gabarito.
    Se diferente, conta como 0; questões não marcadas/ambíguas também.
    Retorna (nota, acertos_str) onde nota = acertos * 0.5 e acertos_str = "X/Y".
    """
    gabarito = prova.respostas_corretas
    peso = 0.5
    acertos = 0
    for i, resp in enumerate(leitura):
        if i >= len(gabarito):
            break
        if resp.lower() == gabarito[i].lower():
            acertos += 1
        # se resp diferente, pontuação 0 (sem else)
    nota = acertos * peso
    return nota, f"{acertos}/{len(gabarito)}"