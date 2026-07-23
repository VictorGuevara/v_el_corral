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
router.get('/ventas', isLoggedIn, async (req, res) => {
	await res.render('inventario/ventas');
});

// Ruta de lista de ventas.
router.get('/lista_ventas', isLoggedIn, async (req, res) => {
	await res.render('inventario/lista_ventas');
});

// Ruta de clientes.
router.get('/clientes', isLoggedIn, async (req, res) => {
	await res.render('inventario/clientes');
});

// Ruta de proveedores.
router.get('/proveedores', isLoggedIn, async (req, res) => {
	await res.render('inventario/proveedores');
});

// Ruta de productos.
router.get('/productos', isLoggedIn, async (req, res) => {
	await res.render('inventario/productos');
});

// Ruta de compras.
router.get('/compras', isLoggedIn, async (req, res) => {
	await res.render('inventario/compras');
});

// Ruta de lista de compras.
router.get('/lista_compras', isLoggedIn, async (req, res) => {
	await res.render('inventario/lista_compras');
});

// Ruta de inventario.
router.get('/inventario', isLoggedIn, async (req, res) => {
	await res.render('inventario/inventario');
});

// Ruta de kardex.
router.get('/kardex', isLoggedIn, async (req, res) => {
	await res.render('inventario/kardex');
});

/* -------------------------------------------------------------------------- */
/*                                   CLIENTES                                 */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de clientes...
router.post('/count_clientes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_clientes FROM clientes', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_clientes: rows[0]['total_clientes'] });
		} else if (error == null) {
			res.json({ cant_clientes: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos los clientes...
router.post('/g_clientes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Obtenemos los datos enviados por el usuario.
	let cod_cliente = req.body.cod_cliente;
	let nom_cliente = req.body.nom_cliente;
	let tel_cliente = req.body.tel_cliente;
	let fna_cliente = req.body.fna_cliente;
	let fer_cliente = req.body.fecha_regis;
	let use_cliente = req.body.user_regist;

	// Creamos la consulta de validación.
	let c_sql_p = 'SELECT * FROM clientes WHERE (tel_cliente = ?)';

	// Ejecutamos las consultas SQL...
	await pool.query(c_sql_p, [tel_cliente], (error, rows, fields) => {
		if (!error && rows.length > 0) {
			res.json({ mensaje: 'Ya existe el cliente con los dados proporcionados...' });
		} else {
			// Si no existe errror, ejecutamos la consulta para guardar.
			pool.query(
				'INSERT INTO clientes (codigo_cliente, nombre_cliente, tel_cliente, fnac_cliente, fecha_registro, user_registro) VALUES (?, ?, ?, ?, ?, ?)',
				[cod_cliente, nom_cliente, tel_cliente, fna_cliente, fer_cliente, use_cliente],
				(error, rows, fields) => {
					if (!error) {
						// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
						res.json({ mensaje: 'Se guardo el cliente correctamente.' });
					} else {
						// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
						console.log(error);
						res.json({ mensaje: error });
					}
				}
			);
		}
	});
});

// Ruta para listar los clientes.
router.post('/clientes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let text = '%' + req.body.d_text + '%';

	await pool.query('SELECT * FROM clientes WHERE nombre_cliente LIKE ?', [text], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Ruta para editar clientes.
router.post('/eClientes', isLoggedIn, async (req, res, next) => {
	let cod_cliente = req.body.cod_cliente;
	let num_cliente = req.body.num_cliente;
	let tel_cliente = req.body.tel_cliente;
	let fna_cliente = req.body.fna_cliente;

	await pool.query(
		'UPDATE clientes SET nombre_cliente = ?, tel_cliente = ?, fnac_cliente = ? WHERE codigo_cliente = ?',
		[num_cliente, tel_cliente, fna_cliente, cod_cliente],
		(error, rows, fields) => {
			if (!error) {
				// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
				res.json({ mensaje: 'Cliente editado con exito.' });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
				res.json({ mensaje: error });
			}
		}
	);
});

// Ruta para eliminar clientes.
router.post('/dClientes', isLoggedIn, async (req, res, next) => {
	let cod_cliente = req.body.cod_cliente;

	await pool.query('DELETE FROM clientes WHERE codigo_cliente = ?', [cod_cliente], (error, rows, fields) => {
		if (!error) {
			// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
			res.json({ mensaje: 'Cliente eliminado con exito.' });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
			res.json({ mensaje: error });
		}
	});
});

/* -------------------------------------------------------------------------- */
/*                                 PROVEEDORES                                */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de proveedores...
router.post('/count_proveedores', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_proveedores FROM proveedores', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_proveedores: rows[0]['total_proveedores'] });
		} else if (error == null) {
			res.json({ cant_proveedores: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos los proveedores...
router.post('/g_proveedores', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Obtenemos los datos enviados por el usuario.
	let cod_proveedor = req.body.cod_proveedor;
	let nom_proveedor = req.body.nom_proveedor;
	let tel_proveedor = req.body.tel_proveedor;
	let dui_proveedor = req.body.dui_proveedor;
	let mar_proveedor = req.body.mar_proveedor;
	let fecha_regis = req.body.fecha_regis;
	let user_regist = req.body.user_regist;

	// Creamos la consulta de validación.
	let c_sql_p = 'SELECT * FROM proveedores WHERE (dui_proveedor = ?)';

	// Ejecutamos las consultas SQL...
	await pool.query(c_sql_p, [dui_proveedor], (error, rows, fields) => {
		if (!error && rows.length > 0) {
			res.json({ mensaje: 'Ya existe el proveedor con los dados proporcionados...' });
		} else {
			// Si no existe errror, ejecutamos la consulta para guardar.
			pool.query(
				'INSERT INTO proveedores (codigo_proveedor, nombre_proveedor, tel_proveedor, dui_proveedor, marca_proveedor, fecha_registro, user_registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[cod_proveedor, nom_proveedor, tel_proveedor, dui_proveedor, mar_proveedor, fecha_regis, user_regist],
				(error, rows, fields) => {
					if (!error) {
						// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
						res.json({ mensaje: 'Se guardo el proveedor correctamente.' });
					} else {
						// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
						console.log(error);
						res.json({ mensaje: error });
					}
				}
			);
		}
	});
});

// Ruta para listar los proveedores.
router.post('/proveedores', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let text = '%' + req.body.d_text + '%';

	await pool.query('SELECT * FROM proveedores WHERE nombre_proveedor LIKE ?', [text], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Ruta para editar proveedores.
router.post('/eProveedores', isLoggedIn, async (req, res, next) => {
	let codigo_edit = req.body.codigo_edit;
	let nombre_edit = req.body.nombre_edit;
	let telefono_edit = req.body.telefono_edit;
	let dui_edit = req.body.dui_edit;
	let marca_edit = req.body.marca_edit;

	await pool.query(
		'UPDATE proveedores SET nombre_proveedor = ?, tel_proveedor = ?, dui_proveedor = ?, marca_proveedor = ? WHERE codigo_proveedor = ?',
		[nombre_edit, telefono_edit, dui_edit, marca_edit, codigo_edit],
		(error, rows, fields) => {
			if (!error) {
				// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
				res.json({ mensaje: 'Proveedor editado con exito.' });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
				res.json({ mensaje: error });
			}
		}
	);
});

// Ruta para eliminar proveedores.
router.post('/dProveedor', isLoggedIn, async (req, res, next) => {
	let cod_proveedor = req.body.cod_cliente;

	await pool.query('DELETE FROM proveedores WHERE codigo_proveedor = ?', [cod_proveedor], (error, rows, fields) => {
		if (!error) {
			// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
			res.json({ mensaje: 'Proveedor eliminado con exito.' });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
			res.json({ mensaje: error });
		}
	});
});

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTOS                                 */
/* -------------------------------------------------------------------------- */

// Ruta para las marcas de los proveedores...
router.post('/list_marcas_proveedores', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT marca_proveedor FROM proveedores', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/count_productos', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_productos FROM productos', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_productos: rows[0]['total_productos'] });
		} else if (error == null) {
			res.json({ cant_productos: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos los productos...
router.post('/g_productos', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Obtenemos los datos enviados por el usuario.
	let cod_producto = req.body.cod_producto;
	let nom_producto = req.body.nom_producto;
	let des_producto = req.body.des_producto;
	let exl_producto = req.body.exl_producto;
	let exm_producto = req.body.exm_producto;
	let cat_producto = req.body.cat_producto;
	let pre_producto = req.body.pre_producto;
	let gan_producto = req.body.gan_producto;
	let mar_producto = req.body.mar_producto;
	let fecha_regis = req.body.fecha_regis;
	let user_regist = req.body.user_regist;

	// Creamos la consulta de validación.
	let c_sql_p = 'SELECT * FROM productos WHERE (codigo_producto = ? AND nombre_producto = ?)';

	// Ejecutamos las consultas SQL...
	await pool.query(c_sql_p, [cod_producto, nom_producto], (error, rows, fields) => {
		if (!error && rows.length > 0) {
			res.json({ mensaje: 'Ya existe el producto con los dados proporcionados...' });
		} else {
			// Si no existe errror, ejecutamos la consulta para guardar.
			pool.query(
				'INSERT INTO productos (codigo_producto, nombre_producto, descripcion_producto, existencia_total_lotes, existencia_minima, categoria_producto, precio_producto, margen_ganancia, marca_proveedor, fecha_registro, user_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					cod_producto,
					nom_producto,
					des_producto,
					exl_producto,
					exm_producto,
					cat_producto,
					pre_producto,
					gan_producto,
					mar_producto,
					fecha_regis,
					user_regist,
				],
				(error, rows, fields) => {
					if (!error) {
						// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
						res.json({ mensaje: 'Se guardo el producto correctamente.' });
					} else {
						// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
						console.log(error);
						res.json({ mensaje: error });
					}
				}
			);
		}
	});
});

// Ruta para listar todos los productos y servicios.
router.post('/productos', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let text = '%' + req.body.d_text + '%';

	await pool.query('SELECT * FROM productos WHERE nombre_producto LIKE ?', [text], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Ruta para listar los Servicios.
router.post('/productos_servicio', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let text = '%' + req.body.d_text + '%';

	await pool.query(
		'SELECT * FROM productos WHERE nombre_producto LIKE ? AND categoria_producto = ?',
		[text, 'servicio'],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Ruta para listar los productos diferentes a Mary Kay y Servicios.
router.post('/otros_productos_d_srv', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let text = '%' + req.body.d_text + '%';

	await pool.query(
		'SELECT * FROM productos WHERE nombre_producto LIKE ? AND categoria_producto = ?',
		[text, 'otros productos'],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Ruta para editar productos.
router.post('/eProductos', isLoggedIn, async (req, res, next) => {
	let codigo_edit = req.body.codigo_edit;
	let nom_prod_edit = req.body.nom_prod_edit;
	let des_prod_edit = req.body.des_prod_edit;
	let cat_prod_edit = req.body.cat_prod_edit;
	let pre_prod_edit = req.body.pre_prod_edit;
	let gan_prod_edit = req.body.gan_prod_edit;
	let mar_prod_edit = req.body.mar_prod_edit;
	let fecha_regis = req.body.fecha_regis;
	let user_regist = req.body.user_regist;

	await pool.query(
		`
			UPDATE productos 
			SET nombre_producto = ?, 
				descripcion_producto = ?, 
				categoria_producto = ?, 
				precio_producto = ?, 
				margen_ganancia = ?, 
				marca_proveedor = ? 
			WHERE codigo_producto = ?
		`,
		[nom_prod_edit, des_prod_edit, cat_prod_edit, gan_prod_edit, pre_prod_edit, mar_prod_edit, codigo_edit],
		(error, rows, fields) => {
			if (!error) {
				// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
				res.json({ mensaje: 'Producto editado con exito.' });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
				res.json({ mensaje: error });
			}
		}
	);
});

// Ruta para eliminar productos.
router.post('/dProductos', isLoggedIn, async (req, res, next) => {
	let cod_productos = req.body.cod_cliente;

	await pool.query('DELETE FROM productos WHERE codigo_producto = ?', [cod_productos], (error, rows, fields) => {
		if (!error) {
			// SI NO EXISTE ERROR, DEVOLVEMOS UN JSON CON LAS FILAS OPTENIDAS.
			res.json({ mensaje: 'Producto eliminado con exito.' });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
			res.json({ mensaje: error });
		}
	});
});

/* -------------------------------------------------------------------------- */
/*                                   INVENTARIO                                 */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de inventarios...
router.post('/count_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_inventario FROM inventario', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_inventario: rows[0]['total_inventario'] });
		} else if (error == null) {
			res.json({ cant_inventario: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos el registro de existencias de productos en la tabla inventarios...
router.post('/existenciaLotes_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let c__p = req.body.cod_p;

	await pool.query(
		'SELECT SUM(existenciaslote_inventario) AS existencias_lotes FROM inventario WHERE codproducto_inventario = ?',
		[c__p],
		(error, rows, fields) => {
			if (!error && rows[0]['existencias_lotes'] != null) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ dato_existencias: rows[0]['existencias_lotes'] });
			} else {
				res.json({ dato_existencias: 0 });
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el número de lote del producto para crear uno nuevo en la tabla de inventario...
router.post('/numeroLotes_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let c__p = req.body.codigo_p;

	await pool.query(
		'SELECT numlote_inventario FROM inventario WHERE fecha_registro = (SELECT MAX(fecha_registro) FROM inventario WHERE codproducto_inventario = ?) AND codproducto_inventario = ?',
		[c__p, c__p],
		(error, rows, fields) => {
			if (!error && rows.length > 0) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ numero_lote: rows[0]['numlote_inventario'] });
			} else {
				res.json({ numero_lote: 0 });
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen en la tabla de inventario...
router.post('/list_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreP = req.body.d_text;

	if (nombreP != '') {
		nombreP = '%' + nombreP + '%';
	} else {
		nombreP = '%a%';
	}

	await pool.query(
		'SELECT * FROM inventario WHERE (tipoproducto_inventario <> "Servicio") AND nombreproducto_inventario LIKE ? LIMIT 25',
		[nombreP],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el registro de existencias de productos por lotes en la tabla inventarios...
router.post(
	'/existencia_total_lotes_inventario',
	isLoggedIn,
	authCiudad(['Administrador', 'Asistente']),
	async (req, res) => {
		let c__p = req.body.codigo_p;

		await pool.query(
			`
			SELECT 
				SUM(existenciaslote_inventario) AS exitencia_total, 
				codproducto_inventario
			FROM 
				inventario 
			WHERE 
				codproducto_inventario = ?
		`,
			[c__p],
			(error, rows, fields) => {
				if (!error && rows[0]['exitencia_total'] != null) {
					console.log(rows[0]['exitencia_total']);
					// Si no existe error, devolvemos la cantidad del contador.
					res.json({ existencias: rows[0]['exitencia_total'], codigo_producto: rows[0]['codproducto_inventario'] });
				} else {
					res.json({ existencias: 0, codigo_producto: 0 });
					// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
					console.log(error);
				}
			}
		);
	}
);

// Consultamos el registro de existencias de productos por lotes en la tabla inventarios...
router.post('/existencia_lote_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let c__p = req.body.codigo_p;

	await pool.query(
		`
			SELECT 
				fechahoralote_inventario, 
				existenciaslote_inventario, 
				nombreproducto_inventario, 
				codproducto_inventario,
				numlote_inventario
			FROM 
				inventario 
			WHERE 
				fechahoralote_inventario = (
					SELECT 
						MIN(fechahoralote_inventario) 
					FROM 
						inventario 
					WHERE 
						existenciaslote_inventario > 0 AND 
						codproducto_inventario = ?
					) AND 
				codproducto_inventario = ?
		`,
		[c__p, c__p],
		(error, rows, fields) => {
			if (!error && rows[0]['existenciaslote_inventario'] != null) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({
					dato_existencias: rows[0]['existenciaslote_inventario'],
					codigo_producto: rows[0]['codproducto_inventario'],
					no_lote_invetario: rows[0]['numlote_inventario'],
				});
			} else {
				res.json({ dato_existencias: 0, codigo_producto: 0 });
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el registro de existencias de productos por lotes en la tabla inventarios...
router.post('/update_existencias_lotes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let c_p_existencia_p = req.body.cod_producto;
	let n_c_existencia_p = req.body.new_cantidad;
	let n_l_existencia_p = req.body.num_loteInve;

	await pool.query(
		'UPDATE inventario SET existenciaslote_inventario = ? WHERE codproducto_inventario = ? AND numlote_inventario = ?',
		[n_c_existencia_p, c_p_existencia_p, n_l_existencia_p],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ mensaje: 'Se actualizo la existencia de lote' });
			} else {
				res.json({ mensaje: 'Error, no se actualizo' });
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el registro de existencias de productos por lotes en la tabla inventarios...
router.post(
	'/update_existencias_totales_productos',
	isLoggedIn,
	authCiudad(['Administrador', 'Asistente']),
	async (req, res) => {
		let c_p_existencia_p = req.body.cod_producto;
		let n_c_existencia_p = req.body.new_cantidad;

		await pool.query(
			'UPDATE productos SET existencia_total_lotes = ? WHERE codigo_producto = ?',
			[n_c_existencia_p, c_p_existencia_p],
			(error, rows, fields) => {
				if (!error) {
					// Si no existe error, devolvemos la cantidad del contador.
					res.json({ mensaje: 'Se actualizo la existencia de producto' });
				} else {
					res.json({ mensaje: 'Error, no se actualizo' });
					// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
					console.log(error);
				}
			}
		);
	}
);

/* -------------------------------------------------------------------------- */
/*                                    kARDEX                                  */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de kardex...
router.post('/count_kardex', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_kardex FROM kardex', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_kardex: rows[0]['total_kardex'] });
		} else if (error == null) {
			res.json({ cant_kardex: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos el número de lote del producto para crear uno nuevo en la tabla de inventario...
router.post('/existencias_inventario', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let c__p = req.body.codigo_p;

	await pool.query(
		'SELECT existencia_cantidad, existencia_valor_total FROM Kardex WHERE fechahora_movimiento = (SELECT MAX(fechahora_movimiento) FROM Kardex WHERE codigo_producto = ?) AND codigo_producto = ?',
		[c__p, c__p],
		(error, rows, fields) => {
			if (!error && rows.length > 0) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({
					cant_existencias: rows[0]['existencia_cantidad'],
					valor_existencias: rows[0]['existencia_valor_total'],
				});
			} else {
				res.json({ cant_existencias: 0, valor_existencias: 0 });
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen en la tabla de kardex...
router.post('/list_kardex', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let { d_text, f_inicial, f_final } = req.body;

	// Preparamos el texto de búsqueda
	let nombreP = d_text !== '' ? `%${d_text}%` : '%a%';

	// Si no hay fechas, usamos un rango amplio
	if (!f_inicial) f_inicial = '2000-01-01';
	if (!f_final) f_final = '2100-12-31';

	const sql = `
	    SELECT * 
	    FROM kardex 
	    WHERE nombre_producto LIKE ? 
	      AND DATE(fechahora_movimiento) BETWEEN ? AND ?
	    ORDER BY fechahora_movimiento 
	    LIMIT 25
	`;

	await pool.query(sql, [nombreP, f_inicial, f_final], (error, rows) => {
		if (!error) {
			res.json({ rows });
		} else {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al listar kardex' });
		}
	});
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/list_productos_kardex', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreP = req.body.nombreP;

	if (nombreP != '') {
		nombreP = '%' + req.body.nombreP + '%';
	} else {
		nombreP = '%a%';
	}

	await pool.query(
		'SELECT * FROM productos WHERE nombre_producto LIKE ? LIMIT 25',
		[nombreP],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

/* -------------------------------------------------------------------------- */
/*                                   COMPRAS                                  */
/* -------------------------------------------------------------------------- */

// Ruta para las nombres de los proveedores...
router.post('/list_proveedores_compras', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT nombre_proveedor FROM proveedores', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Ruta para las nombres de los proveedores...
router.post('/cod_proveedor_compra', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	const nompre_proveedor = req.body.nompre_proveedor;

	await pool.query(
		'SELECT codigo_proveedor FROM proveedores WHERE nombre_proveedor = ?',
		[nompre_proveedor],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/list_f_productos', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreP = req.body.nombreP;

	if (nombreP != '') {
		nombreP = '%' + req.body.nombreP + '%';
	} else {
		nombreP = '%a%';
	}

	await pool.query(
		'SELECT * FROM productos WHERE (categoria_producto <> "Servicio") AND nombre_producto LIKE ? LIMIT 25',
		[nombreP],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el registro en la tabla de productos...
router.post('/ll_f_productos', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let n__p = req.body.nombre_p;

	await pool.query(
		'SELECT * FROM productos WHERE (categoria_producto <> "Servicio") AND nombre_producto = ? LIMIT 25',
		[n__p],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen en la tabla de compras...
router.post('/count_compras', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_compras FROM compras', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_compras: rows[0]['total_compras'] });
		} else if (error == null) {
			res.json({ cant_compras: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos la compra...
router.post('/g_compras', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Guardamos en una variable todo el req.body que es el array de datos
	let filas_compras = req.body;

	let cod_compra = req.body[0][0];
	let no_factura = req.body[0][1];

	// Hacemos una validación del número de paquete para que no se repita...
	await pool.query(
		`SELECT codigo_compras FROM compras WHERE (codigo_compras = ?)`,
		[cod_compra],
		async (error, rows, fields) => {
			// Validamos:
			if (!error && rows.length > 0) {
				res.json({ mensaje: 'Ya existe el codigo o numero de factura para la compra...' });
			} else {
				// Ejecutamos la consulta para guardar la encomienda...
				await pool.query(
					`
					INSERT INTO compras (
						codigo_compras,
						nofactura_compras,
						codproveedor_compras,
						nombreproveedor_compras,
						tipo_compras,
						periodopago_compras,
						cuotas_pago_compras,
						fechainiciopago_compras,
						estatus_pago_compras,
						codigo_producto_compras,
						nombre_producto_compras,
						vUnit_producto_compras,
						tipo_producto_compras,
						marca_producto_compras,
						cant_producto_compras,
						subt_producto_compras,
						cant_total_p_lotes,
						subtotal_compras,
						descuento_compras,
						total_compras,
						observaciones_compras,
						fecha_registro,
						user_registro
					) VALUES ?
				`,
					[filas_compras[0]],
					async (error, rows, fields) => {
						if (!error) {
							await pool.query(
								`
								INSERT INTO inventario (
									codigo_inventario,
									codigo_compra,
									fechahoralote_inventario,
									existenciaslote_inventario,
									numlote_inventario,
									codproducto_inventario,
									nombreproducto_inventario,
									tipoproducto_inventario,
									marcaproducto_inventario,
									fecha_registro,
									user_registro									
								) VALUES ?
							`,
								[filas_compras[1]],
								async (error, rows, fields) => {
									if (!error) {
										await pool.query(
											`
											INSERT INTO kardex (
												codigo_kardex,
												codigo_producto,
												nombre_producto,
												exitencia_minima,
												fecha_movimiento,
												fechahora_movimiento,
												detalle_kardex,
												entrada_cantidad,
												entrada_valor_unitario,
												entrada_valor_total,
												salida_cantidad,
												salida_valor_unitario,
												salida_valor_total,
												existencia_cantidad,
												existencia_valor_unitario,
												existencia_valor_total
											) VALUES ?
										`,
											[filas_compras[2]],
											(error, rows, fields) => {
												if (!error) {
													// Si no existe error, devolvemos la cantidad del contador.
													res.json({ mensaje: 'Compra guardada con exito.' });
												} else {
													// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
													console.log(error);
												}
											}
										);
									} else {
										// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
										console.log(error);
									}
								}
							);
						} else {
							// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
							console.log(error);
						}
					}
				);
			}
		}
	);
});

// Consultamos los registros de las compras...
router.post('/list_compras_vec', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _text_i = '%' + req.body.iS_text + '%';

	await pool.query(
		`
			SELECT 
				codigo_compras, 
				nofactura_compras, 
				codproveedor_compras, 
				nombreproveedor_compras, 
				tipo_compras, 
				periodopago_compras, 
				cuotas_pago_compras, 
				fechainiciopago_compras, 
				estatus_pago_compras, 
				codigo_producto_compras, 
				nombre_producto_compras, 
				vUnit_producto_compras, 
				tipo_producto_compras, 
				marca_producto_compras, 
				cant_producto_compras, 
				subt_producto_compras, 
				cant_total_p_lotes, 
				subtotal_compras, 
				descuento_compras, 
				total_compras, 
				observaciones_compras, 
				fecha_registro, 
				user_registro
			FROM 
				compras
			WHERE 
				(nombre_producto_compras LIKE ? OR nombreproveedor_compras LIKE ?)
			GROUP BY 
				nofactura_compras
			ORDER BY 
				fecha_registro DESC 
			LIMIT 10 
		`,
		[_text_i, _text_i],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ filas_compras: rows, count_filas_compras: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos los registros de la división de las compras..
router.post('/l_compras_noFactura', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _n_rastreo = req.body.noFactura_compra_vec;

	await pool.query(
		'SELECT DISTINCT nofactura_compras FROM compras WHERE nofactura_compras = ?',
		[_n_rastreo],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ npq: rows, npq_count: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos los registros de los productos de las compras..
router.post('/l_compras_noFacturaDetalle', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _n_factura = req.body.noFactura_compra_vec;

	await pool.query(
		'SELECT cant_producto_compras, nombre_producto_compras, vUnit_producto_compras, tipo_producto_compras, marca_producto_compras, subtotal_compras FROM compras WHERE nofactura_compras = ?',
		[_n_factura],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ pq_d: rows, npq_d_count: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

/* -------------------------------------------------------------------------- */
/*                                   CREDITOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   SALDOS                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   VENTAS                                 */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/list_clientes_ventas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreC = req.body.nombreC;

	if (nombreC != '') {
		nombreC = '%' + req.body.nombreC + '%';
	} else {
		nombreC = '%a%';
	}

	await pool.query('SELECT * FROM clientes WHERE nombre_cliente LIKE ? LIMIT 25', [nombreC], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/ll_clientes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreC = req.body.nombre_cliente;

	if (nombreC != '') {
		nombreC = '%' + nombreC + '%';
	} else {
		nombreC = '%a%';
	}

	await pool.query('SELECT * FROM clientes WHERE nombre_cliente LIKE ? LIMIT 25', [nombreC], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen en la tabla de productos...
router.post('/list_f_productos_ventas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let nombreP = req.body.nombreP;

	if (nombreP != '') {
		nombreP = '%' + req.body.nombreP + '%';
	} else {
		nombreP = '%a%';
	}

	await pool.query(
		'SELECT * FROM productos WHERE nombre_producto LIKE ? LIMIT 25',
		[nombreP],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ rows });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos el registro en la tabla de productos...
router.post('/ll_f_productos_ventas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let n__p = req.body.nombre_p;

	await pool.query('SELECT * FROM productos WHERE nombre_producto = ? LIMIT 25', [n__p], (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ rows });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen en la tabla de ventas...
router.post('/count_ventas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_ventas FROM ventas', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_ventas: rows[0]['total_ventas'] });
		} else if (error == null) {
			res.json({ cant_ventas: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Guardamos la venta...
router.post('/g_venta', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Guardamos en una variable todo el req.body que es el array de datos
	let filas_ventas = req.body;

	let cod_venta = req.body[0][0];
	let no_factura = req.body[0][1];

	// Hacemos una validación del número de paquete para que no se repita...
	await pool.query(
		`SELECT codigo_ventas FROM compras WHERE (codigo_ventas = ?)`,
		[cod_venta],
		async (error, rows, fields) => {
			// Validamos:
			if (!error && rows.length > 0) {
				res.json({ mensaje: 'Ya existe el codigo o numero de factura para la venta...' });
			} else {
				// Ejecutamos la consulta para guardar la encomienda...
				await pool.query(
					`
					INSERT INTO ventas (
						codigo_ventas,
						nofactura_ventas,
						codcliente_ventas,
						nombrecliente_ventas,
						telcliente_ventas,
						codigo_producto_ventas,
						nombre_producto_ventas,
						vUnit_producto_ventas,
						tipo_producto_ventas,
						marca_producto_ventas,
						cant_producto_ventas,
						subt_producto_ventas,
						subtotal_ventas,
						descuento_ventas,
						total_ventas,
						fecha_registro,
						user_registro
					) VALUES ?
				`,
					[filas_ventas[0]],
					async (error, rows, fields) => {
						if (filas_ventas[1].length > 0) {
							if (!error) {
								await pool.query(
									`
								INSERT INTO kardex (
									codigo_kardex,
									codigo_producto,
									nombre_producto,
									exitencia_minima,
									fecha_movimiento,
									fechahora_movimiento,
									detalle_kardex,
									entrada_cantidad,
									entrada_valor_unitario,
									entrada_valor_total,
									salida_cantidad,
									salida_valor_unitario,
									salida_valor_total,
									existencia_cantidad,
									existencia_valor_unitario,
									existencia_valor_total
								) VALUES ?
							`,
									[filas_ventas[1]],
									(error, rows, fields) => {
										if (!error) {
											// Si no existe error, devolvemos la cantidad del contador.
											res.json({ mensaje: 'Venta guardada con exito.' });
										} else {
											// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
											console.log(error);
										}
									}
								);
							} else {
								// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
								console.log(error);
							}
						} else {
							res.json({ mensaje: 'Venta guardada con exito.' });
						}
					}
				);
			}
		}
	);
});

// Consultamos los registros de las ventas...
router.post('/list_ventas_vec', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _text_i = '%' + req.body.iS_text + '%';

	await pool.query(
		`
			SELECT 
				codigo_ventas, 
				nofactura_ventas, 
				codcliente_ventas, 
				nombrecliente_ventas, 
				telcliente_ventas, 
				codigo_producto_ventas, 
				nombre_producto_ventas, 
				vUnit_producto_ventas, 
				tipo_producto_ventas, 
				marca_producto_ventas, 
				cant_producto_ventas, 
				subt_producto_ventas,  
				subtotal_ventas, 
				descuento_ventas, 
				total_ventas, 
				fecha_registro, 
				user_registro
			FROM 
				ventas
			WHERE 
				(nombre_producto_ventas LIKE ? OR nombrecliente_ventas LIKE ?)
			GROUP BY 
				nofactura_ventas
			ORDER BY 
				fecha_registro DESC 
			LIMIT 10 
		`,
		[_text_i, _text_i],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ filas_ventas: rows, count_filas_ventas: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos los registros de la división de las ventas..
router.post('/l_ventas_noFactura', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _n_rastreo = req.body.noFactura_venta_vec;

	await pool.query(
		'SELECT DISTINCT nofactura_ventas FROM ventas WHERE nofactura_ventas = ?',
		[_n_rastreo],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ npq: rows, npq_count: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos los registros de los productos de las vetnas..
router.post('/l_ventas_noFacturaDetalle', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let _n_factura = req.body.noFactura_venta_vec;

	await pool.query(
		'SELECT cant_producto_ventas, nombre_producto_ventas, vUnit_producto_ventas, tipo_producto_ventas, marca_producto_ventas, subt_producto_ventas FROM ventas WHERE nofactura_ventas = ?',
		[_n_factura],
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ pq_d: rows, npq_d_count: rows.length });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

/* -------------------------------------------------------------------------- */
/*                                   PROFILES                                 */
/* -------------------------------------------------------------------------- */

// Consultamos cuantos regitros existen de ventas por meses...
router.post('/count_ventas_vec_meses', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	let last_anio__c = req.body.n_anioc - 1;
	let _anio__c = req.body.n_anioc;
	let last_year = await pool.query(
		'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m, MONTH(fecha_registro) AS mes_id FROM ventas WHERE YEAR(fecha_registro) = ' +
			last_anio__c +
			' GROUP BY MONTH(fecha_registro)'
	);
	let current_year = await pool.query(
		'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m, MONTH(fecha_registro) AS mes_id FROM ventas WHERE YEAR(fecha_registro) = ' +
			_anio__c +
			' GROUP BY MONTH(fecha_registro)'
	);

	await res.json({ total_ventasVec_m_last_year: last_year, total_ventasVec_m_current_year: current_year });
});

// Consultamos cuantos regitros existen de ventas por meses...
router.post(
	'/count_ventas_vec_todos_meses',
	isLoggedIn,
	authCiudad(['Administrador', 'Asistente']),
	async (req, res) => {
		let last_anio__c = req.body.n_anioc - 1;
		let _anio__c = req.body.n_anioc;
		// Años anteriores...
		const month01_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 01 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month02_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 02 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month03_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 03 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month04_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 04 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month05_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 05 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month06_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 06 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month07_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 07 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month08_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 08 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month09_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 09 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month10_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 10 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month11_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 11 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);
		const month12_last_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 12 AND YEAR(fecha_registro) = ' +
				last_anio__c
		);

		// Años actuales...
		const month01_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 01 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month02_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 02 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month03_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 03 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month04_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 04 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month05_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 05 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month06_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 06 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month07_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 07 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month08_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 08 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month09_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 09 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month10_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 10 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month11_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 11 AND YEAR(fecha_registro) = ' +
				_anio__c
		);
		const month12_current_year = await pool.query(
			'SELECT COUNT(DISTINCT nofactura_ventas) AS count_ventas_m FROM ventas WHERE MONTH(fecha_registro) = 12 AND YEAR(fecha_registro) = ' +
				_anio__c
		);

		// Creamos los array de los meses...
		let meses_anteriores = [
			month01_last_year,
			month02_last_year,
			month03_last_year,
			month04_last_year,
			month05_last_year,
			month06_last_year,
			month07_last_year,
			month08_last_year,
			month09_last_year,
			month10_last_year,
			month11_last_year,
			month12_last_year,
		];
		let meses_actuales = [
			month01_current_year,
			month02_current_year,
			month03_current_year,
			month04_current_year,
			month05_current_year,
			month06_current_year,
			month07_current_year,
			month08_current_year,
			month09_current_year,
			month10_current_year,
			month11_current_year,
			month12_current_year,
		];

		await res.json({ total_ventasVec_m_last_year: meses_anteriores, total_ventasVec_m_current_year: meses_actuales });
	}
);

// Consultamos cuantos regitros existen como usuarios administradores...
router.post('/count_administradores', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_admin FROM users WHERE cargo = "Administrador"', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_admin: rows[0]['total_admin'] });
		} else if (error == null) {
			res.json({ cant_admin: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen como usuarios asistentes...
router.post('/count_asitentes', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(*) AS total_asis FROM users WHERE cargo = "Asistente"', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_asis: rows[0]['total_asis'] });
		} else if (error == null) {
			res.json({ cant_asis: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen de servicios...
router.post('/count_servicios', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query(
		'SELECT COUNT(*) AS total_servicios FROM productos WHERE categoria_producto = "servicio"',
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ cant_servicios: rows[0]['total_servicios'] });
			} else if (error == null) {
				res.json({ cant_servicios: 0 });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen  de citas...
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

// Consultamos cuantos regitros existen de compras...
router.post('/count_inventario_no_cero', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query(
		'SELECT COUNT(numlote_inventario) AS total_inventario FROM inventario WHERE existenciaslote_inventario <> 0',
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ cant_inventario: rows[0]['total_inventario'] });
			} else if (error == null) {
				res.json({ cant_inventario: 0 });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

// Consultamos cuantos regitros existen de ventas...
router.post('/dash_count_ventas', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query('SELECT COUNT(DISTINCT nofactura_ventas) AS total_ventas FROM ventas', (error, rows, fields) => {
		if (!error) {
			// Si no existe error, devolvemos la cantidad del contador.
			res.json({ cant_ventas: rows[0]['total_ventas'] });
		} else if (error == null) {
			res.json({ cant_ventas: 0 });
		} else {
			// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
			console.log(error);
		}
	});
});

// Consultamos cuantos regitros existen de productos con cantidad minima...
router.post('/count_productos_min', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	await pool.query(
		'SELECT * FROM productos WHERE existencia_total_lotes <= existencia_minima AND categoria_producto <> "servicio"',
		(error, rows, fields) => {
			if (!error) {
				// Si no existe error, devolvemos la cantidad del contador.
				res.json({ cant_productos_min: rows.length });
			} else if (error == null) {
				res.json({ cant_productos_min: 0 });
			} else {
				// SI EXISTE UN ERROR, MOSTRAMOS EL ERROR POR CONSOLA.
				console.log(error);
			}
		}
	);
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                                                            */
/*                               EXPORTACIONES                                */
/*                                                                            */
/*                                                                            */
/* -------------------------------------------------------------------------- */
module.exports = router;
