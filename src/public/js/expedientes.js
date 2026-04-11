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

/* -------------------------------------------------------------------------- */
/*                                 FUNCIONES                                  */
/* -------------------------------------------------------------------------- */

// Función para inicializar la fecha actual en el campo fecha
function setFechaActual() {
  const hoy = new Date().toISOString().split('T')[0];
  campoFecha.value = hoy;
}

// Función para resetear el formulario y dejar el foco en DUI
function resetFormulario() {
  formExpediente.reset();
  setFechaActual();
  campoDui.focus();
}

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

// Funcion temporal
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

    Swal.fire({ icon: 'info', title: 'Editar expediente', text: 'Los datos se han cargado en el formulario' });

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
  try {
    const response = await fetch('/expedientes/listar');
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

  console.log(data);

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

function verExpediente(id) {
  console.log('Ver expediente:', id);
  // Aquí tu lógica para ver
}

function agregarReceta(id) {
  console.log('Agregar receta al expediente:', id);
  // Aquí tu lógica para receta
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
