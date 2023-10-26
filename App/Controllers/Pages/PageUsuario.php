<?php

namespace App\Controllers\Pages;
use App\Middlewares\PermissionMiddleware;
use MF\Controller\Action;

class PageUsuario extends Action{

    public function listar() {
        $this->render("listar");
    }

}

?>