import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

import atualizarSidebar from "/App/Utils/atualizarSidebar.js"
import atualizarInformacoesUsuario from "/App/Utils/atualizarInformacoesUsuario.js"

atualizarSidebar()
document.querySelector('nav').classList.add('hidden')

const form = document.querySelector('.form_login')
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formdata = new FormData(form)
    
    httpClient.makeRequest('/api/login', formdata)
    .then(response => {
        if(response.ok) {
            httpClient.navigateTo('/home')
            atualizarSidebar()
            atualizarInformacoesUsuario()
            document.querySelector('nav').classList.remove('hidden')
        }
    })

})