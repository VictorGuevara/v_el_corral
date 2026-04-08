/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                 VARIABLES                                  */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Obtenemos la url.
let url_active = window.location.pathname;
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
let ul_box = document.querySelectorAll('#list_items_menu li a');
let nu = document.querySelector('#n_user_cargo');

// Variable de tiempo.
const tiempo_eCarga = 500;

// Capturamos las etiquetas para los eventos del sidebars.
let menu_li = document.querySelectorAll('.menu > ul > li');
let menu_btns = document.querySelector('.menu-btn');
let etic_sidebars = document.querySelector('.sidebar');
let etic_content_sidebars = document.querySelector('.main_content');

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
				else if (rol === 'Atenc. G. Esex' && item.fsp_caja > 0) menuMain.innerHTML += li;
				else if (rol === 'equipaje' && item.fsp_dependiente > 0) menuMain.innerHTML += li;
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
	const cleanUrl = url_active.split('?')[0].replace(/\/$/, '');

	// Si estás en la página principal o login
	if (cleanUrl === '/' || cleanUrl === '/signin') {
		e_css.href = '../css/var_colores.css';
		e_script_tow.src = '';
		return;
	}

	try {
		const res = await fetch('/menu/menu', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		const datos = await res.json();
		const items = datos.menu_items;

		// Buscar coincidencia con la URL activa
		const itemMatch = items.find((item) => {
			const itemUrl = item.url_menu.replace(/\/$/, '');
			return itemUrl === cleanUrl;
		});

		if (itemMatch && itemMatch.js_menu && itemMatch.css_menu) {
			e_script_tow.src = '/js/FDR.js';
			setTimeout(() => {
				e_script.src = itemMatch.js_menu;
				e_css.href = itemMatch.css_menu;
			}, tiempo_eCarga);
		}
	} catch (error) {
		console.error('Error al cargar menú dinámico:', error);
	}

	// Condiciones especiales por palabraEdit
	if (palabraEdit === 13) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/encsv_edit.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	} else if (palabraEditUsa === 17) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/encusa_edit.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	} else if (palabraEditCompraSV === 19) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/compraedit_sv.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	} else if (palabraEditCompra === 20) {
		setTimeout(() => {
			e_script_tow.src = '/js/FDR.js';
			e_script.src = '/js/compraedit_usa.js';
			e_css.href = '/css/var_colores.css';
		}, tiempo_eCarga);
	}
};

// Ejecutamos la función al inicio..
document.addEventListener('DOMContentLoaded', () => {
	list_menu();
	listItems_menu_general();
});

// Manejo de clic en los elementos del menú
menu_li.forEach(function (li) {
	li.addEventListener('click', function (e) {
		const siblings = [...li.parentElement.children].filter((el) => el !== li);

		// Quitar clase "active" de los hermanos
		siblings.forEach((sib) => sib.classList.remove('active'));

		// Alternar clase "active" en el elemento actual
		li.classList.toggle('active');

		// Alternar visibilidad de su submenú si lo tiene
		const subMenu = li.querySelector('ul');
		if (subMenu) {
			subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
		}

		// Cerrar submenús de hermanos
		siblings.forEach((sib) => {
			const sibSubMenu = sib.querySelector('ul');
			if (sibSubMenu) {
				sibSubMenu.style.display = 'none';
			}

			// Quitar clase "active" de ítems del submenú
			sib.querySelectorAll('ul li').forEach((subLi) => subLi.classList.remove('active'));
		});
	});
});

// Manejo de clic en botón del menú lateral
menu_btns.addEventListener('click', async () => {
	await etic_sidebars.classList.toggle('active');
	await etic_content_sidebars.classList.toggle('main_content_compac_sidebars');
});
