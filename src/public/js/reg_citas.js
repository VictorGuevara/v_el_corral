/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                 VARIABLES PARA EL APARTADO DE CALENTADIO                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const calendar = document.querySelector('.calendar');
const date_c = document.querySelector('.date');
const daysContainer = document.querySelector('.days');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const todayBtn = document.querySelector('.today-btn');
const gotoBtn = document.querySelector('.goto-btn');
const dateInput = document.querySelector('.date-input');
const eventDay = document.querySelector('.event-day');
const eventDate = document.querySelector('.event-date');
const eventsContainer = document.querySelector('.events');
const addEventBtn = document.querySelector('#add_cita');
const addEventWrapper = document.querySelector('.add-event-wrapper ');
const addEventCloseBtn = document.querySelector('.close ');
const addEventTitle = document.querySelector('.event-name ');
const addEventFrom = document.querySelector('.event-time-from ');
const addEventTo = document.querySelector('.event-time-to ');
const addEventSubmit = document.querySelector('.add-event-btn ');
let fecha_actual = fecha_a();
let nombre_user_esv = document.querySelector('#name_user_loger').innerHTML;
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Augosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Deciembre',
];

let eventsArr = [];

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                     FUNCIONES DEL CALENDARIO Y CITAS                       */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Función para agregar días en días con día de clase y fecha anterior fecha siguiente en los días del mes anterior y del mes siguiente y activo en hoy
async function initCalendar() {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const prevLastDay = new Date(year, month, 0);
	const prevDays = prevLastDay.getDate();
	const lastDate = lastDay.getDate();
	const day = firstDay.getDay();
	const nextDays = 7 - lastDay.getDay() - 1;

	date_c.innerHTML = months[month] + ' ' + year;

	let days = '';

	for (let x = day; x > 0; x--) {
		days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
	}

	for (let i = 1; i <= lastDate; i++) {
		// Checamos si hay citas en la fecha seleccionada...
		let event = false;

		eventsArr.forEach((eventObj) => {
			console.log(eventObj);
			if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
				event = true;
			}
		});
		if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
			activeDay = i;
			getActiveDay(i);
			updateEvents(i);
			if (event) {
				days += `<div class="day today active event">${i}</div>`;
			} else {
				days += `<div class="day today active">${i}</div>`;
			}
		} else {
			if (event) {
				days += `<div class="day event">${i}</div>`;
			} else {
				days += `<div class="day ">${i}</div>`;
			}
		}
	}

	for (let j = 1; j <= nextDays; j++) {
		days += `<div class="day next-date">${j}</div>`;
	}
	daysContainer.innerHTML = days;
	addListner();
}

// Función para agregar mes y año en el botón anterior y siguiente
function prevMonth() {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	initCalendar();
}

function nextMonth() {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	initCalendar();
}

initCalendar();

// Función para agregar la clase active al día seleccionado.
function addListner() {
	const days = document.querySelectorAll('.day');
	days.forEach((day) => {
		day.addEventListener('click', (e) => {
			getActiveDay(e.target.innerHTML);
			updateEvents(Number(e.target.innerHTML));
			activeDay = Number(e.target.innerHTML);
			getEvents(activeDay);
			//remove active
			days.forEach((day) => {
				day.classList.remove('active');
			});
			//if clicked prev-date or next-date switch to that month
			if (e.target.classList.contains('prev-date')) {
				prevMonth();
				//add active to clicked day afte month is change
				setTimeout(() => {
					//add active where no prev-date or next-date
					const days = document.querySelectorAll('.day');
					days.forEach((day) => {
						if (!day.classList.contains('prev-date') && day.innerHTML === e.target.innerHTML) {
							day.classList.add('active');
						}
					});
				}, 100);
			} else if (e.target.classList.contains('next-date')) {
				nextMonth();
				//add active to clicked day afte month is changed
				setTimeout(() => {
					const days = document.querySelectorAll('.day');
					days.forEach((day) => {
						if (!day.classList.contains('next-date') && day.innerHTML === e.target.innerHTML) {
							day.classList.add('active');
						}
					});
				}, 100);
			} else {
				e.target.classList.add('active');
			}
		});
	});
}

function gotoDate() {
	const dateArr = dateInput.value.split('/');
	if (dateArr.length === 2) {
		if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
			month = dateArr[0] - 1;
			year = dateArr[1];
			initCalendar();
			return;
		}
	}
	Swal.fire('¡Fecha Invalida!', 'La fecha introducida es invalida.', 'warning');
}

// Función obtener el nombre y la fecha del día activo y actualizar la fecha del evento
function getActiveDay(date) {
	const day = new Date(year, month, date);
	const dayName = day.toString().split(' ')[0];
	eventDay.innerHTML = dayName;
	eventDate.innerHTML = date + ' ' + months[month] + ' ' + year;
	getEvents(parseInt(date));
}

// Función de actualización de eventos cuando un día está activo.
function updateEvents(date) {
	let citas_registradas = eventsArr[0];
	let events = '';

	// Si no hay citas registradas en absoluto
	if (!citas_registradas || citas_registradas.length === 0) {
		events = `
      <div class="no-event">
        <h3>No Hay Citas</h3>
      </div>
    `;
	} else {
		// Recorremos las citas
		let hayCitas = false;
		for (let log = 0; log < citas_registradas.length; log++) {
			let cout_citas = citas_registradas[log]['events'].length;

			if (
				date == citas_registradas[log].day &&
				month + 1 == citas_registradas[log].month &&
				year == citas_registradas[log].year
			) {
				hayCitas = true;
				for (let index = 0; index < cout_citas; index++) {
					events += `
            <div class="event" onclick="delete_cita('${citas_registradas[log].cod_cita}', '${citas_registradas[log].day}', '${citas_registradas[log].month}', '${citas_registradas[log].year}')">
              <div class="icono">
								<i class="fas fa-clock"></i>
              </div>
              <div class="title">
                <h3 class="event-title">${citas_registradas[log]['events'][index].title}</h3>
              </div>
              <div class="event-time">
                <span class="event-time">${citas_registradas[log]['events'][index].hora_inicio} - ${citas_registradas[log]['events'][index].hora_fin}</span>
              </div>
            </div>
          `;
				}
			}
		}

		// Si recorrimos y no encontramos citas para ese día
		if (!hayCitas) {
			events = `
        <div class="no-event">
          <h3>No Hay Citas</h3>
        </div>
      `;
		}
	}

	eventsContainer.innerHTML = events;
}

// Función que genera el código único de la cita...
const cod_cita = async () => {
	// consultamos para crecar el código del nuevo producto a registrar.
	let cod_g = await fetch('/reg_citas/count_citas', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			return datos.cant_citas;
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});

	// Ejecutamos la funcion, para que cree el número aleatorio.
	let num_a_cita = await g_newCodCsv(1, 9);

	// Variable que guarda el dato del total de productos registrados:
	let ctotal_citas = cod_g;

	// Creamos el codigo de cliente de estados unidos
	let cod_citaG = 'CC' + (num_a_cita + anio_actual) + (ctotal_citas + 1);

	// Retornamos el valor
	return cod_citaG; //?
};

// Función para guardar eventos en el almacenamiento local
const saveEvents = async () => {
	// input de los datos...
	const eventTitle = addEventTitle.value;
	const eventTimeFrom = addEventFrom.value;
	const eventTimeTo = addEventTo.value;

	// Validamos que los campos no esten vacios...
	if (eventTitle === '' || eventTimeFrom === '' || eventTimeTo === '') {
		Swal.fire('¡Campos Vacíos!', '¡Por favor llene todos los campos!', 'warning');
		return;
	}

	// Chacamos si el formato de la hora es correcto...
	const timeFromArr = eventTimeFrom.split(':');
	const timeToArr = eventTimeTo.split(':');
	if (
		timeFromArr.length !== 2 ||
		timeToArr.length !== 2 ||
		timeFromArr[0] > 23 ||
		timeFromArr[1] > 59 ||
		timeToArr[0] > 23 ||
		timeToArr[1] > 59
	) {
		Swal.fire('¡Hora Invalida!', 'Formato de hora invalido.', 'warning');
		return;
	}

	const timeFrom = convertTime(eventTimeFrom);
	const timeTo = convertTime(eventTimeTo);

	// Comprobamos si el evento ya está agregado
	let eventExist = false;
	eventsArr.forEach((event) => {
		if (event.day === activeDay && event.month === month + 1 && event.year === year) {
			event.events.forEach((event) => {
				if (event.title === eventTitle) {
					eventExist = true;
				}
			});
		}
	});

	// Valiodamos si la cita esta repetida...
	if (eventExist) {
		Swal.fire('¡Cita Repetida!', 'Parece que la cita que desea guardar ya existe.', 'warning');
		return;
	}

	/* -------------------------------------------------------------------------------------------------------------- */

	// Ejecutamos la funcion de generan el código de la cita...
	let codCita = await cod_cita();

	// Creamos el objeto de datos...
	let datos_cita = {
		cod_cita: codCita,
		dia_cita: activeDay,
		mes_cita: month + 1,
		anio_cita: year,
		ncl_cita: eventTitle,
		hora_inicio: eventTimeFrom + ':00',
		hora_fin: eventTimeTo + ':00',
		fecha_regis: fecha_actual,
		user_regist: nombre_user_esv,

		// Nuevos campos automáticos
		tipo_evento: document.getElementById('tipo_evento').value,
		descripcion: `Cita de ${document.getElementById('tipo_evento').value} para ${eventTitle}`,
		id_expediente: document.getElementById('id_expediente').value || null,
		telefono_cliente: document.getElementById('telefono_cliente')
			? document.getElementById('telefono_cliente').value
			: null,
	};

	// Enviamos los datos por caja iteración; para guardar los clienetes.
	await fetch('/reg_citas/g_citas', {
		method: 'POST',
		body: JSON.stringify(datos_cita),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			if (datos.mensaje == 'Se guardó la cita correctamente.') {
				Swal.fire({
					icon: 'success',
					title: '¡Cita guardada!',
					text: datos.mensaje,
					confirmButtonText: 'Aceptar',
				});

				addEventWrapper.classList.remove('active');
				addEventTitle.value = '';
				addEventFrom.value = '';
				addEventTo.value = '';
				getEvents(activeDay);
			} else if (datos.mensaje == 'Ya existe la cita con el nombre proporcionado...') {
				Swal.fire({
					icon: 'warning',
					title: '¡Cita repetida!',
					text: datos.mensaje,
					confirmButtonText: 'Entendido',
				});
			}
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
			Swal.fire({
				icon: 'error',
				title: 'Error al guardar',
				text: 'No se pudo guardar la cita',
				confirmButtonText: 'Cerrar',
			});
		});
};

// Función para obtener eventos del almacenamiento local
async function getEvents(activeDay) {
	updateEvents(activeDay);
	let datos_busqueda = {
		dia_cita: activeDay,
		mes_cita: month + 1,
		anio_cita: year,
	};

	// Consultamos...
	await fetch('/reg_citas/citas', {
		method: 'POST',
		body: JSON.stringify(datos_busqueda),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((datos) => {
			eventsArr = [];
			eventsArr.push(datos.array_one);
			setTimeout(async () => {
				await updateEvents(activeDay);
			}, 250);
		})
		.catch((error) => {
			console.error('Ocurrio un error: ', error);
		});
}

// Ejecutamos al principio y al inicio...
getEvents(activeDay);

function convertTime(time) {
	//convert time to 24 hour format
	let timeArr = time.split(':');
	let timeHour = timeArr[0];
	let timeMin = timeArr[1];
	let timeFormat = timeHour >= 12 ? 'PM' : 'AM';
	timeHour = timeHour % 12 || 12;
	time = timeHour + ':' + timeMin + ' ' + timeFormat;
	return time;
}

// Función para eliminar la cita...
const delete_cita = (cod_cita, dia, mes, anio) => {
	// Creamos el obejto a enviar.
	let obg_cDE = {
		cod_cita: cod_cita,
		dia: dia,
		mes: mes,
		anio: anio,
	};

	Swal.fire({
		title: '¿Eliminar Cita?',
		text: '¡Los cambios no se podrán revertir!',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, Eliminar',
	}).then((result) => {
		if (result.dismiss == 'cancel') {
			Swal.fire('Op. Cancelada', 'No se eliminó la cita :)', 'error');
		} else if ((result.value = true)) {
			// Enviamos los datos.
			fetch('/reg_citas/delete_cita', {
				method: 'DELETE',
				body: JSON.stringify(obg_cDE),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((datos) => {
					if (datos.mensaje == 'Cita eliminada con exito.') {
						Swal.fire('¡Eliminada!', datos.mensaje, 'success');
						setTimeout(async () => {
							await getEvents(dia);
						}, 250);
					}
				})
				.catch((error) => {
					console.error('Ocurrio un error: ', error);
				});
		}
	});
};

document.getElementById('tipo_evento').addEventListener('change', function () {
	const fields = document.getElementById('expediente_fields');
	if (this.value !== 'simple') {
		fields.style.display = 'block';
	} else {
		fields.style.display = 'none';
	}
});

// Cuando la secretaria termina de escribir el DUI y sale del campo
document.getElementById('dui').addEventListener('blur', async function () {
	const dui = this.value.trim();
	if (dui !== '') {
		try {
			const response = await fetch('/reg_citas/buscar_expediente', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dui }),
			});
			const data = await response.json();

			console.log(data);

			if (data.id_expediente) {
				document.getElementById('id_expediente').value = data.id_expediente;
				if (data.telefono) {
					document.getElementById('telefono_cliente').value = data.telefono;
				}
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'No se pudo buscar el expediente',
			});
		}
	}
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                             EVENTOS LISTENER                               */
/*                                                                            */
/* -------------------------------------------------------------------------- */

prev.addEventListener('click', prevMonth);
next.addEventListener('click', nextMonth);

todayBtn.addEventListener('click', () => {
	today = new Date();
	month = today.getMonth();
	year = today.getFullYear();
	initCalendar();
});

dateInput.addEventListener('input', (e) => {
	dateInput.value = dateInput.value.replace(/[^0-9/]/g, '');
	if (dateInput.value.length === 2) {
		dateInput.value += '/';
	}
	if (dateInput.value.length > 7) {
		dateInput.value = dateInput.value.slice(0, 7);
	}
	if (e.inputType === 'deleteContentBackward') {
		if (dateInput.value.length === 3) {
			dateInput.value = dateInput.value.slice(0, 2);
		}
	}
});

gotoBtn.addEventListener('click', gotoDate);

//function to add event
addEventBtn.addEventListener('click', () => {
	addEventWrapper.classList.toggle('active');
});

addEventCloseBtn.addEventListener('click', () => {
	addEventWrapper.classList.remove('active');
});

document.addEventListener('click', (e) => {
	if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
		addEventWrapper.classList.remove('active');
	}
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener('input', (e) => {
	addEventTitle.value = addEventTitle.value.slice(0, 60);
});

//allow only time in eventtime from and to
addEventFrom.addEventListener('input', (e) => {
	addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, '');
	if (addEventFrom.value.length === 2) {
		addEventFrom.value += ':';
	}
	if (addEventFrom.value.length > 5) {
		addEventFrom.value = addEventFrom.value.slice(0, 5);
	}
});

addEventTo.addEventListener('input', (e) => {
	addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, '');
	if (addEventTo.value.length === 2) {
		addEventTo.value += ':';
	}
	if (addEventTo.value.length > 5) {
		addEventTo.value = addEventTo.value.slice(0, 5);
	}
});

//function to add event to eventsArr
addEventSubmit.addEventListener('click', () => {
	saveEvents();
});
