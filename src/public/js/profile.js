/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                    VARIABLES DEL FORMULARIO ENCOMIENDAS                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const item_count_admin = document.getElementById('cant_admin');
const item_count_asis = document.getElementById('cant_asis');
const item_count_citas = document.getElementById('cant_citas');
const item_count_proveedores = document.getElementById('cant_proveedores');
const item_count_servicios = document.getElementById('cant_servicios');
const item_count_productos = document.getElementById('cant_productos');
const item_count_compras = document.getElementById('cant_compras');
const item_count_inventario = document.getElementById('cant_inventario');
const item_count_ventas = document.getElementById('cant_ventas');
const item_count_productos_min = document.getElementById('cant_productos_min');

// Graficos..
const chart = document.getElementById('myChart');
let Chart_1;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                    FUNCIONES DEL FORMULARIO ENCOMIENDAS                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

/* Graficos */
const ventas_vec_meses = async () => {
	let current_anio = anio_actual;
	let nombre_meses = [
		'',
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	// Obejeto del número de carga...
	let ob_carga = {
		n_anioc: current_anio,
	};

	// Consultamos la cantidad de encomiendas por meses.
	await fetch('/acciones_inventario/count_ventas_vec_meses', {
		method: 'POST',
		body: JSON.stringify(ob_carga),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			// Variables de utilidad...
			let i_name_meses = [];
			let total_encsv_meses_last_year = [];
			let total_encsv_meses_current_year = [];
			let total_filas_last_year = datos.total_ventasVec_m_last_year.length;
			let total_filas_currentd_year = datos.total_ventasVec_m_current_year.length;

			// Recorremos los datos del año anterior...
			for (let i_lastY = 0; i_lastY < total_filas_last_year; i_lastY++) {
				total_encsv_meses_last_year.push(datos.total_ventasVec_m_last_year[i_lastY].count_ventas_m);
			}

			// Recorremos los datos del año actual...
			for (let i_currentY = 0; i_currentY < total_filas_currentd_year; i_currentY++) {
				i_name_meses.push(nombre_meses[datos.total_ventasVec_m_current_year[i_currentY].mes_id]);
				total_encsv_meses_current_year.push(datos.total_ventasVec_m_current_year[i_currentY].count_ventas_m);
			}

			Chart_1 = new Chart(chart, {
				type: 'bar',
				data: {
					labels: i_name_meses,
					datasets: [
						{
							label: 'Ventas año ' + (parseInt(current_anio) - 1),
							data: total_encsv_meses_last_year,
							borderWidth: 1,
							backgroundColor: ['rgba(255, 99, 132, 0.7)'],
							borderColor: ['rgba(255, 99, 132, 1)'],
							borderWidth: 2,
							borderRadius: 10,
							borderSkipped: false,
						},
						{
							label: 'Ventas año ' + current_anio,
							data: total_encsv_meses_current_year,
							borderWidth: 1,
							backgroundColor: ['rgba(130, 30, 80, 0.7)'],
							borderColor: ['rgba(130, 30, 80, 1)'],
							borderWidth: 2,
							borderRadius: 10,
							borderSkipped: false,
						},
					],
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

const ventas_vec_todos_meses = async () => {
	let current_anio = anio_actual;

	// Obejeto del número de carga...
	let ob_carga = {
		n_anioc: current_anio,
	};

	// Consultamos la cantidad de encomiendas por meses.
	await fetch('/acciones_inventario/count_ventas_vec_todos_meses', {
		method: 'POST',
		body: JSON.stringify(ob_carga),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			// Variables de utilidad...
			let i_name_meses = [];
			let total_encsv_meses_last_year = [];
			let total_encsv_meses_current_year = [];
			let total_filas_last_year = datos.total_ventasVec_m_last_year.length;
			let total_filas_currentd_year = datos.total_ventasVec_m_current_year.length;

			// Recorremos los datos del año anterior...
			for (let i_lastY = 0; i_lastY < total_filas_last_year; i_lastY++) {
				total_encsv_meses_last_year.push(datos.total_ventasVec_m_last_year[i_lastY][0].count_ventas_m);
			}

			// Recorremos los datos del año actual...
			for (let i_currentY = 0; i_currentY < total_filas_currentd_year; i_currentY++) {
				total_encsv_meses_current_year.push(datos.total_ventasVec_m_current_year[i_currentY][0].count_ventas_m);
			}

			Chart_1 = new Chart(chart, {
				type: 'bar',
				data: {
					labels: [
						'Enero',
						'Febrero',
						'Marzo',
						'Abril',
						'Mayo',
						'Junio',
						'Julio',
						'Agosto',
						'Septiembre',
						'Octubre',
						'Noviembre',
						'Diciembre',
					],
					datasets: [
						{
							label: 'Ventas año ' + (parseInt(current_anio) - 1),
							data: total_encsv_meses_last_year,
							borderWidth: 1,
							backgroundColor: ['rgba(99, 255, 132, 0.7)'],
							borderColor: ['rgba(99, 255, 132, 1)'],
							borderWidth: 2,
							borderRadius: 10,
							borderSkipped: false,
						},
						{
							label: 'Ventas año ' + current_anio,
							data: total_encsv_meses_current_year,
							borderWidth: 1,
							backgroundColor: ['rgba(30, 130, 80, 0.7)'],
							borderColor: ['rgba(30, 130, 80, 1)'],
							borderWidth: 2,
							borderRadius: 10,
							borderSkipped: false,
						},
					],
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista las datos genericos de VETERINARIA EL CORRAL...
const dash = async () => {
	// Consultamos la cantidad de administradores.
	let cant_admin = await fetch('/acciones_inventario/count_administradores', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_admin;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_admin.innerHTML = cant_admin.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de asistentes o contadores.
	let cant_asis = await fetch('/acciones_inventario/count_asitentes', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_asis;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_asis.innerHTML = cant_asis.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de citas.
	let cant_citas = await fetch('/acciones_inventario/count_citas', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_citas;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_citas.innerHTML = cant_citas.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de proveedores.
	let cant_proveedores = await fetch('/acciones_inventario/count_proveedores', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_proveedores;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_proveedores.innerHTML = cant_proveedores.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de servicios.
	let cant_servicios = await fetch('/acciones_inventario/count_servicios', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_servicios;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_servicios.innerHTML = cant_servicios.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de productos.
	let cant_productos = await fetch('/acciones_inventario/count_productos', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_productos;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_productos.innerHTML = cant_productos.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de compras.
	let cant_compras = await fetch('/acciones_inventario/count_compras', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_compras;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_compras.innerHTML = cant_compras.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de inventario.
	let cant_inventario = await fetch('/acciones_inventario/count_inventario', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_inventario;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_inventario.innerHTML = cant_inventario.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de ventas.
	let cant_ventas = await fetch('/acciones_inventario/dash_count_ventas', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_ventas;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_ventas.innerHTML = cant_ventas.toFixed(0);

	/* ---------------------------------------------------------------------- */

	// Consultamos la cantidad de productos con stock mínimo.
	let cant_productos_min = await fetch('/acciones_inventario/count_productos_min', {
		method: 'POST',
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_productos_min;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Pintamos la cantidad.
	item_count_productos_min.innerHTML = cant_productos_min.toFixed(0);
};

// Ejecutamos al inicio..
dash();
ventas_vec_todos_meses();

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                              EVENTOS LISTENER                              */
/*                                                                            */
/* -------------------------------------------------------------------------- */
