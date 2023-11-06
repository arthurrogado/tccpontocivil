import HttpClient from "/App/App.js";

const httpClient = new HttpClient();

// Preencher select dos escritórios
httpClient.makeRequest("/api/escritorio/listar").then((response) => {
    const selectEscritorio = document.querySelector("[name='id_escritorio']");
    response?.escritorios.forEach((escritorio) => {
        const option = document.createElement("option");
        option.value = escritorio.id;
        option.textContent = escritorio.id + " - " + escritorio.nome;
        selectEscritorio.appendChild(option);
    });
});



// Preencher os dados do usuário
httpClient.makeRequest('/api/usuario/visualizar', {id: httpClient.getParams().id})
.then(response => {
    const usuario = response?.usuario
    httpClient.fillAllInputs(usuario)
})

document.querySelector('#mudarSenha').href = `/usuario/mudar_senha?id=${httpClient.getParams().id}`