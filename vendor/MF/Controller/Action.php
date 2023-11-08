<?php

namespace MF\Controller;

use function PHPSTORM_META\type;

abstract class Action {
    
    protected $view;

    public function __construct() {
        $this->view = new \stdClass();
    }

    public function render($view) {
        
        // Get the current class name, like: "App\Controllers\IndexController"
        $currentClass = get_class($this);
        // Remove the namespace, and the word "Controller", so we get: "Index"
        // if the controller is inside a subfolder, like: "App\Controllers\Pages\Pessoas" we get: "Pages\Pessoas" 
        // and we need to remove the "Pages\" part, because view files are inside the "App/Views" folder

        $currentClass = str_replace("App\\Controllers\\", "", $currentClass);
        $currentClass = str_replace("Controller", "", $currentClass);
        $currentClass = str_replace("Pages\\", "", $currentClass); // now we have: "Pessoas"
        // $currentClass = strtolower( $currentClass );
        $currentClass = lcfirst($currentClass);

        // criar array com as variáveis que serão usadas na view: html, css, js, etc
        $result = array();

        ob_start();

        $base_app_views =  "../../App/Views/";


        if(file_exists($base_app_views . $currentClass . "/" . $view.".phtml")){
            require_once $base_app_views . $currentClass . "/" . $view.".phtml";
        } else if(file_exists($base_app_views . $currentClass . "/" . $view."/".$view.".html") ) {
            require_once $base_app_views . $currentClass . "/" . $view."/".$view.".html";
        } 
        
        else if(file_exists($base_app_views . $currentClass . "/" . $view.".html")) {
            require_once $base_app_views . $currentClass . "/" . $view.".html";
        } else if(file_exists($base_app_views . $currentClass . "/" . $view."/".$view.".phtml") ) {
            require_once $base_app_views . $currentClass . "/" . $view."/".$view.".phtml";
        }
        
        else {
            echo "View não encontrada. Current class: " . $currentClass . " View: " . $view . ".html <br> Caminho: ../App/Views/" . $currentClass . "/" . $view . ".phtml";
        }

        
        $html = ob_get_clean();
        $html = (string)$html;
        $result['html'] = $html;
        
        // get css
        ob_start();

        if(file_exists($base_app_views . $currentClass . "/" . $view.".css")) {
            require_once $base_app_views . $currentClass . "/" . $view.".css";
        } else if(file_exists($base_app_views . $currentClass . "/" . $view."/".$view.".css") ) {
            require_once $base_app_views . $currentClass . "/" . $view."/".$view.".css";
        }

        $css = ob_get_clean();
        $css = (string)$css;
        $result['css'] = $css;


        
        // get js
        ob_start();
        if(file_exists($base_app_views . $currentClass . "/" . $view.".js")) {
            require_once $base_app_views . $currentClass . "/" . $view.".js";
        } else if(file_exists($base_app_views . $currentClass . "/" . $view."/".$view.".js") ) {
            require_once $base_app_views . $currentClass . "/" . $view."/".$view.".js";
        }
        
        $js = ob_get_clean();
        $js = (string)$js;
        $result['js'] = $js;
        $result['class'] = $currentClass;
        $result['view'] = $view;

        echo json_encode($result);

        // echo json_encode($result);

        

    }

}

?>