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

        $orcamentos = Container::getModel("Orcamento")::listar( $id_escritorio );
        if ($orcamentos['ok']) {
            echo json_encode(array('ok' => true, "orcamentos" => $orcamentos['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $orcamentos['message']));
        }
    }

    public function visualizar()
    {
        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $orcamento = Container::getModel("Orcamento");
        $id_escritorio_orcamento = $orcamento->id_escritorio;
        
        if(!PermissionMiddleware::checkConditions([
            "id_escritorio" => $id_escritorio_orcamento
        ])) return;

        $status = $orcamento->visualizar($id);
        if ($status['ok']) {
            echo json_encode(array('ok' => true, "orcamento" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: " . $status['message']));
        }
    }

}

?>