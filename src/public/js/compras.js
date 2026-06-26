/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   VARIABLES DEL FORMULARIO DE COMPRAS                      */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// campos de datos de factura de compra.
const no_factura_compra = document.getElementById('noFacturaCompra');
const codigoProveedor_compra = document.getElementById('codigoProveedorCompra');
const nombreProveedor_compra = document.getElementById('nombreProveedorCompra');
const tipo_compra = document.getElementById('tipo_compra');

// Campos de datos de credito...
const i_pPago_Compra = document.getElementById('pPagoCompra');
const i_noCuotas_Compra = document.getElementById('noCuotasCompra');
const i_fInPago_Compra = document.getElementById('fInPagoCompra');
const i_estadoCred_Compra = document.getElementById('estadoCompraCred');

/* Los campos de datos de productos se colocan el su respectiva función */

// Totales
const d_tsubCompraVeterinaria = document.getElementById('tsub_compraVeterinaria');
const d_tdesCompraVeterinaria = document.getElementById('tdes_compraVeterinaria');
const d_totalCompraVeterinaria = document.getElementById('total_compraVeterinaria');

// Observaciones...
const i_observaciones_compra = document.querySelector('#observaciones_compra');

// Datos de utilidad...
let dl_nombres_productos = document.getElementById('lista_productos');
const btn_addFProductos_compra = document.getElementById('btnAddFile');
const bnt_upd_dlProducto = document.getElementById('bnt_upd_dlProducto');
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;

// Botones...
const btn_guardarCompra = document.getElementById('btn_guardar_compra');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                   FUNCIONES DEL FORMULARIO DE COMPRAS                      */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Cambio de tipo de compra...
const cambio_tipo_compra = () => {
	if (tipo_compra.value === 'credito') {
		i_pPago_Compra.disabled = false;
		i_noCuotas_Compra.disabled = false;
		i_fInPago_Compra.disabled = false;
		i_estadoCred_Compra.disabled = false;
		// Limpiamos los campos...
		i_pPago_Compra.focus();
		i_pPago_Compra.value = '';
		i_noCuotas_Compra.value = '';
		i_fInPago_Compra.value = '';
		i_estadoCred_Compra.value = '';
	} else {
		i_pPago_Compra.disabled = true;
		i_noCuotas_Compra.disabled = true;
		i_fInPago_Compra.disabled = true;
		i_estadoCred_Compra.disabled = true;
		// Limpiamos los campos...
		i_pPago_Compra.value = '';
		i_noCuotas_Compra.value = '';
		i_fInPago_Compra.value = '';
		i_estadoCred_Compra.value = '';
	}
};

// Funcion para agregar filas de detalles de la compra.
const add_fila_compra = () => {
	document.querySelector('#btn_eliminar_fila_Pcompra').disabled = false;
	document.querySelector('#btn_eliminar_fila_Pcompra').classList.remove('dbd');
	let fila_clonar = document.querySelectorAll('tbody #file_aadFC_es_principal')[0];
	let body_AddNuevaFila = document.getElementById('body_aadFC_es_principal');

	let fila_clonada = fila_clonar.cloneNode(true);

	body_AddNuevaFila.appendChild(fila_clonada);
};

// Función que agrega la fila
function da_btnAddFile() {
	const btn_quitarFila = document.querySelectorAll('#btn_eliminar_fila_Pcompra');
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

	document.querySelectorAll('#cod_producto_compra')[NFF].value = '';
	document.querySelectorAll('#nombreP_Pcompra')[NFF].value = '';
	document.querySelectorAll('#valosU_Pcompra')[NFF].value = '';
	document.querySelectorAll('#tipo_Pcompra')[NFF].value = '';
	document.querySelectorAll('#cantidad_Pcompra')[NFF].value = '';
	document.querySelectorAll('#subTotal_Pcompra')[NFF].value = '';
};

// Funcion para quitar las filas agregadas
const deleteRowCompra = (btn) => {
	let row = btn.parentNode.parentNode;
	row.parentNode.removeChild(row);
	da_btnAddFile();
	sumatorias();
};

// Funcion que genera el listado proveedores en la etiqueta datalist...
const dcod_proveedore = () => {
	let dato = {
		nompre_proveedor: nombreProveedor_compra.value,
	};

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/cod_proveedor_compra', {
		method: 'POST',
		body: JSON.stringify(dato),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			codigoProveedor_compra.value = datos.rows[0].codigo_proveedor;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
};

// Funcion que genera el listado proveedores en la etiqueta datalist...
const dList_proveedores = () => {
	let dl_marcas_proveedores = document.getElementById('nombres_proveedores');

	// Enviamos los datos por caja iteración; para guardar los productos.
	fetch('/acciones_inventario/list_proveedores_compras', {
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
				dl_marcas_proveedores.innerHTML += `<option value="${datos.rows[i].nombre_proveedor.toLowerCase()}"></option>`;
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
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
	fetch('/acciones_inventario/list_f_productos', {
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
	await cambio_tipo_compra();
	await d_productos();
	await dList_proveedores();
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

	// Creamos el objeto para enviar la consulta...
	let nombre_p = {
		nombre_p: tr.children[0].children[2].value,
	};

	// Enviamos los datos por cada iteración; para guardar los productos.
	let datos_ll = await fetch('/acciones_inventario/ll_f_productos', {
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
		tr.children[2].children[1].value = '';
		tr.children[2].children[3].value = '';
		tr.children[2].children[4].value = '';
		tr.children[2].children[1].value = datos_ll.rows[0].categoria_producto;
		tr.children[2].children[2].value = '';
		tr.children[2].children[2].value = datos_ll.rows[0].marca_proveedor;
		tr.children[3].children[1].value = '';
		tr.children[1].children[1].focus();
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
		tr_l.children[2].children[2].value = '';
		tr_l.children[3].children[1].value = '';
		tr_l.children[4].children[1].value = '';
		d_productos(tr_l.children[0].children[2].value);
	} else {
		tr_l.children[0].children[0].value = '';
		tr_l.children[0].children[2].value = '';
		tr_l.children[1].children[1].value = '';
		tr_l.children[2].children[1].value = '';
		tr_l.children[2].children[2].value = '';
		tr_l.children[3].children[1].value = '';
		tr_l.children[4].children[1].value = '';
		d_productos(tr_l.children[0].children[2].value);
	}
};

// Función que hace las operaciones del formulario de compras...
const sumatorias = () => {
	let tr_p_sv_s = document.querySelectorAll('#file_aadFC_es_principal');
	let nombre_p = document.querySelectorAll('#nombreP_Pcompra');
	let tipo_p = document.querySelectorAll('#tipo_Pcompra');
	let vUnit_p = document.querySelectorAll('#valosU_Pcompra');
	let cantidad_p = document.querySelectorAll('#cantidad_Pcompra');
	let subTotalF_p = document.querySelectorAll('#subTotal_Pcompra');

	let contador_s = 0;
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
		} else {
			total_v_om += 0;
		}
	}

	// Sumamos el aumento del jefe al subtotal...
	subtotal_s = Math.round(total_v_om);

	// Sumamos todos los descuentos...
	descuentos_s = 0;

	// Hacemos la operaciòn para obtener el valor de la compra..
	m_total = Math.round(subtotal_s) - Math.round(descuentos_s);

	// Asignamos el valor a los elementos que repesentan la sumatoria en el formulario...
	d_tsubCompraVeterinaria.innerHTML = subtotal_s.toFixed(2);
	d_tdesCompraVeterinaria.innerHTML = descuentos_s.toFixed(2);
	d_totalCompraVeterinaria.innerHTML = m_total.toFixed(2);
};

// Función que guarda la compra.
const guardar_nueva_compra = async () => {
	let observaciones_compra = '';

	// consultamos para crecar el código de la compra.
	let cont_compras = await fetch('/acciones_inventario/count_compras', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_compras;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_compras = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de clientes Estados Unidos:
	let ctotal_compras = cont_compras;

	// Creamos el codigo de compra de estados unidos
	let cod_comprasG = 'COMP' + (num_a_compras + anio_actual) + (parseInt(ctotal_compras) + 1);

	/* ------------------------------------------------------------------------------------------ */
	/*                                    Codigo de invetarios                                    */
	/* ------------------------------------------------------------------------------------------ */

	// consultamos para crecar el código de inventario.
	let cont_inventario = await fetch('/acciones_inventario/count_inventario', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_inventario;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_inventario = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de clientes Estados Unidos:
	let ctotal_inventario = cont_inventario;

	// Creamos el codigo de inventario
	let cod_inventarioG = 'COMP' + (num_a_inventario + anio_actual) + (parseInt(ctotal_inventario) + 1);

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

	// Validamos que los campos de crédito no queden vacios si la compra es al credito..
	if (tipo_compra.value == 'credito' && i_pPago_Compra.value !== '') {
		i_pPago_Compra.focus();
	} else if (tipo_compra.value == 'credito' && i_noCuotas_Compra.value !== '') {
		i_noCuotas_Compra.focus();
	} else if (tipo_compra.value == 'credito' && i_fInPago_Compra.value !== '') {
		i_fInPago_Compra.focus();
	} else if (tipo_compra.value == 'credito' && i_estadoCred_Compra.value !== '') {
		i_estadoCred_Compra.focus();
	} else {
		i_pPago_Compra.value = 'pago unico';
		i_noCuotas_Compra.value = 1;
		i_fInPago_Compra.value = fecha_a();
		i_estadoCred_Compra.value = 'completado';
	}

	// Validamos que el campo de observaciones no sea vacío.
	if (i_observaciones_compra.value == '') {
		observaciones_compra = 'No se otorgaron observaciones...';
	} else {
		observaciones_compra = i_observaciones_compra.value;
	}

	/* --- Obetenemos los datos de los compos dinámicos (Detalle de la compra). --- */
	// Asignamos las varables aqui; para que cada vez que ejecutemos la función se consulten las nuevas filas...
	let tr_dCompra_sv = document.querySelectorAll('#file_aadFC_es_principal');
	let codigo_producto = document.querySelectorAll('#cod_producto_compra');
	let nombre_producto = document.querySelectorAll('#nombreP_Pcompra');
	let tipo_producto = document.querySelectorAll('#tipo_Pcompra');
	let existen_producto = document.querySelectorAll('#existencia_Pcompra');
	let nolote_producto = document.querySelectorAll('#noLotes_Pcompra');
	let marca_producto = document.querySelectorAll('#marca_Pcompra');
	let vUnit_producto = document.querySelectorAll('#valosU_Pcompra');
	let cantidad_producto = document.querySelectorAll('#cantidad_Pcompra');
	let subTotalF_producto = document.querySelectorAll('#subTotal_Pcompra');

	// Datos para kardex...
	let detalle_kardex_compra = '';

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

		let noLote_inventario = await fetch('/acciones_inventario/numeroLotes_inventario', {
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

		let lote = noLote_inventario.numero_lote;
		if (lote > 0) {
			lote = lote + 1;
		} else {
			lote = 1;
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
			detalle_kardex_compra = 'compra según factura No. ' + no_factura_compra.value;
			existencias_producto_Total = parseInt(existencias_producto_kardex) + parseInt(cantidad_producto[ntr].value);
			existencias_producto_valorTotal =
				parseFloat(subTotalF_producto[ntr].value) + parseFloat(valor_existencias_producto_kardex);
		} else {
			detalle_kardex_compra = 'Compra inicial según factura No. ' + no_factura_compra.value;

			existencias_producto_Total = parseInt(cantidad_producto[ntr].value);
			existencias_producto_valorTotal = parseFloat(subTotalF_producto[ntr].value);
		}

		// Valor total de compra del producto.
		entrada_producto_valorTotal = parseFloat(cantidad_producto[ntr].value) * parseFloat(vUnit_producto[ntr].value);

		/* --------------------------------------------------------------------------------------------------- */

		// Cremaos una variable para guardar el tipo de producto...
		let tipo_producto_servicio_venta = tipo_producto[ntr].value.toLowerCase();

		if (tipo_producto_servicio_venta !== 'servicio') {
			await fetch('/acciones_inventario/existencia_total_lotes_inventario', {
				method: 'POST',
				body: JSON.stringify(cod_p),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then(async (datos) => {
					// return datos;
					// Operamos para tener la nueva cantidad total de existencias del producto...
					let existencia_lote = datos.existencias;
					let codproduc_invent = datos.codigo_producto;
					let nueva_existencia_lote = 0;

					nueva_existencia_lote = parseInt(existencia_lote) + parseInt(cantidad_producto[ntr].value);

					// Cremaos el objeto...
					let d_update_existencia = {
						cod_producto: codproduc_invent,
						new_cantidad: nueva_existencia_lote,
					};

					await fetch('/acciones_inventario/update_existencias_totales_productos', {
						method: 'POST',
						body: JSON.stringify(d_update_existencia),
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
			cod_comprasG = cod_comprasG + ntr;
			cod_inventarioG = cod_inventarioG + ntr;
			cod_kardexG = cod_kardexG + ntr;

			// Creamos el objeto de datos de la compra.
			let datos_compra = [
				cod_comprasG,

				// campos de datos de factura de compra.
				no_factura_compra.value,
				codigoProveedor_compra.value,
				nombreProveedor_compra.value,
				tipo_compra.value,

				// Campos de datos de credito...
				i_pPago_Compra.value,
				i_noCuotas_Compra.value,
				i_fInPago_Compra.value,
				i_estadoCred_Compra.value,

				// Valores del detalle.
				codigo_producto[ntr].value,
				nombre_producto[ntr].value,
				vUnit_producto[ntr].value,
				tipo_producto[ntr].value,
				marca_producto[ntr].value,
				cantidad_producto[ntr].value,
				subTotalF_producto[ntr].value,

				// Total lotes...
				0,

				// Valores de los totales.
				d_tsubCompraVeterinaria.innerHTML,
				d_tdesCompraVeterinaria.innerHTML,
				d_totalCompraVeterinaria.innerHTML,

				// Campo de observaciones.
				observaciones_compra,

				// Datos de usuario...
				fecha_Hora,
				nombre_user_esv,
			];

			// Creamos el objeto de datos para la tabla de inventario...
			let datos_inventario = [
				cod_inventarioG,
				cod_comprasG,
				fecha_Hora,
				// Datos de productos.
				cantidad_producto[ntr].value,
				lote,
				codigo_producto[ntr].value,
				nombre_producto[ntr].value,
				tipo_producto[ntr].value,
				marca_producto[ntr].value,
				// Datos de usuario.
				fecha_Hora,
				nombre_user_esv,
			];

			// Creamos el objeto de datos para la tabla de kardex...
			let datos_kardex = [
				cod_kardexG,

				// Datos de productos.
				codigo_producto[ntr].value,
				nombre_producto[ntr].value,
				1,
				fecha,
				fecha_Hora,
				detalle_kardex_compra,

				// Entradas...
				cantidad_producto[ntr].value,
				vUnit_producto[ntr].value,
				entrada_producto_valorTotal,

				// Salidas.
				0,
				0,
				0,

				// Existencias
				existencias_producto_Total,
				vUnit_producto[ntr].value,
				existencias_producto_valorTotal,
			];

			// Agregamos el array de la fila al array principal
			a_nuevaCompra.push(datos_compra);
			a_nDatoInventario.push(datos_inventario);
			a_nDatoKardex.push(datos_kardex);
		}
	}

	// Agremagos al array que se envía para la compra...
	add_nuevaCompra.push(a_nuevaCompra);
	add_nuevaCompra.push(a_nDatoInventario);
	add_nuevaCompra.push(a_nDatoKardex);

	// Enviamos los datos por cada iteración; para guardar los productos.
	fetch('/acciones_inventario/g_compras', {
		method: 'POST',
		body: JSON.stringify(add_nuevaCompra),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Compra guardada con exito.') {
				Swal.fire({
					title: 'Compra Realizada!',
					text: datos.mensaje,
					icon: 'success',
				});
			} else if (datos.mensaje == 'Ya existe el codigo o numero de factura para la compra...') {
				Swal.fire({
					title: 'Compra No Realizada!',
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
const validate_form_compras = () => {
	// Validamos campo por campo (todos los que son requeridos).
	if (no_factura_compra.value == '') {
		no_factura_compra.focus();
	} else if (nombreProveedor_compra.value == '') {
		nombreProveedor_compra.focus();
	} else if (tipo_compra.value == '') {
		tipo_compra.focus();
	} else {
		// Ejecutamos para guardar clientes despues de 1/2 segundo.
		setTimeout(async () => {
			//g_producto();
			await guardar_nueva_compra();
		}, 125);
	}
};

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             EVENTOS LISTENER                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Boton de agregar filas...
btn_addFProductos_compra.addEventListener('click', (event) => {
	event.preventDefault();
	add_fila_compra();
	da_btnAddFile();
	limpiarfila();
});

// Campo de nombre de proveedor...
nombreProveedor_compra.addEventListener('change', (event) => {
	dcod_proveedore();
});

// Campo de nombre de preovvedor...
nombreProveedor_compra.addEventListener('dblclick', (event) => {
	nombreProveedor_compra.value = '';
});

// Campo de tipo de compra...
tipo_compra.addEventListener('change', (event) => {
	cambio_tipo_compra();
});

// Boton de actualizar lista de productos en filas...
bnt_upd_dlProducto.addEventListener('click', (event) => {
	event.preventDefault();
	d_productos();
});

// Boton de guardar compra...
btn_guardarCompra.addEventListener('click', (event) => {
	event.preventDefault();
	validate_form_compras();
});
