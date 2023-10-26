<?php

namespace App\Controllers\Pages;
use MF\Controller\Action;
// Instanciar model sem new
use MF\Model\Container;

class Produtos extends Action {

    public function listar() {
        $classe_produto = Container::getModel('Produto');
        $produtos = $classe_produto->getProdutos();

        // Passar dados para view (renderização server-side)
        $this->view->data = $produtos;
        $this->render("produtos");
    }

}

?>