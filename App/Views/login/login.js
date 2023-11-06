import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

import atualizarSidebar from "/App/Utils/atualizarSidebar.js"
import atualizarInformacoesUsuario from "/App/Utils/atualizarInformacoesUsuario.js"

const form = document.querySelector('.formLogin')
console.log(form)
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formdata = new FormData(form)
    
    httpClient.makeRequest('/api/login', formdata)
    .then(response => {
        if(response.ok) {
            httpClient.navigateTo('/home')
            atualizarSidebar()
            atualizarInformacoesUsuario()
        }
    })

})