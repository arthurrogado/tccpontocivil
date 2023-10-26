<?php

namespace App\Controllers;

// Recursos do miniframework
use MF\Controller\Action;
use MF\Model\Container; // dependency container: allows to instantiate models

// Modelos
use App\Models\info;
use App\Models\Produto;

class IndexController extends Action {
    // public function index() {
    //     $this->render("index");
    // }

    public function sobreNos() {

        //// if server has api.php in the url, return error
        // if(isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'api.php') !== false) {
        //     echo json_encode(array('error' => 'API não encontrada'));
        //     exit;
        // }
        
        $info = Container::getModel('Info');

        $informacoes = $info->getInfo();

        $this->view->data = $informacoes;

        $this->render("sobreNos");
    }

    public function contato() {

        // $produto = Container::getModel('Produto');
        // $produtos = $produto->getProdutos();

        $this->render("contato");
    }

    public function produtos() {
        $produto = Container::getModel('Produto');
        $produtos = $produto->getProdutos();
        $this->view->data = $produtos;
        $this->render("produtos");
    }

    public function _404() {
        $this->render("404");
    }


}

?>