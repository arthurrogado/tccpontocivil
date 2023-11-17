# TCC: PontoCivil

Este projeto é o produto do Trabalho de Conclusão de Curso de Tecnologia em Análise e Desenvolvimento de Sistemas pelo Instituto Federal de Educação, Ciência e Tecnologia de Goiás - Câmpus Uruaçu. Autor do projeto: Arthur Rogado Reis.

## Descrição do Projeto

O PontoCivil é um sistema de orçamentação para construção civil, que visa atender necessidades de profisionais da área. Foi desenvolvido utilizando as linguagens PHP (para backend), e Javascript Vanilla (para frontend).

O PontoCivil é um sistema de controle de ponto eletrônico que visa atender as necessidades de empresas de pequeno porte. O sistema foi desenvolvido utilizando a linguagem de programação Java e o framework Spring Boot. O banco de dados utilizado foi o MySQL. O sistema foi desenvolvido para ser executado em um servidor local, porém, pode ser facilmente adaptado para ser executado em um servidor remoto.

## Setup básico para execução do projeto

### Pré-requisitos
- PHP 7 ou superior
- MySQL 5.7 ou superior

### Instalação
1. Clone o repositório
2. Crie um banco de dados no MySQL e configure o arquivo `App/Config/Config.php` com as informações do banco de dados.
3. Execute o script `database.sql` no banco de dados criado.
    3.1. O script já adiciona um escritório e usuário master, de senha 123.
4. Execute o comando `php -S localhost:8000` na pasta `./public` do projeto.
5. Acesse o sistema em `localhost:8000` no navegador.

### Licença
Leia LICENCE.md para mais informações.