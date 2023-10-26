<?php

$pass = $_GET['password'];
echo password_hash($pass, PASSWORD_DEFAULT);

?>