import Info from "../App/components/InfoBox.js"
import navigateTo from "../App/App.js"

class HttpClient {

    constructor() {
        this.Info = Info
        this.navigateTo = navigateTo
    }

    makeRequest(url, data = {}) {
        let method = data == {} ? 'GET' : 'POST'

        const options = {
            method: method,
            body: data ? data : null
        }

        url = '/api' + url

        // tentar retornar a response em json, se não der certo, retorna em texto
        return fetch(url, options)
            .then(response => response.json())
            .then(response => {
                console.log('response: ')
                console.log(response)

                if(response.message) {
                    if(response.ok) {
                        new this.Info(response.message, 'success', 3000)
                    } else {
                        new this.Info(response.message, 'danger', 3000)
                    }
                }

                if(response.redirect) {
                    this.navigateTo(response.redirect)
                }

                return response
            })
            .catch(error => {
                console.log('error: ')
                console.log(error)
                
                // se não der certo o json, tenta retornar o texto
                return fetch(url, options)
                    .then(response => response.text())
                    .then(response => {
                        console.log('response: ')
                        console.log(response)
                        return response
                    })
                    .catch(error => {
                        console.log('error: ')
                        console.log(error)
                    })
            })
    }

    // Verificar os input-fields com * e retornar false se algum estiver vazio
    verifyObrigatoryFields(msgbox = false) {
        let result = true
        document.querySelectorAll('.input-field label')
            .forEach(label => {
                if (label.innerHTML.includes('*')) {
                    let ehVazio = label.parentElement.querySelector('input')?.value == ''
                    if (ehVazio) {
                        label.parentNode.classList.add('error')
                        result = false
                    }
                }
            })

        if (!result) {
            // msgbox ? this.messageBox('Preencha todos os campos obrigatórios!', 'error', 3000) : null
            msgbox ? new this.Info("Preencha todos os campos obrigatórios!", "danger", 3000) : null
            return false
        }
        return result
    }

}
// window.HttpClient = HttpClient

export default HttpClient