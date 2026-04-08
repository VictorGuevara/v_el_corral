const { promises } = require("dns");
const mysql = require("mysql");
const { prmisify, promisify } = require("util");
const { database } = require("./keys");

// Creamos la conexion con la base de datos
const pool = mysql.createPool(database);

// Ejecutamos la conexión.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.log("LA CONEXIÓN CON LA BASE DE DATOS FUE CERRRADA");
        } else if (err.code === "ER_CON_COUNT_ERROR") {
            console.log("LA BASE DE DATOS TIENE MUCHAS CONEXIONES");
        } else if (err.code === "ECONNREFUSED") {
            console.log("SE RECHAZÓ LA CONEXIÓN DE LA BASE DE DATOS");
        } else {
            console.log("EXISTE UN ERROR - " + err.code);
        }
    } else {
        if (connection) {
            connection.release();
            console.log(
                "LA BASE DE DATOS " + database.database + " ESTÁ CONECTADA",
            );
            return;
        }
    }
});

// Ejecutamos esta sentencia para que podamos usar siertos metodos de mysql...
pool.query(
    `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`,
);

// Utilizamos promisify para poder usar promesas para hacer consultas a la base de datos...
pool.query = promisify(pool.query);

// Exportamos el modulo de conexión para que pueda ser utilizado.
module.exports = pool;
