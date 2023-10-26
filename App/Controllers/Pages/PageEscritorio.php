<?php

namespace App\Controllers\Pages;
use App\Middlewares\PermissionMiddleware;
use MF\Controller\Action;

class PageEscritorio extends action {

    public function listar() {
        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);
        $this->render("listar");
    }

    public function criar() {
        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);
        $this->render("criar");
    }

    public function visualizar() {
        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);
        $this->render("visualizar");
    }

}

?>