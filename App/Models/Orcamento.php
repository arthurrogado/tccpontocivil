<?php

namespace App\Models;
use MF\Model\Model;

class Orcamento extends Model {

    public static function listar($id_escritorio) {
        return self::select(
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

    public function visualizar($id)
    {
        return $this->selectOne(
            "orcamentos",
            ["*"],
            "id = $id"
        );
    }

}

?>