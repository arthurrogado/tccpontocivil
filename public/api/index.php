<?php
    //index.php

    //print_r($_SERVER['REQUEST_URI']);
    
    // Permitir acesso cross-origin
    header("Access-Control-Allow-Origin: *");

    try {
        //code...
        require_once "../../vendor/autoload.php";
        $route = new \App\Route;
    } catch (\Throwable $th) {
        //throw $th;
        echo json_encode(["ok" => false, "message" => $th->getMessage(), "line" => $th->getLine()]);
    }


?>