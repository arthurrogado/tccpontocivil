<?php

namespace App\Controllers;
// use MF\Controller\Action;

class LoginController {

    public function __construct(){
        // verificar se é GET ou POST
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
            case 'GET':
                # code...
                break;

            case 'POST':
                # code...
                break;
            
            default:
                # code...
                break;
        }
    }


}

?>