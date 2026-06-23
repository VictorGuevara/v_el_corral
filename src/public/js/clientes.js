/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   VARIABLES DEL FORMULARIO DE CLIENTES                     */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Formulario de guardar.
const form_clientes = document.getElementById('add_clientes_form');
const codigo = document.getElementById('cod_cliente');
const nombre = document.getElementById('name_cliente');
const telefono = document.getElementById('tel_cliente');
const fecha_nacimiento = document.getElementById('fn_cliente');

// Variables de utilidad.
const btn_guardar = document.getElementById('btn_add_cliente');
const btn_reporte_clientes = document.getElementById('bnt_gR_clientes');
const btn_editar = document.getElementById('btn_edit_cliente');
const btn_cancelar = document.getElementById('bnt_cancelar_edit');
const tbody_clientes = document.getElementById('tbody_table_clientes');
const i_sClientes = document.getElementById('i_sClientes');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   FUNCIONES DEL FORMULARIO DE CLIENTES                     */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que genera el código único del cliente...
const cod_cliente = async () => {
	// consultamos para crecar el código del nuevo producto a registrar.
	let cod_g = await fetch('/acciones_inventario/count_clientes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_clientes;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_cliente = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de productos registrados:
	let ctotal_clientes = cod_g;

	// Creamos el codigo de cliente de estados unidos
	let cod_clienteG = 'CC' + (num_a_cliente + anio_actual) + (ctotal_clientes + 1);

	// Retornamos el valor
	return cod_clienteG; //?
};

// Función que guarda los clientes...
const g_cliente = async () => {
	// Ejecutamos la funcion de generan el código del producto...
	let codCliente = await cod_cliente();

	// Creamos el objeto de datos...
	let datos_cliente = {
		cod_cliente: codCliente,
		nom_cliente: nombre.value,
		tel_cliente: telefono.value,
		fna_cliente: fecha_nacimiento.value,
		fecha_regis: fecha_actual,
		user_regist: nombre_user_esv,
	};

	// Enviamos los datos por caja iteración; para guardar los clienetes.
	fetch('/acciones_inventario/g_clientes', {
		method: 'POST',
		body: JSON.stringify(datos_cliente),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Se guardo el cliente correctamente.') {
				Toast.fire({
					icon: 'success',
					title: datos.mensaje,
				});

				form_clientes.reset();
				list_clientes();
			} else if (datos.mensaje == 'Ya existe el cliente con los dados proporcionados...') {
				Toast.fire({
					icon: 'warning',
					title: datos.mensaje,
				});
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista los clientes en la tabla.
const list_clientes = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sClientes.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/clientes', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_clientes.innerHTML = '';

			let contador = 0;
			for (let i = 0; i < t_rows; i++) {
				// aumentamos el contador...
				contador++;

				tbody_clientes.innerHTML += `
                <tr>
                    <td>${contador}</td>
                    <td>${datos.rows[i].codigo_cliente}</td>
                    <td>${datos.rows[i].nombre_cliente}</td>
                    <td>${datos.rows[i].tel_cliente}</td>
                    <td>${datos.rows[i].fnac_cliente}</td>
                    <td class="center_text">
                        <a onclick="ll_dEditV('${datos.rows[i].codigo_cliente}', '${datos.rows[i].nombre_cliente}', '${datos.rows[i].tel_cliente}', '${datos.rows[i].fnac_cliente}')" class="btn_table_edit"><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    <td class="center_text">
                        <a onclick="deleteCliente('${datos.rows[i].codigo_cliente}')" class="btn_table_delete"><i class="fa-solid fa-trash"></i></a>
                    </td>
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
	cancelEditClientes();
}, 150);

// Función que llena los datos en el formulario de editar...
const ll_dEditV = (d_codigo, d_nombre, d_telefono, d_fecha_na) => {
	// Limpiamos el formulario.
	form_clientes.reset();

	// Agregamos los datos a los campos correspondientes.
	codigo.value = d_codigo;
	nombre.value = d_nombre;
	telefono.value = d_telefono;
	fecha_nacimiento.value = formatearFecha(d_fecha_na, 'DD-MM-YYYY');

	// Hacemos visibles los botones.
	btn_guardar.style.display = 'none';
	btn_editar.style.display = 'block';
	btn_cancelar.style.display = 'block';
};

// Función editar cargas.
const editClientes = async () => {
	// Creamos el objeto a enviar.
	let dU = {
		cod_cliente: codigo.value,
		num_cliente: nombre.value,
		tel_cliente: telefono.value,
		fna_cliente: fecha_nacimiento.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/eClientes', {
		method: 'POST',
		body: JSON.stringify(dU),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Cliente editado con exito.') {
				console.log(datos.mensaje);
				Swal.fire({
					icon: 'success',
					title: datos.mensaje,
				});
				cancelEditClientes();
				list_clientes();
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función para cancelar edición de clientes.
const cancelEditClientes = async () => {
	form_clientes.reset();
	btn_guardar.style.display = 'block';
	btn_editar.style.display = 'none';
	btn_cancelar.style.display = 'none';
};

// Función editar usuario.
const deleteCliente = async (codCliente) => {
	// Creamos el objeto a enviar.
	let dD = {
		cod_cliente: codCliente,
	};

	// Mostramos el mensaje.
	Swal.fire({
		title: '¿Eliminar Cliente?',
		text: '¡Los cambios no se podrán revertir!',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, Eliminar',
	}).then((result) => {
		if (result.dismiss == 'cancel') {
			Swal.fire('Operación Cancelada', 'No se eliminó el cliente :)', 'error');
		} else if ((result.value = true)) {
			// Consultamos...
			fetch('/acciones_inventario/dClientes', {
				method: 'POST',
				body: JSON.stringify(dD),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					if (datos.mensaje == 'Cliente eliminado con exito.') {
						Swal.fire('¡Eliminado!', datos.mensaje, 'success');
						list_clientes();
					}
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});
		}
	});
};

// Validamos el formulario de agregar cliente...
const valid_form_g_cliente = () => {
	if (nombre.value == '') {
		nombre.focus();
	} else if (telefono.value == '') {
		telefono.focus();
	} else if (fecha_nacimiento.value == '') {
		fecha_nacimiento.focus();
	} else {
		g_cliente();
	}
};

// Validamos el formulario de editar cliente...
const valid_form_e_cliente = () => {
	if (nombre.value == '') {
		nombre.focus();
	} else if (telefono.value == '') {
		telefono.focus();
	} else if (fecha_nacimiento.value == '') {
		fecha_nacimiento.focus();
	} else {
		editClientes();
	}
};

// Función para generar reporte de clientes...
const reporte_clientes_pdf = async () => {
	// Mostramos mensaje...
	Swal.fire({
		position: 'center',
		icon: 'warning',
		title: 'No posees permisos para crear el reporte de Clientes.',
		showConfirmButton: false,
		timer: 3000,
	});
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             EVENTOS LISTENER                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Evento clic para el boton guardar de clientes...
btn_guardar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_g_cliente();
});

// Evento clic para el boton editar de clientes...
btn_editar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_e_cliente();
});

// Evento clic para el boton de cancelar edición de clientes...
btn_cancelar.addEventListener('click', (event) => {
	event.preventDefault();
	cancelEditClientes();
});

// Boton de genear reporte de clientes...
btn_reporte_clientes.addEventListener('click', (event) => {
	reporte_clientes_pdf();
});
