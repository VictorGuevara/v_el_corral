/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Ruta de renderizar la vista de compras.
router.get('/', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	// Renderizamos la vista de compras...
	await res.render('admin/expedientes');
});

// Consultamos cuantos regitros existen en la tabla de presentaciones.
router.post('/count_presentaciones', isLoggedIn, async (req, res) => {
	await pool.query('SELECT COUNT(*) AS cant_presentacion FROM presentaciones', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_presentacion: rows[0]['cant_presentacion'] });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Ruta para guardar presentaciones.
router.post('/g_presentaciones', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	try {
		// Creamos el array de los datos enviador por el usuario.
		const [cod, nombre, cantidad, fecha, usuario] = req.body;

		console.log(nombre);

		// Verificar si ya existe una presentación con el mismo nombre
		const existe = await pool.query(`SELECT COUNT(*) AS total FROM presentaciones WHERE detalle_presentacion = ?`, [
			nombre,
		]);

		// Validamos.
		if (existe.total > 0) {
			return res.json({ mensaje: 'Presentación registrada' });
		}

		// Insertar nueva presentación
		await pool.query(
			`INSERT INTO presentaciones (cod_presentacion, detalle_presentacion, cantidad_presentacion, fecha_registro, user_registro)
             VALUES (?, ?, ?, ?, ?)`,
			[cod, nombre, cantidad, fecha, usuario]
		);

		res.json({ mensaje: 'Presentación guardada con exito.' });
	} catch (error) {
		console.error('Error al guardar presentación:', error);
		res.status(500).json({ mensaje: 'Error interno al guardar presentación.' });
	}
});

// Ruta para listar las presentaciones...
router.post('/list_presentaciones', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	let dato_busqueda = '%' + req.body.nombre_presentacion + '%';
	const pagina = parseInt(req.body.page);
	const limite = parseInt(req.body.limit);
	const desfase = (pagina - 1) * limite;

	try {
		let totalQuery = '';
		let dataQuery = '';
		let paramsTotal = [];
		let paramsData = [];

		if (req.body.nombre_presentacion.trim() === '') {
			// Sin búsqueda
			totalQuery = `SELECT COUNT(*) AS total FROM presentaciones`;
			dataQuery = `SELECT * FROM presentaciones ORDER BY detalle_presentacion ASC LIMIT ? OFFSET ?`;
			paramsData = [limite, desfase];
		} else {
			// Con búsqueda
			totalQuery = `SELECT COUNT(*) AS total FROM presentaciones WHERE detalle_presentacion LIKE ?`;
			dataQuery = `SELECT * FROM presentaciones WHERE detalle_presentacion LIKE ? ORDER BY detalle_presentacion ASC LIMIT ? OFFSET ?`;
			paramsTotal = [dato_busqueda];
			paramsData = [dato_busqueda, limite, desfase];
		}

		// Obtener total de filas
		const totalRows = await pool.query(totalQuery, paramsTotal);
		const cant_filas = totalRows[0].total;

		// Obtener datos paginados
		const datos = await pool.query(dataQuery, paramsData);

		// Enviar respuesta
		res.json([datos, cant_filas, desfase]);
	} catch (error) {
		console.error('Error en paginación:', error);
		res.status(500).json({ error: 'Error al obtener presentaciones' });
	}
});

// Ruta para llenar el formulario de usuario para editar los datos...
router.post('/cargar_presentacion', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	let dato_busqueda = req.body.cod_presentacion;
	await pool.query(
		`SELECT * FROM presentaciones WHERE cod_presentacion = ?`,
		[dato_busqueda],
		async (error, rows, fields) => {
			res.json(rows);
		}
	);
});

// Ruta para editar presentaciones
router.post('/editar_presentacion', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res, next) => {
	let cod_presentacion = req.body.cod;
	let name_presentacion = req.body.nombre_presentacion;
	let cant_presentacion = req.body.cantid_presentacion;

	try {
		// Verificar si el DUI ya existe en otro usuario
		const nombreExistente = await pool.query(
			'SELECT cod_presentacion FROM presentaciones WHERE detalle_presentacion = ? AND cod_presentacion != ?',
			[name_presentacion, cod_presentacion]
		);

		if (nombreExistente.length > 0) {
			// Ya existe otro usuario con ese DUI
			return res.json({ mensaje: 'El nombre ya esta registrado en otra presentación.' });
		}

		// Si no hay conflicto, actualizamos
		await pool.query(
			'UPDATE presentaciones SET detalle_presentacion = ?, cantidad_presentacion = ? WHERE cod_presentacion = ?',
			[name_presentacion, cant_presentacion, cod_presentacion]
		);

		res.json({ mensaje: 'Presentación actualizada con exito.' });
	} catch (error) {
		console.error('Error al editar usuario:', error);
		res.json({ mensaje: 'Error al editar usuario.' });
	}
});

// Ruta para eliminar presentación.
router.post('/eliminar_presentacion', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	const cod_presentacion = req.body.cod_presentacion;

	try {
		// Verificar si la presentación existe
		const rows = await pool.query('SELECT COUNT(*) AS total FROM presentaciones WHERE cod_presentacion = ?', [
			cod_presentacion,
		]);

		if (rows[0].total === 0) {
			return res.json({ mensaje: 'Presentación no encontrada.' });
		} else {
			// Eliminar la presentación
			await pool.query('DELETE FROM presentaciones WHERE cod_presentacion = ?', [cod_presentacion]);
			res.json({ mensaje: 'Presentación eliminada con exito.' });
		}
	} catch (error) {
		console.error('Error al eliminar la presentación:', error);
		res.json({ mensaje: 'Error al eliminar la presentación.' });
	}
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
