// listar.js
// /pessoas/listar
import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

const deletePessoa = async (tdItem, nome = '') => {
    let formdata = new FormData()
    console.log(tdItem)
    console.log(tdItem.getAttribute('data-id'))
    formdata.append('id', tdItem.getAttribute('data-id'))
    let response = await fetch(`/api/pessoas/delete`, {
        method: 'POST',
        body: formdata
    })
    response = await response.json()
    if(response.ok) {
        new httpClient.Info(`Pessoa ${nome} deletada com sucesso!`, 'success')
        tdItem.remove()
        // window.location.reload()
    }
}

const listarPessoas = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // let response = await fetch('/api/api/pessoas/get_pessoas')
    // response = await response.json()
    // const pessoas = response.data
    // console.log('Pessoas ')
    // console.log(pessoas)

    let response = await httpClient.makeRequest('/api/pessoas/get_pessoas')
    let pessoas = response.usuarios

    document.querySelector('#loading').style.display = 'none'

    let tbody = document.querySelector('#tablePessoas tbody') 
    pessoas.forEach(pessoa => {
        let row = document.createElement('tr')
        row.setAttribute('data-id', pessoa.id)
        
        let tdId = document.createElement('td')
        tdId.innerHTML = pessoa.id
        row.appendChild(tdId)

        let tdNome = document.createElement('td')
        tdNome.innerHTML = pessoa.nome
        row.appendChild(tdNome)

        let tdButton = document.createElement('td')
        let button = document.createElement('button')
        button.innerHTML = 'Deletar'
        button.addEventListener('click', (e) => {
            deletePessoa(row, pessoa.nome)
        })
        tdButton.appendChild(button)
        row.appendChild(tdButton)
        tbody.appendChild(row)
    })
}

listarPessoas()