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
            'route' => '/',
            'controller' => 'Pages/Home',
            'action' => 'index'
        );




        $routes['sobre_nos'] = array(
            'route' => '/sobre_nos',
            'controller' => 'IndexController',
            'action' => 'sobreNos'
        );

        $routes['contato'] = array(
            'route' => '/contato',
            'controller' => 'IndexController',
            'action' => 'contato'
        );

        $routes['produtos'] = array(
            'route' => '/produtos',
            'controller' => 'Pages/Produtos',
            'action' => 'listar'
        );

        // PESSOAS //
        $routes['pessoas'] = array(
            'route' => '/pessoas',
            'redirect' => '/pessoas/listar'
        );
        $routes['listar_pessoas'] = array(
            'route' => '/pessoas/listar',
            'controller' => 'Pages/Pessoas',
            'action' => 'listar',
        );
        $routes["page_criar_pessoa"] = array(
            "route" => "/pessoas/criar",
            "controller" => "Pages/Pessoas",
            "action" => "criar"
        );
        $routes['create_pessoa'] = array(
            'route' => '/pessoas/create',
            'controller' => 'PessoasController',
            'action' => 'createPessoa',
            'middlewares' => ['AuthMiddleware']
        );
        $routes['get_pessoas'] = array(
            'route' => '/api/pessoas/get_pessoas',
            'controller' => 'UsuarioController',
            'action' => 'getUsuarios'
        );
        $routes['delete_pessoa'] = array(
            'route' => '/pessoas/delete',
            'controller' => 'PessoasController',
            'action' => 'deletePessoa'
        );
        // //



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

        // USUÁRIO

            // paginas
        array_push($routes, [
            'route' => '/usuario',
            'redirect' => '/usuario/listar'
        ]);
        array_push($routes, [
            'route' => '/usuario/listar',
            'controller' => 'Pages/PageUsuario',
            'action' => 'listar',
        ]);
        array_push($routes, [
            'route' => '/usuarios/criar',
            'controller' => 'Pages/PageUsuario',
            'action' => 'criar',
        ]);

            // api

        array_push($routes, [
            'route' => '/api/usuario/listar',
            'controller' => 'UsuarioController',
            'action' => 'getUsuarios',
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
            'route' => '/api/orcamento/itens',
            'controller' => 'OrcamentoController',
            'action' => 'getItens',
        ]);

            // orçamento etapas
        
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

            // Pesquisa composição

        array_push($routes, [
            'route' => '/api/orcamento/composicao/pesquisar',
            'controller' => 'OrcamentoController',
            'action' => 'pesquisarComposicao',
        ]);


            // Adicionar composição

        array_push($routes, [
            'route' => '/api/orcamento/composicao/adicionar',
            'controller' => 'ItemController',
            'action' => 'adicionar',
        ]);

            // Adicionar item


        $this->setRoutes($routes);
    }



}

?>