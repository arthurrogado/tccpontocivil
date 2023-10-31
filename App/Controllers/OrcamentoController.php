<?php

namespace App\Controllers;

use MF\Model\Container;
use App\Models\Usuario;
use App\Middlewares\PermissionMiddleware;

class OrcamentoController
{

    public function criar()
    {
        if(!PermissionMiddleware::checkConditions()) return;

        $nome = filter_input(INPUT_POST, "nome", FILTER_DEFAULT);
        $descricao = filter_input(INPUT_POST, "descricao", FILTER_DEFAULT);
        $estado = filter_input(INPUT_POST, "estado", FILTER_DEFAULT);
        $data_sinapi = filter_input(INPUT_POST, "data_sinapi", FILTER_DEFAULT);
        $bdi = filter_input(INPUT_POST, "bdi", FILTER_DEFAULT);
        $desonerado = filter_input(INPUT_POST, "desonerado", FILTER_DEFAULT);
        $orcamento = Container::getModel("Orcamento");

        $usuario = Container::getModel("Usuario")::checkLogin();
        $id_escritorio = $usuario->id_escritorio;

        $status = $orcamento->criar($nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado, $id_escritorio);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "message" => "Orçamento criado com sucesso", "redirect" => "/orcamentos"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message']));
        }
    }

    public function listar()
    {
        if(!PermissionMiddleware::checkConditions()) return;

        $usuario = Container::getModel("Usuario")::checkLogin();
        $id_escritorio = $usuario->id_escritorio;

        $orcamentoModel = Container::getModel("Orcamento");
        $orcamentos = $orcamentoModel->listar( $id_escritorio );
        if ($orcamentos['ok']) {
            echo json_encode(array('ok' => true, "orcamentos" => $orcamentos['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $orcamentos['message']));
        }
    }

    public function visualizar()
    {
        // $id é o id do orçamento
        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $orcamentoModel = Container::getModel("Orcamento");

        // Instanciando objeto do tipo Orcamento pelo $id passado
        $orcamento = $orcamentoModel->visualizar($id);

        $id_escritorio_orcamento = $orcamento['data']->id_escritorio;
        
        if(!PermissionMiddleware::checkConditions([
            "id_escritorio" => $id_escritorio_orcamento
        ])) return;

        $status = $orcamentoModel->visualizar($id);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "orcamento" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message']));
        }
    }



    public function oldcriarEtapa() {

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
                
            // pegar ID da etapa que está com "id_proxima_etapa" = null (procurar pela etapa anterior, se existir)
            $atualUltimaEtapa = $etapaModel->selectOne(
                "etapas",
                ["id"],
                "id_proxima_etapa IS NULL AND id_orcamento = $id_orcamento"
            );

            // criar etapa, e guardar o id dela
            $statusCriacao = $etapaModel->criar($id_orcamento, $descricao);
            if(!$statusCriacao['ok']) {
                echo json_encode(array('ok' => false, "message" => "Erro: " . $statusCriacao['message']));
                return;
            }
            $id_etapa_criada = $statusCriacao['id'];
            
            // se existir uma etapa ANTERIOR, alterar o "id_proxima_etapa" dela para o id da etapa criada

            try{
                $id_ultima_etapa = $atualUltimaEtapa['data']->id;
            } catch( \Throwable $th ) {
                $id_ultima_etapa = null;
            }

            // alterar a o "id_proxima_etapa" da da etapa que está com "id_proxima_etapa" = null
            $statusAlteracao = $etapaModel->update(
                "etapas",
                ["id_proxima_etapa"],
                [$id_etapa_criada],
                "id = $id_ultima_etapa"
            );
            if(!$statusAlteracao['ok']) {
                echo json_encode(array('ok' => false, "message" => "Erro: " . $statusAlteracao['message']));
                return;
            }
            
            echo json_encode(array('ok' => true, "id_etapa_criada" => $id_etapa_criada));

            // FIM da transação
            $pdo->commit();

        } catch (\Throwable $th) {
            
            echo json_encode(array('ok' => false, "message" => "Erro: " . $th->getMessage() ));
        }


    }
















}

?>