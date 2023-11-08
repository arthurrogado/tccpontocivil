<?php

namespace App\Models;
use MF\Model\Model;

class Usuario extends Model
{
    private $id;
    private $nome;
    private $usuario;
    private $id_escritorio;

    public function __get($attr) {
        return $this->$attr;
    }

    public function __set($attr, $value) {
        $this->$attr = $value;
    }

    public static function getUsuario($id) {
        self::getConn();
        $query = "SELECT id, nome FROM tb_usuarios WHERE id = :id";
        $stmt = self::$conn->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_OBJ);
    }

    public function criar($nome, $usuario, $senha, $categoria, $cpf, $telefone, $id_escritorio)
    {
        $senha = password_hash($senha, PASSWORD_DEFAULT);
        return $this->insert(
            "usuarios",
            [
                "nome", "usuario", "senha", "categoria", "cpf", "telefone", "id_escritorio"
            ],
            [
                $nome, $usuario, $senha, $categoria, $cpf, $telefone, $id_escritorio
            ]
        );
    }

    public function editar($id, $nome, $usuario, $categoria, $cpf, $telefone, $id_escritorio)
    {
        return $this->update(
            "usuarios",
            ["nome", "usuario", "categoria", "cpf", "telefone", "id_escritorio"],
            [$nome, $usuario, $categoria, $cpf, $telefone, $id_escritorio],
            "id = $id"
        );
    }

    public function excluir($id)
    {
        return $this->delete(
            "usuarios",
            "id = $id"
        );
    }

    public function visualizar($id)
    {
        return $this->selectOne(
            "usuarios",
            ["*"],
            "id = $id"
        );
    }

    public function mudarSenha($id, $senha)
    {
        $senha = password_hash($senha, PASSWORD_DEFAULT);
        return $this->update(
            "usuarios",
            ["senha"],
            [$senha],
            "id = $id"
        );
    }



    public static function checkLogin() {
        // session_start();

        if(isset($_SESSION['usuario'])) {
            // return self::getUsuario($_SESSION['usuario']->id);
            return $_SESSION['usuario'];
        } else {
            return false;
        }
    }

    public static function login($usuario, $senha) {
        self::getConn();
        $query = "SELECT * FROM usuarios WHERE usuario = :usuario";
        $stmt = self::$conn->prepare($query);
        $stmt->bindValue(":usuario", $usuario);
        $stmt->execute();
        $usuario = $stmt->fetch(\PDO::FETCH_OBJ);
        if($usuario) {
            if(password_verify($senha, $usuario->senha)) {
                // session_start();
                $_SESSION['usuario'] = $usuario;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static function logout() {
        // session_start();
        return session_destroy();
    }

    public function getUsuarios() {
        // self::getConn();
        return self::select(
            "usuarios",
            ["id", "nome"]
        );
    }

}

?>