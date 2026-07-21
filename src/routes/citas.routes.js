/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                                                            */
/*                               IMPORTACIONES                                */
/*                                                                            */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                                                            */
/*                                   RUTAS                                    */
/*                                                                            */
/*                                                                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               RUTAS DE VISTAS                              */
/* -------------------------------------------------------------------------- */

// Ruta de ventas.
router.get('/', isLoggedIn, async (req, res) => {
	await res.render('admin/calendario');
});

/* -------------------------------------------------------------------------- */
/*                                   PROFILES                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    CITAS                                   */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de citas...
router.post('/count_citas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_citas FROM citas', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_citas: rows[0]['total_citas'] });
		} else if (error == null) {
			res.json({ cant_citas: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos las citas y opcionalmente en expediente_historial
// Guardamos las citas y opcionalmente en expediente_historial
// Guardamos las citas, historial y notificación
router.post('/g_citas', (req, res) => {
	const {
		cod_cita,
		dia_cita,
		mes_cita,
		anio_cita,
		ncl_cita,
		hora_inicio,
		hora_fin,
		fecha_regis,
		user_regist,
		tipo_evento,
		descripcion,
		id_expediente,
		telefono_cliente, // nuevo campo en el formulario
	} = req.body;

	pool.getConnection((err, conn) => {
		if (err) {
			console.error('Error al obtener conexión:', err);
			return res.status(500).json({ mensaje: 'Error de conexión' });
		}

		conn.beginTransaction((err) => {
			if (err) {
				conn.release();
				return res.status(500).json({ mensaje: 'Error al iniciar transacción' });
			}

			// 1. Insertar en citas
			conn.query(
				`INSERT INTO citas 
         (codigo_citas, dia_cita, mes_cita, anio_cita, nombre_cliente, hora_inicio, hora_fin, fecha_registro, user_registro) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[cod_cita, dia_cita, mes_cita, anio_cita, ncl_cita, hora_inicio, hora_fin, fecha_regis, user_regist],
				(err, result) => {
					if (err) {
						return conn.rollback(() => {
							conn.release();
							console.error('Error al guardar cita:', err);
							res.status(500).json({ mensaje: 'Error al guardar cita', error: err.message });
						});
					}

					// 2. Insertar en expediente_historial si corresponde
					const insertHistorial = (callback) => {
						if (id_expediente && tipo_evento && tipo_evento !== 'simple') {
							conn.query(
								`INSERT INTO expediente_historial 
                 (id_expediente, codigo_cita, tipo_evento, descripcion, fecha_evento, user_registro) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
								[id_expediente, cod_cita, tipo_evento, descripcion, fecha_regis, user_regist],
								(err2) => {
									if (err2) {
										return conn.rollback(() => {
											conn.release();
											console.error('Error al guardar historial:', err2);
											res.status(500).json({ mensaje: 'Error al guardar historial', error: err2.message });
										});
									}
									callback();
								}
							);
						} else {
							callback();
						}
					};

					// 3. Insertar en notificaciones
					insertHistorial(() => {
						conn.query(
							`INSERT INTO notificaciones 
               (id_cita, telefono_cliente, mensaje, fecha_programada, user_registro) 
               VALUES (?, ?, ?, ?, ?)`,
							[
								result.insertId, // id_cita recién creado
								telefono_cliente,
								`Hola ${ncl_cita}, le recordamos su cita el ${dia_cita}/${mes_cita}/${anio_cita} a las ${hora_inicio}.`,
								fecha_regis,
								user_regist,
							],
							(err3) => {
								if (err3) {
									return conn.rollback(() => {
										conn.release();
										console.error('Error al guardar notificación:', err3);
										res.status(500).json({ mensaje: 'Error al guardar notificación', error: err3.message });
									});
								}

								// Commit final
								conn.commit((errCommit) => {
									conn.release();
									if (errCommit) {
										console.error('Error al hacer commit:', errCommit);
										return res.status(500).json({ mensaje: 'Error al confirmar transacción' });
									}
									res.json({ mensaje: 'Se guardó la cita correctamente.' });
								});
							}
						);
					});
				}
			);
		});
	});
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/citas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let dia_cita = req.body.dia_cita;
	let mes_cita = req.body.mes_cita;
	let anio_cita = req.body.anio_cita;
	let array_one = [];
	let array_tow = [];
	let filas_one = 0;
	let filas_tow = 0;
	let filas_tree = 0;

	await pool.query(
		'SELECT codigo_citas, dia_cita, mes_cita, anio_cita FROM citas WHERE dia_cita = ? AND mes_cita = ? AND anio_cita = ?',
		[dia_cita, mes_cita, anio_cita],
		async (error, rows) => {
			if (!error && rows.length > 0) {
				const filas_one = rows;
				const count = rows.length;

				await pool.query(
					'SELECT nombre_cliente, hora_inicio, hora_fin FROM citas WHERE dia_cita = ? AND mes_cita = ? AND anio_cita = ?',
					[dia_cita, mes_cita, anio_cita],
					(error, rows) => {
						if (!error) {
							let array_tow = [];
							for (let index = 0; index < count; index++) {
								filas_tow = {
									title: rows[index].nombre_cliente,
									hora_inicio: rows[index].hora_inicio,
									hora_fin: rows[index].hora_fin,
								};

								array_tow.push(filas_tow);
							}

							let filas_tree = {
								cod_cita: filas_one[0].codigo_citas,
								day: filas_one[0].dia_cita,
								month: filas_one[0].mes_cita,
								year: filas_one[0].anio_cita,
								events: array_tow,
							};

							res.json({ array_one: [filas_tree] });
						} else {
							console.log(error);
						}
					}
				);
			}
		}
	);
});

// Ruta para eliminar citas.
router.delete('/delete_cita', isLoggedIn, async (req, res, next) => {
	let cod_cita = req.body.cod_cita;
	let dia = req.body.dia;
	let mes = req.body.mes;
	let anio = req.body.anio;

	await pool.query(
		'DELETE FROM citas WHERE codigo_citas = ? AND dia_cita = ? AND mes_cita = ? AND anio_cita = ?',
		[cod_cita, dia, mes, anio],
		(error) => {
			if (!error) {
				res.json({ mensaje: 'Cita eliminada con exito.' });
			} else {
				console.log(error);
				res.json({ mensaje: error });
			}
		}
	);
});

// Buscar expediente por DUI
router.post('/buscar_expediente', async (req, res) => {
	try {
		const { dui } = req.body;
		if (!dui) return res.status(400).json({ error: 'DUI requerido' });

		const rows = await pool.query(
			'SELECT id_expediente, telefono FROM expediente e JOIN propietarios p ON e.id_propietario = p.id WHERE e.dui = ?',
			[dui]
		);

		if (rows.length > 0) {
			res.json({ id_expediente: rows[0].id_expediente, telefono: rows[0].telefono });
		} else {
			res.json({ id_expediente: null, telefono: null });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al buscar expediente' });
	}
});

/* -------------------------------------------------------------------------- */
/*                                   VENTAS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   CREDITOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   SALDOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   INVENTARIO                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    kARDEX                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   USUARIOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                                                            */
/*                               EXPORTACIONES                                */
/*                                                                            */
/*                                                                            */
/* -------------------------------------------------------------------------- */
module.exports = router;
