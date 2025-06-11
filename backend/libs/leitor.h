#ifndef LIB_H
#define LIB_H

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    int erro;            // Código de erro da leitura.
                         //  - 0: Não houve erro.
                         //  - 1: Erro de leitura do código Aztec
                         //  - 2: Imprecisão ou erro na identificação da área de leitura
                         //  - 3: Erro fatal durante a leitura.
    int id_prova;        // ID da prova (-1 se não foi possível identificar)
    int id_participante; // ID do participante (-1 se não foi possível identificar)
    char* leitura;       // String com a leitura do gabarito
                         //  - 0: questão em branco
                         //  - ?: questão com mais de um item marcado
                         //  - a, b, c, d, e, ...: o item marcado na questão
} Reading;

// EXEMPLO:
// erro: 0
// id_aluno: 10211291
// id_prova: 15
// leitura: abbaccdeea0ed?dd0ba

// Recebe: o path de uma imagem no sistema
// Retorna um struct Reading com a leitura realizada
Reading read_image_path(const char* path);

// Recebe:
// 1. extensão da imagem (ex: .png),
// 2. um array de chars correspondente aos dados (bytes) do arquivo
// 3. o tamanho do array em bytes
// Retorna um struct Reading com a leitura realizada
Reading read_image_data(const char* file_type, const unsigned char* file_data, int file_data_size);

#ifdef __cplusplus
}
#endif

#endif