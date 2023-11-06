<?php

namespace App\Controllers\Pages;
use App\Middlewares\PermissionMiddleware;
use MF\Controller\Action;

class PageUsuario extends Action{

    public function listar() {
        if(!PermissionMiddleware::checkConditions(['id'=>'1'])) return;

        $this->render("listar");
    }

    public function criar() {
        if(!PermissionMiddleware::checkConditions(['id'=>'1'])) return;
        $this->render("criar");
    }

    public function visualizar() {
        if(!PermissionMiddleware::checkConditions(['id'=>'1'])) return;
        $this->render("visualizar");
    }

    public function editar() {
        if(!PermissionMiddleware::checkConditions(['id'=>'1'])) return;
        $this->render("editar");
    }

    public function mudarSenha() {
        $this->render("mudar_senha");
    }

}

?>