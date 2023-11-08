<?php

namespace App;
use MF\Init\Bootstrap;

class Route extends Bootstrap {

    public function initRoutes() {

        session_start();

        $routes = array();

        $routes['404'] = array(
            'route' => '/404',
            'controller' => 'IndexController',
            'action' => '_404'
        );

        $routes['home'] = array(
            'route' => '/home',
            'controller' => 'Pages/Index',
            'action' => 'home'
        );


        // LOGIN

        array_push($routes, [
            'route' => '/login',
            'controller' => 'Pages/Login',
            'action' => 'index',
            'public' => true
        ]);

        array_push($routes, [
            'route' => '/api/login',
            'controller' => 'AuthController',
            'action' => 'login',
            'public' => true
        ]);


        // LOGOUT

        array_push($routes, [
            'route' => '/logout',
            'controller' => 'AuthController',
            'action' => 'logout',
        ]);

        // ESCRITÓRIO

            // paginas

        array_push($routes, [
            'route' => '/escritorio/listar',
            'controller' => 'Pages/PageEscritorio',
            'action' => 'listar',
        ]);

        array_push($routes, [
            'route' => '/escritorio/criar',
            'controller' => 'Pages/PageEscritorio',
            'action' => 'criar',
        ]);

        array_push($routes, [
            'route' => "/escritorio/visualizar",
            'controller' => 'Pages/PageEscritorio',
            'action' => 'visualizar'
        ]);
                
            // api

        array_push($routes, [
            'route' => '/api/escritorio/listar',
            'controller' => 'EscritorioController',
            'action' => 'listar',
        ]);
        array_push($routes, [
            'route' => '/api/escritorio/criar',
            'controller' => 'EscritorioController',
            'action' => 'createEscritorio',
        ]);
        array_push($routes, [
            'route' => "/api/escritorio/visualizar",
            "controller" => "EscritorioController",
            "action" => "visualizar"
        ]);
        array_push($routes, [
            'route' => '/api/escritorio/excluir',
            'controller' => 'EscritorioController',
            'action' => 'excluir',
        ]);
        array_push($routes, [
            'route' => '/api/escritorio/editar',
            'controller' => 'EscritorioController',
            'action' => 'editar',
        ]);

        // USUARIO

            // paginas
        array_push($routes, [
            'route' => '/usuarios',
            'redirect' => '/usuario/listar'
        ]);
        array_push($routes, [
            'route' => '/usuario/listar',
            'controller' => 'Pages/PageUsuario',
            'action' => 'listar',
        ]);
        array_push($routes, [
            'route' => '/usuario/criar',
            'controller' => 'Pages/PageUsuario',
            'action' => 'criar',
        ]);
        array_push($routes, [
            'route' => '/usuario/visualizar',
            'controller' => 'Pages/PageUsuario',
            'action' => 'visualizar',
        ]);
        array_push($routes, [
            'route' => '/usuario/mudar_senha',
            'controller' => 'Pages/PageUsuario',
            'action' => 'mudarSenha',
        ]);

            // api

        array_push($routes, [
            'route' => '/api/usuario/check_login',
            'controller' => 'UsuarioController',
            'action' => 'checkLogin',
            'public' => true
        ]);
        array_push($routes, [
            'route' => '/api/usuario/listar',
            'controller' => 'UsuarioController',
            'action' => 'getUsuarios',
        ]);
        array_push($routes, [
            'route' => '/api/usuario/criar',
            'controller' => 'UsuarioController',
            'action' => 'criar',
        ]);
        array_push($routes, [
            'route' => '/api/usuario/editar',
            'controller' => 'UsuarioController',
            'action' => 'editar',
        ]);
        array_push($routes, [
            'route' => '/api/usuario/excluir',
            'controller' => 'UsuarioController',
            'action' => 'excluir',
        ]);
        array_push($routes, [
            'route' => '/api/usuario/visualizar',
            'controller' => 'UsuarioController',
            'action' => 'visualizar',
        ]);
        array_push($routes, [
            'route' => '/api/usuario/mudar_senha',
            'controller' => 'UsuarioController',
            'action' => 'mudarSenha',
        ]);


        // ORÇAMENTO

            // paginas

        array_push($routes, [
            'route' => '/orcamentos',
            'redirect' => '/orcamento/listar'
        ]);
        array_push($routes, [
            'route' => '/orcamento/listar',
            'controller' => 'Pages/PageOrcamento',
            'action' => 'listar',
        ]);

        array_push($routes, [
            'route' => '/orcamento/criar',
            'controller' => 'Pages/PageOrcamento',
            'action' => 'criar',
        ]);

        array_push($routes, [
            'route' => '/orcamento/visualizar',
            'controller' => 'Pages/PageOrcamento',
            'action' => 'visualizar',
        ]);

            // api

        array_push($routes, [
            'route' => '/api/orcamento/listar',
            'controller' => 'OrcamentoController',
            'action' => 'listar',
        ]);
        array_push($routes, [
            'route' => '/api/orcamento/criar',
            'controller' => 'OrcamentoController',
            'action' => 'criar',
        ]);
        array_push($routes, [
            'route' => '/api/orcamento/visualizar',
            'controller' => 'OrcamentoController',
            'action' => 'visualizar',
        ]);

        array_push($routes, [
            'route' => '/api/orcamento/excluir',
            'controller' => 'OrcamentoController',
            'action' => 'excluir',
        ]);

        array_push($routes, [
            'route' => '/api/orcamento/editar',
            'controller' => 'OrcamentoController',
            'action' => 'editar',
        ]);

        array_push($routes, [
            'route' => '/api/orcamento/itens',
            'controller' => 'OrcamentoController',
            'action' => 'getItens',
        ]);

            // orçamento ETAPAS
        
        array_push($routes, [
            'route' => '/api/orcamento/etapa/criar',
            'controller' => 'EtapaController',
            'action' => 'criarEtapa',
        ]);

        array_push($routes, [
            'route' => '/api/orcamento/etapa/listar',
            'controller' => 'EtapaController',
            'action' => 'listarEtapas',
        ]);

        array_push($routes, [
            'route' => '/api/etapa/excluir',
            'controller' => 'EtapaController',
            'action' => 'excluir',
        ]);

            // Pesquisa itens

        array_push($routes, [
            'route' => '/api/orcamento/composicao/pesquisar',
            'controller' => 'OrcamentoController',
            'action' => 'pesquisarComposicao',
        ]);
        array_push($routes, [
            'route' => '/api/orcamento/insumo/pesquisar',
            'controller' => 'OrcamentoController',
            'action' => 'pesquisarInsumo',
        ]);



            // ITEM

        array_push($routes, [
            'route' => '/api/item/adicionar',
            'controller' => 'ItemController',
            'action' => 'adicionar',
        ]);

        array_push($routes, [
            'route' => '/api/itens/por_etapa',
            'controller' => 'ItemController',
            'action' => 'listar',
        ]);

        array_push($routes, [
            'route' => '/api/item/excluir',
            'controller' => 'ItemController',
            'action' => 'excluir',
        ]);

        array_push($routes, [
            'route' => '/api/item/meses_sinapi',
            'controller' => 'ItemController',
            'action' => 'getMesesSinapi',
        ]);

        array_push($routes, [
            'route' => '/api/item/estados_sinapi',
            'controller' => 'ItemController',
            'action' => 'getEstadosSinapi',
        ]);

        $this->setRoutes($routes);
    }



}

?>