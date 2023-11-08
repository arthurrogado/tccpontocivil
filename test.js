var palavraChave = "Alvenaria";
palavraChave = palavraChave.toUpperCase();

const arrayDeObjetos = [
    { id: 67, codigo: 90724, descricao: 'JUNTA ARGAMASSADA ENTRE TUBO DN 100 MM E O POÇO DE…CRETO OU ALVENARIA EM REDES DE ESGOTO. AF_01/2021', unidade: 'UN', tipo: 'C' },
    { id: 68, codigo: 90725, descricao: 'JUNTA ARGAMASSADA ENTRE TUBO DN 150 MM E O POÇO DE…CRETO OU ALVENARIA EM REDES DE ESGOTO. AF_01/2021', unidade: 'UN', tipo: 'C' },
    { id: 69, codigo: 90726, descricao: 'JUNTA ARGAMASSADA ENTRE TUBO DN 200 MM E O POÇO/ C…CRETO OU ALVENARIA EM REDES DE ESGOTO. AF_01/2021', unidade: 'UN', tipo: 'C' },
    { id: 5783, codigo: 89307, descricao: 'ALVENARIA ESTRUTURAL DE BLOCOS CERÂMICOS 14X19X29, (ESPESSURA DE 14 CM), UTILIZANDO COLHER DE PEDREIRO E ARGAMASSA DE ASSENTAMENTO COM PREPARO MANUAL. AF_03/2023', unidade: 'M2', tipo: 'C' }
];

function compararPorDescricaoInicial(a, b) {
    const descricaoA = a.descricao.toUpperCase();
    const descricaoB = b.descricao.toUpperCase();

    if (descricaoA.startsWith(palavraChave) && !descricaoB.startsWith(palavraChave)) {
        return -1; // "a" vem antes de "b"
    } else if (!descricaoA.startsWith(palavraChave) && descricaoB.startsWith(palavraChave)) {
        return 1; // "b" vem antes de "a"
    } else {
        // Caso nenhuma das descrições comece com a palavra-chave, mantenha a ordem original
        return 0;
    }
}

arrayDeObjetos.sort(compararPorDescricaoInicial);

console.log(arrayDeObjetos);
