<?php

namespace App\Controllers;
use MF\Model\Container;
use App\Middlewares\PermissionMiddleware;

class UsuarioController {
        
        public function login() {
            $usuario = filter_input(INPUT_POST, "usuario", FILTER_DEFAULT);
            $senha = filter_input(INPUT_POST, "senha", FILTER_DEFAULT);        
            $user = Container::getModel("Usuario");
            $status = $user->login($usuario, $senha);
            if($status) {
                echo json_encode(array('ok' => true, "message" => "Login feito com sucesso"));
            } else {
                echo json_encode(array('ok' => false, "message" => "Usuário ou senha incorretos" ));
            }
        }
    
        public function logout() {
            $user = Container::getModel("Usuario");
            if($user->logout()) {
                echo json_encode(array('ok' => true, "message" => "Logout feito com sucesso", "redirect" => "/"));
            } else {
                echo json_encode(array('ok' => false, "message" => "Erro ao fazer logout (???)"));
            }
        }

        public function getUsuarios() {

            if(!PermissionMiddleware::checkConditions(["id" => "1"])) return;

            $user = Container::getModel("Usuario");
            $status = $user->getUsuarios();
            if($status['ok']) {
                echo json_encode(array('ok' => true, "usuarios" => $status['data']));
            } else {
                echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
            }
        }
}

?>