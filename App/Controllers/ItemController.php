<?php

namespace App\Controllers;
use MF\Model\Container;
use App\Middlewares\PermissionMiddleware;

class ItemController {

    public function adicionar()
    {
        
        $id_etapa = filter_input(INPUT_POST, "id_etapa", FILTER_DEFAULT);
        $codigo = filter_input(INPUT_POST, "codigo", FILTER_DEFAULT);
        $quantidade = filter_input(INPUT_POST, "quantidade", FILTER_DEFAULT);
        $tipo = filter_input(INPUT_POST, "tipo", FILTER_DEFAULT); // i (insumo) ou c (composição)


        // $status_etapa = Container::getModel("Etapa")->selectOne(
        //     "etapas",
        //     ["*"],
        //     "id = $id_etapa"
        // );
        // if(!$status_etapa['ok']) {
        //     echo json_encode(array('ok' => false, "message" => "Erro: " . $status_etapa['message']));
        //     return;
        // }
        // $id_orcamento = $status_etapa['data']->id_orcamento;

        $pdo = Container::getModel("Etapa")->__get("db");
        // pegar id_escritorio com JOIN
        $query = "
            SELECT
                o.id_escritorio
            FROM 
                orcamentos o
            JOIN etapas e 
                ON e.id_orcamento = o.id
            WHERE e.id = '$id_etapa';
        ";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $id_escritorio_etapa = $stmt->fetchAll(\PDO::FETCH_OBJ);
        if(!$id_escritorio_etapa) {
            echo json_encode(array('ok' => false, "message" => "Erro: Etapa não encontrada"));
            return;
        }

        $conditions = [
            "id_escritorio" => $id_escritorio_etapa
        ];
        if(!PermissionMiddleware::checkConditions( $conditions )) return;

        $itemModel = Container::getModel("Item");
        $pdo = $itemModel->__get("db");

        /**
         * 1 - Verificar se o id_etapa existe
         * 2 - Verificar se a etapa tem algum item
         *  2.1 - Se não tiver, criar o primeiro item
         *  2.2 - Se tiver, criar o item e definir o seu id como id_proximo_item do item que está com id_proximo_item = null
         * 3 - Retornar o id do item criado
        */

        try {

            // INICIO TRANSACAO
            $pdo->beginTransaction();

            // 1 - Verificar se o id_etapa existe e pegar o atualUltimoItem
            $query = "SELECT id FROM itens WHERE id_proximo_item IS NULL AND id_etapa = $id_etapa";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $atualUltimoItem = $stmt->fetch(\PDO::FETCH_OBJ);
                // resultado: {"id": 1} ou null

            if(!$atualUltimoItem) {
                $id_ultimo_item = null;
            } else {
                $id_ultimo_item = $atualUltimoItem->id;
            }

            // 2 - Criar o item
            $query = "INSERT INTO itens (
                codigo, quantidade, tipo, id_etapa
            ) VALUES (
                '$codigo', $quantidade, '$tipo', $id_etapa
            );";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $id_item_criado = $pdo->lastInsertId();

            // 3 - Atualizar o id_proximo_item do item que está com id_proximo_item = null (ultimo item)
            if($id_ultimo_item) {
                $query = "UPDATE itens SET id_proximo_item = $id_item_criado WHERE id = $id_ultimo_item";
                $stmt = $pdo->prepare($query);
                $stmt->execute();
            }

            // FIM TRANSACAO
            $pdo->commit();

            echo json_encode(array('ok' => true, "message" => "Item criado com sucesso", "id_item_criado" => $id_item_criado));


        } catch( \Throwable $th ) {
            $pdo->rollBack();
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage()));
            return;
        }
        

    }

    public function excluir()
    {

        // Permissões: id_escritorio do orçamento da etapa == id_escritorio do usuário logado

        /**
         * O que fazer?
         * 1 - Pegar o id_proximo_item do item que será excluído
         * 2 - Alterar o id_proximo_item do item que atualmente está com id_proximo_item = id_do_item_que_sera_excluido para o id_proximo_item do item que será excluído
         * 3 - Excluir o item
        */

        try {
            $id_item_excluir = filter_input(INPUT_POST, "id_item", FILTER_DEFAULT);
            
            $itemModel = Container::getModel("Item");
            $pdo = $itemModel->__get("db");

            // INICIO da transação
            $pdo->beginTransaction();

            // 1 - Pegar o id_proximo_item do item que será excluído
            $query = "SELECT id_proximo_item FROM itens WHERE id = $id_item_excluir";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $id_proximo_item = $stmt->fetch(\PDO::FETCH_OBJ)->id_proximo_item;
            // se for null, será retornado "" (string vazia), então é necessário verificar se é null
            $id_proximo_item = $id_proximo_item ? $id_proximo_item : 'null';

            // 2 - Alterar o id_proximo_item do item que atualmente está com id_proximo_item = id_do_item_que_sera_excluido para o id_proximo_item do item que será excluído
            $query = "UPDATE itens SET id_proximo_item = $id_proximo_item WHERE id_proximo_item = $id_item_excluir";
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute();
            if ($result === false) {
                throw new \Exception("Erro ao alterar id_proximo_item do item que atualmente está com id_proximo_item = id_do_item_que_sera_excluido para o id_proximo_item do item que será excluído");
            }
            
            // 3 - Excluir o item
            $query = "DELETE FROM itens WHERE id = $id_item_excluir";
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute();
            if ($result === false) {
                throw new \Exception("Erro ao excluir o item");
            }

            // FIM da transação
            $pdo->commit();

            echo json_encode(array('ok' => true));

        } catch (\Throwable $th) {
            $pdo->rollBack();
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }

    }

    public function listar()
    {

        $id_etapa = filter_input(INPUT_POST, "id_etapa", FILTER_DEFAULT);

        $pdo = Container::getModel("Etapa")->__get("db");
        // pegar id_escritorio com JOIN
        $query = "
            SELECT
                o.id_escritorio
            FROM 
                orcamentos o
            JOIN etapas e 
                ON e.id_orcamento = o.id
            WHERE e.id = '$id_etapa';
        ";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $id_escritorio_etapa = $stmt->fetchAll(\PDO::FETCH_OBJ);
        if(!$id_escritorio_etapa) {
            echo json_encode(array('ok' => false, "message" => "Erro: Etapa não encontrada"));
            return;
        }

        $conditions = [
            "id_escritorio" => $id_escritorio_etapa
        ];
        if(!PermissionMiddleware::checkConditions( $conditions )) return;

        
        $itemModel = Container::getModel("Item");
        $statusItens = $itemModel->listar($id_etapa);
        if ($statusItens['ok']) {
            echo json_encode(array('ok' => true, "itens" => $statusItens['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $statusItens['message']));
        }

    }

}

?>