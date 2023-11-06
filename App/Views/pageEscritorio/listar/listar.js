import HttpClient from "/App/App.js";
import Table from "/App/components/Table.js";
import Button from "/App/components/Button.js";

const httpClient = new HttpClient();

const btnNovo = new Button("#actions", "Novo").element;
btnNovo.addEventListener("click", () => {
    httpClient.navigateTo("/escritorio/criar");
})

httpClient.makeRequest("/api/escritorio/listar").then((response) => {
    const columns = ["id", "nome", "cnpj"];
    const headers = ["ID", "Nome", "CNPJ"];

    const actions = [
        {
            text: "Visualizar",
            action: (id) => {
                httpClient.navigateTo("/escritorio/visualizar", { id: id });
            },
        },
    ];

    const table = new Table("#tableEscritorios", response?.escritorios, columns, headers, actions);
    console.log(table);
    let trs = table.element.querySelectorAll("table tbody tr");
    // trs.forEach((tr) => {
    //     tr.addEventListener("click", () => {
    //         httpClient.navigateTo("/escritorio/visualizar", {id: tr.dataset.id});
    //     });
    // });


})