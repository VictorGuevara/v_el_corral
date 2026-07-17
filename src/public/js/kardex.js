/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     VARIABLES DEL AREA DE INVENTARIO                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Variables de utilidad.
const btn_reporte_kardex = document.getElementById('bnt_gR_kardex');
const tbody_kardex = document.getElementById('tbody_table_kardex');
const i_sNProdKardex = document.getElementById('nombreProductoKardex');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;
let dl_nombres_productos = document.getElementById('lista_productos');
let cod_producto = document.getElementById('codigoProducto');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     FUNCIONES DEL AREA DE INVENTARIO                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que lista los clientes en la tabla.
const list_kardex = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sNProdKardex.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/list_kardex', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_kardex.innerHTML = '';

			for (let i = 0; i < t_rows; i++) {
				let format_fecha = fecha_a(datos.rows[i].fecha_movimiento);

				tbody_kardex.innerHTML += `
                <tr>
                    <td>${format_fecha}</td>
                    <td>${datos.rows[i].nombre_producto}</td>
                    <td>${datos.rows[i].entrada_cantidad}</td>
                    <td>${datos.rows[i].entrada_valor_unitario}</td>
                    <td>${datos.rows[i].entrada_valor_total}</td>
                    <td>${datos.rows[i].salida_cantidad}</td>
                    <td>${datos.rows[i].salida_valor_unitario}</td>
                    <td>${datos.rows[i].salida_valor_total}</td>
                    <td>${datos.rows[i].existencia_cantidad}</td>
                    <td>${datos.rows[i].existencia_valor_unitario}</td>
                    <td>${datos.rows[i].existencia_valor_total}</td>
                </tr>
            `;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Retrazamos esta ejecución 15 milisegundos...
setTimeout(() => {
	list_kardex(); // Ejecutamos al inicio...
	d_kardexProducto();
}, 150);

// Funcion que genera los productos en la etiqueta datalist...
const d_kardexProducto = (nombreP) => {
	let np_list = 0;

	// Validamos.
	if (nombreP == '' || nombreP == undefined) {
		np_list = 'a';
	} else {
		np_list = nombreP;
	}

	let np = {
		nombreP: np_list,
	};

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/list_productos_kardex', {
		method: 'POST',
		body: JSON.stringify(np),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			dl_nombres_productos.innerHTML = '';

			for (let i = 0; i < t_rows; i++) {
				dl_nombres_productos.innerHTML += `<option value="${datos.rows[i].nombre_producto}"></option>`;
			}

			// Dato del campo del nombre del producto...
			let lista_productos = document.querySelectorAll('#lista_productos')[0];

			if (lista_productos.querySelector("option[value='" + nombreP + "']")) {
				cod_producto.value = '';
				cod_producto.value = datos.rows[0].codigo_producto;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función para generar reporte de inventario...
const reporte_kardex_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de kardex?',
		html:
			'<input id="input1" type="date" class="swal2-input" placeholder="Inicio" value="">' +
			'<input id="input2" class="swal2-input" placeholder="Fecha Final" value="' +
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
				c_pro: cod_producto.value,
				fecha: fecha,
				fecha_i: input_1,
				fecha_f: input_2,
				user: nombre_user_esv,
			};

			return fetch('../../rk_pdf', {
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
					if (datos.d == 'OKRKVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte kardex Creado.',
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
/*                             EVENTOS LISTENER                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Evento clic para el boton listar los clientes...
i_sNProdKardex.addEventListener('input', (event) => {
	event.preventDefault();
	//list_kardex();
});

// Boton de genear reporte de kardex...
btn_reporte_kardex.addEventListener('click', (event) => {
	reporte_kardex_pdf();
});
