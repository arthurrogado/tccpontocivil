<?php

namespace App\Middlewares;

class AuthMiddleware
{

    public function __construct()
    {
    }

    public function __invoke($request, $response, $next)
    {
        if (isset($_SESSION["usuario"])) {
            return $next($request, $response);
        } else {
            return $response->withRedirect("/login");
        }
    }


}
