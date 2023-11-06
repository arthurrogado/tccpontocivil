<?php

namespace App\Models;

use MF\Model\Model;

class Item extends Model
{

    public function listar($id_etapa)
    {
        // return $this->select(
        //     "itens",
        //     ["*"],
        //     "id_etapa = $id_etapa"
        // );

        try {
            $pdo = $this->__get("db");
            // $query = "
            //     SELECT i.* , ci.descricao, ci.unidade, ci.tipo 
            //     FROM itens i
            //     JOIN composicoes_insumos ci
            //         ON i.codigo = ci.codigo
            //     WHERE 
            //         i.id_etapa = $id_etapa;
            // ";

            $query = "
                SELECT 
                    i.* , 
                    ci.descricao, ci.unidade, ci.tipo, dci.valor
                    FROM itens i
                
                JOIN etapas e
                    ON e.id = $id_etapa
                
                JOIN orcamentos o
                    ON o.id = e.id_orcamento
                
                JOIN composicoes_insumos ci
                    ON i.codigo = ci.codigo
                    
                JOIN detalhes_composicoes_insumos dci
                    ON i.codigo = dci.codigo 
                        AND dci.estado_referencia = o.estado
                        AND dci.mes_referencia = o.data_sinapi
                        AND dci.desonerado = o.desonerado
            
                WHERE i.id_etapa = $id_etapa;
            ";

            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $itens = $stmt->fetchAll(\PDO::FETCH_OBJ);
            return [
                "ok" => true,
                "data" => $itens
            ];
        } catch (\Throwable $th) {
            return [
                "ok" => false,
                "message" => "Erro: " . $th->getMessage()
            ];
        }

    }

    public function criar($codigo, $quantidade, $tipo, $id_etapa, $id_proximo_item = null)
    {
        return $this->insert(
            "itens",
            [
                "codigo",
                "quantidade",
                "tipo",
                "id_etapa",
                "id_proximo_item"
            ],
            [
                $codigo,
                $quantidade,
                $tipo,
                $id_etapa,
                $id_proximo_item
            ]
        );
    }

    public function excluir($id_item)
    {
        return $this->delete(
            "itens",
            "id = $id_item"
        );
    }

    public function getMesesSinapi()
    {
        try {
            $pdo = $this->__get("db");

            $query = "SELECT DISTINCT mes_referencia FROM detalhes_composicoes_insumos;";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $meses = $stmt->fetchAll(\PDO::FETCH_OBJ);
            return [
                "ok" => true,
                "data" => $meses
            ];

        } catch (\Throwable $th) {
            return [
                "ok" => false,
                "message" => "Erro: " . $th->getMessage()
            ];
        }
    }

    public function getEstadosSinapi()
    {
        try {
            $pdo = $this->__get("db");

            $query = "SELECT DISTINCT estado_referencia FROM detalhes_composicoes_insumos;";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $estados = $stmt->fetchAll(\PDO::FETCH_OBJ);
            return [
                "ok" => true,
                "data" => $estados
            ];

        } catch (\Throwable $th) {
            return [
                "ok" => false,
                "message" => "Erro: " . $th->getMessage()
            ];
        }
    }

}

?>