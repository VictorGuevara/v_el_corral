/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                         VARIABLES DE FUNCIONALIDAD                         */
/*                                                                            */
/* -------------------------------------------------------------------------- */

let date = new Date();
let anio_actual = date.getFullYear();
let tab_buttons = document.querySelectorAll('.tab-button');
let tab_panels = document.querySelectorAll('.tab-panel');
let infoPest = document.querySelectorAll('.json_cargar');

// Paginación.
let num_pagina = 1;
let limite_paginas = 14;
let total_paginas = 1; // se actualizará con la respuesta del servidor

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 FUNCIONES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/* Función para obtener la fecha actual. */
/* ------------------------------------- */
const fecha_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = '0' + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = '0' + mes_actual;
	} else {
		mes = mes_actual;
	}

	fecha = anio_actual + '-' + mes + '-' + dia;

	return fecha;
};

/* ---------------------------------------------- */
/* Función para obtener la fecha dividida actual. */
/* ---------------------------------------------- */
const fecha_d_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = '0' + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = '0' + mes_actual;
	} else {
		mes = mes_actual;
	}

	let fecha_d = {
		anio_actual: anio_actual,
		mes: mes,
		dia: dia,
	};

	return fecha_d;
};

/* -------------------------------------------- */
/* Función para obtener la fecha y hora actual. */
/* -------------------------------------------- */
const fecha_hora_a = () => {
	let date = new Date();
	let dia_actual = date.getDate();
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = '0' + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = '0' + mes_actual;
	} else {
		mes = mes_actual;
	}

	fecha = anio_actual + '-' + mes + '-' + dia;

	let hora_actual = date.getHours();
	let minutos_actual = date.getMinutes();
	let segundos_actual = date.getSeconds();
	let hora = 0;
	let hora_a = 0;
	let minutos = 0;
	let segundos = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (hora_actual < 10) {
		hora_a = '0' + hora_actual;
	} else {
		hora_a = hora_actual;
	}

	// Validamos que la fecha sea legible con cero en el mes...
	if (minutos_actual < 10) {
		minutos = '0' + minutos_actual;
	} else {
		minutos = minutos_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (segundos_actual < 10) {
		segundos = '0' + segundos_actual;
	} else {
		segundos = segundos_actual;
	}

	hora = hora_a + ':' + minutos + ':' + segundos;

	let fecha_Hora = fecha + ' ' + hora;

	return fecha_Hora;
};

/* --------------------------------------------- */
/* Fución para obtener la fecha con suma de días */
/* --------------------------------------------- */
const fecha_sum = (dias) => {
	let date = new Date();
	let dia_actual = date.getDate() + dias;
	let mes_actual = date.getMonth() + 1;
	let anio_actual = date.getFullYear();
	let fecha = 0;
	let mes = 0;
	let dia = 0;

	// Validamos que la fecha sea legible con cero en el mes...
	if (dia_actual < 10) {
		dia = '0' + dia_actual;
	} else {
		dia = dia_actual;
	}

	// Validamos que el día sea legible con cero en el inicio...
	if (mes_actual < 10) {
		mes = '0' + mes_actual;
	} else {
		mes = mes_actual;
	}

	// Creamos la fecha.
	fecha = anio_actual + '-' + mes + '-' + dia;

	// Retornamos la fecha.
	return fecha;
};

/* ---------------------------------------------------- */
/* Configuración de los Toas. (Notificaciones pequeñas) */
/* ---------------------------------------------------- */
const Toast = Swal.mixin({
	toast: true,
	position: 'bottom-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
});

/* ---------------------------------------------------- */
/* Función que genera el número aleatorio de 4 digitos. */
/* ---------------------------------------------------- */
const g_newCodCsv = async (max, min) => {
	let nR_1 = Math.floor(Math.random() * (max - min)) + min;
	let nR_2 = Math.floor(Math.random() * (max - min)) + min;
	let nR_3 = Math.floor(Math.random() * (max - min)) + min;
	let nR_4 = Math.floor(Math.random() * (max - min)) + min;
	let nR_5 = Math.floor(Math.random() * (max - min)) + min;

	return `${nR_1}` + `${nR_2}` + `${nR_3}` + `${nR_4}` + `${nR_5}`;
};

/* ------------------------------------------------- */
/* Función que se llama para descargar los listados. */
/* ------------------------------------------------- */
const descargar_listado = (url, name_archive) => {
	const domloadInstance = document.createElement('a');
	domloadInstance.href = url;
	domloadInstance.target = '_blank';
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------ */
/* Función que se llama para descargar los recibos. */
/* ------------------------------------------------ */
const descargar_recibos = (url, name_archive) => {
	const domloadInstance = document.createElement('a');
	domloadInstance.href = url;
	domloadInstance.target = '_blank';
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------------------------ */
/*  Función que se llama pra descargar los machotes de El Salvador.   */
/* ------------------------------------------------------------------ */
// Función que se llama pra descargar los machotes...
const descargar_machote = (url, name_archive) => {
	const domloadInstance = document.createElement('a');
	domloadInstance.href = url;
	domloadInstance.target = '_blank';
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ------------------------------------------------------------------ */
/* Función que se llama pra descargar los machotes de Estados Unidos. */
/* ------------------------------------------------------------------ */
const descargar_machote_usa = (url, name_archive) => {
	const domloadInstance = document.createElement('a');
	domloadInstance.href = url;
	domloadInstance.target = '_blank';
	domloadInstance.download = name_archive;

	document.body.appendChild(domloadInstance);
	domloadInstance.click();
};

/* ----------------------------------------- */
/* Funcion para evitar el enter en textarea. */
/* ----------------------------------------- */
const enter_block = (event) => {
	if (event.keyCode == 16 || event.keyCode == 13) {
		event.preventDefault();
		return false;
	}
};

/* ----------------------------------------- */
/* Funcion para las pestañas del contenido.  */
/* ----------------------------------------- */
tab_buttons.forEach((button) => {
	button.addEventListener('click', () => {
		// Eliminar la clase 'active' de todos los botones y paneles
		tab_buttons.forEach((btn) => btn.classList.remove('active'));
		tab_panels.forEach((panel) => panel.classList.remove('active'));
		infoPest.forEach((pestania) => pestania.classList.remove('active'));

		// Activar el botón y panel correspondiente
		button.classList.add('active');
		const tabId = button.getAttribute('data-tab');
		document.getElementById(`tab-${tabId}`).classList.add('active');
		document.getElementById(`info_pestania-${tabId}`).classList.add('active');
	});
});

/* ------------------------------------------------------ */
/* Función para los botones de páginación de las tablas.  */
/* ------------------------------------------------------ */

// Funciones de actualizar números de paginación.
function actualizarBotonesNumericos() {
	const pri = document.getElementById('pri_num_pag');
	const seg = document.getElementById('seg_num_pag');
	const ter = document.getElementById('ter_num_pag');
	const ult = document.getElementById('ultimo_num_pag');
	const separador = document.getElementById('separador_pag');

	let inicio, medio, fin;

	if (num_pagina <= 1) {
		inicio = 1;
		medio = 2;
		fin = 3;
	} else if (num_pagina >= total_paginas - 1) {
		inicio = total_paginas - 2;
		medio = total_paginas - 1;
		fin = total_paginas;
	} else {
		inicio = num_pagina - 1;
		medio = num_pagina;
		fin = num_pagina + 1;
	}

	pri.textContent = inicio;
	seg.textContent = medio;
	ter.textContent = fin;

	[pri, seg, ter].forEach((btn) => btn.classList.remove('active'));
	if (num_pagina === inicio) pri.classList.add('active');
	else if (num_pagina === medio) seg.classList.add('active');
	else if (num_pagina === fin) ter.classList.add('active');

	// Mostrar u ocultar separador y último botón
	if (fin < total_paginas) {
		separador.style.display = 'inline-block';
		ult.style.display = 'inline-block';
		ult.textContent = total_paginas;
	} else {
		separador.style.display = 'none';
		ult.style.display = 'none';
	}
}

// Boton de página de inicio.
document.getElementById('btn_pag_init').addEventListener('click', () => {
	num_pagina = 1;
	ejecutarFuncionListado();
});

// Botón de página final.
document.getElementById('btn_pag_final').addEventListener('click', () => {
	num_pagina = total_paginas;
	ejecutarFuncionListado();
});

// Botón de salto de página anterior.
document.getElementById('btn_saltoAnt_pag').addEventListener('click', () => {
	if (num_pagina > 1) {
		num_pagina--;
		ejecutarFuncionListado();
	}
});

// Botón de salto de página siguiente.
document.getElementById('btn_saltoDes_pag').addEventListener('click', () => {
	if (num_pagina < total_paginas) {
		num_pagina++;
		ejecutarFuncionListado();
	}
});

// Botón de la ultima página.
document.getElementById('ultimo_num_pag').addEventListener('click', () => {
	num_pagina = total_paginas;
	ejecutarFuncionListado();
});

// Función que pregunta si existe las funciones de listado.
function ejecutarFuncionListado() {
	if (typeof list_presentaciones === 'function') {
		list_presentaciones();
	} else if (typeof list_productos === 'function') {
		list_productos();
	} else if (typeof list_cod_barra === 'function') {
		list_cod_barra();
	} else if (typeof list_usuarios === 'function') {
		list_usuarios();
	} else if (typeof list_compras_guardadas === 'function') {
		list_compras_guardadas();
	} else if (typeof list_compras_pagadas === 'function') {
		list_compras_pagadas();
	} else {
		console.warn('No se encontró ninguna función de listado activa.');
	}
}

// Botones de números de pagina y actualización de los mismos.
['pri_num_pag', 'seg_num_pag', 'ter_num_pag'].forEach((id) => {
	const btn = document.getElementById(id);
	if (btn) {
		btn.addEventListener('click', () => {
			num_pagina = parseInt(btn.textContent);
			ejecutarFuncionListado();
		});
	}
});
