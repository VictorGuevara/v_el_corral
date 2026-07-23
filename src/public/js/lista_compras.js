/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  VARIABLES DE LA VENTANA LISTA DE COMPRAS                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

let caja_list_compras_vec = document.querySelector('#list_compras');

// Campo de busqueda...
let inpSearch = document.querySelector('#i_search_compras_vec');
let bnt_gRCompras = document.querySelector('#bnt_gR_compras');

// Usuario.
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  FUNCIONES DE LA VENTANA LISTA DE COMPRAS                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que lista las compras.
const list_compras = async () => {
	// Consultamos la fecha actual...
	let input_busqueda = document.getElementById('i_search_compras_vec').value;

	// Creamos el objeto para enviarselo a la consulta...
	let texto_busqueda = {
		iS_text: input_busqueda,
	};

	let cod_n_compra_vec = await fetch('/acciones_inventario/list_compras_vec', {
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
	let cont_f = cod_n_compra_vec.count_filas_compras;

	// Limpiamos el contenedor...
	caja_list_compras_vec.innerHTML = '';

	// Recorremos para poder crear la lista
	for (let e = 0; e < cont_f; e++) {
		// Capturamos el codigo de la compra...
		let nf_c_vec = cod_n_compra_vec.filas_compras[e].nofactura_compras.toLowerCase();

		// Creamos un objeto para consultar...
		let a_compra_nf = {
			noFactura_compra_vec: nf_c_vec,
		};

		// Consultamos...
		let nfacturaUnit_c_vec = await fetch('/acciones_inventario/l_compras_noFactura', {
			method: 'POST',
			body: JSON.stringify(a_compra_nf),
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
			// Capturamos el número de paquete de la compra...
			let nf_detalle_compraVec = nfacturaUnit_c_vec.npq[e_npq].nofactura_compras;

			// Creamos un objeto para consultar...
			let a_nfactura_compraVec = {
				noFactura_compra_vec: nf_detalle_compraVec,
			};

			// Consultamos...
			let detalle_compra_vec = await fetch('/acciones_inventario/l_compras_noFacturaDetalle', {
				method: 'POST',
				body: JSON.stringify(a_nfactura_compraVec),
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
			for (let e_npq_d = 0; e_npq_d < detalle_compra_vec.npq_d_count; e_npq_d++) {
				paquete_n_d += `
                        <tr class="tr_d_pq_n_usa">
                            <td data-label="Cantidad:" class="td_list_pq">${detalle_compra_vec.pq_d[e_npq_d].cant_producto_compras}</td>
                            <td data-label="Producto:" class="td_list_pq">${detalle_compra_vec.pq_d[e_npq_d].nombre_producto_compras}</td>
                            <td data-label="Valor Unitario:" class="td_list_pq">$ ${detalle_compra_vec.pq_d[e_npq_d].vUnit_producto_compras}</td>
                            <td data-label="Tipo:" class="td_list_pq">${detalle_compra_vec.pq_d[e_npq_d].tipo_producto_compras}</td>
                            <td data-label="Marca:" class="td_list_pq">${detalle_compra_vec.pq_d[e_npq_d].marca_producto_compras}</td>
                            <td data-label="Subtotal:" class="td_list_pq">$ ${detalle_compra_vec.pq_d[e_npq_d].subtotal_compras}</td>
                        </tr>
                    `;
			}

			paquete_n += `
                    <div class="detalle">
                        <div class="d_title">
                            <div class="dt_title_npq">
                                <h5>Detalle De La Compra: <span>Factura. # <span class="npq">${nf_detalle_compraVec}</span></span></h5>
                            </div>
                            <div></div>
                            <div class="box_npq"></div>
                            <div class="box_npq"></div>
                        </div>
                        <table class="table_list_pqEnc_sv">
                            <thead>
                                <tr class="tr_d_pq_n_usa">
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

		caja_list_compras_vec.innerHTML += `
                <div class="desv_box_compras_vec">
                    <div class="box_secctions_npq_acctions">
                        <div class="box_npq">
                            <h5>Ingredado Por: </h5>
                            <span class="npq">${cod_n_compra_vec.filas_compras[e].user_registro}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Fecha: </h5>
                            <span class="npq">${formatearFecha(cod_n_compra_vec.filas_compras[e].fecha_registro)}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Nombre Proveedor: </h5>
                            <span class="npq">${cod_n_compra_vec.filas_compras[e].nombreproveedor_compras}</span>
                        </div>
                        <div class="box_npq">
                            <h5>Tipo De Compra: </h5>
                            <span class="npq">${cod_n_compra_vec.filas_compras[e].tipo_compras}</span>
                        </div>
                        <div class="box_npq"></div>
                        <div class="box_acctions"></div>
                    </div>
                    <div class="box_section_detalle">
                        ${paquete_n}
                    </div>
                    <br id="separador_totales">
                    <div class="totales">
                        <table class="table_totales_venta">
                            <thead>
                                <tr>
									<th colspan="3" class="th_list_pq" style="text-align: center;">TOTALES DE LA COMPRA:</th> 
                                </tr>
                                <tr class="tr_d_pq_n_t">
                                    <th class="th_list_pq">Sub Total</th>
                                    <th class="th_list_pq">Descuento</th>
                                    <th class="th_list_pq">Total</th>
                                </tr>
                            </thead>
                            <tbody id="">
                                <tr class="tr_d_pq_n_t">
                                    <td data-label="Subtotal:" class="td_list_enc_t"><span>$ </span>${cod_n_compra_vec.filas_compras[e].subtotal_compras}</td>
                                    <td data-label="Descuento:" class="td_list_enc_r"><span>- $ </span>${cod_n_compra_vec.filas_compras[e].descuento_compras}</td>
                                    <td data-label="TOTAL:" class="td_list_enc_t"><span>$ </span>${cod_n_compra_vec.filas_compras[e].total_compras}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="observaciones">
                        <h5>Observaciones de la compra:</h5>
                        <p>${cod_n_compra_vec.filas_compras[e].observaciones_compras}</p>
                    </div>
                </div>
            `;
	}
};

list_compras();

// Función para generar reporte de compras...
const reporte_compras_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de compras?',
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

			return fetch('../../rcompras_pdf', {
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
					if (datos.d == 'OKRCOMPRASVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte Compras Creado.',
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
	list_compras();
});

// Boton de genear reporte de compras...
bnt_gRCompras.addEventListener('click', (event) => {
	reporte_compras_pdf();
});
