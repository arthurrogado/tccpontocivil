// index.js
import HttpClient from "/App/App.js";
import atualizarSidebar from "/App/Utils/atualizarSidebar.js";
import atualizarInformacoesUsuario from "/App/Utils/atualizarInformacoesUsuario.js";

const httpClient = new HttpClient()
document.querySelectorAll('nav').forEach(el => {
    el.addEventListener('click', (event) => {
        event.preventDefault()
        let href = event.target.getAttribute('href')

        if(!href) return

        else if(href == window.location.pathname) {
            return
        }

        httpClient.navigateTo(event.target.getAttribute('href'))
    })
})

// Controlar o sidebar
document.querySelector('#controlSidebar').addEventListener('click', () => {
    document.querySelector('nav').classList.toggle('active')
})

// Se a tela for menor que 768px, o sidebar é fechado
const verificarTamanhoTela = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if(window.innerWidth < 768) {
        document.querySelector('nav').classList.remove('active');
    } else {
        document.querySelector('nav').classList.add('active');
    }

}
window.addEventListener('resize', async () => {
    await verificarTamanhoTela()
})


// EXECUÇÃO

atualizarSidebar();
atualizarInformacoesUsuario();
verificarTamanhoTela();