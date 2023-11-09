<?php

namespace App\Controllers;
use MF\Model\Container;
use App\Middlewares\PermissionMiddleware;

class EtapaController {

    public function validarEtapaOrcamentoEscritorio_id($id_etapa)
    {
        // Essa função se o ID do escritório do Orçamento da Etapa é igual ao ID do escritório do usuário logado
                // Permissões: id_escritorio do orçamento da etapa == id_escritorio do usuário logado

        // Pegar o id_orcamento da etapa
        $etapaModel = Container::getModel("Etapa");
        $statusIdOrcamento = $etapaModel->selectOne(
            "etapas",
            ["id_orcamento"],
            "id = $id_etapa"
        );
        if(!$statusIdOrcamento['data']) {
            echo json_encode(array('ok' => false, "message" => "Erro: id_orcamento não encontrado"));
            return;
        }
        $id_orcamento = $statusIdOrcamento['data']->id_orcamento;

        // Pegar o id_escritorio do orçamento
        $orcaModel = Container::getModel("Orcamento");
        $statusIdEscritorio = $orcaModel->selectOne(
            "orcamentos",
            ["id_escritorio"],
            "id = $id_orcamento"
        );
        if(!$statusIdEscritorio['data']) {
            echo json_encode(array('ok' => false, "message" => "Erro: id_escritorio não encontrado"));
            return;
        }
        $id_escritorio_orcamento = $statusIdEscritorio['data']->id_escritorio;

        $conditions = [
            "id_escritorio" => $id_escritorio_orcamento
        ];

        // Verificar as permissões
        if(!PermissionMiddleware::checkConditions( $conditions )) return false;
        return true;
    }

    public function criarEtapa() {

        $id_orcamento = filter_input(INPUT_POST, "id_orcamento", FILTER_DEFAULT);
        $descricao = filter_input(INPUT_POST, "descricao", FILTER_DEFAULT);
        
        // Permissões: id_escritorio do orçamento == id_escritorio do usuário logado

        $escritorio_orcamento = Container::getModel("Orcamento")->selectOne(
            "orcamentos",
            ["id_escritorio"],
            "id = $id_orcamento"
        );
        $id_escritorio_orcamento = $escritorio_orcamento['data']->id_escritorio;

        $conditions = [
            "id_escritorio" => $id_escritorio_orcamento
        ];
        if(!PermissionMiddleware::checkConditions( $conditions )) return;

        
        /**
         * 1 - Verificar se o id_orcamento existe
         * 2 - Verificar se o orçamento tem alguma etapa
         *  2.1 - Se não tiver, criar a primeira etapa
         *  2.2 - Se tiver, criar a etapa e definir o seu id como id_proxima da etapa que está com id_proxima = null
         * 3 - Retornar o id da etapa criada
         *  
        */

        $etapaModel = Container::getModel("Etapa");
        
        $pdo = $etapaModel->__get("db");

        try {
            // INICIO da transação
            $pdo->beginTransaction();
                

            $query = "SELECT id FROM etapas WHERE id_proxima_etapa IS NULL AND id_orcamento = $id_orcamento";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $atualUltimaEtapa = $stmt->fetch(\PDO::FETCH_OBJ);
                // resultado: {"id": 1} ou null
                
            try{   
                if(!$atualUltimaEtapa) {
                    $id_ultima_etapa = null;
                } else {
                    $id_ultima_etapa = $atualUltimaEtapa->id;
                }
            } catch( \Throwable $th ) {
                $id_ultima_etapa = null;
            }

            $query = "INSERT INTO etapas (id_orcamento, descricao) VALUES ($id_orcamento, '$descricao')";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $id_etapa_criada = $pdo->lastInsertId();
            
            // se existir uma etapa ANTERIOR, alterar o "id_proxima_etapa" dela para o id da etapa criada

            if($id_ultima_etapa) {
                // alterar a o "id_proxima_etapa" da da etapa que está com "id_proxima_etapa" = null
                $query = "UPDATE etapas SET id_proxima_etapa = $id_etapa_criada WHERE id = $id_ultima_etapa";
                $stmt = $pdo->prepare($query);
                $stmt->execute();
                $atualUltimaEtapa = $stmt->fetch(\PDO::FETCH_OBJ);
            }

            // FIM da transação
            $pdo->commit();
            
            echo json_encode(array('ok' => true, "id_etapa_criada" => $id_etapa_criada));

        } catch (\Throwable $th) {
            $pdo->rollBack();
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }

    }
    
    public function listarEtapas()
    {
        // retornar:
        // 1 - Etapas (id, descricao, id_proxima_etapa)
        // 2 - Itens (insumos e composições) (id, descricao, unidade, valor_unitario, quantidade, valor_total, id_etapa)
        // com isso é possível montar a tabela ordenando por etapas, e dentro de cada etapa seus respectivos itens

        try{
            $id_orcamento = filter_input(INPUT_POST, "id_orcamento", FILTER_DEFAULT);

            $etapaModel = Container::getModel("etapa");
            $statusEtapas = $etapaModel->listar($id_orcamento);
            $etapas = $statusEtapas['data'] ? $statusEtapas['data'] : [];

            echo json_encode(array('ok' => true, "etapas" => $etapas));

        } catch (\Throwable $th) {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }

    }

    public function excluir()
    {
        $id_etapa_excluir = filter_input(INPUT_POST, "id_etapa", FILTER_DEFAULT);

        if(!$this->validarEtapaOrcamentoEscritorio_id($id_etapa_excluir)) return;

        /** 
         * O que fazer?
         * 1 - Pegar o id_proxima_etapa da etapa que será excluída
         * 2 - Alterar o id_proxima_etapa da etapa que atualmente está com id_proxima_etapa = id_da_etapa_que_sera_excluida para o id_proxima_etapa da etapa que será excluída
         * 3 - Excluir a etapa
        */        
        
        try {


            $etapaModel = Container::getModel("etapa");

            $pdo = $etapaModel->__get("db");

            // INICIO da transação
            $pdo->beginTransaction();

            // 1 - Pegar o id_proxima_etapa da etapa que será excluída
            $query = "SELECT id_proxima_etapa FROM etapas WHERE id = $id_etapa_excluir";
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            $id_proxima_etapa = $stmt->fetch(\PDO::FETCH_OBJ);
            $id_proxima_etapa = $id_proxima_etapa->id_proxima_etapa;
            // se for null, será retornado "" (string vazia), então é necessário verificar se é null
            $id_proxima_etapa = $id_proxima_etapa ? $id_proxima_etapa : 'null';            

            // 2 - Alterar o id_proxima_etapa da etapa que atualmente está com id_proxima_etapa = id_da_etapa_que_sera_excluida para o id_proxima_etapa da etapa que será excluída
            $query = "UPDATE etapas SET id_proxima_etapa = $id_proxima_etapa WHERE id_proxima_etapa = $id_etapa_excluir";
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute();
            if ($result === false) {
                throw new \Exception("Erro ao alterar id_proxima_etapa da etapa que atualmente está com id_proxima_etapa = id_da_etapa_que_sera_excluida para o id_proxima_etapa da etapa que será excluída");
            }

            // 3 - Excluir a etapa
            $query = "DELETE FROM etapas WHERE id = $id_etapa_excluir";
            $stmt = $pdo->prepare($query);
            $result = $stmt->execute();
            if ($result === false) {
                throw new \Exception("Erro ao excluir a etapa");
            }

            // FIM da transação
            $pdo->commit();
            
            echo json_encode(array('ok' => true));

        } catch (\Throwable $th) {
            $pdo->rollBack();
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }

    }

    public function editar()
    {
        
        $id_etapa = filter_input(INPUT_POST, "id_etapa", FILTER_DEFAULT);
        
        // Permissões: id_escritorio do orçamento da etapa == id_escritorio do usuário logado
        if(!$this->validarEtapaOrcamentoEscritorio_id($id_etapa)) return;

        try {

            $descricao = filter_input(INPUT_POST, "descricao", FILTER_DEFAULT);

            $etapaModel = Container::getModel("etapa");
            $status = $etapaModel->editar($id_etapa, $descricao);

            if($status['ok']) {
                echo json_encode(array('ok' => true, "message" => "Etapa editada com sucesso"));
            } else {
                echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message'] ));
            }

        } catch (\Throwable $th) {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }
    }

}

?>