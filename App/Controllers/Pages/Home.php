<?php

namespace App\Controllers\Pages;

use MF\Controller\Action;

class Home extends Action {
    
    public function index() {
        $this->render("index");
    }

}

?>