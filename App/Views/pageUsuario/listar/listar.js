import HttpClient from "/App/App.js";
import Table from "/App/components/Table.js";
import Badge from "/App/components/Badge.js";

const httpClient = new HttpClient();

httpClient.makeRequest("/api/usuario/listar")
.then(response => {
    const tableUsuarios = new Table("#tableUsuarios", response?.usuarios, ["id", "nome"]).element

    tableUsuarios.querySelectorAll("table tbody tr").forEach(tr => {
        tr.addEventListener("click", () => {
            httpClient.navigateTo("/usuario/visualizar", {id: tr.dataset.id})
        })
    })

})

new Badge("#actions", "Novo").element.addEventListener("click", () => {
    httpClient.navigateTo("/usuario/criar")
})