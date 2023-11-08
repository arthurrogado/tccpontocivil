<?php

namespace MF\Init;

abstract class Bootstrap {

    private $routes;

    abstract protected function initRoutes();

    public function __construct() {
        $this->initRoutes();
        // var_dump( $this->getUrl() );
        $this->run($this->getUrl());
    }

    public function getRoutes() {
        return $this->routes;
    }

    public function setRoutes(array $routes) {
        $this->routes = $routes;
    }

    protected function run($url) {
        foreach($this->getRoutes() as $key => $route) {

            // Rodar os middlewares necessários, como exemplo:
            // AuthMiddleware (para verificar se está logado),
            // PermissionMiddleware (para verificar se tem permissão para acessar a página)
            // eu deveria criar um Middleware específico, tipo um para verificar se a obra e o usuário são do mesmo escritório?
            // ou eu poderia criar um middleware genérico, que recebe como parâmetro o nome do model e o nome do método?
            // resposta: acho que o melhor é criar um middleware genérico, que recebe como parâmetro o nome do model e o nome do método, dessa forma:
            // $routes['create_pessoa'] = array(
            //     'route' => '/pessoas/create',
            //     'controller' => 'PessoasController',
            //     'action' => 'createPessoa',
            //     'middlewares' => ['AuthMiddleware', 'PermissionMiddleware']
            // );
            // e o middleware genérico verifica se o usuário tem permissão para acessar o método do model

            // Exemplo de utilização do middleware de verificar a permissão:
            // class PermissionMiddleware implements Middleware {
            //     public function handle($user, $model, $method) {
            //         // verificar se o usuário tem permissão para acessar o método do model
            //         // verificar se o usuário tem permissão para acessar a página
            //         // verificar se o usuário tem permissão para acessar o controller
            //         // verificar se o usuário tem permissão para acessar a rota
            //          $user->hasPermission($model, $method);

            //     }
            



            // define a default route if "route->redirect" exists
            if(isset($route['redirect']) && $url == $route['route']) {
                $url = $route['redirect'];
            }




            if(isset($route['route']) && $url == $route['route']) {

                // Verify if the route is public, if not, verify if the user is logged in
                if(!isset($route['public']) || (isset($route['public']) && $route['public'] == false)) {
                    // session_start();
                    if(!isset($_SESSION['usuario']) || $_SESSION['usuario'] == '') {
                        echo json_encode(["message" => "Você não está logado!", "ok" => false, 'redirect' => "/login"]);
                        exit;
                    }
                }



                // renomear, por exemplo, o controller "Pages/Pessoas" para "Pages\Pessoas"
                $route['controller'] = str_replace("/", "\\", $route['controller']);

                $class = "App\\Controllers\\".ucfirst($route['controller']);
                $controller = new $class;
                $action = $route['action'];
                $controller->$action();
                exit;
            } 
            
        }
        
        // echo "404";
        $class = "App\\Controllers\\Pages\\Index";
        $controller = new $class;
        $action = "_404";
        $controller->$action();

    }

    protected function getUrl() {
        // return parse_url($_SERVER['PATH_INFO'], PHP_URL_PATH);
        
        $request_url = $_SERVER['REQUEST_URI'];
        // Remover o primeiro "/api" da url
        $request_url = substr($request_url, 4);
        return parse_url( $request_url , PHP_URL_PATH);
    }

}

?>