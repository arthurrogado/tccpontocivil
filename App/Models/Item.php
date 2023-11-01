<?php

namespace App\Models;
use MF\Model\Model;

class Item extends Model {

    public function listar($id_orcamento)
    {
        return $this->select(
            "itens",
            ["*"],
            "id_orcamento = $id_orcamento"
        );
    }

    public function criar($codigo, $quantidade, $tipo, $id_etapa, $id_proximo_item = null)
    {
        return $this->insert(
            "itens",
            [
                "codigo", "quantidade", "tipo", "id_etapa", "id_proximo_item"
            ],
            [
                $codigo, $quantidade, $tipo, $id_etapa, $id_proximo_item
            ]
        );
    }

}

?>