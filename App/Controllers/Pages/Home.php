<?php

namespace App\Controllers\Pages;

use MF\Controller\Action;

class Home extends Action {
    
    public function index() {
        $this->render("index");
    }

    public function produtos() {
        $this->render("produtos");
    }

}

?>