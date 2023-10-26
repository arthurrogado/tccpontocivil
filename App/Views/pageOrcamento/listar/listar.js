import HttpClient from "/App/App.js";
import Table from "/App/components/Table.js";
import Button from "/App/components/Button.js";
import Badge from "/App/components/Badge.js";

const httpClient = new HttpClient();

httpClient.makeRequest('/api/orcamento/listar')
.then(response => {
    const table = new Table('#tableOrcamentos', response?.orcamentos, ['id', 'nome'], ['ID', 'Nome'], []).element;

    const actionsTh = document.createElement('th');
    actionsTh.textContent = 'Ações';
    table.querySelector('thead tr').appendChild(actionsTh);

    document.querySelectorAll('#tableOrcamentos tbody tr').forEach(tr => {
        const actionsTd = document.createElement('td');
        actionsTd.id = "actionsTd"
        const btnVisualizar = new Badge("#actionsTd", 'Visualizar').element;
        btnVisualizar.addEventListener('click', () => {
            httpClient.navigateTo(`/orcamento/visualizar`, {id: tr.dataset.id});
        });
        actionsTd.appendChild(btnVisualizar);
        tr.appendChild(actionsTd);
        console.log('tr: ', tr)
    });

});

const btnNovo = new Button("#actions", "Novo").element;
btnNovo.addEventListener("click", () => {
    httpClient.navigateTo("/orcamento/criar");
})