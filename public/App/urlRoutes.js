const urlRoutes = {
    404: {
        title: 'Página não encontrada',
        description: 'A página que você está tentando acessar não existe.',
        template: '/templates/404.html'
    },
    '/': {
        title: 'Home',
        description: 'Página inicial do site.',
        template: '/templates/home.html'
    },
    "/publico": {
        title: 'Público',
        template: '/templates/publico.html',
    },
    "/contato": {
        title: 'Contato',
        route: '/contato',
        description: 'Página de contato.',
    },
    "/sobre_nos": {
        title: 'Sobre nós',
        route: '/sobre_nos',
        description: 'Página sobre nós.',
    },
    "/produtos": {
        title: 'Produtos',
        route: '/produtos',
        description: 'Página de produtos.',
    },

    "/pessoas": {
        redirect: '/pessoas/listar',
    }, "/pessoas/": {redirect: '/pessoas/listar'},
    "/pessoas/listar": {
        title: 'Listar pessoas',
        route: '/pessoas/listar',
        description: 'Página de listagem de pessoas.',
    },
    "/pessoas/criar": {
        title: 'Criar pessoa',
        route: '/pessoas/criar',
        description: 'Página de criação de pessoas.',
    },
    "/login": {
        title: 'Login',
        route: '/login',
        description: 'Página de login.',
    }
}

export default urlRoutes;