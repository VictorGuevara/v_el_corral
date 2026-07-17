/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const pool = require('../../database');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, authCiudad } = require('../../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

router.post('/', isLoggedIn, authCiudad(['Administrador', 'Contador']), async (req, res) => {
	const fecha_hora_a = () => {
		let date = new Date();
		let dia_actual = date.getDate();
		let mes_actual = date.getMonth() + 1;
		let anio_actual = date.getFullYear();
		let fecha = 0;
		let mes = 0;
		let dia = 0;

		// Validamos que la fecha sea legible con cero en el mes...
		if (dia_actual < 10) {
			dia = '0' + dia_actual;
		} else {
			dia = dia_actual;
		}

		// Validamos que el día sea legible con cero en el inicio...
		if (mes_actual < 10) {
			mes = '0' + mes_actual;
		} else {
			mes = mes_actual;
		}

		fecha = anio_actual + '-' + mes + '-' + dia;

		let hora_actual = date.getHours();
		let minutos_actual = date.getMinutes();
		let segundos_actual = date.getSeconds();
		let hora = 0;
		let hora_a = 0;
		let minutos = 0;
		let segundos = 0;

		// Validamos que la fecha sea legible con cero en el mes...
		if (hora_actual < 10) {
			hora_a = '0' + hora_actual;
		} else {
			hora_a = hora_actual;
		}

		// Validamos que la fecha sea legible con cero en el mes...
		if (minutos_actual < 10) {
			minutos = '0' + minutos_actual;
		} else {
			minutos = minutos_actual;
		}

		// Validamos que el día sea legible con cero en el inicio...
		if (segundos_actual < 10) {
			segundos = '0' + segundos_actual;
		} else {
			segundos = segundos_actual;
		}

		hora = hora_a + ':' + minutos + ':' + segundos;

		let fecha_Hora = fecha + ' ' + hora;

		return fecha_Hora;
	};

	let fecha = req.body.fecha;
	let fecha_b = '%' + req.body.fecha + '%';
	let anio = '%' + req.body.anio + '%';
	let user = req.body.user;

	// Función de conpilación...
	const compile = async (templateName, data) => {
		let html = await fs.readFileSync(
			path.join(__dirname, '../..') + '/public/reportes/plantillas/' + templateName + '.hbs',
			'utf8'
		);
		let render_htmlAndData = await hbs.compile(html)(data);
		return render_htmlAndData;
	};

	// Configuramos un if para poder comparar el datos de pago...
	hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
		return arg1 == arg2 ? options.fn(this) : options.inverse(this);
	});

	// Configuramos el formato de fecha.
	hbs.registerHelper('dateFormat', function (value, format) {
		return moment(value).format(format);
	});

	// Creamos una función asíncronica.
	(async function () {
		try {
			// Obetenemos los tados de la venta de la base de datos.
			let d_ventas_detalle = await new Promise((resolve, reject) => {
				pool.query('SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""))');
				pool.query(
					`
                        SELECT 
                            DISTINCT nofactura_ventas
                        FROM 
                            ventas 
                        WHERE 
                            fecha_registro LIKE ? AND 
                            YEAR(fecha_registro) LIKE ?
                    `,
					[fecha_b, anio],
					async (error, rows, fields) => {
						if (!error && rows.length > 0) {
							let a_montos = [];

							let filas_count = rows.length;
							let fila_obj = filas_count - 1;

							for (let i_filas = 0; i_filas < filas_count; i_filas++) {
								pool.query(
									`
										SELECT 
											SUM(DISTINCT subtotal_ventas) AS s_subtotal_ventas,
											SUM(DISTINCT descuento_ventas) AS s_descuento_ventas,
											SUM(DISTINCT total_ventas) AS s_total_ventas
										FROM 
											ventas 
										WHERE 
											nofactura_ventas = ?
									`,
									[rows[i_filas].nofactura_ventas],
									async (error, rows, fields) => {
										if (!error && rows.length > 0) {
											a_montos.push(rows[0]);
											resolve(a_montos);
										} else {
											a_montos = [];
											resolve(a_montos);
										}
									}
								);
							}
						} else {
							a_montos = [];
							resolve(a_montos);
						}
					}
				);
			});

			// Obetenemos los tados de la ventas de la base de datos.
			let d_ventas = await new Promise((resolve, reject) => {
				pool.query(
					`
                        SELECT 
                            id,
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
                            fecha_registro LIKE ? AND 
                            YEAR(fecha_registro) LIKE ?
                        GROUP BY nofactura_ventas  
                        ORDER BY fecha_registro ASC
                    `,
					[fecha_b, anio],
					async (error, rows, fields) => {
						console.log(rows);
						if (!error && rows.length > 0) {
							resolve(rows);
						} else {
							rows = [];
							resolve(rows);
						}
					}
				);
			}).then((data) => {
				return data;
			});

			let data_one = {
				montos: d_ventas_detalle,
			};

			// Variables para operacioens matematicas...
			let count_for_suma = data_one.montos.length;
			let a_suma_subtotales = [];
			let suma_subtotales = 0;
			let a_suma_descuentos = [];
			let suma_descuentos = 0;
			let suma_totales = 0;

			// Validamos.
			if (count_for_suma > 0) {
				for (let i = 0; i < count_for_suma; i++) {
					// Hacemos una operacion de agregar y sumar de subtotales...
					a_suma_subtotales.push(data_one.montos[i].s_subtotal_ventas);
					suma_subtotales = a_suma_subtotales.reduce((a, b) => a + b, 0);

					// Hacemos una operacion de agregar y sumar de subtotales...
					a_suma_descuentos.push(data_one.montos[i].s_descuento_ventas);
					suma_descuentos = a_suma_descuentos.reduce((a, b) => a + b, 0);

					// Hacemos operación para el total de dinero a entregar.
					suma_totales = suma_subtotales - suma_descuentos;
				}
			}

			// Cremaos el objeto que contiene los datos de la base de datos...
			let data = {
				data_fechas: [
					{
						fecha_cierre: fecha,
						fecha_creado: fecha_hora_a(),
						user_cierre: user,
					},
				],
				data_suma_montos: [
					{
						suma_monto_subtotal: suma_subtotales.toFixed(2),
						suma_monto_descuento: suma_descuentos.toFixed(2),
						suma_monto_total: suma_totales.toFixed(2),
					},
				],
				data_ventas_cvd: d_ventas,
			};

			// Iniciamos el navegador.
			const browser = await puppeteer.launch({
				headless: 'new',
			});
			const page = await browser.newPage(); // Cremaos una nueva pagina.

			// Compilamos los datos con la plantilla...
			const content = await compile('cierre_diario', data);
			await page.setContent(content);
			await page.emulateMediaType('screen');
			await page.pdf({
				path: './src/public/reportes/Cierre-De-Ventas-Diaria-Fecha-' + fecha + '.pdf',
				format: 'letter',
				printBackground: true,
				margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
			});

			// RESPUESTA DEL SERVIDOR.
			console.log('Finish to create a PDF document.');

			// Datos para que se descargue el archivo de recibos.
			let datos_post = {
				d: 'OKLCVDVEC',
				e: '/reportes/Cierre-De-Ventas-Diaria-Fecha-' + fecha + '.pdf',
				f: 'Cierre-De-Ventas-Diaria-Fecha-' + fecha + '.pdf',
			};

			// Enviamos el objeto de datos y cerramos el navegador...
			res.json(datos_post);
			await browser.close();
		} catch (error) {
			console.log(error);
		}
	})();
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
