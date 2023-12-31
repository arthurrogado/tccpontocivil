import HttpClient from "/App/App.js";
import Modal from "/App/components/Modal.js";
import infoBox from "/App/components/InfoBox.js";
import Table from "/App/components/Table.js";
import siglas_estados from "/App/Utils/siglas_estados.js";

const httpClient = new HttpClient();


const atualizarInformacoes = () => {
  httpClient.makeRequest('/api/orcamento/visualizar', { id: httpClient.getParams().id })
    .then(response => {
      if (response.orcamento) {
        const orcamento = response.orcamento;

        // Formatar datas
        orcamento.criado_em = new Date(orcamento.criado_em).toLocaleDateString('pt-br');
        let data_sinapi = new Date(orcamento.data_sinapi)
        // adicionar 1 dia para o mês ficar correto
        data_sinapi.setDate(data_sinapi.getDate() + 1)
        data_sinapi = data_sinapi.toLocaleDateString('pt-br', { month: '2-digit', year: 'numeric' });

        window.orcamento = orcamento;

        let replaces = {
          "#nomeOrcamento": orcamento.nome,
          "#descricaoOrcamento": orcamento.descricao,
          "#criadoEm": orcamento.criado_em,
          "#bdi": orcamento.bdi,
          "#encargosSociais": orcamento.desonerado == 1 ? 'Desonerado' : 'Não desonerado',
          "#estadoReferencia": orcamento.estado,
          "#dataSinapi": data_sinapi,
        }

        for (let key in replaces) {
          document.querySelector(key).textContent = replaces[key];
        }

      }
    })
}
atualizarInformacoes();

// FUNÇÕES _______________________________________________________________

const getEtapasOptions = async () => {
  let optionsEtapas = "";
  let response = await httpClient.makeRequest('/api/orcamento/etapa/listar', { id_orcamento: httpClient.getParams().id })
  const etapas = response.etapas;
  etapas.forEach(etapa => {
    optionsEtapas += /*html*/`
      <option value="${etapa.id}">${etapa.descricao}</option>
    `;
  })
  return optionsEtapas;
}

// PESQUISA
const pesquisarComposicao = (pesquisa) => {
  pesquisar(pesquisa, 'composicao')
}
const pesquisarInsumo = (pesquisa) => {
  pesquisar(pesquisa, 'insumo')
}
const pesquisar = (pesquisa, tipo, parent = '#itensPesquisa') => {
  document.querySelector(parent).innerHTML = '';
  if (pesquisa.length < 3) return false;

  httpClient.makeRequest(`/api/orcamento/${tipo}/pesquisar`, { pesquisa: pesquisa })
    .then(response => {
      if (response.ok) {
        const resultado = response.resultado;


        pesquisa = pesquisa.toUpperCase();

        // organizar para os itens que começa com o termo da pesquisa aparecerem primeiro
        function compararPorDescricaoInicial(a, b) {
          const descricaoA = a.descricao.toUpperCase();
          const descricaoB = b.descricao.toUpperCase();

          if (descricaoA.startsWith(pesquisa) && !descricaoB.startsWith(pesquisa)) {
            return -1; // "a" vem antes de "b"
          } else if (!descricaoA.startsWith(pesquisa) && descricaoB.startsWith(pesquisa)) {
            return 1; // "b" vem antes de "a"
          } else {
            // Caso nenhuma das descrições comece com a palavra-chave, mantenha a ordem original
            return 0;
          }
        }
        resultado.sort(compararPorDescricaoInicial);

        const tableResultados = new Table(parent, resultado, ['codigo', 'descricao', 'unidade'], ['Código', 'Descrição', 'Unidade'], [], false).element
        tableResultados.querySelector('thead').style.position = 'sticky';
        tableResultados.querySelector('thead').style.top = '0';

        tableResultados.querySelectorAll('tbody tr').forEach(tr => {

          // definir o item composicao_insumo a ser colocado. 
          // colocar as informações dele no #composicaoInsumo selecionado
          // depois definir quantidade e clicar no botão adicionar

          tr.addEventListener('click', () => {
            selecionarItem(tr, "#itensPesquisa");
          })

        })

      }
    })
}


// SELECIONAR uma composição para o item
const selecionarItem = (tr, parent = '#itensPesquisa') => {
  const codigo = tr.querySelector(':nth-child(1)').textContent;
  const descricao = tr.querySelector(':nth-child(2)').textContent;
  const unidade = tr.querySelector(':nth-child(3)').textContent;

  document.querySelector(parent).innerHTML = /*html*/`
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







document.querySelector('#btnEdicaoOrcamento').addEventListener('click', () => {
  const modalEditarOrcamento = new Modal("body", "Editar orçamento", /*html*/`
      <div class="">

        <form class="form" id="formCriarOrcamento">
            <div class="input-field">
                <input type="text" name="nome" required>
                <label>Nome*</label>
            </div>

            <div class="input-field">
                <textarea name="descricao" rows="5" style="resize: vertical; height: 5rem;" required></textarea>
                <label>Descrição</label>
            </div>

            <div class="input-field">
                <select name="estado" required>
                    <option value=""></option>
                </select>
                <label>UF da base SINAPI*</label>
            </div>

            <div class="input-field">
                <select name="data_sinapi" required>
                    <option value=""></option>
                </select>
                <label>Mês da base SINAPI*</label>
            </div>

            <div class="input-field">
                <input type="text" name="bdi" required>
                <label>BDI</label>
            </div>
            
            <div id="encargo">
                <span value="0">Não Desonerado</span>
                <span value="1">Desonerado</span>
            </div>

        </form>

    </div>
    `).element;
  modalEditarOrcamento.querySelector('.footer').innerHTML = /*html*/`<button type="button" id="editarOrcamento" class="btn btn-primary">Editar</button>`

  modalEditarOrcamento.querySelector("[name='nome']").value = orcamento.nome;
  modalEditarOrcamento.querySelector("[name='descricao']").value = orcamento.descricao;
  modalEditarOrcamento.querySelector('[name="estado"]').value = orcamento.estado;
  modalEditarOrcamento.querySelector('[name="bdi"]').value = orcamento.bdi;

  // Preencher select de meses de referência do SINAPI
  httpClient.makeRequest('/api/item/meses_sinapi')
    .then(response => {
      if (response.meses_referencia) {
        const meses = response.meses_referencia;
        meses.forEach(mes_referencia => {
          let mes = mes_referencia.mes_referencia;

          let option = document.createElement('option');
          option.value = mes;
          option.innerHTML = mes.split('-')[1] + '/' + mes.split('-')[0];
          document.querySelector('[name="data_sinapi"]').appendChild(option);
          document.querySelector('[name="data_sinapi"]').value = orcamento.data_sinapi;
        })
      }
    });

  // Preencher select de estados do SINAPI
  httpClient.makeRequest('/api/item/estados_sinapi')
    .then(response => {
      if (response.estados_referencia) {
        const estados = response.estados_referencia;
        estados.forEach(estado_referencia => {
          let estado = estado_referencia.estado_referencia;

          let option = document.createElement('option');
          option.value = estado;
          option.innerHTML = siglas_estados[estado];
          document.querySelector('[name="estado"]').appendChild(option);
          document.querySelector('[name="estado"]').value = orcamento.estado;
        })
      }
    })

  // Preencher se é Desonerado ou Não Desonerado
  const encargo = document.querySelector('#encargo')
  encargo.querySelectorAll('span').forEach(span => {
    span.addEventListener('click', () => {
      encargo.querySelector('span[selected]').removeAttribute('selected');
      span.setAttribute('selected', '');
    });
  });
  document.querySelector(`#encargo span[value="${orcamento.desonerado}"]`).setAttribute('selected', '');

  document.querySelector('#editarOrcamento').addEventListener('click', () => editarOrcamento())

})

const editarOrcamento = () => {
  if (!httpClient.verifyObrigatoryFields()) return;

  const formdata = new FormData(document.querySelector('#formCriarOrcamento'));

  const valueDesonerado = document.querySelector('#encargo span[selected]').getAttribute('value');
  formdata.append('desonerado', valueDesonerado);

  formdata.append('id', httpClient.getParams().id);

  httpClient.makeRequest('/api/orcamento/editar', formdata)
    .then(response => {
      if (response.ok) {
        // close modal
        document.querySelector('.box').parentElement.remove();
        // atualizarInformacoes();
        httpClient.reloadPage();
      }
    })

}



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

// ENVIAR PARA ADICIONAR COMPOSICAO
const enviarItem = (tipo) => {
  if (tipo != 'I' && tipo != 'C') {
    new infoBox('Erro ao enviar item!', 'danger')
    return false;
  }

  const data = {
    id_etapa: document.querySelector('[name="etapa"]')?.value,
    codigo: document.querySelector('[name="codigo"]')?.value,
    quantidade: document.querySelector('[name="quantidade"]')?.value,
    tipo: tipo
  }

  // verificar se há alguma vazio
  for (let key in data) {
    if (data[key] == '') {
      new infoBox('Preencha todos os campos!', 'danger')
      return false;
    }
  }

  httpClient.makeRequest('/api/item/adicionar', data)
    .then(response => {
      if (response.ok) {
        new infoBox('Item adicionado com sucesso!', 'success')
        // novaComposicaoModal.remove();
        document.querySelector('.box').parentElement.remove();
        listarEtapas()
      }
    })

}



const btnAddComposicao = document.querySelector('#addComposicao');
btnAddComposicao.addEventListener('click', async () => {

  const contentModal = /*html*/`
    <div class="input-field">
      <input type="text" name="descricao" required>
      <label>Descrição</label>
    </div>
    <div id="itensPesquisa"></div>

    <div class="input-field">
      <select name="etapa" required>
        <option value=""></option>
        ${await getEtapasOptions()}
      </select>
      <label>Etapa</label>
    </div>

    <div class="input-field">
      <input type="number" name="quantidade" required>
      <label>Quantidade</label>
    </div>

    <button class="btn btn-primary" id="enviarComposicao">Adicionar composição</button>
  `;

  const novaComposicaoModal = new Modal("body", "Adicionar composição", contentModal, [])
  document.querySelector('#enviarComposicao').addEventListener('click', () => {
    enviarItem('C');
  })

  novaComposicaoModal.element.querySelector('.box').style.maxWidth = '90%';

  let timeout = null;
  document.querySelector('[name="descricao"]').addEventListener('input', (e) => {
    document.querySelector('#itensPesquisa').innerHTML = 'Buscando...';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      pesquisarComposicao(e.target.value)
    }, 1000)
  })

});


// ADICIONAR INSUMO

const btnAddInsumo = document.querySelector('#addInsumo');
btnAddInsumo.addEventListener('click', async () => {

  let contentModalInsumo = /*html*/`
    <div class="input-field">
      <input type="text" name="descricao" required>
      <label>Descrição</label>
    </div>
    <div id="itensPesquisa"></div>

    <div class="input-field">
      <select name="etapa" required>
        <option value=""></option>
        ${await getEtapasOptions()}
      </select>
      <label>Etapa</label>
    </div>

    <div class="input-field">
      <input type="number" name="quantidade" required>
      <label>Quantidade</label>
    </div>

    <button class="btn btn-primary" id="enviarInsumo">Adicionar insumo</button>

  `;
  const novoInsumoModel = new Modal('body', 'Quer adicionar um insumo?', contentModalInsumo).element;
  novoInsumoModel.querySelector('.box').style.maxWidth = '90%';

  let timeout = null;
  document.querySelector('[name="descricao"]').addEventListener('input', (e) => {
    document.querySelector('#itensPesquisa').innerHTML = 'Buscando...';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      pesquisarInsumo(e.target.value)
    }, 1000)
  })

  document.querySelector('#enviarInsumo').addEventListener('click', () => {
    enviarItem('I');
  })

})




// LISTAR ETAPAS

const listarEtapas = () => {
  httpClient.makeRequest('/api/orcamento/etapa/listar', { id_orcamento: httpClient.getParams().id })
    .then(response => {
      if (response.etapas) {
        const etapas = response.etapas;

        // limpa a tabela
        document.querySelector('#tableOrcamento tbody').innerHTML = '';

        // Calcular total do orçamento
        let totalOrcamento = 0;

        etapas.forEach(etapa => {
          const trEtapa = document.createElement('tr');
          trEtapa.setAttribute('section', etapa.id);

          // Preencher ETAPA --------------------------------------------
          trEtapa.innerHTML = /*html*/`
            <th class="noprint"><i class="fa fa-caret-right"></i></th>

            <td class="noprint">
              <div class="w3-dropdown-hover w3-container">
                <i class="fa fa-wrench"></i>
                <div class="w3-dropdown-content w3-bar-block w3-round w3-padding">

                  <button class="excluir-etapa w3-bar-item w3-button w3-deep-orange w3-hover-red w3-round">
                    <i class="fa fa-trash"></i>
                    Excluir
                  </button>
                  <button class="editar-etapa w3-bar-item w3-button w3-round w3-margin-top w3-hover-blue" style="background: var(--secondary-color); color: white;">
                    <i class="fa fa-edit"></i>
                    Editar
                  </button>

                </div>
              </div>
            </td>

            <td class="noprint">${etapa.id}</td>
            <td></td> <!-- codigo -->
            <td>${etapa.descricao}</td>
            <td></td> <!-- unidade -->
            <td></td> <!-- quantidade -->
            <td></td> <!-- valor unitario -->

            <td></td> <!-- valor com bdi -->
            <td class="totalEtapa">R$ --</td> <!-- valor total -->

          `;

          // Preencher ITENS --------------------------------------------
          httpClient.makeRequest('/api/itens/por_etapa', { id_etapa: etapa.id })
            .then(response => {
              if (response.itens) {
                const itens = response.itens;

                // Total da etapa
                // let totalEtapa = itens.map(item => item.quantidade * item.valor).reduce((a, b) => a + b, 0);

                let totalEtapa = itens.map(item =>
                  item.quantidade * item.valor
                ).reduce((a, b) => a + b, 0);

                let totalEtapaFormatadoComBDI = (totalEtapa * (1 + window.orcamento.bdi / 100)).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                trEtapa.querySelector('.totalEtapa').textContent = `R$ ${totalEtapaFormatadoComBDI}`;
                totalOrcamento += totalEtapa;
                // Preencher TOTAL do orçamento
                let totalOrcamentoFormatado = totalOrcamento.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                document.querySelector('#totalSemBdi').textContent = `R$ ${totalOrcamentoFormatado}`;

                let totalOrcamentoComBdi = totalOrcamento * (1 + window.orcamento.bdi / 100);
                let totalOrcamentoFormatadoComBDI = totalOrcamentoComBdi.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                document.querySelector('#totalOrcamento').textContent = `R$ ${(totalOrcamentoFormatadoComBDI)}`;

                let totalBdi = totalOrcamento * window.orcamento.bdi / 100;
                let totalBdiFormatado = totalBdi.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                document.querySelector('#totalBdi').textContent = `R$ ${totalBdiFormatado}`;

                let orderedItems = [];

                // o item atual é o último, pois ele não tem próximo item
                let currentItem = itens.find(item => item.id_proximo_item == null)

                while (currentItem) {
                  orderedItems.push(currentItem)
                  currentItem = itens.find(item => item.id_proximo_item == currentItem.id)
                }


                orderedItems.forEach(item => {
                  let trItem = document.createElement('tr');
                  trItem.setAttribute('from-section', etapa.id);

                  let totalItem = item?.quantidade * item?.valor * (1 + window.orcamento.bdi / 100);
                  let totalItemFormatado = totalItem.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                  trItem.innerHTML = /*html*/`
                  <tr from-section="${etapa.id}">
                    <th class="noprint">
                      <!-- <i class="fa fa-caret-down"></i> -->
                    </th>
                    
                    <td class="noprint"> 
                      <div class="w3-dropdown-hover w3-container" style="background: none;">
                        <i class="fa fa-bars"></i>
                        <div class="w3-dropdown-content w3-bar-block w3-round w3-padding">
                          <button class="delete-item w3-bar-item w3-button w3-deep-orange w3-hover-red w3-round">
                            <i class="fa fa-trash"></i>
                            Excluir
                          </button>
                        </div>
                      </div>
                    </td>
                    
                    <td class="noprint"> ${item?.tipo == "I" ?
                      `<i class="fa fa-cube"></i> ` :
                      `<i class="fa fa-cubes"></i> `
                    } </td>

                    <td> ${item?.codigo} </td>
                    <td> ${item?.descricao} </td>
                    <td> ${item?.unidade} </td>
                    <td> ${item?.quantidade} </td>
                    <td class="nowrap"> R$ ${item?.valor} </td>
                    <td class="nowrap"> R$ ${(item?.valor * (1 + window.orcamento.bdi / 100)).toFixed(2)} </td>
                    <td class="nowrap"> R$ ${totalItemFormatado} </td>
                      
                  </tr>
                `;

                  // Deletar item
                  trItem.querySelector('.delete-item').addEventListener('click', () => {
                    if (!confirm('Tem certeza que deseja excluir este item?')) return false;
                    const data = {
                      id_item: item.id
                    }
                    httpClient.makeRequest('/api/item/excluir', data)
                      .then(response => {
                        if (response.ok) {
                          new infoBox('Item excluído com sucesso!', 'success');
                          trItem.remove();
                          // recalcularTotal();
                          listarEtapas();
                        }
                      })
                  })

                  trEtapa.insertAdjacentElement('afterend', trItem);

                })
              }
            })


          //== Excluir e Editar etapa 
          trEtapa.querySelector('.excluir-etapa').addEventListener('click', () => {

            new Modal('body', 'Excluir etapa', 'Tem certeza que deseja excluir esta etapa?', [
              {
                text: 'Sim, excluir.',
                class: ['btn-primary'],
                action: () => {
                  confirmarExclusao(etapa)
                }
              }
            ]);

            const confirmarExclusao = (etapa) => {
              new Modal('body', '<b>CERTEZA?</b>', 'Deletar a etapa irá apagar os itens nela. CERTEZA?', [
                {
                  text: 'Sim, já sei que vai apagar os itens.',
                  class: ['btn-danger'],
                  action: () => {
                    excluirEtapa(etapa)
                  }
                }
              ]);
            }

            const excluirEtapa = (etapa) => {
              const data = {
                id_etapa: etapa.id
              }
              httpClient.makeRequest('/api/etapa/excluir', data)
                .then(response => {
                  if (response.ok) {
                    new infoBox('Etapa excluída com sucesso!', 'success')
                    listarEtapas()
                    // Fechar todos os modais
                    new Modal().fecharTodosModais();
                  }
                })
            }

          })

          trEtapa.querySelector('.editar-etapa').addEventListener('click', () => {
            const modalEditarEtapa = new Modal("body", "Editar etapa", /*html*/`
                <div>
                  <form class="form">
                      <div class="input-field">
                          <input type="text" name="descricao" required>
                          <label>Descrição*</label>
                      </div>
                      <button type="button" id="editarEtapa" class="btn btn-primary">Editar</button>
                  </form>
              </div>
              `).element;

            modalEditarEtapa.querySelector("[name='descricao']").value = etapa.descricao;

            document.querySelector('#editarEtapa').addEventListener('click', () => {
              let data = {
                id_etapa: etapa.id,
                descricao: modalEditarEtapa.querySelector("[name='descricao']").value
              };
              httpClient.makeRequest('/api/etapa/editar', data)
                .then(response => {
                  if (response.ok) {
                    // close modal
                    document.querySelector('.box').parentElement.remove();
                    // atualizarInformacoes();
                    listarEtapas()
                  }
                })
            })
          })
          //_______________________________________________________________


          // Abrir itens
          trEtapa.addEventListener('click', () => {
            const sectionNumber = trEtapa.getAttribute('section');
            const items = document.querySelectorAll(`tr[from-section="${sectionNumber}"]`);
            items.forEach(item => {
              item.classList.toggle('hidden');
            })
          })

          document.querySelector('#tableOrcamento tbody').append(trEtapa);
        })

      }
    })
}
listarEtapas()




// Exportar para pdf (com comando de imprimir)
document.querySelector('#exportarPdf').addEventListener('click', async () => {
  // printar apenas a tabela
  let janelaImpressao = window.open('', '_self');  

  let html = "";


  let style = document.querySelector('main style').outerHTML;
  let cabecalho = document.querySelector('#cabecalhoOrcamento').outerHTML;
  let orcamento = document.querySelector('#orcamento').outerHTML;
  let relatorio = document.querySelector('#relatorio').outerHTML;

  let noprintstyle = /*css*/`
    .noprint {
      display: none;
    }
    .naoquebrar {
      page-break-inside: avoid;
    }
  `

  html = /*html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PontoCivil</title>
      <link rel="stylesheet" href="/App/App.css">
      <link rel="stylesheet" href="/index/index.css">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

      <style type="text/css" id="operaUserStyle"></style><style type="text/css"></style>
      ${style}
      <style>
        ${noprintstyle}
      </style>
    </head>

    <body>

      ${cabecalho}
      ${orcamento}
      ${relatorio}
      
    </body>
    </html>
  `;

  janelaImpressao.document.write(html);
  // esperar até o html ser totalmente carregado para depois imprimir
  await new Promise(resolve => setTimeout(resolve, 1000));
  janelaImpressao.print();

  window.location.reload();

})