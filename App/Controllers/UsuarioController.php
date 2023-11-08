<?php

namespace App\Controllers;
use MF\Model\Container;
use App\Middlewares\PermissionMiddleware;

class UsuarioController {

    public function criar()
    {
        // Permissões: ser admin do sistema (id = 1)
        if(!PermissionMiddleware::checkConditions(["id" => "1"])) return;

        // $nome, $usuario, $senha, $categoria, $cpf, $telefone, $id_escritorio
        $nome = filter_input(INPUT_POST, "nome", FILTER_DEFAULT);
        $usuario = filter_input(INPUT_POST, "usuario", FILTER_DEFAULT);
        $senha = filter_input(INPUT_POST, "senha", FILTER_DEFAULT);
        $categoria = filter_input(INPUT_POST, "categoria", FILTER_DEFAULT);
        $cpf = filter_input(INPUT_POST, "cpf", FILTER_DEFAULT);
        $telefone = filter_input(INPUT_POST, "telefone", FILTER_DEFAULT);
        $id_escritorio = filter_input(INPUT_POST, "id_escritorio", FILTER_DEFAULT);

        $modelUsuario = Container::getModel("Usuario");
        $statusCriacao = $modelUsuario->criar($nome, $usuario, $senha, $categoria, $cpf, $telefone, $id_escritorio);
        if($statusCriacao['ok']) {
            echo json_encode(array('ok' => true, "message" => "Usuário criado com sucesso", "id"=> $statusCriacao['id'] ));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$statusCriacao['message'] ));
        }

    }

    public function editar()
    {
        // Permissões: ser admin do sistema (id = 1) ou ser o próprio usuário
        if(!PermissionMiddleware::checkConditions(["id" => "1"])) return;

        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $nome = filter_input(INPUT_POST, "nome", FILTER_DEFAULT);
        $usuario = filter_input(INPUT_POST, "usuario", FILTER_DEFAULT);
        $categoria = filter_input(INPUT_POST, "categoria", FILTER_DEFAULT);
        $cpf = filter_input(INPUT_POST, "cpf", FILTER_DEFAULT);
        $telefone = filter_input(INPUT_POST, "telefone", FILTER_DEFAULT);
        $id_escritorio = filter_input(INPUT_POST, "id_escritorio", FILTER_DEFAULT);

        $modelUsuario = Container::getModel("Usuario");
        $statusEdicao = $modelUsuario->editar($id, $nome, $usuario, $categoria, $cpf, $telefone, $id_escritorio);
        if($statusEdicao['ok']) {
            echo json_encode(array('ok' => true, "message" => "Usuário editado com sucesso"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$statusEdicao['message'] ));
        }
    }

    public function excluir()
    {
        // Permissões: ser admin do sistema (id = 1)
        if(!PermissionMiddleware::checkConditions(["id" => "1"])) return;

        $id = filter_input(INPUT_POST, "id", FILTER_DEFAULT);
        $modelUsuario = Container::getModel("Usuario");
        $statusExclusao = $modelUsuario->excluir($id);
        if($statusExclusao['ok']) {
            echo json_encode(array('ok' => true, "message" => "Usuário excluído com sucesso"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$statusExclusao['message'] ));
        }
    }
    
    public function login() {
        $usuario = filter_input(INPUT_POST, "usuario", FILTER_DEFAULT);
        $senha = filter_input(INPUT_POST, "senha", FILTER_DEFAULT);        
        $user = Container::getModel("Usuario");
        $status = $user->login($usuario, $senha);
        if($status) {
            echo json_encode(array('ok' => true, "message" => "Login feito com sucesso"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Usuário ou senha incorretos" ));
        }
    }

    public function logout() {
        $user = Container::getModel("Usuario");
        if($user->logout()) {
            echo json_encode(array('ok' => true, "message" => "Logout feito com sucesso", "redirect" => "/"));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro ao fazer logout (???)"));
        }
    }

    public function getUsuarios() {

        if(!PermissionMiddleware::checkConditions(["id" => "1"])) return;

        $user = Container::getModel("Usuario");
        $status = $user->getUsuarios();
        if($status['ok']) {
            echo json_encode(array('ok' => true, "usuarios" => $status['data']));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
        }
    }

    public function checkLogin()
    {
        // retornar dados do usuárioo logado (só não a senha)
        $user = Container::getModel("Usuario");
        $status = $user->checkLogin();

        if($status) {
            // Tirar o atributo "senha" do stdClass $status
            unset($status->senha);
            echo json_encode(array('ok' => true, "usuario" => $status));
        } else {
            echo json_encode(array('ok' => false, "status" => "Pelo jeito não está logado" ));
        }

    }

    public function visualizar() {
        $id = filter_input(INPUT_POST, 'id', FILTER_DEFAULT);

        // Permissões: ser admin do sistema (id = 1)
        if(!PermissionMiddleware::checkConditions(["id" => $id])) return;

        $usuario = Container::getModel("Usuario");
        $status = $usuario->visualizar($id);
        if($status['ok']) {
            $status['data']->senha = "";
            echo json_encode(array('ok' => true, "usuario" => $status['data'] ));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
        }
    }

    public function mudarSenha() {
        $id = filter_input(INPUT_POST, 'id', FILTER_DEFAULT);
        $senha = filter_input(INPUT_POST, 'senha', FILTER_DEFAULT);

        // Permissões: ser admin do sistema (id = 1) ou ser o próprio usuário
        if(!PermissionMiddleware::checkConditions(["id" => $id])) return;

        $usuario = Container::getModel("Usuario");
        $status = $usuario->mudarSenha($id, $senha);
        if($status['ok']) {
            echo json_encode(array('ok' => true, "message" => "Senha alterada com sucesso" ));
        } else {
            echo json_encode(array('ok' => false, "message" => "Erro: ".$status['message'] ));
        }
    }

}

?>