/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   VARIABLES DEL FORMULARIO DE VENTAS                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Formulario.
const formAddVentaV_E_C = document.getElementById('form_addVentaVetEC');

// campos de datos de factura de venta.
const codigo_cliente_venta = document.getElementById('codigoClienteVenta');
const nombre_cliente_venta = document.getElementById('nombreClienteVenta');
const telefono_cliente_venta = document.getElementById('telefonoClienteVenta');

/* Los campos de datos de productos se colocan el su respectiva función */

// Variables de autorizaciones de jefe...
let monto_descuento_sv = document.querySelector('#aMontoDescuentoVenta');
let detalle_Mdescuento_sv = document.querySelector('#aDesMontoDescuentoVenta');

// Totales
const d_tsubVentaCocoa = document.getElementById('tsub_ventaCocoa');
const d_tdesVentaCocoa = document.getElementById('tdes_ventaCocoa');
const d_totalVentaCocoa = document.getElementById('total_ventaCocoa');

// Variables de utilidad...
let dl_clientes_ventas = document.getElementById('clientes');
let dl_nombres_productos = document.getElementById('lista_productos');
const btn_addFProductos_venta = document.getElementById('btnAddFile');

// Botones...
const btn_guardarVenta = document.getElementById('btn_guardar_venta');
const btn_cierreVenta = document.getElementById('btn_cd_ventas');
const bnt_upd_dlProducto = document.getElementById('bnt_upd_dlProducto');

// Usuario...
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   FUNCIONES DEL FORMULARIO DE VENTAS                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */
let anio = new Date().getFullYear();

// Funcion para agregar filas de detalles de la venta.
const add_fila_venta = () => {
	document.querySelector('#btn_eliminar_fila_Pventa').disabled = false;
	document.querySelector('#btn_eliminar_fila_Pventa').classList.remove('dbd');
	let fila_clonar = document.querySelectorAll('tbody #file_aadFV_es_principal')[0];
	let body_AddNuevaFila = document.getElementById('body_aadFC_es_principal');

	let fila_clonada = fila_clonar.cloneNode(true);

	body_AddNuevaFila.appendChild(fila_clonada);
};

// Función que agrega la fila
function da_btnAddFile() {
	const btn_quitarFila = document.querySelectorAll('#btn_eliminar_fila_Pventa');
	let total_filas = document.querySelectorAll('#body_aadFC_es_principal tr');

	if (total_filas.length == 1) {
		[...btn_quitarFila][0].disabled = true;
		[...btn_quitarFila][0].classList.add('dbd');
	} else if (total_filas.length > 1) {
		[...btn_quitarFila][0].disabled = false;
		[...btn_quitarFila][0].classList.remove('dbd');
	}
}

// Función que limpia la fila a clonar
const limpiarfila = () => {
	let total_filas = document.querySelectorAll('#body_aadFC_es_principal tr');
	let NFF = 0;

	for (let i = 0; i < total_filas.length; i++) {
		NFF = i;
	}

	document.querySelectorAll('#cod_producto_venta')[NFF].value = '';
	document.querySelectorAll('#nombreP_Pventa')[NFF].value = '';
	document.querySelectorAll('#valosU_Pventa')[NFF].value = '';
	document.querySelectorAll('#valosU_Pventa')[NFF].disabled = true;
	document.querySelectorAll('#tipo_Pventa')[NFF].value = '';
	document.querySelectorAll('#cantidad_Pventa')[NFF].value = '';
	document.querySelectorAll('#subTotal_Pventa')[NFF].value = '';
};

// Funcion para quitar las filas agregadas
const deleteRowVenta = (btn) => {
	let row = btn.parentNode.parentNode;
	row.parentNode.removeChild(row);
	da_btnAddFile();
	sumatorias();
};

// Funcion que genera los productos en la etiqueta datalist...
const d_clientes = (nombre) => {
	// Ejecutamos la funcón para llenar los campos...
	ll_clientes(nombre);

	// Declaramos una variable...
	let n_cliente = 'a';

	// Validamos.
	if (nombre == '' || nombre == undefined) {
		np_list = 'a';
	} else {
		np_list = nombre.value;
	}

	let nClientes = {
		nombreC: n_cliente,
	};

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/list_clientes_ventas', {
		method: 'POST',
		body: JSON.stringify(nClientes),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			let t_rows = datos.rows.length;
			dl_clientes_ventas.innerHTML = '';

			for (let i = 0; i < t_rows; i++) {
				dl_clientes_ventas.innerHTML += `<option value="${datos.rows[i].nombre_cliente}"></option>`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Funcion que hace llenar los datos en las filas de productos...
const ll_clientes = async (campoNC) => {
	// Capturamos la fila de la tabla...
	let nc_list = 0;

	// Validamos.
	if (campoNC == '' || campoNC == undefined) {
		nc_list = 'a';
	} else {
		nc_list = campoNC.value;
	}

	// Creamos el objeto para enviar la consulta...
	let nombre_cliente = {
		nombre_cliente: nc_list,
	};

	// Enviamos los datos por cada iteración; para guardar los productos.
	let datos_ll_clientes = await fetch('/acciones_inventario/ll_clientes', {
		method: 'POST',
		body: JSON.stringify(nombre_cliente),
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

	// Dato del campo del nombre del producto...
	let lista_cliente = document.querySelectorAll('#clientes')[0];

	if (lista_cliente.querySelector("option[value='" + nc_list + "']")) {
		codigo_cliente_venta.value = '';
		codigo_cliente_venta.value = datos_ll_clientes.rows[0].codigo_cliente;
		telefono_cliente_venta.value = '';
		telefono_cliente_venta.value = datos_ll_clientes.rows[0].tel_cliente;
	}
};

// Funcion que genera los productos en la etiqueta datalist...
const d_productos = (nombreP) => {
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
	fetch('/acciones_inventario/list_f_productos_ventas', {
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
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

/* Ejecutamos la función al inicio de la aplicacion */
setTimeout(async () => {
	await d_clientes();
	await d_productos();
	await da_btnAddFile();
}, 150);

// Funcion que hace llenar los datos en las filas de productos...
const ll_productos = async (element) => {
	// Capturamos la fila de la tabla...
	let tr = element.parentNode.parentNode;

	// Validamos.
	if (tr.children[0].children[2].value == '') {
		let nombre_dP_vacio = 'a';
		d_productos(nombre_dP_vacio);
	} else {
		let nombre_dP_nv = tr.children[0].children[2].value;
		d_productos(nombre_dP_nv);
	}

	setTimeout(() => {
		if (tr.children[2].children[1].value == 'Servicio') {
			tr.children[1].children[1].disabled = false;
			tr.children[1].children[1].value = '';
			tr.children[1].children[1].focus();
		} else {
			tr.children[1].children[1].disabled = true;
		}
	}, 250);

	// Creamos el objeto para enviar la consulta...
	let nombre_p = {
		nombre_p: tr.children[0].children[2].value,
	};

	// Enviamos los datos por cada iteración; para guardar los productos.
	let datos_ll = await fetch('/acciones_inventario/ll_f_productos_ventas', {
		method: 'POST',
		body: JSON.stringify(nombre_p),
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

	// Dato del campo del nombre del producto...
	let dnProducto = tr.children[0].children[2].value;
	let lista_producto = document.querySelectorAll('#lista_productos')[0];

	if (lista_producto.querySelector("option[value='" + dnProducto + "']")) {
		tr.children[0].children[0].value = '';
		tr.children[0].children[0].value = datos_ll.rows[0].codigo_producto;
		tr.children[1].children[1].value = '';
		tr.children[1].children[1].value = datos_ll.rows[0].precio_producto;
		tr.children[2].children[1].value = '';
		tr.children[2].children[1].value = datos_ll.rows[0].categoria_producto;
		tr.children[2].children[2].value = '';
		tr.children[2].children[2].value = datos_ll.rows[0].marca_proveedor;
		tr.children[3].children[1].value = '';
		tr.children[3].children[1].focus();
	}
};

// Función que limpia el campo de nombre de producto...
const lf = (element) => {
	// Capturamos la fila de la tabla...
	let tr_l = element.parentNode.parentNode;

	// Dato del campo del nombre del producto...
	let dnProducto_l = tr_l.children[2].children[1].value;
	let lista_producto_l = document.querySelectorAll('#lista_productos')[0];

	// Condicionamos para limpiar...
	if (lista_producto_l.querySelector("option[value='" + dnProducto_l + "']")) {
		tr_l.children[0].children[0].value = '';
		tr_l.children[0].children[2].value = '';
		tr_l.children[1].children[1].value = '';
		tr_l.children[2].children[1].value = '';
		tr_l.children[3].children[1].value = '';
		tr_l.children[4].children[1].value = '';
		d_productos(tr_l.children[0].children[2].value);
	} else {
		tr_l.children[0].children[0].value = '';
		tr_l.children[0].children[2].value = '';
		tr_l.children[1].children[1].value = '';
		tr_l.children[2].children[1].value = '';
		tr_l.children[3].children[1].value = '';
		tr_l.children[4].children[1].value = '';
		d_productos(tr_l.children[0].children[2].value);
	}
};

// Función que calcula el monto a descontar
const calc_desc_ja = (porcentaje) => {
	let d = 0;
	let sub_t = d_tsubVentaCocoa.innerHTML;
	sub_t = parseFloat(sub_t);

	// Validamos
	if (porcentaje == '10% De descuento') {
		d = sub_t * 0.1;

		// Asignamos el valor al campo de descuento.
		monto_descuento_sv.value = d;

		// Ejecutamos la función de sumatoria.
		sumatorias();
	} else if (porcentaje == '15% De descuento') {
		d = sub_t * 0.15;

		// Asignamos el valor al campo de descuento.
		monto_descuento_sv.value = d;

		// Ejecutamos la función de sumatoria.
		sumatorias();
	} else if (porcentaje == '20% De descuento') {
		d = sub_t * 0.2;

		// Asignamos el valor al campo de descuento.
		monto_descuento_sv.value = d;

		// Ejecutamos la función de sumatoria.
		sumatorias();
	} else {
		monto_descuento_sv.value = 0;

		// Ejecutamos la función de sumatoria.
		sumatorias();
	}
};

// Función que hace las operaciones del formulario de ventas...
const sumatorias = () => {
	let tr_p_sv_s = document.querySelectorAll('#file_aadFV_es_principal');
	let nombre_p = document.querySelectorAll('#nombreP_Pventa');
	let tipo_p = document.querySelectorAll('#tipo_Pventa');
	let vUnit_p = document.querySelectorAll('#valosU_Pventa');
	let cantidad_p = document.querySelectorAll('#cantidad_Pventa');
	let subTotalF_p = document.querySelectorAll('#subTotal_Pventa');

	let contador_s = 0;
	let total_v_sc = 0;
	let total_v_om = 0;

	// Creamos un for, para recorrer las casillas...
	for (let items of tr_p_sv_s) {
		let ntr_s = contador_s++; /* Declaramos una variable iteradora */
		let tp_sp = tipo_p[ntr_s].value.toLowerCase();
		let stp_sp = subTotalF_p[ntr_s].value.toLowerCase();
		let nom_sp = nombre_p[ntr_s].value.toLowerCase();

		// Verificamos si los campos estan vacios...
		if (vUnit_p[ntr_s].value === '' || cantidad_p[ntr_s].value === '') {
			subTotalF_p[ntr_s].value = 0;
		} else {
			subTotalF_p[ntr_s].value = 0;
		}

		// Recorremos las filas para sumar el valor de los articulos...
		if (tp_sp == 'otros productos' && (stp_sp != null || stp_sp != 0 || stp_sp != '')) {
			// Creamos una variable que hace la multiplicación...
			let mp_om = parseFloat(vUnit_p[ntr_s].value) * parseFloat(cantidad_p[ntr_s].value);

			// Verificamos si los campos estan vacios...
			if (vUnit_p[ntr_s].value === '' || cantidad_p[ntr_s].value === '') {
				subTotalF_p[ntr_s].value = 0;
			} else {
				// Colocamos el resultado de la operación en el campo subtotal de la fila...
				subTotalF_p[ntr_s].value = mp_om.toFixed(2);
			}

			// Sumamos todos los subtotales de cada fila que sea de documento...
			total_v_om += parseFloat(subTotalF_p[ntr_s].value);
		} else if (tp_sp == 'servicio' && (stp_sp != null || stp_sp != 0 || stp_sp != '')) {
			// Creamos una variable que hace la multiplicación...
			let mp_om = parseFloat(vUnit_p[ntr_s].value) * parseFloat(cantidad_p[ntr_s].value);

			// Verificamos si los campos estan vacios...
			if (vUnit_p[ntr_s].value === '' || cantidad_p[ntr_s].value === '') {
				subTotalF_p[ntr_s].value = 0;
			} else {
				// Colocamos el resultado de la operación en el campo subtotal de la fila...
				subTotalF_p[ntr_s].value = mp_om.toFixed(2);
			}

			// Sumamos todos los subtotales de cada fila que sea de documento...
			total_v_sc += parseFloat(subTotalF_p[ntr_s].value);
		} else {
			total_v_sc += 0;
			total_v_om += 0;
		}
	}

	// Sumamos el aumento del jefe al subtotal...
	subtotal_s = Math.round(total_v_om) + Math.round(total_v_sc);

	// Sumamos todos los descuentos...
	descuentos_s = Math.round(monto_descuento_sv.value);

	// Hacemos la operaciòn para obtener el valor de la encomienda..
	m_total = Math.round(subtotal_s) - Math.round(descuentos_s);

	// Asignamos el valor a los elementos que repesentan la sumatoria en el formulario...
	d_tsubVentaCocoa.innerHTML = subtotal_s.toFixed(2);
	d_tdesVentaCocoa.innerHTML = descuentos_s.toFixed(2);
	d_totalVentaCocoa.innerHTML = m_total.toFixed(2);
};

// Función que guarda la venta.
const guardar_nueva_venta = async () => {
	let observaciones_venta = '';

	// consultamos para crecar el código de la venta.
	let cont_ventas = await fetch('/acciones_inventario/count_ventas', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_ventas;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_ventas = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de clientes Estados Unidos:
	let ctotal_ventas = cont_ventas;

	// Creamos el codigo de compra de estados unidos
	let cod_ventaG = 'VENT' + (num_a_ventas + anio_actual) + (parseInt(ctotal_ventas) + 1);

	// No. Facutura...
	let no_facturaVenta = 'VEC' + (num_a_ventas + anio_actual) + (parseInt(ctotal_ventas) + 1);

	/* ------------------------------------------------------------------------------------------ */
	/*                                      Codigo de kardex                                      */
	/* ------------------------------------------------------------------------------------------ */

	// consultamos para crecar el código de kardex.
	let cont_kardex = await fetch('/acciones_inventario/count_kardex', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_kardex;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_kardex = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de clientes Estados Unidos:
	let ctotal_kardex = cont_kardex;

	// Creamos el codigo de kardex
	let cod_kardexG = 'COMP' + (num_a_kardex + anio_actual) + (parseInt(ctotal_kardex) + 1);

	/* ------------------------------------------------------------------------------------------ */

	// Consultamos la fecha con la hora actual...
	let fecha_Hora = fecha_hora_a();
	let fecha = fecha_a();

	/* --- Obetenemos los datos de los compos dinámicos (Detalle de la compra). --- */
	// Asignamos las varables aqui; para que cada vez que ejecutemos la función se consulten las nuevas filas...
	let tr_dCompra_sv = document.querySelectorAll('#file_aadFV_es_principal');
	let codigo_producto = document.querySelectorAll('#cod_producto_venta');
	let nombre_producto = document.querySelectorAll('#nombreP_Pventa');
	let tipo_producto = document.querySelectorAll('#tipo_Pventa');
	let marca_producto = document.querySelectorAll('#marca_Pventa');
	let vUnit_producto = document.querySelectorAll('#valosU_Pventa');
	let cantidad_producto = document.querySelectorAll('#cantidad_Pventa');
	let subTotalF_producto = document.querySelectorAll('#subTotal_Pventa');

	// Datos para kardex...
	let detalle_kardex_venta = '';

	// Declaramos un contador.
	let contador_enc = 0;

	// Array de datos a guardar
	let add_nuevaCompra = [];
	let a_nuevaCompra = [];
	let a_nDatoInventario = [];
	let a_nDatoKardex = [];

	// Recorremos las fijas tr; para enviar los datos de los productos...
	for (let item of tr_dCompra_sv) {
		let ntr = contador_enc++; /* Declaramos una variable iteradora */

		// Creamos el dato de existencia en lotes para inventarios...
		let cod_p = {
			codigo_p: codigo_producto[ntr].value,
		};

		/* --------------------------------------------------------------------------------------------------- */

		// Cremaos una variable para guardar el tipo de producto y la cantidad de producto...
		let tipo_producto_servicio_venta = tipo_producto[ntr].value.toLowerCase();
		let cant_producto_venta = cantidad_producto[ntr].value;

		// Condicionamos para que el producto no sea servicio...
		if (tipo_producto_servicio_venta !== 'servicio') {
			/* --------------------------------------------------------------------------------------------------- */
			/*         Creamos un ciclo para actualizar los productos en inventario por lotes uno por uno          */
			/* --------------------------------------------------------------------------------------------------- */

			for (let item_lote = 0; item_lote < cant_producto_venta; item_lote++) {
				// Consultamos para saber la existencia total por lotes...
				await fetch('/acciones_inventario/existencia_lote_inventario', {
					method: 'POST',
					body: JSON.stringify(cod_p),
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((response) => response.json())
					.then(async (datos) => {
						// Operamos para tener la nueva cantidad total de existencias del producto...
						let existencia_lote = datos.dato_existencias;
						let codproduc_invent = datos.codigo_producto;
						let numerolot_invent = datos.no_lote_invetario;
						let nueva_existencia_lote = --existencia_lote;

						// Cremaos el objeto...
						let d_update_existencia_lotes = {
							cod_producto: codproduc_invent,
							new_cantidad: nueva_existencia_lote,
							num_loteInve: numerolot_invent,
						};

						// Consultamos para actualizar la existencia en lotes de inventario...
						await fetch('/acciones_inventario/update_existencias_lotes', {
							method: 'POST',
							body: JSON.stringify(d_update_existencia_lotes),
							headers: {
								'Content-Type': 'application/json',
							},
						})
							.then((response) => response.json())
							.then(async (datos) => {})
							.catch((error) => {
								console.error('Ocurrio un error: ', error);
							});
					})
					.catch((error) => {
						console.error('Ocurrio un error: ', error);
					});
			}

			/* --------------------------------------------------------------------------------------------------- */
			/*               Consultamos para actualizar el monto total de existencias en productor                */
			/* --------------------------------------------------------------------------------------------------- */

			await fetch('/acciones_inventario/existencia_total_lotes_inventario', {
				method: 'POST',
				body: JSON.stringify(cod_p),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then(async (datos) => {
					let existencias_lote = datos.existencias;
					let codigo_producto = datos.codigo_producto;

					// Cremaos el objeto...
					let d_update_existencia_producto = {
						cod_producto: codigo_producto,
						new_cantidad: existencias_lote,
					};

					await fetch('/acciones_inventario/update_existencias_totales_productos', {
						method: 'POST',
						body: JSON.stringify(d_update_existencia_producto),
						headers: {
							'Content-Type': 'application/json',
						},
					})
						.then((response) => response.json())
						.then((datos) => {
							// console.log(datos.mensaje);
						})
						.catch((error) => {
							console.error('Ocurrio un error: ', error);
						});
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});
		}

		/* --------------------------------------------------------------------------------------------------- */

		let existencias_inventario = await fetch('/acciones_inventario/existencias_inventario', {
			method: 'POST',
			body: JSON.stringify(cod_p),
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

		// Variables de los datos traidos de la base de datos.
		let existencias_producto_kardex = existencias_inventario.cant_existencias;
		let valor_existencias_producto_kardex = existencias_inventario.valor_existencias;

		// Variables de operación...
		let entrada_producto_valorTotal = 0;
		let existencias_producto_Total = 0;
		let existencias_producto_valorTotal = 0;

		if (existencias_producto_kardex > 0) {
			detalle_kardex_venta = 'Venta según factura No. ' + no_facturaVenta;
			existencias_producto_Total = parseInt(existencias_producto_kardex) - parseInt(cantidad_producto[ntr].value);
			existencias_producto_valorTotal =
				parseFloat(valor_existencias_producto_kardex) - parseFloat(subTotalF_producto[ntr].value);
		} else {
			detalle_kardex_venta = 'Venta inicial según factura No. ' + no_facturaVenta;

			existencias_producto_Total = parseInt(cantidad_producto[ntr].value);
			existencias_producto_valorTotal = parseFloat(subTotalF_producto[ntr].value);
		}

		// Valor total de compra del producto.
		entrada_producto_valorTotal = parseFloat(cantidad_producto[ntr].value) * parseFloat(vUnit_producto[ntr].value);

		/* --------------------------------------------------------------------------------------------------- */

		// Validamos que las filas del detalle de la compra este llena por completo...
		if (
			nombre_producto[ntr].value == '' ||
			tipo_producto[ntr].value == '' ||
			vUnit_producto[ntr].value == '' ||
			cantidad_producto[ntr].value == '' ||
			subTotalF_producto[ntr].value == ''
		) {
			// No hacer nada; ya que no necesitamos guardar las filas que están vacías...
		} else {
			cod_ventaG = cod_ventaG + ntr;
			// cod_inventarioG = cod_inventarioG + ntr;
			cod_kardexG = cod_kardexG + ntr;

			// Creamos el objeto de datos de la venta.
			let datos_compra = [
				cod_ventaG,

				// campos de datos de factura de venta.
				no_facturaVenta,

				// Datos del cliente...
				codigo_cliente_venta.value,
				nombre_cliente_venta.value,
				telefono_cliente_venta.value,

				// Valores del detalle.
				codigo_producto[ntr].value,
				nombre_producto[ntr].value,
				vUnit_producto[ntr].value,
				tipo_producto[ntr].value,
				marca_producto[ntr].value,
				cantidad_producto[ntr].value,
				subTotalF_producto[ntr].value,

				// Valores de los totales.

				d_tsubVentaCocoa.innerHTML,
				d_tdesVentaCocoa.innerHTML,
				d_totalVentaCocoa.innerHTML,

				// Datos de usuario...
				fecha_Hora,
				nombre_user_esv,
			];

			// Agregamos el array de la fila al array principal
			a_nuevaCompra.push(datos_compra);

			// Validamos que solo se genere cuando no sea un servicio del salon...
			if (tipo_producto_servicio_venta !== 'servicio') {
				// Tomamos el costo promedio acumulado del inventario
				let costoPromedio =
					existencias_producto_kardex > 0
						? valor_existencias_producto_kardex / existencias_producto_kardex
						: parseFloat(vUnit_producto[ntr].value);

				// Recalcular existencias después de la salida
				let nuevaExistenciaCantidad = parseInt(existencias_producto_kardex) - parseInt(cantidad_producto[ntr].value);
				let nuevaExistenciaValorTotal =
					parseFloat(valor_existencias_producto_kardex) - parseInt(cantidad_producto[ntr].value) * costoPromedio;

				// Evitar negativos
				if (nuevaExistenciaCantidad < 0) nuevaExistenciaCantidad = 0;
				if (nuevaExistenciaValorTotal < 0) nuevaExistenciaValorTotal = 0;

				// Nuevo valor unitario
				let nuevoValorUnitario = nuevaExistenciaCantidad > 0 ? nuevaExistenciaValorTotal / nuevaExistenciaCantidad : 0;

				// Creamos el objeto de datos para la tabla de kardex...
				let datos_kardex = [
					cod_kardexG,

					// Datos de productos.
					codigo_producto[ntr].value,
					nombre_producto[ntr].value,
					1,
					fecha,
					fecha_Hora,
					detalle_kardex_venta,

					// Entradas...
					0,
					0,
					0,

					// Salidas.
					cantidad_producto[ntr].value,
					costoPromedio,
					cantidad_producto[ntr].value * costoPromedio,

					// Existencias
					existencias_producto_Total,
					nuevoValorUnitario,
					nuevaExistenciaValorTotal,
				];

				// Agregamos el array de la fila al array principal
				a_nDatoKardex.push(datos_kardex);
			}

			// a_nDatoInventario.push(datos_inventario);
		}

		add_nuevaCompra.push(a_nuevaCompra);
		// add_nuevaCompra.push(a_nDatoInventario);
		add_nuevaCompra.push(a_nDatoKardex);
	}

	// Enviamos los datos por cada iteración; para guardar los productos.
	fetch('/acciones_inventario/g_venta', {
		method: 'POST',
		body: JSON.stringify(add_nuevaCompra),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Venta guardada con exito.') {
				Swal.fire({
					title: 'Venta Realizada!',
					text: datos.mensaje,
					icon: 'success',
				});
				setTimeout(async () => {
					await imprimir(a_nuevaCompra);
					await formAddVentaV_E_C.reset();
					await sumatorias();
				}, 500);
			} else if (datos.mensaje == 'Ya existe el codigo o numero de factura para la venta...') {
				Swal.fire({
					title: 'Venta No Realizada!',
					text: datos.mensaje,
					icon: 'warning',
				});
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Función que valida el fomulario de compras...
const validate_form_ventas = () => {
	// Validamos campo por campo (todos los que son requeridos).
	if (nombre_cliente_venta.value == '') {
		nombre_cliente_venta.focus();
	} else if (telefono_cliente_venta.value == '') {
		telefono_cliente_venta.focus();
	} else {
		// Ejecutamos para guardar clientes despues de 1/2 segundo.
		setTimeout(async () => {
			//g_producto();
			await guardar_nueva_venta();
		}, 125);
	}
};

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
					if (datos.d == 'OKLCVDCOCOA') {
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

// Función de imprimir...
const imprimir = async (datos) => {
	let count_array = datos.length;
	// Formateamos número de telefono de El Salvador...
	let parte_tel_sv_1 = datos[0][4].slice(0, 4);
	let parte_tel_sv_2 = datos[0][4].slice(4, 8);
	telefono_sv = `${parte_tel_sv_1} - ${parte_tel_sv_2}`;
	// Colocamos los datos en el orden correspondiente.
	let div_stickersPak = document.querySelector('#stickersPak');

	let filas = '';
	for (let index = 0; index < count_array; index++) {
		filas += `
			<tr class="tr_stickers">
				<td>${datos[index][6]}</td>
				<td class="valor">$ ${datos[index][7]}</td>
			</tr>
		`;
	}

	// Varibable del valor a copiar...
	let separador_dato = '--------------------------------';
	let html_stickersPak = `
		<div class="stikers_venta_cocoa">
			<div class="img">
				<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iOTkwLjAwMDAwMHB0IiBoZWlnaHQ9IjQ0My4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDk5MC4wMDAwMDAgNDQzLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNDQzLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTEyNzUgMzkzMyBjLTE5NCAtMzAgLTM4NyAtMTQwIC01MTQgLTI5MyAtMTQzIC0xNzIgLTIxNiAtMzc5IC0yMjgKLTY0NSAtOSAtMjExIDIzIC0zODYgMTAxIC01NTAgMTA1IC0yMjEgMjczIC0zNjkgNTA2IC00NDcgOTAgLTMwIDEwMyAtMzEgMjU1Ci0zMiAxMzcgLTEgMTcyIDIgMjQzIDIyIDE4NSA1MCAzMjggMTU1IDQ0MiAzMjMgbDM4IDU1IC01NiAzMSAtNTcgMzIgLTMwIC00MgpjLTE0MCAtMTk2IC0zMjUgLTI5MCAtNTcwIC0yOTAgLTIwMCAwIC0zNDMgNTQgLTQ3NCAxNzggLTE2NCAxNTUgLTI0NCAzNDIKLTI1OCA2MDUgLTE2IDMxMSA3OCA1NzAgMjc0IDc1MCA3NCA2NyAyMDUgMTM4IDMwMyAxNjIgNzkgMTkgMjc5IDE2IDM1OSAtNgoxMjYgLTM0IDI0NyAtMTE1IDMzMiAtMjIwIGw1MiAtNjUgMzYgMTkgYzgyIDQyIDgxIDM5IDIyIDExOSAtMTA0IDE0MCAtMjIxCjIyMiAtMzg5IDI3MyAtNTEgMTUgLTEwMiAyMSAtMjEyIDIzIC04MCAyIC0xNTggMSAtMTc1IC0yeiIvPgo8cGF0aCBkPSJNMzAxNyAzOTMwIGMtNDA5IC03NCAtNjcxIC0zNzkgLTcyOCAtODUwIC0xOSAtMTU2IDMgLTM3NiA1MSAtNTIwCjEwMCAtMjk5IDMxNCAtNTAwIDYxMCAtNTc2IDExMSAtMjggMzYzIC0yNiA0NzUgNSAxNjcgNDUgMzE5IDEzOCA0MjAgMjU3IDE1MAoxNzcgMjIwIDM3NiAyMzIgNjU0IDE0IDM1MCAtNjkgNTkyIC0yNzIgNzk1IC0xMTggMTE4IC0yMjkgMTgyIC0zODUgMjIyIC02NgoxNyAtMzM1IDI2IC00MDMgMTN6IG0zOTggLTE1MiBjMzQ3IC0xMDIgNTM5IC00MjEgNTIyIC04NjggLTExIC0yODMgLTc0IC00NDcKLTIzNyAtNjEwIC0xNDkgLTE1MCAtMjg2IC0yMDMgLTUyNSAtMjAzIC0xMTkgMCAtMTUyIDQgLTIyMCAyNCAtMzYzIDExMCAtNTY0CjQ2NiAtNTI2IDkyNiAxMiAxNDAgMzIgMjIyIDc2IDMxOSA3NyAxNjkgMTk3IDI5NiAzNDcgMzY4IDUxIDI0IDExOCA0OSAxNDgKNTUgMzAgNiA2NCAxMyA3NSAxNSAxMSAzIDc0IDMgMTQwIDEgODggLTIgMTQxIC0xMCAyMDAgLTI3eiIvPgo8cGF0aCBkPSJNNTAzMCAzOTM0IGMtMTcwIC0zMyAtMzE4IC0xMDYgLTQzMiAtMjEzIC0xMzcgLTEyOSAtMjIzIC0yNzUgLTI3NQotNDY5IC0yNSAtOTAgLTI3IC0xMTIgLTI3IC0zMTIgMCAtMjAxIDIgLTIyMSAyNiAtMzExIDUyIC0xOTAgMTI4IC0zMjAgMjY1Ci00NDkgOTQgLTg5IDE2NCAtMTMyIDI3NSAtMTcxIDEwNCAtMzUgMTg4IC00OSAzMDMgLTQ5IDIzMSAwIDQyMiA3NyA1NzUgMjMxCjQ1IDQ3IDEzMCAxNTkgMTMwIDE3MyAwIDIgLTI1IDE4IC01NSAzNCBsLTU1IDMwIC0zMCAtNDMgYy00MyAtNjMgLTE0MSAtMTU1Ci0yMDQgLTE5NCAtMjExIC0xMjcgLTUxMyAtMTI4IC03MjYgLTQgLTM1IDIxIC05OCA3MiAtMTQwIDExMyAtNjIgNjIgLTg1IDk1Ci0xMjggMTgwIC04MiAxNjQgLTk2IDIyOCAtOTYgNDU1IDAgMTYzIDMgMjAyIDIyIDI3NyA5OSAzOTUgNDMxIDYzOCA4MDUgNTkwCjE4MSAtMjMgMjk0IC04MSA0MTIgLTIxMiAyMiAtMjUgNDggLTU2IDU3IC02OSBsMTcgLTIzIDU2IDMyIDU2IDMyIC0xNyAyNwpjLTc0IDExNiAtMTgyIDIxNiAtMjg5IDI2OSAtMTIxIDYwIC0xODYgNzQgLTM1MCA3OCAtODIgMSAtMTYxIDAgLTE3NSAtMnoiLz4KPHBhdGggZD0iTTY3NTEgMzkyNSBjLTM3MSAtNjcgLTY0MCAtMzc1IC03MDEgLTgwMCAtNSAtMzggLTEwIC0xMTkgLTEwIC0xODAKMCAtMTk5IDM0IC0zNTQgMTEwIC01MTAgMTA5IC0yMjQgMjk3IC0zODEgNTM2IC00NDcgNjcgLTE4IDEwNSAtMjEgMjQ5IC0yMQoxODggMCAyNjggMTQgMzkyIDczIDE2MiA3NiAzMTUgMjI1IDM5NyAzODcgMTQzIDI4NSAxNTIgNzIxIDIxIDEwMDkgLTEyMiAyNjgKLTM1NSA0NDggLTYzNyA0OTQgLTg2IDE0IC0yNjcgMTEgLTM1NyAtNXogbTQwNCAtMTQwIGMxNDEgLTM4IDI4NCAtMTMzIDM3MAotMjQ3IDEzMSAtMTczIDE5NCAtNDM0IDE2NyAtNjk2IC0xNiAtMTU1IC00MSAtMjQ4IC05OSAtMzYyIC02NiAtMTMyIC0xODEKLTI0OCAtMzAzIC0zMDggLTExNyAtNTcgLTE5OSAtNzUgLTM0NSAtNzYgLTE1MCAtMSAtMjI1IDE0IC0zNDMgNzEgLTE1MiA3MgotMjgyIDIxMiAtMzQ3IDM3MiAtNTUgMTMzIC02OSAyMjEgLTY5IDQxMSAwIDE0OSAzIDE4OCAyMyAyNjUgODEgMzE4IDI5OCA1MzEKNTk2IDU4NSA3MCAxMyAyNzggNCAzNTAgLTE1eiIvPgo8cGF0aCBkPSJNODYxNyAzOTAzIGMtMyAtNCAtMTQ5IC0zOTkgLTMyNSAtODc4IC0xNzYgLTQ3OCAtMzM0IC05MDcgLTM1MQotOTUzIGwtMzEgLTgzIDcxIDMgNzEgMyAxMTEgMjk4IDExMCAyOTcgMzk4IDAgMzk3IDAgMTAgLTI3IGM3MyAtMjA1IDIwNgotNTYwIDIxMSAtNTY2IDUgLTQgMzcgLTcgNzMgLTUgbDY1IDMgLTM0NiA5NTUgLTM0NyA5NTUgLTU2IDMgYy0zMSAyIC01OCAtMQotNjEgLTV6IG0yMzEgLTcwMSBjOTUgLTI1MSAxNzIgLTQ2MCAxNzIgLTQ2NCAwIC01IC0xNTggLTggLTM1MSAtOCAtMzMwIDAKLTM1MSAxIC0zNDcgMTggMTMgNDQgMzIwIDg3NiAzMzEgODkzIDYgMTAgMTQgMTkgMTcgMTkgMyAwIDgzIC0yMDYgMTc4IC00NTh6Ii8+CjxwYXRoIGQ9Ik0yODgwIDg4NSBjMCAtMjI5IDIgLTI2NSAxNSAtMjY1IDEzIDAgMTUgMzYgMTUgMjY1IDAgMjI5IC0yIDI2NQotMTUgMjY1IC0xMyAwIC0xNSAtMzYgLTE1IC0yNjV6Ii8+CjxwYXRoIGQ9Ik00NDQwIDg4NSBjMCAtMTcwIDQgLTI2NSAxMCAtMjY1IDYgMCAxMCA5NSAxMCAyNjUgMCAxNzAgLTQgMjY1IC0xMAoyNjUgLTYgMCAtMTAgLTk1IC0xMCAtMjY1eiIvPgo8cGF0aCBkPSJNNjc2MCA4ODUgYzAgLTIyOSAyIC0yNjUgMTUgLTI2NSAxMyAwIDE1IDM2IDE1IDI2NSAwIDIyOSAtMiAyNjUKLTE1IDI2NSAtMTMgMCAtMTUgLTM2IC0xNSAtMjY1eiIvPgo8cGF0aCBkPSJNMTk2MCA5NDAgYzAgLTE3MSAyIC0yMDAgMTUgLTIwMCAxMyAwIDE1IDI5IDE1IDIwMCAwIDE3MSAtMiAyMDAKLTE1IDIwMCAtMTMgMCAtMTUgLTI5IC0xNSAtMjAweiIvPgo8cGF0aCBkPSJNMzg3MCA5NDAgYzAgLTEyNyA0IC0yMDAgMTAgLTIwMCA2IDAgMTAgNzMgMTAgMjAwIDAgMTI3IC00IDIwMCAtMTAKMjAwIC02IDAgLTEwIC03MyAtMTAgLTIwMHoiLz4KPHBhdGggZD0iTTU0NzAgOTQwIGMwIC0xMjcgNCAtMjAwIDEwIC0yMDAgNiAwIDEwIDI3IDEwIDYyIGwwIDYyIDYzIC02MiBjODYKLTg2IDEwMyAtNzggMjMgMTAgbC02NiA3MiA2MiA2MyBjMzQgMzUgNTYgNjMgNDggNjMgLTggMCAtNDAgLTI2IC03MiAtNTcKbC01OCAtNTcgMCAxMjIgYzAgNzUgLTQgMTIyIC0xMCAxMjIgLTYgMCAtMTAgLTczIC0xMCAtMjAweiIvPgo8cGF0aCBkPSJNNzEyMCA5NDAgYzAgLTEyNyA0IC0yMDAgMTAgLTIwMCA2IDAgMTAgNyAxMCAxNiAwIDE0IDIgMTQgMjIgMCAyOQotMjEgMTA3IC0yMCAxMzcgMCA2OCA0OCA2OCAyMDAgLTEgMjQ4IC0zMSAyMiAtODYgMjAgLTEyNSAtNCBsLTMzIC0yMCAwIDgwCmMwIDQ3IC00IDgwIC0xMCA4MCAtNiAwIC0xMCAtNzMgLTEwIC0yMDB6IG0xNjggMzUgYzcyIC02MSAzMyAtMjE1IC01NCAtMjE1Ci02NiAwIC0xMDAgNDcgLTkyIDEzMCA5IDk0IDg0IDEzOCAxNDYgODV6Ii8+CjxwYXRoIGQ9Ik0zNzUyIDEwOTMgYzUgLTI2IDM4IC0yOSAzOCAtNCAwIDE1IC02IDIxIC0yMSAyMSAtMTQgMCAtMTkgLTUgLTE3Ci0xN3oiLz4KPHBhdGggZD0iTTE1MDkgOTk5IGMtMTQgLTE0IC0xOSAtMzAgLTE3IC01NyAzIC0zNCA3IC0zOSA2MyAtNjcgNDkgLTI1IDYxCi0zNSA2MyAtNTggMiAtMTYgLTIgLTM1IC05IC00MyAtMTcgLTIxIC03MyAtMTggLTk0IDYgLTIxIDI0IC0zNSAyNiAtMzUgNiAwCi00NCAxMTMgLTYzIDE1MCAtMjYgMjMgMjMgMjYgNjggNiA5NSAtNyAxMCAtMzggMzAgLTY3IDQ0IC00NCAyMSAtNTQgMzEgLTU0CjUxIDAgMTYgOSAyOSAyOCA0MCAyNSAxNCAzMCAxMyA1OCAtMiAzNyAtMjIgNTAgLTIzIDQzIC00IC0xNCAzNyAtMTAzIDQ3Ci0xMzUgMTV6Ii8+CjxwYXRoIGQ9Ik0xNzMwIDk5NCBjLTIxIC0xOCAtMjggLTMwIC0yMSAtMzcgNyAtNyAxNiAtMyAyOCAxMSAxMCAxMiAzMiAyNSA1MAoyOCAyNiA1IDM3IDEgNTcgLTE5IDM5IC0zOSAzNCAtNjUgLTExIC03MiAtNjQgLTEwIC0xMTAgLTI0IC0xMjIgLTM4IC0yMyAtMjgKLTIzIC03MSAtMSAtMTAwIDE4IC0yMiAyOSAtMjcgNjYgLTI3IDI1IDAgNTYgNyA2OSAxNiAyMyAxNSAyNSAxNSAyNSAwIDAgLTkKNSAtMTYgMTAgLTE2IDYgMCAxMCA0NSAxMCAxMTUgMCAxMTAgLTEgMTE3IC0yNSAxNDAgLTM0IDM1IC05MyAzNCAtMTM1IC0xegptMTQwIC0xNDUgYzAgLTQxIC00NyAtODkgLTg5IC04OSAtNjggMCAtODMgNzIgLTIxIDEwMiAxOSAxMCA1MiAxOCA3MyAxOCAzNQowIDM3IC0yIDM3IC0zMXoiLz4KPHBhdGggZD0iTTIxMDMgMTAwMCBjLTc4IC00NyAtODYgLTE3MSAtMTcgLTIzNSAyMiAtMjAgMzggLTI1IDc5IC0yNSA2MSAwIDk5CjI0IDEyMSA3NiA1NCAxMzAgLTY5IDI1NCAtMTgzIDE4NHogbTE0MCAtNDAgYzU2IC02MiAyNiAtMTgyIC00OSAtMTk2IC03NQotMTQgLTEyNyAzMSAtMTI3IDExMSAwIDEwOSAxMDcgMTYwIDE3NiA4NXoiLz4KPHBhdGggZD0iTTI0MDIgMTAwNCBjLTEyIC04IC0yMiAtMTAgLTIyIC01IDAgNiAtNyAxMSAtMTUgMTEgLTEzIDAgLTE1IC0yMgotMTUgLTEzNSAwIC0xMTMgMiAtMTM1IDE1IC0xMzUgMTIgMCAxNSAxOCAxNSAxMDMgMCA5MCAzIDEwNiAyMCAxMjUgMzEgMzMgNjcKMzggOTggMTUgMjYgLTE5IDI3IC0yNCAzMCAtMTMyIDIgLTkwIDUgLTExMSAxNyAtMTExIDEyIDAgMTUgMTkgMTUgMTAwIDAgMTA3Ci0xMyAxNTAgLTQ5IDE3MCAtMjkgMTUgLTgzIDEyIC0xMDkgLTZ6Ii8+CjxwYXRoIGQ9Ik0zMjgyIDEwMDQgYy0xMiAtOCAtMjIgLTEwIC0yMiAtNSAwIDYgLTcgMTEgLTE1IDExIC0xMyAwIC0xNSAtMjIKLTE1IC0xMzUgMCAtMTEzIDIgLTEzNSAxNSAtMTM1IDEyIDAgMTUgMTggMTUgMTAzIDAgOTAgMyAxMDYgMjAgMTI1IDMxIDMzIDY3CjM4IDk4IDE1IDI2IC0xOSAyNyAtMjQgMzAgLTEzMiAyIC05MCA1IC0xMTEgMTcgLTExMSAxMiAwIDE1IDE5IDE1IDEwMCAwIDEwNwotMTMgMTUwIC00OSAxNzAgLTI5IDE1IC04MyAxMiAtMTA5IC02eiIvPgo8cGF0aCBkPSJNMzUzMCA5OTQgYy0yMSAtMTggLTI4IC0zMCAtMjEgLTM3IDcgLTcgMTYgLTMgMjggMTEgMTAgMTIgMzIgMjUgNTAKMjggMjYgNSAzNyAxIDU3IC0xOSAzOSAtMzkgMzQgLTY1IC0xMSAtNzIgLTY0IC0xMCAtMTEwIC0yNCAtMTIyIC0zOCAtMjMgLTI4Ci0yMyAtNzEgLTEgLTEwMCAxOCAtMjIgMjkgLTI3IDY2IC0yNyAyNSAwIDU2IDcgNjkgMTYgMjMgMTUgMjUgMTUgMjUgMCAwIC05CjUgLTE2IDEwIC0xNiA2IDAgMTAgNDUgMTAgMTE1IDAgMTEwIC0xIDExNyAtMjUgMTQwIC0zNCAzNSAtOTMgMzQgLTEzNSAtMXoKbTE0MCAtMTQ1IGMwIC00MSAtNDcgLTg5IC04OSAtODkgLTY4IDAgLTgzIDcyIC0yMSAxMDIgMTkgMTAgNTIgMTggNzMgMTggMzUKMCAzNyAtMiAzNyAtMzF6Ii8+CjxwYXRoIGQ9Ik0zOTgyIDk5NyBjLTIyIC0yMyAtMjggLTYyIC0xNCAtODQgNCAtNiAzMiAtMjQgNjEgLTQwIDY5IC0zNiA4MAotNTMgNTggLTg3IC0yMiAtMzMgLTc1IC0zNiAtMTAyIC02IC0yMCAyMiAtMzUgMjYgLTM1IDEwIDAgLTI2IDQxIC01MCA4NSAtNTAKNTYgMCA4NSAyNSA4NSA3MyAwIDQwIC0xOCA1OCAtODEgODUgLTUwIDIyIC02NSA0MyAtNDkgNzMgMTYgMjggNTQgMzQgODkgMTMKMzggLTIyIDU1IC05IDIyIDE3IC0zMyAyNyAtOTIgMjUgLTExOSAtNHoiLz4KPHBhdGggZD0iTTQ4NDIgMTAwNCBjLTEyIC04IC0yMiAtMTAgLTIyIC01IDAgNiAtNyAxMSAtMTUgMTEgLTEzIDAgLTE1IC0yMgotMTUgLTEzNSAwIC0xMTMgMiAtMTM1IDE1IC0xMzUgMTIgMCAxNSAxOCAxNSAxMDQgMCA4NCAzIDEwOCAxOCAxMjQgMjYgMzIgNjQKMzcgOTIgMTQgMjMgLTE5IDI1IC0yOCAyOCAtMTMxIDMgLTYxIDggLTExMSAxMyAtMTExIDUgMCA5IDQ1IDkgMTAxIDAgOTggMQoxMDEgMjkgMTMwIDM2IDM1IDU0IDM2IDg2IDQgMjMgLTIzIDI1IC0zMSAyNSAtMTMwIDAgLTg3IDMgLTEwNSAxNSAtMTA1IDEyIDAKMTUgMTYgMTUgODggMCAxMDMgLTEzIDE1NiAtNDMgMTc3IC0zMiAyMyAtODQgMTkgLTExMSAtOCBsLTIzIC0yMyAtMjEgMjMKYy0yNCAyNyAtNzYgMzEgLTExMCA3eiIvPgo8cGF0aCBkPSJNNTIzNiA5OTkgYy0xNCAtMTEgLTI2IC0yNyAtMjYgLTM1IDAgLTIwIDEwIC0xOCAzNyA4IDMwIDI4IDkwIDMwCjEwOSAzIDI1IC0zMyAxOCAtNjMgLTE2IC02OSAtMTYgLTMgLTQzIC05IC02MCAtMTIgLTQ4IC05IC04MCAtNDEgLTgwIC04MCAwCi00OCAyOSAtNzQgODMgLTc0IDIzIDAgNTMgNyA2NSAxNiAyMCAxNCAyMiAxNCAyMiAwIDAgLTkgNyAtMTYgMTUgLTE2IDEyIDAKMTUgMTkgMTUgMTExIDAgMTA5IDAgMTExIC0yOSAxNDAgLTM3IDM2IC05NCA0MCAtMTM1IDh6IG0xMzQgLTE1NCBjMCAtNDggLTM2Ci04NSAtODQgLTg1IC03MyAwIC04NCA4OCAtMTQgMTA5IDE4IDUgNDggMTAgNjYgMTAgMzAgMSAzMiAtMSAzMiAtMzR6Ii8+CjxwYXRoIGQ9Ik01NzEwIDk5MyBjLTc2IC02OCAtNTMgLTIyNyAzNiAtMjUyIDQ4IC0xMyA4OCAtNCAxMjAgMjcgMzEgMzIgMTQKNDIgLTIyIDEzIC01OCAtNDUgLTEzOSAtMTIgLTE1MSA2MiBsLTYgMzcgMTAyIDAgYzk5IDAgMTAxIDAgMTAxIDI0IDAgMTAxCi0xMDcgMTU0IC0xODAgODl6IG0xMDUgLTMgYzI1IC05IDU4IC02NiA0OSAtODIgLTMgLTUgLTQzIC04IC05MCAtOCAtOTAgMAotOTUgNCAtNzAgNDkgMTMgMjQgNTEgNTAgNzMgNTEgNiAwIDIzIC00IDM4IC0xMHoiLz4KPHBhdGggZD0iTTYyNzcgMTAwMCBjLTMwIC0yNCAtMzcgLTI1IC0zNyAtNSAwIDggLTQgMTUgLTEwIDE1IC02IDAgLTEwIC03MgotMTAgLTE5NSAwIC0xMjMgNCAtMTk1IDEwIC0xOTUgNiAwIDEwIDMwIDEwIDcxIDAgNjQgMiA3MCAxOCA2NCA3NCAtMzEgMTM0Ci0xOSAxNzAgMzUgMjEgMzAgMjMgNDQgMjAgMTA0IC0zIDYyIC03IDcxIC0zNiA5NyAtNDAgMzYgLTk2IDM5IC0xMzUgOXogbTk3Ci0xMSBjNzIgLTMzIDcxIC0xODUgLTEgLTIxOCAtMzcgLTE3IC03MCAtMTMgLTk5IDEyIC01MyA0NiAtMzggMTcyIDI2IDIwNCAzMQoxNiA0MyAxNiA3NCAyeiIvPgo8cGF0aCBkPSJNNzQ1MyAxMDA0IGMtMTQgLTEwIC0yMyAtMTIgLTIzIC01IDAgNiAtNCAxMSAtMTAgMTEgLTYgMCAtMTAgLTUyCi0xMCAtMTM1IDAgLTc0IDQgLTEzNSA5IC0xMzUgNSAwIDExIDQ3IDEzIDEwNSAzIDkyIDYgMTA3IDI1IDEyNyAxMyAxMiAzNSAyMgo1MCAyMyAxNiAwIDI4IDUgMjggMTAgMCAxNyAtNTggMTYgLTgyIC0xeiIvPgo8cGF0aCBkPSJNNzYwMyA5ODcgYy0zMiAtMzAgLTM3IC00MSAtNDEgLTkwIC04IC0xMDUgMzMgLTE1NyAxMjQgLTE1NyA0NCAwCjU5IDUgODQgMjggNjggNjAgNTcgMTk3IC0yMCAyMzcgLTUxIDI2IC0xMDUgMjAgLTE0NyAtMTh6IG0xMjEgMyBjNzEgLTI3IDg3Ci0xNDggMjcgLTIwMiAtMzYgLTMyIC04NCAtMzcgLTEyMCAtMTIgLTI1IDE4IC01MSA3MSAtNTEgMTA1IDAgMzggMzIgOTEgNjQKMTA1IDM4IDE2IDQ4IDE3IDgwIDR6Ii8+CjxwYXRoIGQ9Ik04MjMyIDk5NyBjLTIyIC0yMyAtMjggLTYyIC0xNCAtODQgNCAtNiAzMiAtMjQgNjEgLTQwIDY5IC0zNiA4MAotNTMgNTggLTg3IC0yMiAtMzMgLTc1IC0zNiAtMTAyIC02IC0yMCAyMiAtMzUgMjYgLTM1IDEwIDAgLTI2IDQxIC01MCA4NSAtNTAKNTYgMCA4NSAyNSA4NSA3MyAwIDQwIC0xOCA1OCAtODEgODUgLTUwIDIyIC02NSA0MyAtNDkgNzMgMTYgMjggNTQgMzQgODkgMTMKMzggLTIyIDU1IC05IDIyIDE3IC0zMyAyNyAtOTIgMjUgLTExOSAtNHoiLz4KPHBhdGggZD0iTTM3NjAgODc1IGMwIC04MyA0IC0xMzUgMTAgLTEzNSA2IDAgMTAgNTIgMTAgMTM1IDAgODMgLTQgMTM1IC0xMAoxMzUgLTYgMCAtMTAgLTUyIC0xMCAtMTM1eiIvPgo8cGF0aCBkPSJNNTk0MCA5MTAgYzAgLTEwNSAxMyAtMTUxIDQ1IC0xNjQgMzIgLTEyIDk4IC02IDExNyAxMSAxNyAxNSAxOCAxNQoxOCAwIDAgLTEwIDcgLTE3IDE1IC0xNyAxMyAwIDE1IDIyIDE1IDEzNSAwIDExMyAtMiAxMzUgLTE1IDEzNSAtMTIgMCAtMTUKLTE4IC0xNSAtMTAwIDAgLTk0IC0yIC0xMDMgLTI1IC0xMjUgLTI1IC0yNiAtNjMgLTMyIC05NSAtMTUgLTI2IDE0IC00MCA3MAotNDAgMTYzIDAgNDQgLTQgNzcgLTEwIDc3IC02IDAgLTEwIC00MCAtMTAgLTEwMHoiLz4KPHBhdGggZD0iTTc4NDIgOTk0IGM0OCAtMTc3IDc0IC0yNTQgODMgLTI1NCA3IDAgMjYgNDcgNDQgMTA1IDE4IDU4IDM0IDEwNQozNSAxMDUgMiAwIDE2IC00NyAzMSAtMTA1IDE2IC02MCAzMyAtMTA1IDQwIC0xMDUgNyAwIDIwIDI2IDI5IDU4IDkgMzEgMjcgOTIKNDAgMTM1IDE4IDU2IDIxIDc3IDEyIDc3IC04IDAgLTI2IC00NCAtNDUgLTEwNSAtMTggLTU4IC0zNCAtMTA1IC0zNSAtMTA1IC0yCjAgLTE1IDQ3IC0zMSAxMDUgLTE1IDU4IC0zMyAxMDUgLTM5IDEwNSAtNyAwIC0yNyAtNDggLTQ1IC0xMDcgLTE5IC02MCAtMzUKLTEwMyAtMzcgLTk4IC0yIDYgLTE2IDUyIC0zMiAxMDQgLTE1IDUyIC0zNCA5NyAtNDEgOTkgLTEwIDMgLTEyIC0xIC05IC0xNHoiLz4KPC9nPgo8L3N2Zz4K" alt="">
			</div>
			<p class="text">- Atención De Lunes A Sábado</p>
			<p class="text">- Abierto De 8:00 a. m. - 5:30 p. m.</p>
			<p class="text">- Tel.: +503 6109 - 4705</p>
			<p class="text">- Barrio La Parroquia, 6a Avenida Norte y 8a Calle Ote. Usulután, Usulután</p>
			<p class="text">${separador_dato}</p>
			<h4 class="text">Datos Del Cliente:</h4>
			<p class="text_m_i">- ${datos[0][3]}</p>
			<p class="text">- ${telefono_sv}</p>
			<p class="text">${separador_dato}</p>
			<h4 class="text">Comprobante Simplificado</h4>
			<p class="text">- Venta: ${datos[0][1]}</p>
			<p class="text">- Fecha: ${fecha_hora_a()}</p>
			<p class="text">${separador_dato}</p>
			<table>
				<thead>
					<tr class="tr_stickers">
						<th>Producto</th>
						<th>Valor $</th>
					</tr>
				</thead>
				<tbody>
					${filas}
				</tbody>
			</table>
			<br>
			<p class="text_m_i">Subtotal: $ ${datos[0][15]} </p>
			<p class="text">Descuento: $ ${datos[0][16]}</p>
			<p class="text">Total: $ ${datos[0][17]}</p>
			<br>
			<div class="img">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnsAAAJ7AQMAAACh+sXUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP///6XZn90AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMBSURBVHja7d1BTisxDIDhPHXRZY8wR+Fo9GhzlByhSxZV/TpJnNiZIITgSZnX3xuGJvMxiCLLiQNhEO/yjI8Qlu3jww1dRNbt42kbypc+FkBAQEBAwJnBPKgRN/CpnNNn127+xc19gu7zD0BAQEBAwPnBW5l/aqCJbOvEt+0yaEYVuZdZfwABAQEBAQ8J5pSo83JyHeROQEBAQEDA/wCsxaMUeym5M0dSLoCAgICAgIcETZjicdmWTGsadZHv+dYaLCAgICAg4PfBXWjWi+6yT3Xa2OIDEBAQEBBwYlBGUdOoWFC0KFRwFICAgICAgPOCKS6tEExlYq0Y3RZfUMUUj/qVU7PnGRAQEBAQcGowjWh21Ki5U7frQpc7dTOvPkQ94wcICAgICDgvaEIHjfIuo+g3CmMBWl4GBAQEBAScEdSUqMfwzDqphi8e13Yp7Z4rICAgICDgEUBph88HJxceYR/D4rFsLgICAgICAs4M3tvM3akIjcUN6KtvrY5sY4CAgICAgNOC6ZWcRlXpj0LkkC78PfUrAwICAgIC/hrYN6loftN9PVPrnVzbi7m09SEgICAgIODkYGj7esGtcF5tD6e4pdBbV+sBAgICAgIeABRNibvVyhYx+HybYy33pDQq+6MQgICAgICAc4GmJtTBFL6HU0tKUzEaMEWuMgEBAQEBAScGh4NV0eIxgabtJfQZFRAQEBAQ8ACgKmvYhTmGF7v2mPt+Yv4rZvJ6YORbfoEnBPw5yPsQcI6fsoziMbDNkml6ybfUXHXib4Ph9Z4Q8OfgwhsbcAKQ3+UJwa/+05AJ00ej9lpeXcpDnKX12LwOGAHnA3nbAAICfgr6nhhtdclRs2Nr/1y7ThlTRwICAgICAh4A9O0xDqxLq30aNbG45wEEBAQEBPyXoFnh/PS8nrQEqHEGBAQEBAQ8Hih9D6eCqlS7gXUiICAgICDg1KCJ2Pb1xLRm2ltz+G6WL/b1AAEBAQEB5wB3ocWjzgttX+/mulmkNKIBAgICAgIeAJT4F1STZXqFmQZiAAAAAElFTkSuQmCC" alt="">
			</div>
		</div>
	`;

	// Generamos el stickers...
	div_stickersPak.innerHTML = '';
	div_stickersPak.innerHTML = html_stickersPak;

	setTimeout(async () => {
		var printContents = document.getElementById('stikers_venta_cocoa').innerHTML;
		w = window.open(' ', 'popimpr');
		w.document.write(printContents);
		w.document.close(); // necessary for IE >= 10
		w.focus(); // necessary for IE >= 10
		w.print();
		w.close();

		// Colocamos el puntero despues de imprimir o cancelar.
		await nombre_cliente_venta.focus();
	}, 1000);
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             EVENTOS LISTENER                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

btn_addFProductos_venta.addEventListener('click', (event) => {
	event.preventDefault();
	add_fila_venta();
	da_btnAddFile();
	limpiarfila();
});

// Boton de guardar compra...
btn_guardarVenta.addEventListener('click', (event) => {
	event.preventDefault();
	validate_form_ventas();
});

// Boton de cierre de ventas...
btn_cierreVenta.addEventListener('click', (event) => {
	cierre_ventas();
});
