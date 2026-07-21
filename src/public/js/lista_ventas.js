/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  VARIABLES DE LA VENTANA LISTA DE VENTAS                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */

let caja_list_ventas_vec = document.querySelector('#list_ventas');

// Campo de busqueda...
let inpSearch = document.querySelector('#i_search_ventas_vec');
const btn_cierreVenta = document.getElementById('btn_cd_ventas');
let bnt_gRVentas = document.querySelector('#bnt_gR_ventas');
let btn_buscar = document.getElementById('bnt_search');

// Usuario.
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  FUNCIONES DE LA VENTANA LISTA DE VENTAS                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */
let anio = new Date().getFullYear();

// Función que lista las ventas.
const list_ventas = async () => {
	// Consultamos la fecha actual...
	let input_busqueda = document.getElementById('i_search_ventas_vec').value;

	// Creamos el objeto para enviarselo a la consulta...
	let texto_busqueda = {
		iS_text: input_busqueda,
	};

	let cod_n_venta_vec = await fetch('/acciones_inventario/list_ventas_vec', {
		method: 'POST',
		body: JSON.stringify(texto_busqueda),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Guardamos el dato del total de filas encontradas...
	let cont_f = cod_n_venta_vec.count_filas_ventas;

	// Limpiamos el contenedor...
	caja_list_ventas_vec.innerHTML = '';

	// Recorremos para poder crear la lista
	for (let e = 0; e < cont_f; e++) {
		// Capturamos el codigo de la venta...
		let nf_c_vec = cod_n_venta_vec.filas_ventas[e].nofactura_ventas.toLowerCase();

		// Creamos un objeto para consultar...
		let a_venta_nf = {
			noFactura_venta_vec: nf_c_vec,
		};

		// Consultamos...
		let nfacturaUnit_c_vec = await fetch('/acciones_inventario/l_ventas_noFactura', {
			method: 'POST',
			body: JSON.stringify(a_venta_nf),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((datos) => {
				return datos;
			})
			.catch((error) => {
				console.error('Ocurrio un error: ', error);
			});

		// Paquetes
		let paquete_n = '';

		// Creamos los paquetes con sus respectivos datos...
		for (let e_npq = 0; e_npq < nfacturaUnit_c_vec.npq_count; e_npq++) {
			// Capturamos el número de paquete de la venta...
			let nf_detalle_ventaVec = nfacturaUnit_c_vec.npq[e_npq].nofactura_ventas;

			// Creamos un objeto para consultar...
			let a_nfactura_ventaVec = {
				noFactura_venta_vec: nf_detalle_ventaVec,
			};

			// Consultamos...
			let detalle_venta_vec = await fetch('/acciones_inventario/l_ventas_noFacturaDetalle', {
				method: 'POST',
				body: JSON.stringify(a_nfactura_ventaVec),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					return datos;
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});

			// Paquetes
			let paquete_n_d = '';

			// Creamos las filas del detalle del paquete...
			for (let e_npq_d = 0; e_npq_d < detalle_venta_vec.npq_d_count; e_npq_d++) {
				paquete_n_d += `
                        <tr>
                            <td class="td_list_pq">${detalle_venta_vec.pq_d[e_npq_d].cant_producto_ventas}</td>
                            <td class="td_list_pq">${detalle_venta_vec.pq_d[e_npq_d].nombre_producto_ventas}</td>
                            <td class="td_list_pq">$ ${detalle_venta_vec.pq_d[e_npq_d].vUnit_producto_ventas}</td>
                            <td class="td_list_pq">${detalle_venta_vec.pq_d[e_npq_d].tipo_producto_ventas}</td>
                            <td class="td_list_pq">${detalle_venta_vec.pq_d[e_npq_d].marca_producto_ventas}</td>
                            <td class="td_list_pq">$ ${detalle_venta_vec.pq_d[e_npq_d].subt_producto_ventas}</td>
                        </tr>
                    `;
			}

			paquete_n += `
                    <div class="detalle">
                        <div class="d_title">
                            <div class="dt_title_npq">
                                <h5>Detalle De La Compra: <span>Factura. # <span class="npq">${nf_detalle_ventaVec}</span></span></h5>
                            </div>
                            <div></div>
                            <div class="box_npq"></div>
                            <div class="box_npq"></div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th class="th_list_pq">Cant. P.</th>
                                    <th class="th_list_pq">Nompre P.</th>
                                    <th class="th_list_pq">Valor U.</th>
                                    <th class="th_list_pq">Tipo:</th>
                                    <th class="th_list_pq">Marca:</th>
                                    <th class="th_list_pq">Sub Total</th>
                                </tr>
                            </thead>
                            <tbody id="">
                                ${paquete_n_d}
                            </tbody>
                        </table>
                    </div>
                `;
		}

		caja_list_ventas_vec.innerHTML += `
                <div class="desv_box_compras_vec ventas">
                    <div class="box_secctions_npq_acctions">
                        <div class="box_npq">
                            <h5>Ingredado Por: </h5>
                            <span class="npq">${cod_n_venta_vec.filas_ventas[e].user_registro}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Fecha: </h5>
                            <span class="npq">${formatearFecha(cod_n_venta_vec.filas_ventas[e].fecha_registro)}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Nombre Del Cliente: </h5>
                            <span class="npq">${cod_n_venta_vec.filas_ventas[e].nombrecliente_ventas}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Tel. Del Cliente: </h5>
                            <span class="npq">${cod_n_venta_vec.filas_ventas[e].telcliente_ventas}</span>
                        </div>
						 <div class="box_npq"></div>
                        <div class="box_acctions"></div>
                    </div>
					<div class="box_section_detalle">
                        ${paquete_n}
                    </div>
                    <div>
                        <table class="table_totales_venta">
                            <thead>
                                <tr>
									<th colspan="3" class="th_list_pq" style="text-align: center;">TOTALES DE LA VENTA:</th> 
                                </tr>
                                <tr class="tr_d_pq_n_t">
                                    <th class="th_list_pq">Sub Total</th>
                                    <th class="th_list_pq">Descuento</th>
                                    <th class="th_list_pq">Total</th>
                                </tr>
                            </thead>
                            <tbody id="">
                                <tr class="tr_d_pq_n_t">
                                    <td class="td_list_enc_t"><span>$ </span>${cod_n_venta_vec.filas_ventas[e].subtotal_ventas}</td>
                                    <td class="td_list_enc_r"><span>- $ </span>${cod_n_venta_vec.filas_ventas[e].descuento_ventas}</td>
                                    <td class="td_list_enc_t"><span>$ </span>${cod_n_venta_vec.filas_ventas[e].total_ventas}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
	}
};

list_ventas();

// Función para cierre de ventas...
const cierre_ventas = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear documento de cierre de ventas diarias?',
		html:
			'<input id="input1" type="date" class="swal2-input" placeholder="Fecha" value="' +
			fecha +
			'">' +
			'<input id="input2" class="swal2-input" placeholder="Año" value="' +
			anio +
			'">',
		showCancelButton: true,
		confirmButtonText: 'Crear Documento',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			let input_1 = document.getElementById('input1').value;
			let input_2 = document.getElementById('input2').value;

			// Validamos...
			if (input_1 == null || input_1 == '') {
				fecha = fecha_a();
			} else {
				fecha = input_1;
			}

			// Creamos un objeto para enviarlo.
			let dato_gmh = {
				fecha: fecha,
				anio: input_2,
				user: nombre_user_esv,
			};

			return fetch('../../cvd', {
				method: 'POST',
				body: JSON.stringify(dato_gmh),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json();
				})
				.then((datos) => {
					if (datos.d == 'OKLCVDVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Listado de Cierre De Ventas Diarias Creado.',
							showConfirmButton: false,
							timer: 3000,
						});
					}
				})
				.catch((error) => {
					Swal.showValidationMessage(`Ocurrio un error: ${error}`);
				});
		},
	});
};

// Función para generar reporte de ventas...
const reporte_ventas_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de ventas?',
		html:
			'<input id="input1" type="date" class="swal2-input" placeholder="Inicio" value="">' +
			'<input id="input2" type="date" class="swal2-input" placeholder="Fecha Final" value="' +
			fecha +
			'">',
		showCancelButton: true,
		confirmButtonText: 'Crear Reporte',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			let input_1 = document.getElementById('input1').value;
			let input_2 = document.getElementById('input2').value;

			// Validamos el campo #1...
			if (input_1 == null || input_1 == '') {
				input_1 = fecha_a();
			} else {
				input_1 = input_1;
			}

			// Validamos el campo #2...
			if (input_2 == null || input_2 == '') {
				input_2 = fecha_a();
			} else {
				input_2 = input_2;
			}

			// Creamos un objeto para enviarlo.
			let dato_gmh = {
				fecha: fecha,
				fecha_i: input_1,
				fecha_f: input_2,
				user: nombre_user_esv,
			};

			return fetch('../../rventas_pdf', {
				method: 'POST',
				body: JSON.stringify(dato_gmh),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json();
				})
				.then((datos) => {
					if (datos.d == 'OKRVENTASVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte Ventas Creado.',
							showConfirmButton: false,
							timer: 3000,
						});
					}
				})
				.catch((error) => {
					Swal.showValidationMessage(`Ocurrio un error: ${error}`);
				});
		},
	});
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                              EVENTOS LISTENER                              */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Campo de busqueda
inpSearch.addEventListener('input', () => {
	list_ventas();
});

// Boton de cierre de ventas...
btn_cierreVenta.addEventListener('click', (event) => {
	cierre_ventas();
});

// Boton de genear reporte de vetnas...
bnt_gRVentas.addEventListener('click', (event) => {
	reporte_ventas_pdf();
});

// Botón buscar
btn_buscar.addEventListener('click', (event) => {
	event.preventDefault();
	list_ventas();
});
