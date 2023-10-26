import HttpClient from "/App/App.js"
const httpClient = new HttpClient()

let form = document.querySelector('#formCriarPessoa')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let formdata = new FormData(form)
    
    fetch('/api/pessoas/create', {
        method: 'POST',
        body: formdata
    }).then(response => response.json())
    .then(response => {
        console.log(response)
        if(response.ok) {
            // window.location.href = '/pessoas/listar'
            new httpClient.Info("Pessoa criada com sucesso!", "success", 3000)
            form.reset()
        } else {
            new httpClient.Info("Erro ao criar pessoa!", "danger", 3000)
        }
    })

})