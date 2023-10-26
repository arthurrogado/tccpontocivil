import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

const encargo = document.querySelector('#encargo')
encargo.querySelectorAll('span').forEach(span => {
    span.addEventListener('click', () => {
        encargo.querySelector('span[selected]').removeAttribute('selected')
        span.setAttribute('selected', '')
    })
})

const btnCriar = document.querySelector('#criarOrcamento')
btnCriar.addEventListener('click', () => {

    if(!httpClient.verifyObrigatoryFields()) return

    const formdata = new FormData(document.querySelector('#formCriarOrcamento'))

    const valueDesonerado = encargo.querySelector('span[selected]').getAttribute('value')
    formdata.append('desonerado', valueDesonerado)

    httpClient.makeRequest('/api/orcamento/criar', formdata )
})