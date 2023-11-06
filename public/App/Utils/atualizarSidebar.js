import HttpClient from "../HttpClient.js";
const httpClient = new HttpClient();

// Atualizar sidebar

function returnNavItem( href, nome, icon = 'fa-solid fa-folder') {
    let div = document.createElement('div')
    div.classList.add('nav-item')
    div.setAttribute('href', href)
    div.innerHTML = `
        <i class="fa ${icon}"></i>
        <span>${nome}</span>
    `
    return div
}

function popularMenuItems(items){
    let navigation = document.querySelector('#content nav');
    if(!navigation) return;

    navigation.innerHTML = '';
    items.forEach(item => {
        let nav_item = returnNavItem(item[0], item[1], item[2]);
        navigation.appendChild(nav_item);
    });
}

function atualizarSidebar(){
    // verificar se logado
    httpClient.makeRequest('/api/usuario/check_login')
    .then(response => {

        console.log('~~ RESPOSTA ATUALIZAR SIDEBAR | check_login')
        console.log(response)

        if(response.ok){ // LOGADO
            let usuario = response.usuario

            if(usuario.id == 1){ // ADMIN
                popularMenuItems([
                    ['/home', 'Home', 'fa-home'],
                    // ['obras', 'Minhas Obras', 'fa-building'],
                    // ['colaboradores', 'Colaboradores', 'fa-users'],

                    ['/escritorio/listar', 'Escritórios', 'fa-briefcase'],
                    ['/usuarios', 'Usuários', 'fa-users'],
                    ['/orcamentos', 'Orçamentos', 'fa-folder'],
                ])

            // Usuário comum
            } else if(usuario.id !== 1) {
                popularMenuItems([
                    ['home', 'Home', 'fa-solid fa-home'],
                    ['orcamentos', 'Orçamentos', 'fa-folder'],
                ])
            } else {
                popularMenuItems([])
            }
        }

        else { // NÃO LOGADO
            
        }

    })
}

export default atualizarSidebar;