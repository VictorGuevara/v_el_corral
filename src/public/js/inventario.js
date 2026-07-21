/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     VARIABLES DEL AREA DE INVENTARIO                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Variables de utilidad.
const btn_gReporte_inventario = document.getElementById('bnt_gR_inventario');
const tbody_inventario = document.getElementById('tbody_table_inventario');
const i_sInventario = document.getElementById('i_sInventario');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     FUNCIONES DEL AREA DE INVENTARIO                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que lista los clientes en la tabla.
const list_clientes = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sInventario.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/list_inventario', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_inventario.innerHTML = '';
			let contador = 0;

			for (let i = 0; i < t_rows; i++) {
				contador++;
				tbody_inventario.innerHTML += `
                <tr>
                    <td>${contador}</td>
                    <td>${datos.rows[i].codproducto_inventario}</td>
                    <td>${datos.rows[i].nombreproducto_inventario}</td>
                    <td>${datos.rows[i].tipoproducto_inventario}</td>
                    <td>${datos.rows[i].existenciaslote_inventario}</td>
                    <td>${datos.rows[i].numlote_inventario}</td>
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
	list_clientes(); // Ejecutamos al inicio...
}, 150);

// Función para generar reporte de inventario...
const reporte_inventario_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de inventario?',
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

			return fetch('../../ri_pdf', {
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
					if (datos.d == 'OKRIVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte de inventario Creado.',
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
i_sInventario.addEventListener('input', (event) => {
	event.preventDefault();
	list_clientes();
});

// Boton de genear reporte de inventario...
btn_gReporte_inventario.addEventListener('click', (event) => {
	reporte_inventario_pdf();
});
