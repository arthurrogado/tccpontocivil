<?php

namespace App\Models;
use MF\Model\Model;
use MF\Model\Container;

class Orcamento extends Model {

    private $id_escritorio;

    public function listar($id_escritorio) {
        return $this->select(
            "orcamentos",
            ["*"],
            "id_escritorio = $id_escritorio"
        );
    }

    public function criar ($nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado, $id_escritorio) {
        return $this->insert(
            "orcamentos",
            [
                "nome", "descricao", "estado", "data_sinapi", "bdi", "desonerado", "id_escritorio"
            ],
            [
                $nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado, $id_escritorio
            ]
        );
    }

    public function editar ($id, $nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado) {
        return $this->update(
            "orcamentos",
            [
                "nome", "descricao", "estado", "data_sinapi", "bdi", "desonerado"
            ],
            [
                $nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado
            ],
            "id = $id"
        );
    }

    public function excluir ($id) {
        return $this->delete(
            "orcamentos",
            "id = $id"
        );
    }

    public function visualizar($id)
    {
        return $this->selectOne(
            "orcamentos",
            ["*"],
            "id = $id"
        );
    }

    // ITENS

    public function listarItens($id_orcamento)
    {
        return $this->select(
            "itens",
            ["*"],
            "id_orcamento = $id_orcamento"
        );
    }

    // Pesquisa

    public function pesquisa($pesquisa, $tipo)
    {
        return $this->select(
            "composicoes_insumos",
            ["*"],
            "(descricao LIKE '%$pesquisa%' OR codigo LIKE '%$pesquisa%') AND tipo = '$tipo'"
        );
    }

    public function pesquisarComposicao($pesquisa)
    {
        return $this->pesquisa($pesquisa, "C");
    }

    public function pesquisarInsumo($pesquisa)
    {
        return $this->pesquisa($pesquisa, "I");
    }

}

?>