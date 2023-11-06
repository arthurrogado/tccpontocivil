import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

const form = document.querySelector('.formCriarEscritorio')
const button = document.querySelector('#btnCriarEscritorio')
button.addEventListener('click', async (e) => {
    e.preventDefault()

    if(!httpClient.verifyObrigatoryFields(form)) return

    const data = new FormData(form)
    const url = '/api/escritorio/criar'
    
    httpClient.makeRequest(url, data)
    .then(response => {
        if(response.ok){
            httpClient.navigateTo('/escritorio/listar')
        }
    })

})