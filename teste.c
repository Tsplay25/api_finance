#include <stdio.h>
#include <stdlib.h>

typedef struct computador
{
    int teclas;
    int tamanhoTela;
    char marca[10];
}Computador;

int main() {
    Computador *pc1 = (Computador*)malloc(sizeof(Computador));

    return 0;
}