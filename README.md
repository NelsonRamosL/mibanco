Readme 


instrucciones base de datos posgres

CREATE DATABASE Banco;

CREATE TABLE transacciones
(descripcion varchar(50), fecha varchar(10), monto DECIMAL, cuenta INT);

CREATE TABLE cuentas (id INT, saldo DECIMAL CHECK (saldo >= 0) );

INSERT INTO cuentas values (1, 20000);





Ejemplo 

para registrar una nueva transacción por consola
node .\index.js 'nuevo' 'pago de servicios' '25-08-2021' 5000 1


consultar 10 registros maximo de una cuenta en específico 
node .\index.js 'consulta' 1


consulta saldo disponible de la cuenta
node .\index.js 'saldo' 1

