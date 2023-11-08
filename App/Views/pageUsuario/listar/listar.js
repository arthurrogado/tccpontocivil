import HttpClient from "/App/App.js";
import Table from "/App/components/Table.js";
import Badge from "/App/components/Badge.js";
import Modal from "/App/components/Modal.js";

const httpClient = new HttpClient();

httpClient.makeRequest("/api/usuario/listar")
.then(response => {
    const tableUsuarios = new Table("#tableUsuarios", response?.usuarios, ["id", "nome"], ["ID", "Nome"], []).element

    let thAcoes = document.createElement('th');
    thAcoes.textContent = "Ações";
    tableUsuarios.querySelector('thead tr').appendChild(thAcoes);

    tableUsuarios.querySelectorAll('tbody tr').forEach(tr => {
        let tdAcoes = document.createElement('td');
        tdAcoes.id = "actionsTd";

        let btnVisualizar = new Badge("#actionsTd", "Visualizar").element;
        btnVisualizar.addEventListener('click', () => {
            httpClient.navigateTo("/usuario/visualizar", {id: tr.dataset.id})
        })

        let btnExcluir = new Badge("#actionsTd", "Excluir", "var(--danger-color)").element;
        btnExcluir.addEventListener('click', () => {
            const modalExcluir = new Modal('body', 'Excluir usuário', 'Tem certeza que deseja excluir este usuário?', [
                {
                    text: 'Não',
                    class: 'default',
                    action: () => {
                        modalExcluir.element.remove();
                    }
                },
                {
                    text: 'Sim',
                    class: 'bg-danger',
                    action: () => {
                        confirmarExclusao(tr.dataset.id);
                    }
                }
            ])
        })

        tdAcoes.appendChild(btnVisualizar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdAcoes);
    })


    // tableUsuarios.querySelectorAll("table tbody tr").forEach(tr => {
    //     tr.addEventListener("click", () => {
    //         httpClient.navigateTo("/usuario/visualizar", {id: tr.dataset.id})
    //     })
    // })

})

new Badge("#actions", "Novo").element.addEventListener("click", () => {
    httpClient.navigateTo("/usuario/criar")
})

const confirmarExclusao = (id) => {
    if(!confirm("Tem certeza que deseja excluir este usuário?")) return;

    httpClient.makeRequest("/api/usuario/excluir", {id: id}).then((response) => {
        if(response.ok) {
            httpClient.reloadPage();
            new Modal().fecharTodosModais();
        }
    });
}