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

router.post('/', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
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

	const fecha_hora_a_i = (fecha_dada) => {
		let date = new Date(fecha_dada);
		let dia_actual = date.getDate() + 1;
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
		let hora = '00:00:01';
		let fecha_Hora = fecha + ' ' + hora;

		return fecha_Hora;
	};

	const fecha_hora_a_f = (fecha_dada) => {
		let date = new Date(fecha_dada);
		let dia_actual = date.getDate() + 1;
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

		let hora = '23:59:59';
		let fecha_Hora = fecha + ' ' + hora;

		return fecha_Hora;
	};

	let fecha = req.body.fecha;
	let f_i = req.body.fecha_i;
	let f_f = req.body.fecha_f;
	let fecha_i = fecha_hora_a_i(f_i);
	let fecha_f = fecha_hora_a_f(f_f);
	let userCreador = req.body.user;

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
			let d_ventas = await new Promise((resolve, reject) => {
				pool.query('SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""))');
				pool.query(
					`
                        SELECT
							DISTINCT codigo_ventas
                        FROM
							ventas
                        WHERE (fecha_registro BETWEEN ? AND ?)
                        ORDER BY fecha_registro ASC
                    `,
					[fecha_i, fecha_f],
					async (error, rows, fields) => {
						let array_one = [];
						let count_for = rows.length;

						for (let index = 0; index < count_for; index++) {
							let codigoCompras = rows[index].codigo_ventas;
							pool.query(
								`
									SELECT 
										*
									FROM 
										ventas 
									WHERE 
                                        codigo_ventas = ? AND 
										(fecha_registro BETWEEN ? AND ?)
									ORDER BY fecha_registro ASC
								`,
								[codigoCompras, fecha_i, fecha_f],
								async (error, rows_two, fields) => {
									console.log(rows_two);
									if (!error && rows_two.length > 0) {
										let objeto_one = '';
										for (let jindex = 0; jindex < rows_two.length; jindex++) {
											objeto_one = {
												no_factura: rows_two[jindex].nofactura_ventas,
												nombre_cliente: rows_two[jindex].nombrecliente_ventas,
												tel_cliente: rows_two[jindex].telcliente_ventas,
												obsr_ventas: rows_two[jindex].observaciones_ventas,
												detalle: rows_two,
											};
										}
										array_one.push(objeto_one);
										resolve(array_one);
									} else {
										array_one = [];
									}
								}
							);
						}
					}
				);
			});

			// Cremaos el objeto que contiene los datos de la base de datos...
			let data = {
				data_fechas: [
					{
						fecha_cierre: fecha,
						fecha_creado: fecha_hora_a(),
						fecha_inicio: fecha_i,
						fecha_final: fecha_f,
						user_creado: userCreador,
					},
				],
				data_ventas: d_ventas,
			};

			// Iniciamos el navegador.
			const browser = await puppeteer.launch({
				headless: 'new',
			});
			const page = await browser.newPage(); // Cremaos una nueva pagina.

			// Compilamos los datos con la plantilla...
			const content = await compile('ventas', data);
			await page.setContent(content);
			await page.emulateMediaType('screen');
			await page.pdf({
				path: './src/public/reportes/Reporte-Ventas-VETERINARIA-EL-CORRAL-Fecha-' + fecha + '.pdf',
				format: 'letter',
				landscape: true,
				printBackground: true,
				margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
			});

			// RESPUESTA DEL SERVIDOR.
			console.log('Finish to create a PDF document.');

			// Datos para que se descargue el archivo de recibos.
			let datos_post = {
				d: 'OKRVENTASVEC',
				e: '/reportes/Reporte-Ventas-VETERINARIA-EL-CORRAL-Fecha-' + fecha + '.pdf',
				f: 'Reporte-Ventas-VETERINARIA-EL-CORRAL-Fecha-' + fecha + '.pdf',
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
