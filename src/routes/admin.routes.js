/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Ruta de incio
router.get('/', isLoggedIn, authCiudad('Administrador'), async (req, res) => {
	await res.render('profile');
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
