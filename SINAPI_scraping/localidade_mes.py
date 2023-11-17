import pandas as pd
import datetime as dt

# Tabela abreviaturas, exemplo: Goiânia => GO
abreviacoes = {
    "RIO BRANCO": "AC",
    "MACEIO": "AL",
    "MACAPA": "AP",
    "MANAUS": "AM",
    "SALVADOR": "BA",
    "FORTALEZA": "CE",
    "BRASILIA": "DF",
    "VITORIA": "ES",
    "GOIANIA": "GO",
    "SAO LUIS": "MA",
    "CUIABA": "MT",
    "CAMPO GRANDE": "MS",
    "BELO HORIZONTE": "MG",
    "BELEM": "PA",
    "JOAO PESSOA": "PB",
    "CURITIBA": "PR",
    "RECIFE": "PE",
    "TERESINA": "PI",
    "RIO DE JANEIRO": "RJ",
    "NATAL": "RN",
    "PORTO ALEGRE": "RS",
    "PORTO VELHO": "RO",
    "BOA VISTA": "RR",
    "FLORIANOPOLIS": "SC",
    "SAO PAULO": "SP",
    "ARACAJU": "SE",
    "PALMAS": "TO",
}


# Pegar informações básicas: mês e localidade
df_basico = pd.read_excel('composicoes_202309.xlsx')

# pegar célula A3
df_basico = df_basico.iloc[1, 0]

# converter para string
df_basico = str(df_basico)


# "ABRANGÊNCIA : NACIONAL    LOCALIDADE  : GOIANIA   DATA DE PREÇO   : 09/2023 REFERÊNCIA COLETA : MEDIANO"

capital = df_basico.split('LOCALIDADE')[1].split('DATA DE PREÇO')[0]
capital = capital.replace(':', '').strip()
localidade = abreviacoes[capital]
print(localidade)

mes = df_basico.split('DATA DE PREÇO')[1].split('REFERÊNCIA COLETA')[0]
mes = mes.replace(':', '').strip()
data = dt.datetime.strptime(mes, '%m/%Y').date()
print(data)