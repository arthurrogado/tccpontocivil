import pandas as pd
import datetime as dt
import json

from abreviacoes import abreviacoes
from database import cursor, mydb


nome_arquivo = input("Cole o caminho do arquivo (ctrl + shift + v): ")
# tirar as aspas do nome do arquivo
nome_arquivo = nome_arquivo.replace('"', '')


#‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
### Pegar informações BÁSICAS: desonerado, mês e localidade
#______________________________________________
df_basico = pd.read_excel(nome_arquivo)

# linha que procura se é DESONERADO ou não
linha_desonerado = str(df_basico.iloc[0, 0])
if 'DESONERADOS' in linha_desonerado:
    desonerado = 1
else:
    desonerado = 0

linha_localidade_mes = str(df_basico.iloc[1, 0])
    # Exemplo de df_basico: "ABRANGÊNCIA : NACIONAL  LOCALIDADE  : GOIANIA   DATA DE PREÇO   : 09/2023 REFERÊNCIA COLETA : MEDIANO"

capital = linha_localidade_mes.split('LOCALIDADE')[1].split('DATA DE PREÇO')[0]
capital = capital.replace(':', '').strip()
localidade = abreviacoes[capital]

mes = linha_localidade_mes.split('DATA DE PREÇO')[1].split('REFERÊNCIA COLETA')[0]
mes = mes.replace(':', '').strip()
data = dt.datetime.strptime(mes, '%m/%Y').date()



# Ler o arquivo excel e salvar em um DataFrame (df)
df = pd.read_excel(nome_arquivo, header=4)

colunas = [
    "CODIGO  DA COMPOSICAO",
    "DESCRICAO DA COMPOSICAO",
    "UNIDADE",
    "CUSTO TOTAL"
]

# Selecione as colunas definidas no DataFrame
df = df[colunas]

# Converte o DataFrame para um dicionário
df_dict = df.to_dict('records')
    # records: orientação do dicionário. Pode ser 'list' ou 'series'

# Iterar sobre o dicionário do DataFrame
i = 0

# Converter todos os códigos para inteiro para não ter decimais
for item in df_dict:
    i += 1
    # if i > 5: break
    print(f"Trabalhando no item {i} de {len(df_dict)}")

    # if str(item['CODIGO  DA COMPOSICAO']) == 'nan': continue

    # se o código for NaN pular para o próximo:
    if str(item['CODIGO  DA COMPOSICAO']) == 'nan': continue

    # Converter o código para inteiro para não ter decimais
    try: item['CODIGO  DA COMPOSICAO'] = int(item['CODIGO  DA COMPOSICAO'])
    except: pass

    # conterter tudo para string
    for key in item:
        item[key] = str(item[key])

    codigo = item['CODIGO  DA COMPOSICAO']
    descricao = item['DESCRICAO DA COMPOSICAO']
    unidade = item['UNIDADE']
    custo = item['CUSTO TOTAL'].replace(',', '.') # decimal é com ponto, não com vírgula.


    # escape de aspas duplas para não dar erro no sql
    try: descricao = descricao.replace('"', '\\"')
    except: input("Erro ao escapar aspas duplas. Pressione enter para continuar...")


    # INSERIR no banco de dados (COMPOSIÇÕES)

    sql = f"""
        INSERT INTO composicoes_insumos(
            codigo, descricao, unidade, tipo
        ) VALUES (
            "{codigo}",
            "{descricao}",
            "{unidade}",
            "C"
        );
    """
    ## Tentar inserir, mas se já existir o código, ignorar
    try: cursor.execute(sql)
    except Exception as e: print(e)



    # INSERIR no banco de dados (DETALHES DA COMPOSIÇÃO)

    sql = f"""
        INSERT INTO detalhes_composicoes_insumos (
            codigo, estado_referencia, mes_referencia, valor, desonerado
        ) VALUES (
            "{codigo}", "{localidade}", "{data}", "{custo}", "{desonerado}"
        );
    """
    try: 
        cursor.execute(sql)
    except Exception as e:
        print(e)



# Salvar as alterações no banco de dados
mydb.commit()

print("\n\n SUCESSO!")

# Salvar no json apenas para conferência
with open('composicoes.json', 'w') as fp:
    json.dump(df_dict, fp, indent=4)