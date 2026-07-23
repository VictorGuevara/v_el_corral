/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  VARIABLES DEL FORMULARIO DE PRODUCTOS                     */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Formulario de guardar.
const form_productos = document.getElementById('form_productos');
const codigo = document.getElementById('cod_producto');
const nombre = document.getElementById('name_producto');
const descripcion = document.getElementById('des_producto');
const categoria = document.getElementById('cat_producto');
const precio = document.getElementById('precio_producto');
const ganancia = document.getElementById('gan_producto');
const marca = document.getElementById('marca_producto');

// Botones...
const btn_guardar = document.getElementById('btn_create_producto');
const btn_reporte_clientes = document.getElementById('bnt_gR_productos');
const btn_editar = document.getElementById('btn_update_producto');
const btn_cancelar = document.getElementById('btn_cancel_update_producto');
const chk_todos = document.getElementById('chk_proandser');
const chk_servicios = document.getElementById('chk_servicios');
const chk_productos = document.getElementById('chk_productos');

// Variables de utilidad.
const tbody_productos = document.getElementById('tableBody_productos');
const i_sProductos = document.getElementById('i_sProductos');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                  FUNCIONES DEL FORMULARIO DE PRODUCTOS                     */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Funcion que genera el listado de marcas en la etiqueta datalist...
const d_marcas = () => {
	let dl_marcas_proveedores = document.getElementById('marcas_proveedores');

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/list_marcas_proveedores', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			dl_marcas_proveedores.innerHTML = '';

			for (let i = 0; i < t_rows; i++) {
				dl_marcas_proveedores.innerHTML += `<option value="${datos.rows[i].marca_proveedor.toLowerCase()}"></option>`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que genera el código único del viajero...
const cod_producto = async () => {
	// consultamos para crecar el código del nuevo producto a registrar.
	let cod_g = await fetch('/acciones_inventario/count_productos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_productos;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_productos = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de productos registrados:
	let ctotal_productos = cod_g;

	// Creamos el codigo de cliente de estados unidos
	let cod_productoG = 'CC' + (num_a_productos + anio_actual) + (ctotal_productos + 1);

	// Retornamos el valor
	return cod_productoG; //?
};

// Función que guarda los productos...
const g_productos = async () => {
	// Ejecutamos la funcion de generan el código del producto...
	let codProveedor = await cod_producto();

	// Creamos el objeto de datos...
	let datos_productos = {
		cod_producto: codProveedor,
		nom_producto: nombre.value,
		des_producto: descripcion.value,
		exl_producto: 0,
		exm_producto: 5,
		cat_producto: categoria.value,
		pre_producto: precio.value,
		gan_producto: ganancia.value,
		mar_producto: marca.value,
		fecha_regis: fecha_actual,
		user_regist: nombre_user_esv,
	};

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/g_productos', {
		method: 'POST',
		body: JSON.stringify(datos_productos),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Se guardo el producto correctamente.') {
				Toast.fire({
					icon: 'success',
					title: datos.mensaje,
				});

				form_productos.reset();
				list_productos_g();
			} else if (datos.mensaje == 'Ya existe el producto con los dados proporcionados...') {
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

// Función que lista todos los productos en la tabla.
const list_productos_g = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sProductos.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/productos', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_productos.innerHTML = '';
			let contador = 0;

			for (let i = 0; i < t_rows; i++) {
				// Aumentamos el contador...
				contador++;

				tbody_productos.innerHTML += `
                <tr>
                    <td data-label="No.">${contador}</td>
                    <td data-label="Producto:">${datos.rows[i].nombre_producto}</td>
                    <td data-label="Descripcion:">${datos.rows[i].descripcion_producto}</td>
                    <td data-label="Existencias:">${datos.rows[i].existencia_total_lotes}</td>
                    <td data-label="Precio:">$ ${datos.rows[i].precio_producto}</td>
                    <td data-label="Margen:">${datos.rows[i].margen_ganancia} %</td>
                    <td data-label="Marca:">${datos.rows[i].marca_proveedor}</td>
                    <td data-label="Editar" class="center_text">
                        <a onclick="ll_dEditV('${datos.rows[i].codigo_producto}', '${datos.rows[i].nombre_producto}', '${datos.rows[i].descripcion_producto}', '${datos.rows[i].existencia_total_lotes}', '${datos.rows[i].existencia_minima}', '${datos.rows[i].categoria_producto}', '${datos.rows[i].precio_producto}', '${datos.rows[i].margen_ganancia}', '${datos.rows[i].marca_proveedor}')" class="btn_table_edit"><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    <td data-label="Eliminar" class="center_text">
                        <a onclick="deleteProductos('${datos.rows[i].codigo_producto}')" class="btn_table_delete"><i class="fa-solid fa-trash"></i></a>
                    </td>
                </tr>
            `;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista los Servicios.
const list_servicios = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sProductos.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/productos_servicio', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_productos.innerHTML = '';
			let contador = 0;

			for (let i = 0; i < t_rows; i++) {
				// Aumentamos el contador...
				contador++;

				tbody_productos.innerHTML += `
                <tr>
                    <td data-label="No.">${contador}</td>
                    <td data-label="Producto:">${datos.rows[i].nombre_producto}</td>
                    <td data-label="Descripcion:">${datos.rows[i].descripcion_producto}</td>
                    <td data-label="Existencias:">${datos.rows[i].existencia_total_lotes}</td>
                    <td data-label="Precio:">$ ${datos.rows[i].precio_producto}</td>
                    <td data-label="Margen:">${datos.rows[i].margen_ganancia} %</td>
                    <td data-label="Marca:">${datos.rows[i].marca_proveedor}</td>
                    <td data-label="Editar" class="center_text">
                        <a onclick="ll_dEditV('${datos.rows[i].codigo_producto}', '${datos.rows[i].nombre_producto}', '${datos.rows[i].descripcion_producto}', '${datos.rows[i].existencia_total_lotes}', '${datos.rows[i].existencia_minima}', '${datos.rows[i].categoria_producto}', '${datos.rows[i].precio_producto}', '${datos.rows[i].margen_ganancia}', '${datos.rows[i].marca_proveedor}')" class="btn_table_edit"><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    <td data-label="Eliminar" class="center_text">
                        <a onclick="deleteProductos('${datos.rows[i].codigo_producto}')" class="btn_table_delete"><i class="fa-solid fa-trash"></i></a>
                    </td>
                </tr>
            `;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que lista los productos diferentes de Mary Kay y los Servicios.
const list_productos = async () => {
	// Creamos el objeto para la busqueda
	let d_search = {
		d_text: i_sProductos.value,
	};

	// Consultamos...
	await fetch('/acciones_inventario/otros_productos_d_srv', {
		method: 'POST',
		body: JSON.stringify(d_search),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			tbody_productos.innerHTML = '';
			let contador = 0;

			for (let i = 0; i < t_rows; i++) {
				// Aumentamos el contador...
				contador++;

				tbody_productos.innerHTML += `
                <tr>
                    <td>${contador}</td>
                    <td>${datos.rows[i].nombre_producto}</td>
                    <td>${datos.rows[i].descripcion_producto}</td>
                    <td>${datos.rows[i].existencia_total_lotes}</td>
                    <td>$ ${datos.rows[i].precio_producto}</td>
                    <td>${datos.rows[i].margen_ganancia} %</td>
                    <td>${datos.rows[i].marca_proveedor}</td>
                    <td class="center_text">
                        <a onclick="ll_dEditV('${datos.rows[i].codigo_producto}', '${datos.rows[i].nombre_producto}', '${datos.rows[i].descripcion_producto}', '${datos.rows[i].existencia_total_lotes}', '${datos.rows[i].existencia_minima}', '${datos.rows[i].categoria_producto}', '${datos.rows[i].precio_producto}', '${datos.rows[i].margen_ganancia}', '${datos.rows[i].marca_proveedor}')" class="btn_table_edit"><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    <td class="center_text">
                        <a onclick="deleteProductos('${datos.rows[i].codigo_producto}')" class="btn_table_delete"><i class="fa-solid fa-trash"></i></a>
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
	d_marcas();
	cancelEditProductos();
	list_productos_g(); // Ejecutamos al inicio...
}, 150);

// Función que llena los datos en el formulario de editar...
const ll_dEditV = (d_codigo, d_nombre, d_descripcion, d_exis_t, d_exis_m, d_categoria, d_precio, d_margen, d_marca) => {
	// Limpiamos el formulario...
	form_productos.reset();

	// Agregamos los datos a los campos correspondientes.
	codigo.value = d_codigo;
	nombre.value = d_nombre;
	descripcion.value = d_descripcion;
	categoria.value = d_categoria;
	precio.value = d_precio;
	ganancia.value = d_margen;
	marca.value = d_marca;

	// Hacemos visibles los botones.
	btn_guardar.style.display = 'none';
	btn_editar.style.display = 'block';
	btn_cancelar.style.display = 'block';
};

// Función editar cargas.
const editProductos = async () => {
	// Creamos el objeto a enviar.
	let dU = {
		codigo_edit: codigo.value,
		nom_prod_edit: nombre.value,
		des_prod_edit: descripcion.value,
		cat_prod_edit: categoria.value,
		pre_prod_edit: precio.value,
		gan_prod_edit: ganancia.value,
		mar_prod_edit: marca.value,
		fecha_regis: fecha_actual,
		user_regist: nombre_user_esv,
	};

	// Consultamos...
	await fetch('/acciones_inventario/eProductos', {
		method: 'POST',
		body: JSON.stringify(dU),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Producto editado con exito.') {
				Swal.fire({
					icon: 'success',
					title: datos.mensaje,
				});
				cancelEditProductos();
				list_productos_g();
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función para cancelar edición de productos.
const cancelEditProductos = async () => {
	// Limpiamos el formulario...
	form_productos.reset();

	// Hacemos visibles los botones.
	btn_guardar.style.display = 'block';
	btn_editar.style.display = 'none';
	btn_cancelar.style.display = 'none';
};

// Función eliminar producto.
const deleteProductos = async (codCliente) => {
	// Creamos el objeto a enviar.
	let dD = {
		cod_cliente: codCliente,
	};

	// Mostramos el mensaje.
	Swal.fire({
		title: '¿Eliminar Producto?',
		text: '¡Los cambios no se podrán revertir!',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, Eliminar',
	}).then((result) => {
		if (result.dismiss == 'cancel') {
			Swal.fire('Operación Cancelada', 'No se eliminó el producto :)', 'error');
		} else if ((result.value = true)) {
			// Consultamos...
			fetch('/acciones_inventario/dProductos', {
				method: 'POST',
				body: JSON.stringify(dD),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					if (datos.mensaje == 'Producto eliminado con exito.') {
						Swal.fire('¡Eliminado!', datos.mensaje, 'success');
						list_productos_g();
					}
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});
		}
	});
};

// Validamos el formulario de agregar productos...
const valid_form_g_productos = () => {
	if (nombre.value == '') {
		nombre.focus();
	} else if (descripcion.value == '') {
		descripcion.focus();
	} else if (categoria.value == '') {
		categoria.focus();
	} else if (precio.value == '') {
		precio.focus();
	} else if (ganancia.value == '') {
		ganancia.focus();
	} else if (marca.value == '') {
		marca.focus();
	} else {
		g_productos();
	}
};

// Validamos el formulario de editar productos...
const valid_form_e_productos = () => {
	if (codigo.value == '') {
		codigo.focus();
	} else if (nombre.value == '') {
		nombre.focus();
	} else if (descripcion.value == '') {
		descripcion.focus();
	} else if (categoria.value == '') {
		categoria.focus();
	} else if (precio.value == '') {
		precio.focus();
	} else if (ganancia.value == '') {
		ganancia.focus();
	} else if (marca.value == '') {
		marca.focus();
	} else {
		editProductos();
	}
};

// Función para generar reporte de productos...
const reporte_productos_pdf = async () => {
	// Consultamos la fecha actual...
	let fecha = fecha_a();

	// Alerta...
	Swal.fire({
		title: '¿Crear reporte de productos?',
		showCancelButton: true,
		confirmButtonText: 'Crear Reporte',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			// Creamos un objeto para enviarlo.
			let dato_gmh = {
				fecha: fecha,
				user: nombre_user_esv,
			};

			return fetch('../../rp_pdf', {
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
					if (datos.d == 'OKRPVEC') {
						// Ejecutamos la función de descarga de machote...
						setTimeout(() => {
							descargar_recibos(datos.e, datos.f);
						}, 1500);

						// Alerta...
						return Swal.fire({
							position: 'center',
							icon: 'success',
							title: 'Reporte De Productos Creado.',
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

// Evento clic para el boton guardar de productos...
btn_guardar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_g_productos();
});

// Evento clic para el boton listar los productos...
i_sProductos.addEventListener('input', (event) => {
	event.preventDefault();
	list_productos_g();
});

// Evento clic para el boton editar de productos...
btn_editar.addEventListener('click', (event) => {
	event.preventDefault();
	valid_form_e_productos();
});

// Evento clic para el boton de cancelar edición de productos...
btn_cancelar.addEventListener('click', (event) => {
	event.preventDefault();
	cancelEditProductos();
});

// Boton de genear reporte de productos...
btn_reporte_clientes.addEventListener('click', (event) => {
	reporte_productos_pdf();
});

// Checkbox para lista de servicios.
chk_todos.addEventListener('change', () => {
	// Validamos...
	if (chk_todos.checked) {
		chk_productos.checked = false;
		chk_servicios.checked = false;
		list_productos_g();
	} else {
		chk_servicios.checked = false;
		// Listamos todos los productos.
		list_productos_g();
	}
});

// Checkbox para lista de servicios.
chk_servicios.addEventListener('change', () => {
	// Validamos...
	if (chk_servicios.checked) {
		chk_todos.checked = false;
		chk_productos.checked = false;
		list_servicios();
	} else {
		chk_servicios.checked = false;
		// Listamos todos los productos.
		list_productos_g();
	}
});

// Checkbox para lista de productos.
chk_productos.addEventListener('change', () => {
	// Validamos...
	if (chk_productos.checked) {
		chk_todos.checked = false;
		chk_servicios.checked = false;
		list_productos();
	} else {
		chk_productos.checked = false;
		// Listamos todos los productos.
		list_productos_g();
	}
});
