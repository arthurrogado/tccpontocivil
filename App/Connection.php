<?php

namespace App;
use App\Config\Config;

class Connection {

    public static function getDB() {
        try{

            $conn = new \PDO(
                "mysql: host=".Config::$host."; dbname=".Config::$dbname,
                Config::$user,
                Config::$password
            );

            return $conn;

        } catch(\PDOException $e) {
            echo $e->getMessage();
        }
    }

}

?>