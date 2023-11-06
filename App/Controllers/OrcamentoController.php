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

    public function editar()
    {

        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $orcamentoModel = Container::getModel("Orcamento");
        $orcamento = $orcamentoModel->visualizar($id);
        $id_escritorio_orcamento = $orcamento['data']->id_escritorio;

        // Condições: id_escritorio do orçamento == id_escritorio do usuário logado
        $conditions = [
            "id_escritorio" => $id_escritorio_orcamento
        ];
        if(!PermissionMiddleware::checkConditions( $conditions )) return;

        $nome = filter_input(INPUT_POST, "nome", FILTER_DEFAULT);
        $descricao = filter_input(INPUT_POST, "descricao", FILTER_DEFAULT);
        $estado = filter_input(INPUT_POST, "estado", FILTER_DEFAULT);
        $data_sinapi = filter_input(INPUT_POST, "data_sinapi", FILTER_DEFAULT);
        $bdi = filter_input(INPUT_POST, "bdi", FILTER_DEFAULT);
        $desonerado = filter_input(INPUT_POST, "desonerado", FILTER_DEFAULT);

        $status = $orcamentoModel->editar($id, $nome, $descricao, $estado, $data_sinapi, $bdi, $desonerado);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "message" => "Orçamento editado com sucesso"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message']));
        }
        
    }

    public function excluir()
    {
        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $orcamentoModel = Container::getModel("Orcamento");
        $orcamento = $orcamentoModel->visualizar($id);
        $id_escritorio_orcamento = $orcamento['data']->id_escritorio;

        // Permissões: id_escritorio do orçamento == id_escritorio do usuário logado
        $conditions = [
            "id_escritorio" => $id_escritorio_orcamento
        ];
        if(!PermissionMiddleware::checkConditions( $conditions )) return;

        $status = $orcamentoModel->excluir($id);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "message" => "Orçamento excluído com sucesso"));
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

    // Pesquisa

    public function pesquisarComposicao()
    {
        $pesquisa = filter_input(INPUT_POST, "pesquisa", FILTER_DEFAULT);
        $orcamentoModel = Container::getModel("Orcamento");
        $status = $orcamentoModel->pesquisarComposicao($pesquisa);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "composicoes" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message']));
        }
    }

}

?>