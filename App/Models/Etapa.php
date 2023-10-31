<?php

namespace App\Models;
use MF\Model\Model;

class Etapa extends Model {

    public function listar($id_orcamento)
    {
        return $this->select(
            "etapas",
            ["*"],
            "id_orcamento = $id_orcamento"
        );
    }

    public function criar($id_orcamento, $descricao, $id_proxima_etapa = null)
    {
        return $this->insert(
            "etapas",
            [
                "id_orcamento", "descricao", "id_proxima_etapa"
            ],
            [
                $id_orcamento, $descricao, $id_proxima_etapa
            ]
        );
    }

    public function excluir($id)
    {
        return $this->delete(
            "etapas",
            "id = $id"
        );
    }

    

}

?>