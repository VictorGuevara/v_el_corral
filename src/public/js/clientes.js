// =======================
// VARIABLES
// =======================
const tableBody = document.getElementById('tableBody_clientes');
const formClientes = document.getElementById('form_clientes');
const codCliente = document.getElementById('cod_cliente');
const nomCliente = document.getElementById('nom_cliente');
const telCliente = document.getElementById('tel_cliente');
const fnacCliente = document.getElementById('fnac_cliente');

const btnCreate = document.getElementById('btn_create_cliente');
const btnUpdate = document.getElementById('btn_update_cliente');
const btnCancel = document.getElementById('btn_cancel_cliente');
const btnSearch = document.getElementById('btn_search_clientes');
const inputSearch = document.getElementById('busqueda_clientes');

// =======================
// FUNCIONES
// =======================

// Listar clientes
async function listarClientes(query = '') {
  try {
    const res = await fetch('/clientes/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busqueda: query })
    });
    const data = await res.json();

    tableBody.innerHTML = '';
    data.forEach((cliente, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${cliente.codigo_cliente}</td>
          <td>${cliente.nombre_cliente}</td>
          <td>${cliente.tel_cliente || ''}</td>
          <td>${cliente.fnac_cliente || ''}</td>
          <td class='center_text'>
            <button onclick="editarCliente('${cliente.codigo_cliente}')"><i class='ti-pencil-alt'></i></button>
          </td>
          <td class='center_text'>
            <button onclick="eliminarCliente('${cliente.codigo_cliente}')"><i class='ti-trash'></i></button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
  } catch (error) {
    console.error('Error al listar clientes:', error);
  }
}

// Crear cliente
async function crearCliente(e) {
  e.preventDefault();
  try {
    const res = await fetch('/clientes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: nomCliente.value,
        tel_cliente: telCliente.value,
        fnac_cliente: fnacCliente.value
      })
    });
    await res.json();
    listarClientes();
    formClientes.reset();
  } catch (error) {
    console.error('Error al crear cliente:', error);
  }
}

// Editar cliente (cargar datos en formulario)
async function editarCliente(codigo) {
  try {
    const res = await fetch(`/clientes/get/${codigo}`);
    const cliente = await res.json();

    codCliente.value = cliente.codigo_cliente;
    nomCliente.value = cliente.nombre_cliente;
    telCliente.value = cliente.tel_cliente;
    fnacCliente.value = cliente.fnac_cliente;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
  }
}

// Actualizar cliente
async function actualizarCliente(e) {
  e.preventDefault();
  try {
    const res = await fetch('/clientes/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_cliente: codCliente.value,
        nombre_cliente: nomCliente.value,
        tel_cliente: telCliente.value,
        fnac_cliente: fnacCliente.value
      })
    });
    await res.json();
    listarClientes();
    formClientes.reset();
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
  }
}

// Eliminar cliente
async function eliminarCliente(codigo) {
  try {
    const res = await fetch(`/clientes/delete/${codigo}`, {
      method: 'DELETE'
    });
    await res.json();
    listarClientes();
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
  }
}

// Cancelar edición
function cancelarEdicion(e) {
  e.preventDefault();
  formClientes.reset();
  codCliente.value = '';
}

// =======================
// EVENT LISTENERS
// =======================
document.addEventListener('DOMContentLoaded', () => listarClientes());

btnCreate.addEventListener('click', crearCliente);
btnUpdate.addEventListener('click', actualizarCliente);
btnCancel.addEventListener('click', cancelarEdicion);

btnSearch.addEventListener('click', () => {
  listarClientes(inputSearch.value);
});
