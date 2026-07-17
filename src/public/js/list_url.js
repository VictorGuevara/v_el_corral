/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Obtenemos la url.
let url_active = window.location.pathname;
let palabra_compra = url_active.search('lista_compras');
let palabra_venta = url_active.search('lista_ventas');
let palabraEdit = url_active.search('editEncsv');
let palabraEditUsa = url_active.search('editEncUsa');
let palabraEditCompraSV = url_active.search('editCompraSV');
let palabraEditCompra = url_active.search('editCompraUsa');
let nameU = document.getElementById('name_user_loger');

// Capturamos la etiqueta script.
let e_script = document.getElementById('script_js');
let e_script_tow = document.getElementById('script_js_tow');

// Capturamos la etiqueta link.
let e_css = document.getElementById('script_css');

// Capturamos todas las etiquetas "a"

let nu = document.querySelector('#n_user_cargo');

// Variable de tiempo.
const tiempo_eCarga = 500;

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                              GERENTE GENERAL                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función que genera el menú para cada tipo de usuario...
const listItems_menu_general = async () => {
	try {
		const res = await fetch('/menu/menu', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});

		const contentType = res.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			console.warn('Respuesta no es JSON, probablemente sesión expirada.');
			return; // o redirigir al login
		}

		const datos = await res.json();
		const items = datos.menu_items;
		const rol = nu.value;

		// Contenedores por sección
		const menuMain = document.querySelector('#list_items_menu');
		const menuSettings = document.querySelector('#list_items_menu_settings');
		const menuCuenta = document.querySelector('#list_items_menu_cuenta');

		// Limpiar contenido
		menuMain.innerHTML = '';
		menuSettings.innerHTML = '';
		menuCuenta.innerHTML = '';

		items.forEach((item) => {
			//  Validamos el estado del menu.
			if (item.estado_menu !== 1 || item.id_menu <= 0) return;

			// Creamos el HTML.
			const li = `
                <li>
                    <a href="${item.url_menu}">
						<i class="${item.icon_menu}"></i>
                        <span class="text" style="text-transform: capitalize">${item.name_menu}</span>
                    </a>
                </li>
            `;

			// Sección principal (id_menu < 80)
			if (item.id_menu < 80) {
				if (rol === 'Administrador' && item.fsp_admin > 0) menuMain.innerHTML += li;
				else if (rol === 'Contador' && item.fsp_contabilidad > 0) menuMain.innerHTML += li;
			}

			// Sección de configuración (80 < id_menu < 90)
			else if (item.id_menu > 80 && item.id_menu < 90) {
				if (rol === 'Administrador' && item.fsp_admin > 0) menuSettings.innerHTML += li;
				else if (rol === 'Contador' && item.fsp_contabilidad > 0) menuMain.innerHTML += li;
			}

			// Sección cuenta (id_menu >= 90)
			else if (item.id_menu >= 90 && item.id_menu <= 100) {
				if (item.id_menu === 100) {
					menuCuenta.innerHTML += li; // aparece para todos
				} else if (rol === 'Administrador' && item.fsp_admin > 0) {
					menuCuenta.innerHTML += li;
				}
			}
		});
	} catch (error) {
		console.error('Error al cargar menú:', error);
	}
};

// Fución que coloca para cada vista su respectivo link css y js...
const list_menu = async () => {
	if (url_active == '/' || url_active == '/signin') {
		e_css.href = '../css/var_colores.css';
		e_script_tow.src = '';
	} else if (nu.value == 'Atenc. Esex Global') {
		await fetch('/menu/menu', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((datos) => {
				for (var i = 0; i < datos.menu_items.length; i++) {
					if (url_active == datos.menu_items[i].url_menu) {
						e_script_tow.src = '/js/FDR.js';
						setTimeout(() => {
							e_script.src = datos.menu_items[i].js_menu;
							e_css.href = '/css/var_colores_pink.css';
						}, tiempo_eCarga);
						break;
					}
				}
			})
			.catch((error) => {
				console.error('Ocurrio un error: ', error);
			});
	} else {
		await fetch('/menu/menu', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((datos) => {
				for (var i = 0; i < datos.menu_items.length; i++) {
					if (url_active == datos.menu_items[i].url_menu) {
						e_script_tow.src = '/js/FDR.js';
						setTimeout(() => {
							e_script.src = datos.menu_items[i].js_menu;
							e_css.href = datos.menu_items[i].css_menu;
						}, tiempo_eCarga);
						break;
					}
				}
			})
			.catch((error) => {
				console.error('Ocurrio un error: ', error);
			});
	}

	if (palabra_compra == 21) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/lista_compras.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	} else if (palabra_venta == 21) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/lista_ventas.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	}
};

// Clases a items menu...
const active_item_menu = () => {
	let li_a = document.querySelectorAll('#list_items_menu_settings li a');

	for (let index = 0; index < li_a.length; index++) {
		// Quitamos la base de la url...
		let url_a = li_a[index].href.replace('http://localhost:4000', '');

		// Quitamos la clase active de todos los items...
		li_a[index].classList.remove('active');

		// Validamos para colocar la clase active en el link correspondiente...
		if (url_a == url_active) {
			li_a[index].classList.add('active');
		}

		// Validamos para colocar la clase active en el link de ventas...
		if (palabra_venta == 7) {
			li_a[2].classList.add('active');
		}

		// Validamos para colocar la clase active en el link de compras...
		if (palabra_compra == 7) {
			li_a[6].classList.add('active');
		}
	}
};

// Ejecutamos al inicio...
setTimeout(() => {
	active_item_menu();
}, 250);

// Ejecutamos la función al inicio..
document.addEventListener('DOMContentLoaded', () => {
	list_menu();
	listItems_menu_general();
});
