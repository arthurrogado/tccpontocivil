<?php

namespace App\Models;
use MF\Model\Model;

class Pessoa extends Model {

    // public function createPessoa($nome, $usuario, $senha) {
    //     $query = "INSERT INTO tb_pessoas(nome, usuario, senha) VALUES(:nome, :usuario, :senha)";
    //     $stmt = $this->db->prepare($query);
    //     $stmt->bindValue(":nome", $nome);
    //     $stmt->bindValue(":usuario", $usuario);
    //     $stmt->bindValue(":senha", $senha);
    //     return $stmt->execute();
    // }

    public function createPessoa($nome, $usuario, $senha) {
        return $this->insert(
            "tb_pessoas",
            ["nome", "usuario", "senha"],
            [$nome, $usuario, $senha]
        );
    }

    public function getPessoas() {
        self::getConn();
        return $this->select(
            "tb_pessoas",
            ["id", "nome"]
        );
        // $query = "SELECT id, nome FROM tb_pessoas";
        // return $this->db->query($query)->fetchAll();
    }

    public function deletePessoa($id) {
        $query = "DELETE FROM tb_pessoas WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(":id", $id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

}



?>