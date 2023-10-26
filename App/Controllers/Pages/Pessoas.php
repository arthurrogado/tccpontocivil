<?php

namespace App\Controllers\Pages;
use MF\Controller\Action;

class Pessoas extends Action {

    public function listar() {
        $this->render("listar");
    }

    public function criar() {
        $this->render("criar");
    }

}

?>