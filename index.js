const { Pool } = require("pg");
const Cursor = require("pg-cursor");

// configuracion de los datos en .env
const dotenv = require("dotenv").config();
const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    max: process.env.DB_max,
    min: process.env.DB_min,
    idleTimeoutMillis: process.env.DB_idleTimeoutMillis,
    connectionTimeoutMillis: process.env.DB_connectionTimeoutMillis,
};

// captura datos del terminal
const argumentos = process.argv.slice(2);
let opcion = argumentos[0];
let descripcion = argumentos[1];
let fecha = argumentos[2];
let monto = argumentos[3];
let cuenta = Number(argumentos[4]);

// Instanciar pool 
const pool = new Pool(config);

//conectar
pool.connect((error_conexion, client, release) => {
    try {

        /**
        1. Crear una función asíncrona que registre una nueva transacción utilizando valores
        ingresados como argumentos en la línea de comando. Debe mostrar por consola la
        última transacción realizada.
        ( Se debe ingresar la transacion y descontar el valor de la cuenta )
        */

        if (opcion == "nuevo") {
            console.log("entrando en nuevo");
            // descripcion, fecha, monto, cuenta
            async function ingresar(dato1, dato2, dato3, dato4) {
                await client.query("BEGIN");
                try {

                    const SQLQueryInsertar = {
                        text: "insert into transacciones (descripcion,fecha, monto, cuenta) values ($1, $2, $3,$4) RETURNING *;",
                        values: [dato1, dato2, dato3, dato4],
                    };
                    console.log(SQLQueryInsertar);
                    const res = await client.query(SQLQueryInsertar);
                    console.log(res.rows);


                    const SQLQueryUpdate = {
                        text: "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *;",
                        values: [dato3, dato4],
                    };
                    console.log(SQLQueryUpdate);
                    const resUpdate = await client.query(SQLQueryUpdate);
                    console.log(resUpdate.rows);


                    await client.query("COMMIT");
                } catch (e) {
                    await client.query("ROLLBACK");
                    console.log("Error código: " + e.code);
                    console.log("Detalle del error: " + e.detail);
                    console.log("Tabla originaria del error: " + e.table);
                    console.log("Restricción violada en el campo: " + e.constraint);
                }

            }
            ingresar(descripcion, fecha, monto, cuenta);
        }


        /**  
        2. Realizar una función asíncrona que consulte la tabla de transacciones y retorne
        máximo 10 registros de una cuenta en específico. Debes usar cursores para esto.
        **/


        if (opcion == "consulta") {
            console.log("entrando consulta");
            // cuenta
            async function consultar(dato1) {

                const consulta = new Cursor(`select * from transacciones WHERE cuenta = ${dato1}`);
                const cursor = client.query(consulta);
                cursor.read(10, (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rows);
                        cursor.close();
                    }

                })

            }
            consultar(descripcion);
        }




        /** 
        3. Realizar una función asíncrona que consulte el saldo de una cuenta y que sea
        ejecutada con valores ingresados como argumentos en la línea de comando. Debes
        usar cursores para esto.
        */

        if (opcion == "saldo") {
            console.log("entrando en Saldo");
            // cuenta
            async function consultarSaldo(dato1) {

                const consulta = new Cursor(`select * from cuentas WHERE id = ${dato1}`);
                const cursor = client.query(consulta);
                cursor.read(1, (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else {

                        console.log(rows);
                        cursor.close();
                    }

                })


            }
            consultarSaldo(descripcion);
        }



        /** 
        4. En caso de haber un error en la transacción, se debe retornar el error por consola
        (Todas las query capturan el error y tambien capturo error en conexion)
        */

    } catch (error_conexion) { console.log(error_conexion); }

    release();
})










