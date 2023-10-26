<?php

// VerificarEscritorioMiddleware.php

namespace App\Middlewares;

class VerificarEscritorioMiddleware
{

    // esse middleware verifica se o usuário está logado e se o mesmo possui um escritório da obra

    public function __construct()
    {
    }

    public function handle($id_obra, $id_escritorio) {

        // verificar se o usuário está logado
        if (isset($_SESSION["usuario"])) {
            // verificar se o usuário possui um escritório da obra
            if ($_SESSION["usuario"]->hasEscritorio($id_obra, $id_escritorio)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

}

?>