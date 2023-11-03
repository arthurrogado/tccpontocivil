let itens = [
    
    {
        "id": 4,
        "codigo": 92106,
        "quantidade": 2,
        "tipo": "C",
        "id_etapa": 4,
        "id_proximo_item": 5,
        "descricao": "CAMINHÃO PARA EQUIPAMENTO DE LIMPEZA A SUCÇÃO, COM CAMINHÃO TRUCADO DE PESO BRUTO TOTAL 23000 KG, CARGA ÚTIL MÁXIMA 15935 KG, DISTÂNCIA ENTRE EIXOS 4,80 M, POTÊNCIA 230 CV, INCLUSIVE LIMPADORA A SUCÇÃO, TANQUE 12000 L - CHP DIURNO. AF_05/2023",
        "unidade": "CHP",
        "valor": 336.03
    },
    {
        "id": 5,
        "codigo": 97141,
        "quantidade": 2,
        "tipo": "C",
        "id_etapa": 4,
        "id_proximo_item": 6,
        "descricao": "ASSENTAMENTO DE TUBO DE FERRO FUNDIDO PARA REDE DE ÁGUA, DN 80 MM, JUNTA ELÁSTICA, INSTALADO EM LOCAL COM NÍVEL ALTO DE INTERFERÊNCIAS (NÃO INCLUI FORNECIMENTO). AF_11/2017",
        "unidade": "M",
        "valor": 8.33
    },
    {
        "id": 6,
        "codigo": 5851,
        "quantidade": 10,
        "tipo": "C",
        "id_etapa": 4,
        "id_proximo_item": null,
        "descricao": "TRATOR DE ESTEIRAS, POTÊNCIA 150 HP, PESO OPERACIONAL 16,7 T, COM RODA MOTRIZ ELEVADA E LÂMINA 3,18 M3 - CHP DIURNO. AF_06/2014",
        "unidade": "CHP",
        "valor": 243.86
    }
]

let orderedItems = []

let currentItem = itens.find(item => item.id_proximo_item == null)


while(currentItem){
    // orderedItems.push(currentItem)
    // to append in the beginning of the array
    orderedItems.unshift(currentItem)
    currentItem = itens.find(item => item.id_proximo_item == currentItem.id)
}

console.log(orderedItems)