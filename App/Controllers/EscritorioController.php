<?php

namespace App\Controllers;
use MF\Model\Container;
use App\Middlewares\PermissionMiddleware;

class EscritorioController {

    public function listar() {

        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);

        $escritorio = Container::getModel("Escritorio");
        $status = $escritorio->listar();
        if($status['ok']) {
            echo json_encode(array('ok' => true, "escritorios" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
        }
    }
    
    public function createEscritorio() {

        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);

        // var_dump($permission);

        $nome = filter_input(INPUT_POST, 'nome');
        $cnpj = filter_input(INPUT_POST, 'cnpj');
        $telefone = filter_input(INPUT_POST, 'telefone');
        $endereco = filter_input(INPUT_POST, 'endereco');
        $observacoes = filter_input(INPUT_POST, 'observacoes');

        $escritorio = Container::getModel("Escritorio");
        $status =  $escritorio->createEscritorio($nome, $cnpj, $telefone, $endereco, $observacoes);
        if($status['ok']) {
            echo json_encode(array('ok' => true, "message" => "Escritório criado com sucesso"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro ao criar escritório".$status['message'] ));
        }
            // Apenas retornar o createEscritorio pois nesse método já é feito o tratamento de erros e o echo (retorno) no padrão correto
    }

    public function visualizar() {
        PermissionMiddleware::checkConditions([
            "id" => "1"
        ]);

        $id = filter_input(INPUT_POST, 'id', FILTER_DEFAULT);

        $escritorio = Container::getModel("Escritorio");
        $status = $escritorio->visualizar($id);
        if($status['ok']) {
            echo json_encode(array('ok' => true, "escritorio" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
        }
    }

    public function excluir() {
        try {
            PermissionMiddleware::checkConditions([
                "id" => "1"
            ]);
    
            $id = filter_input(INPUT_POST, 'id', FILTER_DEFAULT);
    
            $escritorio = Container::getModel("Escritorio");
            $status = $escritorio->excluir($id);
            if($status['ok']) {
                echo json_encode(array('ok' => true, "message" => "Escritório excluído com sucesso", "redirect" => "/escritorio/listar"));
            } else {
                echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
            }
        } catch (\Throwable $th) {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$th->getMessage() ));
        }
    }

}

?>