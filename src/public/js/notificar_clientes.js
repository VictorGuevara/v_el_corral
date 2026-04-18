/* -------------------------------------------------------------------------- */
/*                                 VARIABLES                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                 FUNCIONES                                  */
/* -------------------------------------------------------------------------- */

// Funcion que lista las tabla de notificaciones.
const cargarNotificaciones = async () => {
	const response = await fetch('/notificar_citas/list');
	const data = await response.json();

	// Aseguramos que siempre sea un array
	const notificaciones = Array.isArray(data) ? data : [data];

	const tbody = document.getElementById('tableBody_notificaciones');
	tbody.innerHTML = '';

	for (let i = 0; i < notificaciones.length; i++) {
		const notif = notificaciones[i];
		tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${notif.nombre_cliente}</td>
        <td>${notif.telefono_cliente}</td>
        <td>${notif.mensaje}</td>
        <td>${notif.fecha_programada}</td>
        <td>${notif.estado}</td>
        <td>${notif.fecha_envio || ''}</td>
        <td class='center_text'>
          <button class='btn_table_reverse' onclick="notificar(${notif.id_notificacion})">
            <i class="fa-solid fa-envelope"></i>
          </button>
        </td>
      </tr>
    `;
	}
};

// Funcion que hará que se notifique y que edita el estado.
const actualizarEstado = async (id, nuevoEstado) => {
	try {
		const response = await fetch('/notificar_citas/estado', {
			method: 'PUT',
			body: JSON.stringify({ id_notificacion: id, estado: nuevoEstado }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();

		// Aquí usamos SweetAlert en vez de alert
		Swal.fire({
			icon: 'success',
			title: 'Estado actualizado',
			text: data.mensaje,
			timer: 2000,
			showConfirmButton: false,
		});
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'No se pudo actualizar el estado',
		});
	}
};

// Funcion que enviará el mensaje
const notificar = async (id) => {
	try {
		const response = await fetch('/notificar_citas/enviar', {
			method: 'POST',
			body: JSON.stringify({ id_notificacion: id }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();

		Swal.fire({
			icon: 'info',
			title: 'Notificación',
			text: data.mensaje,
			timer: 2500,
			showConfirmButton: false,
		});

		cargarNotificaciones(); // refrescar tabla
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'No se pudo enviar la notificación',
		});
	}
};

// Ejecutar al cargar la página
cargarNotificaciones();

/* -------------------------------------------------------------------------- */
/*                                  EVENTOS                                   */
/* -------------------------------------------------------------------------- */
