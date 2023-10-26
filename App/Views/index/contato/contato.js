import HttpClient from '/App/App.js'
const httpClient = new HttpClient()

let botao = document.querySelector('#alertar')
botao?.addEventListener('click', () => alert('Alerta funfou'))

new httpClient.Info("Exemplo", 'success', 1500, '#info')
new httpClient.Info('Danger', 'danger', 2000)
new httpClient.Info('Warning', 'warning', 3000, '#info')

import Botao from '/App/components/Botao.js'
Botao('#botao')
Botao('#botao')
Botao('#botao')

let produtos = document.querySelector('#produtos')
console.log(produtos);
produtos?.addEventListener('click', (e) => {
    e.preventDefault();
    window.route('/produtos')
});
