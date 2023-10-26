<?php

namespace App\Controllers;

// use MF\Controller\Action;
use MF\Model\Container; // dependency container: allows to instantiate models:
// this is a way to instantiate models without using the new keyword

// Models
// use App\Models\Pessoa;

class PessoasController {

    public function createPessoa() {
        $nome = $_POST['nome'];
        $usuario = filter_input(INPUT_POST, 'usuario');
        $senha = filter_input(INPUT_POST, 'senha');
        $senha = password_hash($senha, PASSWORD_DEFAULT);

        $pessoa = Container::getModel("Pessoa");
        // just return the createPessoa method because it already handles errors and echoes the correct response (json)
        return $pessoa->createPessoa($nome, $usuario, $senha);
    }

    public function getPessoas() {
        $pessoa = Container::getModel("Pessoa");
        $pessoas = $pessoa->getPessoas();
        // echo json_encode(array('pessoas' => $pessoas));
    }

    public function deletePessoa() {
        $id = filter_input(INPUT_POST, 'id');
        $pessoa = Container::getModel("Pessoa");
        if($pessoa->deletePessoa($id)) {
            echo json_encode(array('ok' => true));
        } else {
            echo json_encode(array('ok' => false));
        }
    }

    // para diferenciar os métodos de renderização de páginas e os métodos que executam ações,
    // os métodos que executam ações devem ser iniciados com um underline
    // ou 

}

?>