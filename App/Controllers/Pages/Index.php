<?php

namespace App\Controllers\Pages;
use MF\Controller\Action;

class Index extends Action {

    public function _404() {
        $this->render("404");
    }

    public function produtos() {
        $this->render("produtos");
    }

}

?>