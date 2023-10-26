<?php

namespace App\Models;
use MF\Model\Model;

use App\Middlewares\PermissionMiddleware;

class Escritorio extends Model {

    private $id;
    private $nome;
    private $cnpj;
    private $telefone;
    private $endereco;
    private $observacoes;
    private $deletado;


    public function listar() {
        return $this->select(
            "escritorios",
            ["*"],
            "deletado = 0"
        );
    }

    public function createEscritorio($nome, $cnpj, $telefone, $endereco, $observacoes) {
        return $this->insert(
            "escritorios",
            ["nome", "cnpj", "telefone", "endereco", "observacoes"],
            [$nome, $cnpj, $telefone, $endereco, $observacoes]
        );
    }

    public function visualizar($id) {
        return $this->selectOne(
            "escritorios",
            ["*"],
            "id = $id"
        );
    }

    public function excluir($id) {
        return $this->update(
            "escritorios",
            ["deletado"],
            [1],
            "id = $id"
        );
    }


}

?>