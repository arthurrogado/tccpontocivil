import urlRoutes from "../App/urlRoutes.js"

let main = 'main'

function makeObjectParams(params) {
    // this function receives a string params and returns an object
    let objectParams = {}
    params.split('&').forEach(param => {
        let [key, value] = param.split('=')
        objectParams[key] = value
    })
    return objectParams
}

function makeUrlParams(params) {
    // this function receives an object and returns a string with the url params

    // if params is already a string, return it
    if(typeof params == 'string') { return params }

    let urlParams = params ? '?' : '' // if params is not null, add '?' to the url
    for (let param in params) {
        urlParams += `${param}=${params[param]}&`
    }
    return urlParams.slice(0, -1) // remove the last '&' from the string
}



function updatePath(path, params = null) {
    // this function receives a path and params and updates the url
        // params in URL format
    
    params = params ? params : ''
    window.history.pushState({}, '', path + params)
}

const navigateTo = (path, params = null) => {
    // If it is a window popstate event, get the path from the event
    if (path instanceof PopStateEvent) {
        path = window.location.pathname
    } else if (path == window.location.pathname) {
        return
    }
    // Transform params object into a string for url
    params = params ? makeUrlParams(params) : ''
    // Update the url
    updatePath(path, params)

    // Then calls the urlLocationHandler
    urlLocationHandler()

}

const urlLocationHandler = async () => {
    let path = window.location.pathname

    if (path == '/') {
        path = '/home'
        updatePath(path)
    }

    loadPage(path)

    // const route = urlRoutes[path] || urlRoutes[404]
    // if(route.redirect) {
    //     window.history.pushState({}, '', route.redirect)
    //     navigateTo(route.redirect)
    // } else if(route.template) {
    //     await fetch(`${route.template}`)
    //     .then(response => response.text())
    //     .then(data => {
    //         document.querySelector(main).innerHTML = data
    //     })
    //     console.log('route: ', route)
    // } else (
    //     pass
    // )
}

async function loadPage(path) {
    const controller = new AbortController()
    const { signal } = controller

    // const apiUrl = `http://localhost:8080/api`
    // const url = `${apiUrl}${path}`
    const url = "/api" + path
    let response = await fetch(url, { signal })
    response = await response.json()
    if (response.redirect) {
        navigateTo(response.redirect)
        return
    }

    if (response.message) {
        if (response.ok) {
            new Info(response.message, 'success', 3000)
        } else {
            new Info(response.message, 'danger', 3000)
        }
    }

    document.querySelector(main).innerHTML = response?.html
    document.querySelector(main).innerHTML += `<style>${response?.css}</style>`
    let script = document.createElement('script')
    script.type = 'module'
    script.innerHTML = response?.js
    document.querySelector(main).appendChild(script)

    // get all the scripts from the response
    // make them into elements
    // and append them to the body
    const response_document = new DOMParser().parseFromString(response, 'text/html')
    const scripts = response_document.querySelectorAll('script')
    scripts.forEach(script => {
        const scriptElement = document.createElement('script')
        scriptElement.type = 'module'
        // get the script content
        scriptElement.innerHTML = script.innerHTML
        // append the script to the body
        document.querySelector('body').appendChild(scriptElement)
    })

}

window.onpopstate = urlLocationHandler

window.route = navigateTo

urlLocationHandler()



// ====================================================================================================



import Info from "../App/components/InfoBox.js"

class HttpClient {

    constructor() {
        this.Info = Info
        this.navigateTo = navigateTo
    }

    makeRequest(url, data = {}) {
        let method = data == {} ? 'GET' : 'POST'
        
        // if data is already a FormData, do nothing
        if(data instanceof FormData) {} else {
            let formdata = new FormData()
            for (let key in data) {
                formdata.append(key, data[key])
            }
            data = formdata
        }
    
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

                if(response.view == "404") {
                    new this.Info("Página ou ação não encontrada!", "danger", 3000)
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
    verifyObrigatoryFields(msgbox = true) {
        let result = true
        document.querySelectorAll('.input-field label')
            .forEach(label => {
                if (label.innerHTML.includes('*')) {
                    let ehVazio = label.parentElement.querySelector('input, select, textarea')?.value == ''
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

    getParams() {
        let params = {}
        location.href
            .split('?')[1] // get the part after the '?' in url
            .split('&') // split the params divided by '&'
            .map(param => {
                let [key, value] = param.split('=')
                params[key] = value
            })
        return params
    }

    fillAllInputs(data) {
        for(let key in data) {
            let input = document.getElementsByName(key)[0]
            if(input) {
                input.value = data[key]
            }
        }
    }

    disableAllInputs() {
        document.querySelectorAll('.input-field > input, .input-field > select, .input-field > textarea').forEach(input => {
            input.setAttribute('disabled', true)
        })
    }

}
window.HttpClient = HttpClient


export default HttpClient;