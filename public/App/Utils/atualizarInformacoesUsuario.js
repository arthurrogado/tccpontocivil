import HttpClient from "/App/App.js";
const httpClient = new HttpClient();

// Atualizar informações do usuário
const atualizarInformacoesUsuario = () => {
    httpClient.makeRequest('/api/usuario/check_login')
    .then(response => {
        if(response.ok){
            let usuario = response.usuario;
            document.querySelector('#nomeUsuario').textContent = usuario.nome;
        }
    });
}

export default atualizarInformacoesUsuario;