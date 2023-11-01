import HttpClient from "/App/App.js";
import Modal from "/App/components/Modal.js";
import infoBox from "/App/components/InfoBox.js";
import Table from "/App/components/Table.js";

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


// Adicionar COMPOSIÇÃO --------------------------------------------
const btnAddComposicao = document.querySelector('#addComposicao');
btnAddComposicao.addEventListener('click', async () => {

  let optionsEtapas = "";
  let response = await httpClient.makeRequest('/api/orcamento/etapa/listar', { id_orcamento: httpClient.getParams().id })
  if (response.etapas) {
    const etapas = response.etapas;
    etapas.forEach(etapa => {
      optionsEtapas += /*html*/`
        <option value="${etapa.id}">${etapa.descricao}</option>
      `;
    })
  }
  
  const contentModal = /*html*/`
    <div class="input-field">
      <input type="text" name="descricao" required>
      <label>Descrição</label>
    </div>
    <div id="composicoesPesquisa"></div>

    <div class="input-field">
      <select name="etapa" required>
        <option value=""></option>
        ${optionsEtapas}
      </select>
      <label>Etapa</label>
    </div>

    <div class="input-field">
      <input type="number" name="quantidade" required>
      <label>Quantidade</label>
    </div>

    <button class="btn btn-primary" id="enviarComposicao">Criar</button>
  `;

  const novaComposicaoModal = new Modal("body", "Adicionar composição", contentModal, [])
  document.querySelector('#enviarComposicao').addEventListener('click', () => {
    enviarComposicao()
  })

  novaComposicaoModal.element.querySelector('.box').style.maxWidth = '90%';

  let timeout = null;
  document.querySelector('[name="descricao"]').addEventListener('input', (e) => {
    document.querySelector('#composicoesPesquisa').innerHTML = 'Buscando...';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      pesquisarComposicao(e.target.value)
    }, 1000)
  })

});

// PESQUISA
const pesquisarComposicao = (pesquisa) => {
  document.querySelector('#composicoesPesquisa').innerHTML = '';
  if(pesquisa.length < 3) return false;

  httpClient.makeRequest('/api/orcamento/composicao/pesquisar', { pesquisa: pesquisa })
    .then(response => {
      if (response.composicoes) {
        const tableResultComposicoes = new Table("#composicoesPesquisa", response.composicoes, ['codigo', 'descricao', 'unidade'], ['Código', 'Descrição', 'Unidade'], [], false).element
        tableResultComposicoes.querySelector('thead').style.position = 'sticky';
        tableResultComposicoes.querySelector('thead').style.top = '0';

        tableResultComposicoes.querySelectorAll('tbody tr').forEach(tr => {

          // definir o item composicao_insumo a ser colocado. 
          // colocar as informações dele no #composicaoInsumo selecionado
          // depois definir quantidade e clicar no botão adicionar
          
          tr.addEventListener('click', () => {
            selecionarComposicao(tr);
          })

        })

      }
    })
}
// SELECIONAR uma composição para o item
const selecionarComposicao = (tr) => {
  const codigo = tr.querySelector(':nth-child(1)').textContent;
  const descricao = tr.querySelector(':nth-child(2)').textContent;
  const unidade = tr.querySelector(':nth-child(3)').textContent;

  document.querySelector('#composicoesPesquisa').innerHTML = /*html*/`
    <div class="input-field">
      <input type="text" name="codigo" value="${codigo}" readonly>
      <label>Código</label>
    </div>
    <div class="input-field">
      <input type="text" name="descricao" value="${descricao}" readonly>
      <label>Descrição</label>
    </div>
    <div class="input-field">
      <input type="text" name="unidade" value="${unidade}" readonly>
      <label>Unidade</label>
    </div>
  `;

  document.querySelector('[name="etapa"]').focus();
}

// ENVIAR PARA ADICIONAR COMPOSICAO
const enviarComposicao = () => {
  const data = {
    id_etapa: document.querySelector('[name="etapa"]').value,
    codigo: document.querySelector('[name="codigo"]').value,
    quantidade: document.querySelector('[name="quantidade"]').value,
    tipo: 'C'
  }

  // verificar se há alguma vazio
  for (let key in data) {
    if (data[key] == '') {
      new infoBox('Preencha todos os campos!', 'error')
      return false;
    }
  }

  httpClient.makeRequest('/api/orcamento/composicao/adicionar', data)
    .then(response => {
      if (response.ok) {
        new infoBox('Composição adicionada com sucesso!', 'success')
        novaComposicaoModal.element.remove();
        listarEtapas()
      }
    })

}




// LISTAR ETAPAS

const listarEtapas = () => {
  httpClient.makeRequest('/api/orcamento/etapa/listar', { id_orcamento: httpClient.getParams().id })
    .then(response => {
      if (response.etapas) {
        const etapas = response.etapas;

        // limpa a tabela
        document.querySelector('#tableOrcamento tbody').innerHTML = '';

        etapas.forEach(etapa => {
          const tr = document.createElement('tr');
          tr.setAttribute('section', etapa.id);

          tr.innerHTML = /*html*/`
            <th><i class="fa fa-caret-right"></i></th>

            <td>
              
              <div class="w3-dropdown-click w3-dropdown-hover w3-container">
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