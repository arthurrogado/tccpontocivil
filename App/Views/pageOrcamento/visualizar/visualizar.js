import HttpClient from "/App/App.js";
import Modal from "/App/components/Modal.js";
import infoBox from "/App/components/InfoBox.js";

const httpClient = new HttpClient();

httpClient.makeRequest('/api/orcamento/visualizar', { id: httpClient.getParams().id })
  .then(response => {
    if (response.orcamento) {
      let orcamento = response.orcamento;

      let replaces = {
        "#nomeOrcamento": orcamento.nome,
        "#criadoEm": orcamento.criado_em,
        "#bdi": orcamento.bdi,
        "#encargosSociais": orcamento.desonerado == 1 ? 'Desonerado' : 'Não desonerado',
      }

      for (let key in replaces) {
        document.querySelector(key).textContent = replaces[key];
      }

    }
  })

const sections = document.querySelectorAll('[section]');
sections.forEach(section => {
  // ao clicar em uma seção, esconde ou mostra os itens da seção
  section.addEventListener('click', () => {
    const sectionNumber = section.getAttribute('section');
    const items = document.querySelectorAll(`tr[from-section="${sectionNumber}"]`);
    items.forEach(item => {
      item.classList.toggle('hidden');

    })
  })
})


// Adicionar etapa
const btnAddEtapa = document.querySelector('#addEtapa');
btnAddEtapa.addEventListener('click', () => {

  const contentModal = /*html*/`
    <div class="input-field">
      <input type="text" name="descricao" required>
      <label>Descrição</label>
    </div>
    <button class="btn btn-primary" id="criarEtapa">Criar</button>
  `;
  const modalCriarEtapa = new Modal("body", "Adicionar etapa", contentModal, [])

  document.querySelector('#criarEtapa').addEventListener('click', () => {
    const descricao = document.querySelector('[name="descricao"]').value;
    const data = {
      descricao: descricao,
      id_orcamento: httpClient.getParams().id
    }

    httpClient.makeRequest('/api/orcamento/etapa/criar', data)
      .then(response => {
        if (response.ok) {
          // new Modal("body", "Sucesso", "Etapa adicionada com sucesso!", [])
          new infoBox("Etapa adicionada com sucesso!", 'success')
          modalCriarEtapa.element.remove();
          listarEtapas()
        }
      })

  })


});


// Adicionar composição
const btnAddComposicao = document.querySelector('#addComposicao');
btnAddComposicao.addEventListener('click', () => {

  const contentModal = /*html*/`
    <div class="input-field">
      <input type="text" name="descricao" required>
      <label>Descrição</label>
    </div>
  `;

  new Modal("body", "Adicionar composição", contentModal, [])

});







// LISTAR ETAPAS

const openDropdown = () => {
  alert('oi')
}

const listarEtapas = () => {
  httpClient.makeRequest('/api/orcamento/etapa/listar', { id_orcamento: httpClient.getParams().id })
    .then(response => {
      if (response.etapas) {

        // limpa a tabela
        document.querySelector('#tableOrcamento tbody').innerHTML = '';

        response.etapas.forEach(etapa => {
          const tr = document.createElement('tr');
          tr.setAttribute('section', etapa.id);

          tr.innerHTML = /*html*/`
            <th><i class="fa fa-caret-right"></i></th>

            <td>
              
              <div class="w3-dropdown-click w3-dropdown-hover">
                <i class="fa fa-wrench"></i>
                <div class="w3-dropdown-content w3-bar-block w3-round w3-padding">
                  <button class="delete w3-bar-item w3-button w3-deep-orange w3-hover-red w3-round">
                    <i class="fa fa-trash"></i>
                    Excluir
                  </button>
                </div>
              </div>

            </td>

            <td>${etapa.id}</td>
            <td></td> <!-- codigo -->
            <td></td> <!-- banco -->
            <td>${etapa.descricao}</td>
            <td></td> <!-- unidade -->
            <td></td> <!-- quantidade -->
            <td></td> <!-- valor unitario -->

            <td>R$ --</td> <!-- valor com bdi -->
            <td>R$ --</td> <!-- valor total -->

          `;

          tr.querySelectorAll('.w3-dropdown-click').forEach(option => {
            option.addEventListener('click', () => {
              option.querySelector('div').classList.toggle('w3-show');
            })
          })

          tr.querySelector('.delete').addEventListener('click', () => {
            const data = {
              id_etapa: etapa.id
            }
            httpClient.makeRequest('/api/etapa/excluir', data)
              .then(response => {
                if (response.ok) {
                  new infoBox('Etapa excluída com sucesso!', 'success')
                  listarEtapas()
                }
              })
          })

          document.querySelector('#tableOrcamento tbody').append(tr);
        })
      }
    })
}

listarEtapas()