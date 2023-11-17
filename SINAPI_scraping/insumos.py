import pandas as pd
import datetime as dt
import json

from abreviacoes import abreviacoes
from database import cursor, mydb

nome_arquivo = input("Cole o caminho do arquivo (ctrl + shift + v): ")
# tirar as aspas do nome do arquivo
nome_arquivo = nome_arquivo.replace('"', '')


df_basico = pd.read_excel(nome_arquivo)

print("""
    1 - Desonerado
    2 - Não desonerado
""")
# digíto upperscore: 

desonerado = input("Selecione o encargo: ")

if desonerado == '1':
    desonerado = 1
elif desonerado == '2':
    desonerado = 0
else:
    print("Opção inválida")
    exit()

confirmar = input(f"Confirmar que o encargo é {desonerado}? (sim / não): ")

if confirmar == 'sim':
    pass
else:
    print("Cancelado")
    exit()

linha_mes = str(df_basico.iloc[1, 0])
mes = linha_mes.split('MES DE COLETA: ')[1].strip()
data_mes = dt.datetime.strptime(mes, '%m/%Y').date()
print(data_mes)

linha_localidade = str(df_basico.iloc[2, 0])
capital = linha_localidade.split('LOCALIDADE: ')[1].split('-')[1].strip()
localidade = abreviacoes[capital]
print(localidade)


# Ler o arquivo excel e salvar em um DataFrame (df)
df = pd.read_excel(nome_arquivo, header=6)


colunas = [
    "CODIGO  ",
    "DESCRICAO DO INSUMO",
    "UNIDADE",
    "  PRECO MEDIANO R$"
]

# Selecione as colunas definidas no DataFrame
df = df[colunas]

# Converte o DataFrame para um dicionário
df_dict = df.to_dict('records')
    # records: orientação do dicionário. Pode ser 'list' ou 'series'


# Iterar sobre o dicionário do DataFrame
i = 0

for item in df_dict:
    i += 1
    print(f"Trabalhando no item {i} de {len(df_dict)}")

    # Transformar "CODIGO  " em "CODIGO"
    item['CODIGO'] = item['CODIGO  ']
    del item['CODIGO  ']

    # Transformar "  PRECO MEDIANO R$" em "PRECO MEDIANO R$"
    item['PRECO MEDIANO R$'] = item['  PRECO MEDIANO R$']
    del item['  PRECO MEDIANO R$']

    # se o código for NaN pular para o próximo:
    if str(item['CODIGO']) == 'nan': continue
    if str(item['DESCRICAO DO INSUMO']) == 'nan': continue

    # Converter o código para inteiro para não ter decimais
    try: item['CODIGO'] = int(item['CODIGO'])
    except: pass

    # conterter tudo para string
    for key in item:
        item[key] = str(item[key])

    codigo = item['CODIGO']
    descricao = item['DESCRICAO DO INSUMO']
    unidade = item['UNIDADE']
    custo = item['PRECO MEDIANO R$']

    # escape as aspas duplas para não dar erro no SQL
    try: descricao = descricao.replace('"', '\\"')
    except: input("Erro ao escapar aspas duplas. Pressione enter para continuar...")


    # INSERIR no banco de dados (INSUMOS)
    sql = f"""
        INSERT INTO composicoes_insumos(
            codigo, descricao, unidade, tipo
        ) VALUES (
            "{codigo}",
            "{descricao}",
            "{unidade}",
            "I"
        );
    """

    ## Tentar inserir, mas se já existir o código, ignorar
    try: cursor.execute(sql)
    except Exception as e: 
        #print('Erro ao colocar insumo: ',e)
        print('    Insumo já existe. Pulando...')


    # INSERIR no banco de dados (DETALHES DO INSUMO)

    sql = f"""
        INSERT INTO detalhes_composicoes_insumos(
            codigo, 
            estado_referencia, 
            mes_referencia, 
            desonerado, 
            valor
        ) VALUES (
            "{codigo}",
            "{localidade}",
            "{data_mes}",
            "{desonerado}",
            "{custo}"
        );
    """

    try: cursor.execute(sql)
    except Exception as e: 
        print("Erro pra colocar o detalhamento: ",e)
        print("SQL: ",sql)

# Salvar as alterações no banco de dados
mydb.commit()


print("\n\n SUCESSO!")

# Salvar no json apenas para conferência
with open('insumos.json', 'w') as f:
    json.dump(df_dict, f, indent=4, ensure_ascii=False)