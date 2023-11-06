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


// Escutar evento de submit do formulário
document.querySelector('#registrarUsuario').addEventListener('click', () => {

    // Verificar os itens obrigatórios
    if(!httpClient.verifyObrigatoryFields()) return;

    const data = new FormData(document.querySelector('#formCriarUsuario'));
    httpClient.makeRequest('/api/usuario/criar', data).then((response) => {
        if(response.ok) {
            httpClient.navigateTo('/usuario/listar');
        }
    });
});