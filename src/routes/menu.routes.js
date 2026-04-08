/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn, authCiudad } = require("../lib/auth");

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Consultamos el menu.
router.post("/menu", isLoggedIn, async (req, res) => {
	await pool.query("SELECT * FROM menu", (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ menu_items: rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
