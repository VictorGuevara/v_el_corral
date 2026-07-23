/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Campos de filtros.
let input_dato_busqueda = document.getElementById('busqueda_usuarios');
let btn_buscar_usuarios = document.getElementById('btn_search_usuarios');
let tbody_usuarios = document.getElementById('tableBody_usuarios');

// Contenedores.
let box_clave = document.getElementById('box_clave_user');
let box_repetir_clave = document.getElementById('box_repetir_clave_user');
let box_estado = document.getElementById('box_estado_user');

// Formulario.
const formulario_usuarios = document.getElementById('form_usuarios');
const i_id_usuario = document.getElementById('id_usuario');
const i_nombre_usuario = document.getElementById('name_user');
const i_clave_usuario = document.getElementById('password_user');
const i_repetir_clave = document.getElementById('password_user_repeat');
const i_nombre_empleado = document.getElementById('name_personal');
const i_num_dui = document.getElementById('n_dui');
const i_cargo_usuario = document.getElementById('cargo_user');
const i_estado_usuario = document.getElementById('estado_user');
const i_sucursal_asignada = document.getElementById('sucursal_destinada');
const btn_crear_usuario = document.getElementById('btn_create_user');
const btn_editar_usuario = document.getElementById('btn_update_user');
const btn_cancelar_edit = document.getElementById('btn_cancel_update_user');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 FUNCIONES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const add_users = async () => {
	let data_form_u = {
		nombre_usuario: i_nombre_usuario.value,
		clave_usuario: i_clave_usuario.value,
		nombre_empleado: i_nombre_empleado.value,
		num_dui: i_num_dui.value,
		cargo_usuario: i_cargo_usuario.value,
		sucursal_asignada: i_sucursal_asignada.value,
	};

	const isEmpty = (input) => input.value.trim() === '';
	const isInvalidDUI = (dui) => {
		const val = dui.value;
		const repeated = Array.from({ length: 10 }, (_, i) => String(i).repeat(9));
		const sequential = ['012345678', '123456789'];
		return val.length !== 9 || repeated.includes(val) || sequential.includes(val);
	};

	if (isEmpty(i_nombre_usuario)) {
		i_nombre_usuario.focus();
	} else if (isEmpty(i_clave_usuario)) {
		i_clave_usuario.focus();
	} else if (isEmpty(i_repetir_clave)) {
		i_repetir_clave.focus();
	} else if (i_clave_usuario.value !== i_repetir_clave.value) {
		Swal.fire({
			icon: 'warning',
			title: 'Las contraseñas no coinciden.',
			timer: 2500,
		});
		i_repetir_clave.focus();
	} else if (isEmpty(i_num_dui) || isInvalidDUI(i_num_dui)) {
		i_num_dui.focus();
	} else if (isEmpty(i_nombre_empleado)) {
		i_nombre_empleado.focus();
	} else if (isEmpty(i_cargo_usuario)) {
		i_cargo_usuario.focus();
	} else if (isEmpty(i_sucursal_asignada)) {
		i_sucursal_asignada.focus();
	} else {
		try {
			const response = await fetch('/usuarios/regis_user', {
				method: 'POST',
				body: JSON.stringify(data_form_u),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const datos = await response.json();

			if (datos.mensaje === 'Usuario guardado con exito.') {
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: datos.mensaje,
				});
				formulario_usuarios.reset();
				list_usuarios();
				i_nombre_usuario.focus();
			} else if (datos.mensaje === 'Usuario registrado') {
				Swal.fire({
					position: 'center',
					icon: 'error',
					title: 'Ya existe el usuario que intenta registrar.',
					timer: 3000,
				});
			}
		} catch (error) {
			console.error('Ocurrio un error: ', error);
		}
	}
};

// Función que genera el listado de usuarios en la tabla.
const list_usuarios = async () => {
	// Creamos el objeto de busqueda y datos del paginado...
	const datos_busqueda = {
		nombre_empleado: input_dato_busqueda.value,
		page: num_pagina,
		limit: limite_paginas,
	};

	// Validamos.
	try {
		// Hacemos la consulta.
		const res = await fetch('/usuarios/list_usuarios', {
			method: 'POST',
			body: JSON.stringify(datos_busqueda),
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await res.json();
		const datos = data[0];
		const t_filas = data[1];
		let contador = data[2];

		total_paginas = Math.ceil(t_filas / limite_paginas);

		// Limpiamos el cuerpo de la tabla.
		tbody_usuarios.innerHTML = '';

		// Pintamos los datos.
		for (let i = 0; i < datos.length; i++) {
			contador++;
			tbody_usuarios.innerHTML += `
                <tr>
                    <td data-label="No." class="center_number">${contador}</td>
                    <td data-label="Código:">${datos[i].cod_users}</td>
                    <td data-label="Nombre:">${datos[i].nombre_c}</td>
                    <td data-label="DUI:">${datos[i].no_dui}</td>
                    <td data-label="Usuario:">${datos[i].username}</td>
                    <td data-label="Cargo">${datos[i].cargo}</td>
                    <td data-label="Estado:">${datos[i].estado_cuenta}</td>
                    <td data-label="Sucursal:">${datos[i].sucursal_user}</td>
                    <td data-label="Editar" class="center_text">
                        <button class="btn_table_edit" onclick="cargar_dUser_edit('${datos[i].cod_users}')"><i class="ti-pencil-alt"></i></button>
                    </td>
                    <td data-label="Eliminar" class="center_text">
                        <button class="btn_table_delete" onclick="eliminar_usuario('${datos[i].cod_users}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
		}

		// Ejecutamos la
		actualizarBotonesNumericos();
	} catch (error) {
		console.error('Ocurrió un error: ', error);
	}
};

// Función que carga los datos en le formulario para editar
const cargar_dUser_edit = async (id_usuario) => {
	await fetch(`/usuarios/cargar_usuario`, {
		method: 'POST',
		body: JSON.stringify({
			cod_user: id_usuario,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((usuario) => {
			// Llenamos los campos...
			i_id_usuario.value = usuario[0].cod_users;
			i_nombre_usuario.value = usuario[0].username;
			i_num_dui.value = usuario[0].no_dui;
			i_cargo_usuario.value = usuario[0].cargo;
			i_nombre_empleado.value = usuario[0].nombre_c;
			i_estado_usuario.value = usuario[0].estado_cuenta;
			i_sucursal_asignada.value = usuario[0].sucursal_user;

			// Guardamos el ID en un atributo oculto o variable global
			i_nombre_usuario.dataset.id_usuario = id_usuario;

			// Cambiamos los campos.
			box_clave.style.display = 'none';
			box_repetir_clave.style.display = 'none';
			box_estado.style.display = 'block';

			// Cambiamos botones
			btn_crear_usuario.style.display = 'none';
			btn_editar_usuario.style.display = 'block';
			btn_cancelar_edit.style.display = 'block';
		})
		.catch((error) => {
			console.error('Error al cargar usuario:', error);
		});
};

// Cancelar edición.
const cancelar_edicion = () => {
	// Cambiamos los campos.
	box_clave.style.display = 'block';
	box_repetir_clave.style.display = 'block';
	box_estado.style.display = 'none';

	// Cambiamos botones
	btn_crear_usuario.style.display = 'block';
	btn_editar_usuario.style.display = 'none';
	btn_cancelar_edit.style.display = 'none';

	// Reseteamos el formulario.
	formulario_usuarios.reset();

	// Colocamos el focus.
	i_nombre_usuario.focus();
};

// Función editar usuario.
const editar_usuario = async () => {
	let data_form_u = {
		id_usuario: i_id_usuario.value,
		nombre_usuario: i_nombre_usuario.value,
		nombre_empleado: i_nombre_empleado.value,
		num_dui: i_num_dui.value,
		cargo_usuario: i_cargo_usuario.value,
		estado_usuario: i_estado_usuario.value,
		sucursal_asignada: i_sucursal_asignada.value,
	};

	const isEmpty = (input) => input.value.trim() === '';
	const isInvalidDUI = (dui) => {
		const val = dui.value;
		const repeated = Array.from({ length: 10 }, (_, i) => String(i).repeat(9));
		const sequential = ['012345678', '123456789'];
		return val.length !== 9 || repeated.includes(val) || sequential.includes(val);
	};

	if (isEmpty(i_nombre_usuario)) {
		i_nombre_usuario.focus();
	} else if (isEmpty(i_num_dui) || isInvalidDUI(i_num_dui)) {
		i_num_dui.focus();
	} else if (isEmpty(i_nombre_empleado)) {
		i_nombre_empleado.focus();
	} else if (isEmpty(i_cargo_usuario)) {
		i_cargo_usuario.focus();
	} else if (isEmpty(i_sucursal_asignada)) {
		i_sucursal_asignada.focus();
	} else {
		try {
			const response = await fetch('/usuarios/edit_user', {
				method: 'POST',
				body: JSON.stringify(data_form_u),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const datos = await response.json();

			if (datos.mensaje === 'Usuario editado con exito.') {
				Toast.fire({
					icon: 'success',
					title: datos.mensaje,
				});
				formulario_usuarios.reset();
				list_usuarios();
				i_nombre_usuario.focus();
				cancelar_edicion();
			} else if (datos.mensaje === 'El número de DUI ya está registrado en otro usuario.') {
				Swal.fire({
					position: 'center',
					icon: 'error',
					title: 'Ya existe el usuario que intenta actualizar.',
					timer: 3000,
				});
			}
		} catch (error) {
			console.error('Ocurrio un error: ', error);
		}
	}
};

// Función eliminar un usuario.
const eliminar_usuario = async (cod_usuario) => {
	let dD = {
		cod_user: cod_usuario,
	};

	Swal.fire({
		title: '¿Eliminar Usuario?',
		text: '¡Los cambios no se podrán revertir!',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, Eliminar',
	}).then((result) => {
		if (result.dismiss == 'cancel') {
			Swal.fire('Operación Cancelada', 'No se eliminó el usuario 🙂', 'info');
		} else if (result.value == true) {
			fetch('/usuarios/eliminar_usuario', {
				method: 'POST',
				body: JSON.stringify(dD),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					const mensaje = datos.mensaje;

					if (mensaje === 'Usuario eliminado con exito.') {
						Swal.fire('¡Eliminado!', mensaje, 'success');
						list_usuarios();
					} else if (mensaje === 'No se puede eliminar el último administrador.') {
						Swal.fire({
							icon: 'warning',
							title: 'Acción bloqueada',
							text: 'Este es el último administrador registrado. No se puede eliminar.',
							timer: 3500,
						});
					} else if (mensaje === 'Usuario no encontrado.') {
						Swal.fire({
							icon: 'error',
							title: 'Usuario no encontrado',
							text: 'No se pudo localizar el usuario en la base de datos.',
							timer: 3000,
						});
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Error inesperado',
							text: mensaje || 'No se pudo completar la operación.',
							timer: 3000,
						});
					}
				})
				.catch((error) => {
					console.error('Ocurrió un error: ', error);
					Swal.fire({
						icon: 'error',
						title: 'Error de conexión',
						text: 'No se pudo conectar con el servidor.',
						timer: 3000,
					});
				});
		}
	});
};

// Retrazamos esta ejecución 15 milisegundos...
setTimeout(() => {
	cancelar_edicion();
	list_usuarios(); // Ejecutamos al inicio...
}, 150);

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                  EVENTOS                                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función clic para el boton de crear usuario.
btn_crear_usuario.addEventListener('click', async (event) => {
	event.preventDefault();
	await add_users();
});

// Evento de escritura para el campo de busqueda.
input_dato_busqueda.addEventListener('input', async (event) => {
	event.preventDefault();
	await list_usuarios();
});

// Evento clic para el boton de buscar.
btn_buscar_usuarios.addEventListener('click', async (event) => {
	event.preventDefault();
	await list_usuarios();
});

// Evento clic para el boton de cancelar edicion.
btn_cancelar_edit.addEventListener('click', async (event) => {
	event.preventDefault();
	await cancelar_edicion();
});

// Evento clic para el boton de editar usuario.
btn_editar_usuario.addEventListener('click', async (event) => {
	event.preventDefault();
	await editar_usuario();
});
