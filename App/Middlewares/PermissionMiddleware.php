<?php

// PermissionMiddleware.php

// require_once './App/Model/Usuario.php';
namespace App\Middlewares;

use App\Models\Usuario;
use MF\Model\Container;

class PermissionMiddleware {

    public static function checkConditions($conditions = []) {
        
        $usuario = Usuario::checkLogin();
        if(!$usuario) {
            return false;
        }
        if( $usuario->id == 1 ) {
            // Se for o admin, pode fazer tudo
            return true;
        }
        
        foreach ($conditions as $key => $value) {
            if($usuario->$key != $value) {
                echo json_encode(["message" => "Você não tem permissão!", "ok" => false]);
                exit;
            }
        }

        return true;

    }

}

# exemplo de uso para verificar se o id_escritorio do usuario logado é igual ao id_escritorio da obra
// $conditions = [
//     "id_escritorio" => $obra->id_escritorio
// ];
// PermissionMiddleware::checkConditions($conditions);

# mas para parar a execução do código, é necessário fazer assim:
// if( !PermissionMiddleware::checkConditions($conditions) ) {
    // // já retorna a mensagem de erro automaticamente, então precisa apenas parar a execução do código
    // return;
// }



?>