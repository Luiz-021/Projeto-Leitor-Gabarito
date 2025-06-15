export const errorCodes = {
    0: 'Nenhum Erro',
    1: 'Erro de leitura do código Aztec (código de barras não detectado ou inválido)',
    2: 'Imprecisão ou erro na identificação da área de leitura (falha ao reconhecer as marcações do gabarito)',
    3: 'Erro fatal durante a leitura (problema interno com a biblioteca ou imagem corrompida/ilegível)',
};

export function getErrorDescription(code) {
    return errorCodes[code] || `Código de Erro Desconhecido: ${code}`;
}