/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                               IMPORTACIONES                                */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn, authCiudad } = require('../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                   RUTAS                                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Ruta de renderizar la vista de compras.
router.get('/', isLoggedIn, authCiudad('Administrador'), async (req, res) => {
	// Renderizamos la vista de compras...
	await res.render('admin/usuarios');
});

// Ruta para realizar acciones al registrar usuarios...
router.post('/regis_user', isLoggedIn, authCiudad('Administrador'), async (req, res, next) => {
	let noDui = req.body.num_dui;

	const newUserData = {
		username: req.body.nombre_usuario,
		password: req.body.clave_usuario,
		nombre_c: req.body.nombre_empleado,
		no_dui: req.body.num_dui,
		cargo: req.body.cargo_usuario,
		estado_cuenta: 'Activo',
		sucursal_user: req.body.sucursal_asignada,
	};

	newUserData.password = await helpers.encryptPassword(req.body.clave_usuario);
	await pool.query('SELECT * FROM users WHERE no_dui = ?', [noDui], async (error, rows, fields) => {
		if (!error && rows.length > 0) {
			res.json({ mensaje: 'Usuario registrado' });
		} else {
			const result = await pool.query('INSERT INTO users SET ?', [newUserData], (error, rows, fields) => {
				if (!error) {
					res.json({
						mensaje: 'Usuario guardado con exito.',
					});
				} else {
					// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
					console.log(error);
					res.json({ mensaje: error });
				}
			});
			newUserData.id = result.insertId;
		}
	});
});

// Ruta para listar las compras y notas de créditos pagados...
router.post('/list_usuarios', isLoggedIn, authCiudad(['Administrador']), async (req, res) => {
	const dato_busqueda = `%${req.body.nombre_empleado}%`;
	const pagina = parseInt(req.body.page);
	const limite = parseInt(req.body.limit);
	const desfase = (pagina - 1) * limite;

	try {
		let totalQuery = '';
		let dataQuery = '';
		let paramsTotal = [];
		let paramsData = [];

		if (req.body.nombre_empleado.trim() === '') {
			// Sin búsqueda
			totalQuery = `SELECT COUNT(*) AS total FROM users`;
			dataQuery = `SELECT * FROM users ORDER BY nombre_c ASC LIMIT ? OFFSET ?`;
			paramsData = [limite, desfase];
		} else {
			// Con búsqueda
			totalQuery = `SELECT COUNT(*) AS total FROM users WHERE nombre_c LIKE ?`;
			dataQuery = `SELECT * FROM users WHERE nombre_c LIKE ? ORDER BY nombre_c ASC LIMIT ? OFFSET ?`;
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
		console.error('Error al listar usuarios:', error);
		res.status(500).json({ error: 'Error al obtener usuarios' });
	}
});

// Ruta para llenar el formulario de usuario para editar los datos...
router.post('/cargar_usuario', isLoggedIn, authCiudad('Administrador'), async (req, res) => {
	let dato_busqueda = req.body.cod_user;
	await pool.query(`SELECT * FROM users WHERE cod_users = ?`, [dato_busqueda], async (error, rows, fields) => {
		res.json(rows);
	});
});

// Ruta para editar usuarios.
router.post('/edit_user', isLoggedIn, authCiudad('Administrador'), async (req, res, next) => {
	let cod_user = req.body.id_usuario;
	let name_user = req.body.nombre_usuario;
	let nombre_c = req.body.nombre_empleado;
	let dui_user = req.body.num_dui;
	let cargo_us = req.body.cargo_usuario;
	let estadoCt = req.body.estado_usuario;
	let sucursal_u = req.body.sucursal_asignada;

	try {
		// Verificar si el DUI ya existe en otro usuario
		const duiExistente = await pool.query('SELECT cod_users FROM users WHERE no_dui = ? AND cod_users != ?', [
			dui_user,
			cod_user,
		]);

		if (duiExistente.length > 0) {
			// Ya existe otro usuario con ese DUI
			return res.json({ mensaje: 'El número de DUI ya está registrado en otro usuario.' });
		}

		// Si no hay conflicto, actualizamos
		await pool.query(
			'UPDATE users SET username = ?, nombre_c = ?, no_dui = ?, cargo = ?, estado_cuenta = ?, sucursal_user = ? WHERE cod_users = ?',
			[name_user, nombre_c, dui_user, cargo_us, estadoCt, sucursal_u, cod_user]
		);

		res.json({ mensaje: 'Usuario editado con exito.' });
	} catch (error) {
		console.error('Error al editar usuario:', error);
		res.json({ mensaje: 'Error al editar usuario.' });
	}
});

// Ruta para eliminar usuarios.
router.post('/eliminar_usuario', isLoggedIn, authCiudad('Administrador'), async (req, res, next) => {
	let cod_user = req.body.cod_user;

	// Validamos.
	try {
		// Verificar si el usuario a eliminar es administrador
		const usuario = await pool.query('SELECT cargo FROM users WHERE cod_users = ?', [cod_user]);

		if (usuario.length === 0) {
			return res.json({ mensaje: 'Usuario no encontrado.' });
		}

		const cargo_usuario = usuario[0].cargo;

		if (cargo_usuario === 'Administrador') {
			// Contar cuántos administradores hay en total
			const admins = await pool.query('SELECT COUNT(*) AS total FROM users WHERE cargo = ?', ['Administrador']);

			if (admins[0].total <= 1) {
				return res.json({ mensaje: 'No se puede eliminar el último administrador.' });
			}
		}

		// Si no es el último administrador, se elimina
		await pool.query('DELETE FROM users WHERE cod_users = ?', [cod_user]);

		res.json({ mensaje: 'Usuario eliminado con exito.' });
	} catch (error) {
		console.error('Error al eliminar usuario:', error);
		res.json({ mensaje: 'Error al eliminar usuario.' });
	}
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                               EXPORTACIONES                                */
/*                                                                            */
/* -------------------------------------------------------------------------- */

module.exports = router;
