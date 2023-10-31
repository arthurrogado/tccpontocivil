<?php

namespace MF\Model;
// use App\Config\Config;
use App\Config\Config;
use App\Connection;

abstract class Model {

    protected $db;

    protected static $conn;

    public function __construct(\PDO $db) {
        $this->db = $db;
    }

    public function __get($attr) {
        return $this->$attr;
    }

    public function __set($attr, $value) {
        $this->$attr = $value;
    }

    public static function getConn() {
        if (!isset(self::$conn)) {
            self::$conn = Connection::getDB();
            return self::$conn;
            // self::$conn =  new \PDO("mysql: host=".Config::$host."; dbname=".Config::$dbname, Config::$user, Config::$password);
        }
    }

    // Métodos genéricos para CRUD

    public static function insert(string $table, array $columns, array $values) : array {
        try {
            self::getConn();
    
            $preparedValues = array_map(function($value) {
                return ($value !== null) ? "'$value'" : 'NULL';
            }, $values);
    
            $query = "INSERT INTO $table (".implode(", ", $columns).") VALUES (". implode(", ", $preparedValues). ")";
            // like: "INSERT INTO users (name, email) VALUES ('Durov', 'durov@telegram')";
            
            $stmt = self::$conn->prepare($query);
            $result = $stmt->execute();
            // retonar o id do registro inserido
            $id = self::$conn->lastInsertId();
            return (["ok" => $result, "id" => $id]);
        } catch (\Throwable $th) {
            return (["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()]);
        }
    }
    

    public static function select(string $table, array $columns, string $where = null) : array {

        // Example: select("users", ["name", "email"], "id = 1");
        try {
            self::getConn();
            $query = "SELECT ".implode(", ", $columns)." FROM $table";
            if($where){
                $query .= " WHERE $where";
            }
            $stmt = self::$conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(\PDO::FETCH_OBJ);
            return ["ok" => true, "data" => $result];
        } catch (\Throwable $th) {
            //throw $th;
            return ["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()];
        }
    }

    public static function selectOne(string $table, array $columns, string $where = null) : array {

        // Example: select("users", ["name", "email"], "id = 1");
        try {
            self::getConn();
            $query = "SELECT ".implode(", ", $columns)." FROM $table";
            if($where){
                $query .= " WHERE $where";
            }
            $stmt = self::$conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(\PDO::FETCH_OBJ);
            return ["ok" => true, "data" => $result];
        } catch (\Throwable $th) {
            //throw $th;
            return ["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()];
        }
    }

    public function update(string $table, array $columns, array $values, string $where){
        // Example: update("users", ["name", "email"], ["Durov", "durov@telegram"], "id = 1");
        try {
            self::getConn();
            $query = "UPDATE $table SET ";
            for ($i=0; $i < count($columns); $i++) { 
                $query .= "$columns[$i] = $values[$i]";
                if($i < count($columns) - 1){
                    $query .= ", ";
                }
            }
            $query .= " WHERE $where";
            var_dump($query);
            $stmt = self::$conn->prepare($query);
            $result = $stmt->execute();
            return(["ok" => $result]);
        } catch (\Throwable $th) {
            //throw $th;
            return(["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()] );
        }
    }

    public function delete(string $table, string $where){
        // Example: delete("users", "id = 1");
        try {
            self::getConn();
            $query = "DELETE FROM $table WHERE $where";
            $stmt = self::$conn->prepare($query);
            $result = $stmt->execute();
            return (["ok" => $result]);
        } catch (\Throwable $th) {
            //throw $th;
            return (["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()]);
        }
    }


}

?>