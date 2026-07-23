/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  VARIABLES DEL FORMULARIO DE PROVEDORES                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Formulario de guardar.
const form_proveedores = document.getElementById('form_proveedores');
const codigo = document.getElementById('cod_proveedor');
const nombre = document.getElementById('name_proveedor');
const telefono = document.getElementById('tel_proveedor');
const dui = document.getElementById('dui_proveedor');
const marca = document.getElementById('marca_proveedor');

// Variables de utilidad.
const btn_guardar = document.getElementById('btn_create_proveedor');
const btn_reporte_proveedores = document.getElementById('btn_reporte_proveedores');
const btn_editar = document.getElementById('btn_update_proveedor');
const btn_cancelar = document.getElementById('btn_cancel_update_proveedor');
const tbody_proveedores = document.getElementById('tableBody_proveedores');
const i_sProveedores = document.getElementById('i_sProveedores');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  FUNCIONES DEL FORMULARIO DE PROVEDORES                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que genera el código único del proveedor...
const cod_proveedor = async () => {
	// consultamos para crecar el código del nuevo producto a registrar.
	let cod_g = await fetch('/acciones_inventario/count_proveedores', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_proveedores;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_proveedor = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de productos registrados:
	let ctotal_proveedores = cod_g;

	// Creamos el codigo de cliente de estados unidos
	let cod_proveedorG = 'CC' + (num_a_proveedor + anio_actual) + (ctotal_proveedores + 1);

	// Retornamos el valor
	return cod_proveedorG; //?
};

// Función que guarda los proveedores...
const g_proveedor = async () => {
	// Ejecutamos la funcion de generan el código del producto...
	let codProveedor = await cod_proveedor();

	// Creamos el objeto de datos...
	let datos_proveedor = {
		cod_proveedor: codProveedor,
		nom_proveedor: nombre.value,
		tel_proveedor: telefono.value,
		dui_proveedor: dui.value,
		mar_proveedor: marca.value,
		fecha_regis: fecha_actual,
		user_regist: nombre_user_esv,
	};

	// Enviamos los datos por caja iteración; para guardar los proveedores.
	fetch('/acciones_inventario/g_proveedores', {
		method: 'POST',
		body: JSON.stringify(datos_proveedor),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Se guardo el proveedor correctamente.') {
				Toast.fire({
					icon: 'success',
					title: datos.mensaje,
				});

				form_proveedores.reset();
				list_proveedores();
			} else if (datos.mensaje == 'Ya existe el proveedor con los dados proporcionados...') {
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

// Función que lista los proveedores en la tabla.
const list_proveedores = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sProveedores.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/proveedores', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_proveedores.innerHTML = '';
			let contador = 0;

			for (let i = 0; i < t_rows; i++) {
				contador++;
				tbody_proveedores.innerHTML += `
                <tr>
                    <td data-label="No.">${contador}</td>
                    <td data-label="Proveedor:">${datos.rows[i].nombre_proveedor}</td>
                    <td data-label="Tel. Proveedor:">${datos.rows[i].tel_proveedor}</td>
                    <td data-label="DUI Proveedor:">${datos.rows[i].dui_proveedor}</td>
                    <td data-label="Marca:">${datos.rows[i].marca_proveedor}</td>
                    <td data-label="Editar" class="center_text">
                        <a onclick="ll_dEditV('${datos.rows[i].codigo_proveedor}', '${datos.rows[i].nombre_proveedor}', '${datos.rows[i].tel_proveedor}', '${datos.rows[i].dui_proveedor}', '${datos.rows[i].marca_proveedor}')" class="btn_table_edit"><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    <td data-label="Eliminar" class="center_text">
                        <a onclick="deleteProveedor('${datos.rows[i].codigo_proveedor}')" class="btn_table_delete"><i class="fa-solid fa-trash"></i></a>
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
	list_proveedores(); // Ejecutamos al inicio...
	cancelEditProveedores();
}, 150);

// Función que llena los datos en el formulario de editar...
const ll_dEditV = (d_codigo, d_nombre, d_telefono, d_dui, d_marca) => {
	// Vaciamos el formulario...
	form_proveedores.reset();

	// Agregamos los datos a los campos correspondientes.
	codigo.value = d_codigo;
	nombre.value = d_nombre;
	telefono.value = d_telefono;
	dui.value = d_dui;
	marca.value = d_marca;

	// Hacemos visibles los botones.
	btn_guardar.style.display = 'none';
	btn_editar.style.display = 'block';
	btn_cancelar.style.display = 'block';
};

// Función editar cargas.
const editProveedores = async () => {
	// Creamos el objeto a enviar.
	let dU = {
		codigo_edit: codigo.value,
		nombre_edit: nombre.value,
		telefono_edit: telefono.value,
		dui_edit: dui.value,
		marca_edit: marca.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/eProveedores', {
		method: 'POST',
		body: JSON.stringify(dU),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Proveedor editado con exito.') {
				Swal.fire({
					icon: 'success',
					title: datos.mensaje,
				});
				cancelEditProveedores();
				list_proveedores();
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función para cancelar edición de proveedores.
const cancelEditProveedores = async () => {
	// Limpiamos el formulario...
	form_proveedores.reset();

	// Hacemos visibles los botones.
	btn_guardar.style.display = 'block';
	btn_editar.style.display = 'none';
	btn_cancelar.style.display = 'none';
};

// Función eliminar proveedor.
const deleteProveedor = async (codCliente) => {
	// Creamos el objeto a enviar.
	let dD = {
		cod_cliente: codCliente,
	};

	// Mostramos el mensaje.
	Swal.fire({
		title: '¿Eliminar Proveedor?',
		text: '¡Los cambios no se podrán revertir!',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, Eliminar',
	}).then((result) => {
		if (result.dismiss == 'cancel') {
			Swal.fire('Operación Cancelada', 'No se eliminó el proveedor :)', 'error');
		} else if ((result.value = true)) {
			// Consultamos...
			fetch('/acciones_inventario/dProveedor', {
				method: 'POST',
				body: JSON.stringify(dD),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					if (datos.mensaje == 'Proveedor eliminado con exito.') {
						Swal.fire('¡Eliminado!', datos.mensaje, 'success');
						list_proveedores();
					}
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});
		}
	});
};

// Validamos el formulario de agregar proveedor...
const valid_form_g_proveedor = () => {
	if (nombre.value == '') {
		nombre.focus();
	} else if (telefono.value == '') {
		telefono.focus();
	} else if (dui.value == '') {
		dui.focus();
	} else if (marca.value == '') {
		marca.focus();
	} else {
		g_proveedor();
	}
};

// Validamos el formulario de editar proveedor...
const valid_form_e_proveedores = () => {
	if (nombre.value == '') {
		nombre.focus();
	} else if (telefono.value == '') {
		telefono.focus();
	} else if (dui.value == '') {
		dui.focus();
	} else if (marca.value == '') {
		marca.focus();
	} else {
		editProveedores();
	}
};

// Función para generar reporte de clientes...
const reporte_proveedores_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de proveedores?',
		showCancelButton: true,
		confirmButtonText: 'Crear Reporte',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			// Creamos un objeto para enviarlo.
			let dato_gmh = {
				fecha: fecha,
				user: nombre_user_esv,
			};

			return fetch('../../rpv_pdf', {
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
					if (datos.d == 'OKRPVVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte De Proveedores Creado.',
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

// Evento escritura para el campo de busqueda...
i_sProveedores.addEventListener('input', (event) => {
	event.preventDefault();
	list_proveedores();
});

// Evento clic para el boton guardar de proveedores...
btn_guardar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_g_proveedor();
});

// Evento clic para el boton editar de proveedores...
btn_editar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_e_proveedores();
});

// Evento clic para el boton de cancelar edición de proveedores...
btn_cancelar.addEventListener('click', (event) => {
	event.preventDefault();
	cancelEditProveedores();
});

// Boton de genear reporte de proveedores...
btn_reporte_proveedores.addEventListener('click', (event) => {
	reporte_proveedores_pdf();
});
