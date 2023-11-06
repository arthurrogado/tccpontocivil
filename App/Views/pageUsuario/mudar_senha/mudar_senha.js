import HttpClient from "/App/App.js";
const httpClient = new HttpClient();

import infoBox from "/App/components/InfoBox.js";

// Preencher nome e nome de usuário
// #nomeMudarSenha e #usuarioMudarSenha
httpClient.makeRequest('/api/usuario/visualizar', {id: httpClient.getParams().id})
.then(response => {
    const usuario = response?.usuario
    document.querySelector('#nomeMudarSenha').textContent = usuario.nome
    document.querySelector('#usuarioMudarSenha').textContent = usuario.usuario
})


// MUDAR SENHA
document.querySelector('#mudarSenha').addEventListener('click', () => {

    const senha = document.querySelector('[name=senha]').value
    const confirmarSenha = document.querySelector('[name=confirmarSenha]').value

    if(senha != confirmarSenha) {
        new infoBox("As senhas não coincidem", "danger", 3000);
        return
    }

    const formData = new FormData();
    formData.append('id', httpClient.getParams().id);
    formData.append('senha', senha);

    httpClient.makeRequest('/api/usuario/mudar_senha', formData).then((response) => {
        if(response.ok) {
            httpClient.navigateTo('/usuario/visualizar', {id: httpClient.getParams().id});
        }
    });
})