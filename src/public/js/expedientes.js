/* -------------------------------------------------------------------------- */
/*                                 VARIABLES                                  */
/* -------------------------------------------------------------------------- */

const formExpediente = document.getElementById('form_expediente');
const campoFecha = document.getElementById('fecha');
const campoDui = document.querySelector('[name="dui"]');
const tbodyExpedientes = document.getElementById('tableBody_expedientes');
const btn_guardar = document.getElementById('btn_guardar_expediente');
const btn_editar = document.getElementById('btn_editar_expediente');
const btn_cancel = document.getElementById('btn_cancelar_edicion');
const btn_guardar_add = document.getElementById('btn_guardar_agregar');
const i_sExpediente = document.getElementById('i_search_expedientes');
const btn_sExpediente = document.getElementById('btn_search_expedientes');

/* -------------------------------------------------------------------------- */
/*                                 FUNCIONES                                  */
/* -------------------------------------------------------------------------- */

// Función para inicializar la fecha actual en el campo fecha
function setFechaActual() {
  const hoy = new Date().toISOString().split('T')[0];
  campoFecha.value = hoy;
}

// Renderizar la tabla de expedientes
function renderTablaExpedientes(expedientes) {
  tbodyExpedientes.innerHTML = '';

  expedientes.forEach((exp) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${exp.propietario}</td>
      <td>${exp.dui}</td>
      <td>${exp.mascota}</td>
      <td class='center_text'>
        <button class='btn_table_reverse' onclick="editarExpediente(${exp.id_expediente})"><i class="fa-solid fa-file-pen"></i></button>
      </td>
      <td class='center_text'>
        <button class='btn_table_reverse' onclick="verExpediente(${exp.id_expediente})"><i class="fa-solid fa-eye"></i></button>
      </td>
      <td class='center_text'>
        <button class='btn_table_reverse' onclick="agregarReceta(${exp.id_expediente})"><i class="fa-solid fa-file-circle-plus"></i></button>
      </td>
    `;

    tbodyExpedientes.appendChild(row);
  });
}

// Funcion que edita el fomulario de expediente.
async function editarExpediente(id) {
  try {
    const response = await fetch('/expedientes/detalle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const expediente = await response.json();
    const form = document.getElementById('form_expediente');

    form.dataset.idExpediente = id;

    // 1. Expediente
    form.querySelector('[name="fecha"]').value = expediente.fecha
      ? new Date(expediente.fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    form.querySelector('[name="dui"]').value = expediente.dui;
    form.querySelector('[name="motivo_consulta"]').value = expediente.motivo_consulta;

    // 2. Datos del Paciente
    form.querySelector('[name="paciente"]').value = expediente.mascota_nombre;
    form.querySelector('[name="especie"]').value = expediente.especie;
    form.querySelector('[name="raza"]').value = expediente.raza;
    form.querySelector('[name="edad"]').value = expediente.edad;
    form.querySelector('[name="sexo"]').value = expediente.sexo;
    form.querySelector('[name="peso"]').value = expediente.peso;
    form.querySelector('[name="color"]').value = expediente.color;
    form.querySelector('[name="senias"]').value = expediente.senias;

    // 3. Datos del Propietario
    form.querySelector('[name="propietario"]').value = expediente.propietario_nombre;
    form.querySelector('[name="correo"]').value = expediente.correo;
    form.querySelector('[name="direccion"]').value = expediente.direccion;
    form.querySelector('[name="telefono"]').value = expediente.telefono;
    form.querySelector('[name="celular"]').value = expediente.celular;

    // 4. Información Adicional
    form.querySelector('[name="vacuna_quintuple"]').checked = expediente.vacuna_quintuple === 1;
    form.querySelector('[name="vacuna_triple_felina"]').checked = expediente.vacuna_triple_felina === 1;
    form.querySelector('[name="vacuna_rabia"]').checked = expediente.vacuna_rabia === 1;
    form.querySelector('[name="vacuna_parvovirus"]').checked = expediente.vacuna_parvovirus === 1;
    form.querySelector('[name="vacuna_leucemia"]').checked = expediente.vacuna_leucemia === 1;
    form.querySelector('[name="vacuna_bordetella"]').checked = expediente.vacuna_bordetella === 1;
    form.querySelector('[name="vacuna_giardia"]').checked = expediente.vacuna_giardia === 1;
    form.querySelector('[name="vacuna_otra"]').value = expediente.vacuna_otra || '';

    form.querySelector('[name="desparasitacion_fecha"]').value = expediente.desparasitacion_fecha
      ? new Date(expediente.desparasitacion_fecha).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    form.querySelector('[name="desparasitacion_medicamento"]').value = expediente.desparasitacion_medicamento || '';
    form.querySelector('[name="control_garrapatas_medicamento"]').value =
      expediente.control_garrapatas_medicamento || '';
    form.querySelector('[name="tiempo_con_mascota"]').value = expediente.tiempo_con_mascota || '';
    form.querySelector('[name="otras_mascotas"]').checked = expediente.otras_mascotas === 1;
    form.querySelector('[name="habitat"]').value = expediente.habitat || '';
    form.querySelector('[name="acceso_calle"]').checked = expediente.acceso_calle === 1;
    form.querySelector('[name="contacto_enfermos"]').checked = expediente.contacto_enfermos === 1;
    form.querySelector('[name="enfermedades_anteriores"]').value = expediente.enfermedades_anteriores || '';
    form.querySelector('[name="dieta"]').value = expediente.dieta || '';
    form.querySelector('[name="sintomas"]').value = expediente.sintomas || '';
    form.querySelector('[name="observaciones"]').value = expediente.observaciones || '';
    form.querySelector('[name="medicamentos_casa"]').value = expediente.medicamentos_casa || '';

    // 5. Exploración
    form.querySelector('[name="tegumentario_lesiones"]').checked = expediente.tegumentario_lesiones === 1;
    form.querySelector('[name="tegumentario_alopecia"]').checked = expediente.tegumentario_alopecia === 1;
    form.querySelector('[name="tegumentario_parasitos"]').checked = expediente.tegumentario_parasitos === 1;
    form.querySelector('[name="tegumentario_aspecto"]').value = expediente.tegumentario_aspecto || '';

    // 6. Examen Físico
    form.querySelector('[name="fc"]').value = expediente.fc || '';
    form.querySelector('[name="fr"]').value = expediente.fr || '';
    form.querySelector('[name="temperatura"]').value = expediente.temperatura || '';
    form.querySelector('[name="pulso"]').value = expediente.pulso || '';
    form.querySelector('[name="reflejo_pupilar"]').value = expediente.reflejo_pupilar || '';
    form.querySelector('[name="mucosas"]').value = expediente.mucosas || '';
    form.querySelector('[name="dentadura"]').value = expediente.dentadura || '';
    form.querySelector('[name="condicion_corporal"]').value = expediente.condicion_corporal || '';
    form.querySelector('[name="otras_observaciones"]').value = expediente.otras_observaciones || '';

    // 7. Diagnósticos
    form.querySelector('[name="dx_presuntivo"]').value = expediente.dx_presuntivo || '';
    form.querySelector('[name="dx_diferencial"]').value = expediente.dx_diferencial || '';

    Toast.fire({
      icon: 'info',
      title: 'Los datos se han cargado en el formulario',
    });

    // Mostrar botones de edición
    btn_guardar.style.display = 'none';
    btn_editar.style.display = 'inline-block';
    btn_cancel.style.display = 'inline-block';
  } catch (error) {
    console.error('Error al cargar expediente:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el expediente' });
  }
}

// Función que lista los expedientes guardados...
async function cargarExpedientes() {
  let dato_busqueda = i_sExpediente.value.trim();
  try {
    const response = await fetch('/expedientes/listar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search: dato_busqueda }), // si no mandás filtro, enviás un body vacío
    });
    const expedientes = await response.json();
    renderTablaExpedientes(expedientes);
  } catch (error) {
    console.error('Error al cargar expedientes:', error);
  }
}

// Función que edita el expediente....
const editar_expediente = async () => {
  const formData = new FormData(formExpediente);
  const data = {};

  formData.forEach((value, key) => {
    const input = document.querySelector(`[name="${key}"]`);
    if (input?.type === 'checkbox') {
      data[key] = input.checked ? 1 : 0;
    } else {
      data[key] = value;
    }
  });

  // Importante: incluir el id_expediente que estás editando
  data.id_expediente = formExpediente.dataset.idExpediente;

  try {
    const response = await fetch('/expedientes/editar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: result.mensaje,
      }).then(async () => {
        btn_guardar.style.display = 'inline-block';
        btn_editar.style.display = 'none';
        btn_cancel.style.display = 'none';
        await cargarExpedientes();
        await resetFormulario();
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.mensaje });
    }
  } catch (error) {
    console.error('Error al editar expediente:', error);
    Swal.fire({ icon: 'error', title: 'Error inesperado', text: error.message });
  }
};

// Función para resetear el formulario y dejar el foco en DUI
function resetFormulario() {
  formExpediente.reset();
  setFechaActual();
  campoDui.focus();
}

// Función muestra la ventana para agregar recetas.
function agregarReceta(id) {
  // Guardamos el id del expediente en el formulario de agregar
  const formAgregar = document.getElementById('form_agregar');
  formAgregar.dataset.idExpediente = id;

  // Ocultar formulario de expediente
  formExpediente.style.display = 'none';

  // Mostrar formulario de agregar
  formAgregar.style.display = 'block';

  Toast.fire({
    icon: 'info',
    text: 'Puedes registrar exámenes y/o medicamentos para este expediente',
  });
}

// Función que guarda los examenes.
const guardar_examenes_recetas = async () => {
  const id_expediente = document.getElementById('form_agregar').dataset.idExpediente;

  try {
    // Guardar exámenes
    for (let i = 1; i <= 5; i++) {
      const nombre = document.querySelector(`[name="nombre_examen_${i}"]`);
      const fecha = document.querySelector(`[name="fecha_examen_${i}"]`);
      const resultado = document.querySelector(`[name="resultado_${i}"]`);

      if (nombre && nombre.value) {
        await fetch('/expedientes/agregar_examenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_expediente,
            nombre_examen: nombre.value,
            fecha: fecha ? fecha.value : null,
            resultado: resultado ? resultado.value : null,
          }),
        });
      }
    }

    // Guardar medicamentos
    for (let i = 1; i <= 5; i++) {
      const nombre = document.querySelector(`[name="nombre_medicamento_${i}"]`);
      const dosis = document.querySelector(`[name="dosis_${i}"]`);
      const frecuencia = document.querySelector(`[name="frecuencia_${i}"]`);
      const duracion = document.querySelector(`[name="duracion_${i}"]`);
      const observaciones = document.querySelector(`[name="observaciones_${i}"]`);
      const via = document.querySelector(`[name="via_administracion_${i}"]`);
      const fechaInicio = document.querySelector(`[name="fecha_inicio_${i}"]`);
      const fechaFin = document.querySelector(`[name="fecha_fin_${i}"]`);

      if (nombre && nombre.value) {
        await fetch('/expedientes/agregar_medicamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_expediente,
            nombre_medicamento: nombre.value,
            dosis: dosis ? dosis.value : null,
            frecuencia: frecuencia ? frecuencia.value : null,
            duracion: duracion ? duracion.value : null,
            observaciones: observaciones ? observaciones.value : null,
            via_administracion: via ? via.value : null,
            fecha_inicio: fechaInicio ? fechaInicio.value : null,
            fecha_fin: fechaFin ? fechaFin.value : null,
          }),
        });
      }
    }

    Swal.fire({ icon: 'success', title: 'Datos guardados', text: 'Se han agregado los registros' });

    document.getElementById('form_agregar').style.display = 'none';
    formExpediente.style.display = 'block';
  } catch (error) {
    console.error('Error al guardar examen/medicamento:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar' });
  }
};

// Función para ver expediente completo del paciente.
async function verExpediente(id) {
  try {
    const response = await fetch('/expedientes/ver_expediente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const { expediente, examenes, medicamentos, historial } = await response.json();
    console.log('Expediente:', expediente); // objeto
    console.log('Exámenes:', examenes.length); // número de exámenes
    console.log('Medicamentos:', medicamentos.length); // número de medicamentos
    console.log('Historial:', historial.length); // número de eventos

    let html = `
  <div class="expediente-grid" style="max-height:80vh; overflow-y:auto;">
  
  <!-- Columna izquierda -->
  <div class="expediente-section">
    <h3>Datos generales</h3>
    <p><b>Fecha:</b> <span>${new Date(expediente.fecha).toLocaleDateString()}</span></p>
    <p><b>DUI:</b> <span>${expediente.dui}</span></p>
    <p><b>Motivo consulta:</b> <span>${expediente.motivo_consulta}</span></p>

    <h3>Paciente</h3>
    <p><b>Nombre:</b> <span>${expediente.mascota_nombre}</span></p>
    <p><b>Especie:</b> <span>${expediente.especie}</span></p>
    <p><b>Raza:</b> <span>${expediente.raza}</span></p>
    <p><b>Edad:</b> <span>${expediente.edad}</span></p>
    <p><b>Sexo:</b> <span>${expediente.sexo}</span></p>
    <p><b>Peso:</b> <span>${expediente.peso} kg</span></p>
    <p><b>Color:</b> <span>${expediente.color}</span></p>
    <p><b>Señas:</b> <span>${expediente.senias}</span></p>

    <h3>Propietario</h3>
    <p><b>Nombre:</b> <span>${expediente.propietario_nombre}</span></p>
    <p><b>Correo:</b> <span>${expediente.correo}</span></p>
    <p><b>Dirección:</b> <span>${expediente.direccion}</span></p>
    <p><b>Teléfono:</b> <span>${expediente.telefono}</span></p>
    <p><b>Celular:</b> <span>${expediente.celular}</span></p>

    <h3>Información adicional</h3>
    <p><b>Dieta:</b> <span>${expediente.dieta}</span></p>
    <p><b>Síntomas:</b> <span>${expediente.sintomas}</span></p>
    <p><b>Observaciones:</b> <span>${expediente.observaciones}</span></p>
    <p><b>Medicamentos en casa:</b> <span>${expediente.medicamentos_casa}</span></p>

    <h3>Exploración</h3>
    <p><b>Tegumentario aspecto:</b> <span>${expediente.tegumentario_aspecto}</span></p>
    <p><b>Lesiones:</b> <span>${expediente.tegumentario_lesiones}</span></p>
    <p><b>Alopecia:</b> <span>${expediente.tegumentario_alopecia}</span></p>
    <p><b>Parásitos:</b> <span>${expediente.tegumentario_parasitos}</span></p>

    <h3>Examen físico</h3>
    <p><b>FC:</b> <span>${expediente.fc}</span></p>
    <p><b>FR:</b> <span>${expediente.fr}</span></p>
    <p><b>Temperatura:</b> <span>${expediente.temperatura}</span></p>
    <p><b>Pulso:</b> <span>${expediente.pulso}</span></p>
    <p><b>Reflejo pupilar:</b> <span>${expediente.reflejo_pupilar}</span></p>
    <p><b>Mucosas:</b> <span>${expediente.mucosas}</span></p>
    <p><b>Dentadura:</b> <span>${expediente.dentadura}</span></p>
    <p><b>Condición corporal:</b> <span>${expediente.condicion_corporal}</span></p>
    <p><b>Otras observaciones:</b> <span>${expediente.otras_observaciones}</span></p>

    <h3>Diagnósticos</h3>
    <p><b>Presuntivo:</b> <span>${expediente.dx_presuntivo}</span></p>
    <p><b>Diferencial:</b> <span>${expediente.dx_diferencial}</span></p>
  </div>

  <!-- Columna derecha -->
  <div class="expediente-section">
    <h3>Exámenes realizados</h3>
    <ul>
      ${
        examenes.length > 0
          ? examenes
              .map(
                (e) => `<li><b>${e.nombre_examen}</b> - <span>(${formatearFecha(e.fecha)}) - ${e.resultado}</span></li>`
              )
              .join('')
          : '<li>No hay exámenes registrados</li>'
      }
    </ul>

    <h3>Medicamentos recetados</h3>
    <ul>
      ${
        medicamentos.length > 0
          ? medicamentos
              .map(
                (m) =>
                  `<li><b>${m.nombre_medicamento}</b> <span>- ${m.dosis}, ${m.frecuencia}, ${m.duracion}. ${m.observaciones || ''}</span></li>`
              )
              .join('')
          : '<li>No hay medicamentos registrados</li>'
      }
    </ul>

    <h3>Historial de eventos</h3>
<ul>
  ${
    historial.length > 0
      ? historial
          .map(
            (h) => `
              <li>
                <b>${h.tipo_evento}</b> 
                <span style="color:gray;">(${formatearFecha(h.fecha_evento)})</span><br>
                <i>${h.descripcion || 'Sin descripción'}</i><br>
                <small>Registrado por: ${h.user_registro}</small>
              </li>
            `
          )
          .join('')
      : '<li>No hay eventos registrados</li>'
  }
</ul>

  </div>
</div>

`;

    Swal.fire({
      title: 'Expediente completo',
      html,
      width: '90%', // ventana más grande
      heightAuto: false,
      scrollbarPadding: false,
      showCloseButton: true,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error al ver expediente:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el expediente' });
  }
}

/* -------------------------------------------------------------------------- */
/*                                  EVENTOS                                   */
/* -------------------------------------------------------------------------- */

// Al cargar la página, inicializar fecha actual...
setTimeout(() => {
  setFechaActual(); // coloca la fecha actual en el campo
  cargarExpedientes(); // trae datos del backend y renderiza la tabla

  // Al cargar la página, ocultar botones
  btn_guardar.style.display = 'inline-block';
  btn_editar.style.display = 'none';
  btn_cancel.style.display = 'none';
}, 200); // 200 ms de retraso

// Evento de envío del formulario
formExpediente.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Capturamos todos los datos del formulario
  const formData = new FormData(this);
  const data = {};

  formData.forEach((value, key) => {
    const input = document.querySelector(`[name="${key}"]`);
    if (input?.type === 'checkbox') {
      data[key] = input.checked ? 1 : 0;
    } else {
      data[key] = value;
    }
  });

  try {
    const response = await fetch('/expedientes/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: result.mensaje,
        footer: 'ID expediente: ' + result.id_expediente,
      }).then(() => {
        resetFormulario();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.mensaje,
      });
    }
  } catch (error) {
    console.error('Error al guardar expediente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: error.message,
    });
  }
});

// Boton de cancelar edición...
btn_cancel.addEventListener('click', (event) => {
  event.preventDefault();

  btn_guardar.style.display = 'inline-block';
  btn_editar.style.display = 'none';
  btn_cancel.style.display = 'none';
  resetFormulario();
});

// Botón de editar expediente...
btn_editar.addEventListener('click', async (event) => {
  event.preventDefault();
  await editar_expediente();
});

// Botón de guardar examenes y recetas.
btn_guardar_add.addEventListener('click', async (event) => {
  event.preventDefault();
  await guardar_examenes_recetas();
});

// Evento para el campo de busqueda...
i_sExpediente.addEventListener('input', async (event) => {
  event.preventDefault();
  await cargarExpedientes();
});

// Evebto para el boton de busqueda...
btn_sExpediente.addEventListener('click', async (event) => {
  event.preventDefault();
  await cargarExpedientes();
});

/* -------------------------------------------------------------------------- */
/*                           FUNCIONES TEMPORALES                             */
/* -------------------------------------------------------------------------- */

// Función para llenar el formulario con datos de prueba
function llenarFormularioExpediente() {
  if (!formExpediente) {
    console.error("No se encontró el formulario con id='form_expediente'");
    return;
  }

  // Asignar valores de prueba a cada campo
  formExpediente.querySelector('[name="fecha"]').value = '2026-04-10';
  formExpediente.querySelector('[name="dui"]').value = '12345678';
  formExpediente.querySelector('[name="motivo_consulta"]').value = 'Consulta general de prueba';

  // Paciente
  formExpediente.querySelector('[name="paciente"]').value = 'Firulais';
  formExpediente.querySelector('[name="especie"]').value = 'Canino';
  formExpediente.querySelector('[name="raza"]').value = 'Labrador';
  formExpediente.querySelector('[name="edad"]').value = '5';
  formExpediente.querySelector('[name="sexo"]').value = 'Macho';
  formExpediente.querySelector('[name="peso"]').value = '25.5';
  formExpediente.querySelector('[name="color"]').value = 'Negro';
  formExpediente.querySelector('[name="senias"]').value = 'Mancha blanca en el pecho';

  // Propietario
  formExpediente.querySelector('[name="propietario"]').value = 'Juan Pérez';
  formExpediente.querySelector('[name="correo"]').value = 'juan@example.com';
  formExpediente.querySelector('[name="direccion"]').value = 'Colonia Centro, Usulután';
  formExpediente.querySelector('[name="telefono"]').value = '2622-0000';
  formExpediente.querySelector('[name="celular"]').value = '7777-8888';

  // Información adicional
  formExpediente.querySelector('[name="vacuna_quintuple"]').checked = true;
  formExpediente.querySelector('[name="vacuna_rabia"]').checked = true;
  formExpediente.querySelector('[name="vacuna_otra"]').value = 'Coronavirus';
  formExpediente.querySelector('[name="desparasitacion_fecha"]').value = '2026-04-01';
  formExpediente.querySelector('[name="desparasitacion_medicamento"]').value = 'Ivermectina';
  formExpediente.querySelector('[name="control_garrapatas_medicamento"]').value = 'Frontline';
  formExpediente.querySelector('[name="tiempo_con_mascota"]').value = '3 años';
  formExpediente.querySelector('[name="otras_mascotas"]').checked = false;
  formExpediente.querySelector('[name="habitat"]').value = 'Casa';
  formExpediente.querySelector('[name="acceso_calle"]').checked = true;
  formExpediente.querySelector('[name="contacto_enfermos"]').checked = false;
  formExpediente.querySelector('[name="enfermedades_anteriores"]').value = 'Ninguna';
  formExpediente.querySelector('[name="dieta"]').value = 'Concentrado premium';
  formExpediente.querySelector('[name="sintomas"]').value = 'Ninguno';
  formExpediente.querySelector('[name="observaciones"]').value = 'Buen estado general';
  formExpediente.querySelector('[name="medicamentos_casa"]').value = 'Vitaminas';

  // Exploración
  formExpediente.querySelector('[name="tegumentario_lesiones"]').checked = false;
  formExpediente.querySelector('[name="tegumentario_alopecia"]').checked = false;
  formExpediente.querySelector('[name="tegumentario_parasitos"]').checked = false;
  formExpediente.querySelector('[name="tegumentario_aspecto"]').value = 'Pelaje brillante';

  // Examen físico
  formExpediente.querySelector('[name="fc"]').value = '90';
  formExpediente.querySelector('[name="fr"]').value = '20';
  formExpediente.querySelector('[name="temperatura"]').value = '38.5';
  formExpediente.querySelector('[name="pulso"]').value = 'Normal';
  formExpediente.querySelector('[name="reflejo_pupilar"]').value = 'Normal';
  formExpediente.querySelector('[name="mucosas"]').value = 'Rosadas';
  formExpediente.querySelector('[name="dentadura"]').value = 'Completa';
  formExpediente.querySelector('[name="condicion_corporal"]').value = 'Buena';
  formExpediente.querySelector('[name="otras_observaciones"]').value = 'Sin hallazgos relevantes';

  // Diagnósticos
  formExpediente.querySelector('[name="dx_presuntivo"]').value = 'Animal sano';
  formExpediente.querySelector('[name="dx_diferencial"]').value = 'Ninguno';

  console.log('Formulario llenado con datos de prueba.');
}

function llenarFormularioAgregar() {
  const formAgregar = document.getElementById('form_agregar');

  if (!formAgregar) {
    console.error("No se encontró el formulario con id='form_agregar'");
    return;
  }

  // Llenar exámenes de ejemplo
  for (let i = 1; i <= 5; i++) {
    const nombreExamen = formAgregar.querySelector(`[name="nombre_examen_${i}"]`);
    const fechaExamen = formAgregar.querySelector(`[name="fecha_examen_${i}"]`);
    const resultadoExamen = formAgregar.querySelector(`[name="resultado_${i}"]`);

    if (nombreExamen) nombreExamen.value = `Examen ${i}`;
    if (fechaExamen) fechaExamen.value = `2026-04-${10 + i}`;
    if (resultadoExamen) resultadoExamen.value = i % 2 === 0 ? 'Pendiente' : 'Resultado normal';
  }

  // Llenar medicamentos de ejemplo
  for (let i = 1; i <= 5; i++) {
    const nombreMed = formAgregar.querySelector(`[name="nombre_medicamento_${i}"]`);
    const dosisMed = formAgregar.querySelector(`[name="dosis_${i}"]`);
    const frecuenciaMed = formAgregar.querySelector(`[name="frecuencia_${i}"]`);
    const duracionMed = formAgregar.querySelector(`[name="duracion_${i}"]`);
    const observacionesMed = formAgregar.querySelector(`[name="observaciones_${i}"]`);
    const viaMed = formAgregar.querySelector(`[name="via_administracion_${i}"]`);
    const fechaInicioMed = formAgregar.querySelector(`[name="fecha_inicio_${i}"]`);
    const fechaFinMed = formAgregar.querySelector(`[name="fecha_fin_${i}"]`);

    if (nombreMed) nombreMed.value = `Medicamento ${i}`;
    if (dosisMed) dosisMed.value = `${i * 100} mg`;
    if (frecuenciaMed) frecuenciaMed.value = 'Cada 12 horas';
    if (duracionMed) duracionMed.value = `${i} días`;
    if (observacionesMed) observacionesMed.value = i % 2 === 0 ? 'Tomar con alimentos' : 'Sin observaciones';
    if (viaMed) viaMed.value = i % 2 === 0 ? 'Oral' : 'Inyectable';
    if (fechaInicioMed) fechaInicioMed.value = `2026-04-${10 + i}`;
    if (fechaFinMed) fechaFinMed.value = `2026-04-${12 + i}`;
  }

  console.log('Formulario de agregar llenado con datos de prueba.');
}
