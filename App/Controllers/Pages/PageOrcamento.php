<?php

namespace App\Controllers\Pages;
use App\Middlewares\PermissionMiddleware;
use MF\Controller\Action;

class PageOrcamento extends Action {
    
    public function criar() {
        $this->render("criar");
    }

    public function listar() {
        $this->render("listar");
    }

    public function visualizar() {
        $this->render("visualizar");
    }

}

?>