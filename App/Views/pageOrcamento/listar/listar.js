import HttpClient from "/App/App.js";
import Table from "/App/components/Table.js";
import Button from "/App/components/Button.js";
import Badge from "/App/components/Badge.js";
import Modal from "/App/components/Modal.js";

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

        const btnExcluir = new Badge("#actionsTd", 'Excluir', "var(--danger-color)").element;
        btnExcluir.addEventListener('click', () => {
            excluirOrcamento(tr.dataset.id);
        });

        actionsTd.appendChild(btnVisualizar);
        actionsTd.appendChild(btnExcluir);

        tr.appendChild(actionsTd);
        console.log('tr: ', tr)
    });

});

const btnNovo = new Button("#actions", "Novo").element;
btnNovo.addEventListener("click", () => {
    httpClient.navigateTo("/orcamento/criar");
})


// Excluir orçamento
const excluirOrcamento = (id) => {
    const modalExcluir = new Modal('body', 'Excluir orçamento', 'Tem certeza que deseja excluir este orçamento?', [
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
                confirmarExclusao(id);
            }
        }
    ]);
}

const confirmarExclusao = (id) => {
    const confirmarExclusao = new Modal('body', 'Excluir orçamento', 'Tem MESMO certeza que deseja excluir este orçamento?', [
        {
            text: 'Não',
            class: 'default',
            action: () => {
                confirmarExclusao.element.remove();
            }
        },
        {
            text: 'Sim',
            class: 'bg-danger',
            action: () => {
                if(!confirm('Tem certeza que deseja excluir este orçamento? NÃO tem como voltar depois hein!    ')) return;
                httpClient.makeRequest('/api/orcamento/excluir', {id: id})
                .then(response => {
                    if(response.ok) {
                        modalExcluir.element.remove();
                        httpClient.reloadPage();
                    }
                });
            }
        }
    ]);
}