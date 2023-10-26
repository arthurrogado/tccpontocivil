import HttpClient from "/App/App.js";

const httpClient = new HttpClient();

const id = httpClient.getParams().id;

httpClient.makeRequest("/api/escritorio/visualizar", {id: id}).then((response) => {
    const escritorio = response?.escritorio
    httpClient.fillAllInputs(escritorio)
})

import Badge from "/App/components/Badge.js";

new Badge("#actions", "Novo").element.addEventListener("click", () => {
    httpClient.navigateTo("/escritorio/criar");
});


const editar = () => {
    document.querySelectorAll("[disabled]").forEach(element=>{
        element.disabled = false;
    })

    // botaoEditar.remove();
    botaoEditar.innerHTML = "Cancelar";
    botaoEditar.style.backgroundColor = "var(--danger-color)";
    botaoEditar.removeEventListener("click", editar);
    botaoEditar.addEventListener("click", () => {
        botaoSalvar.remove();
        botaoEditar.innerHTML = "Editar";
        botaoEditar.style.backgroundColor = "var(--primary-color)";
        botaoEditar.addEventListener("click", editar);
        // Disable all inputs
        httpClient.disableAllInputs();
    })
    
    const botaoSalvar = new Badge("#actions", "Salvar", "var(--success-color)").element
    botaoSalvar.addEventListener("click", () => {
        const data = new FormData(document.querySelector("form"));
        httpClient.makeRequest("/api/escritorio/editar", data).then((response) => {
            console.log(response);
        });
    });


}
const botaoEditar = new Badge("#actions", "Editar").element
botaoEditar.addEventListener("click", editar)


const excluir = () => {
    // confirmation 
    if(!confirm("Tem certeza que deseja excluir?")) return
    httpClient.makeRequest("/api/escritorio/excluir", {id: id})
}
const botaoExcluir = new Badge("#actions", "Excluir", "var(--danger-color)").element
botaoExcluir.addEventListener("click", excluir)