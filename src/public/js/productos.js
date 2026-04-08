/* -------------------------------------------------------------------------- */
/*                                 VARIABLES                                  */
/* -------------------------------------------------------------------------- */

// Campos de filtros.
let input_dato_busqueda = document.getElementById('busqueda_productos');
let btn_buscar_productos = document.getElementById('btn_search_productos');
let tbody_productos = document.getElementById('tableBody_productos');

// Formulario.
const formulario_productos = document.getElementById('form_productos');
const i_id_producto = document.getElementById('id_producto');
const i_cod_producto = document.getElementById('cod_producto');
const i_nombre_producto = document.getElementById('nombre_producto');
const i_laboratorio = document.getElementById('laboratorio');
const i_precio_caja = document.getElementById('precio_caja');
const i_precio_blister = document.getElementById('precio_blister');
const i_precio_unitario = document.getElementById('precio_unitario');
const i_activo = document.getElementById('activo');

const btn_crear_producto = document.getElementById('btn_create_producto');
const btn_editar_producto = document.getElementById('btn_update_producto');
const btn_cancelar_edit = document.getElementById('btn_cancel_update_producto');

/* -------------------------------------------------------------------------- */
/*                                 FUNCIONES                                  */
/* -------------------------------------------------------------------------- */

// Crear producto.
const add_productos = async () => {
  let data_form_p = {
    cod_producto: i_cod_producto.value,
    nombre_producto: i_nombre_producto.value,
    laboratorio: i_laboratorio.value,
    precio_caja: i_precio_caja.value,
    precio_blister: i_precio_blister.value,
    precio_unitario: i_precio_unitario.value,
    activo: i_activo.value,
  };

  const isEmpty = (input) => input.value.trim() === '';

  if (isEmpty(i_cod_producto)) {
    i_cod_producto.focus();
  } else if (isEmpty(i_nombre_producto)) {
    i_nombre_producto.focus();
  } else if (isEmpty(i_laboratorio)) {
    i_laboratorio.focus();
  } else {
    try {
      const response = await fetch('/productos/regis_producto', {
        method: 'POST',
        body: JSON.stringify(data_form_p),
        headers: { 'Content-Type': 'application/json' },
      });
      const datos = await response.json();

      if (datos.mensaje === 'Producto guardado con éxito.') {
        Swal.fire({ icon: 'success', title: datos.mensaje });
        formulario_productos.reset();
        list_productos();
        i_cod_producto.focus();
      } else {
        Swal.fire({ icon: 'error', title: datos.mensaje });
      }
    } catch (error) {
      console.error('Ocurrió un error: ', error);
    }
  }
};

// Listar productos.
const list_productos = async () => {
  const datos_busqueda = {
    nombre_producto: input_dato_busqueda.value,
    page: num_pagina,
    limit: limite_paginas,
  };

  try {
    const res = await fetch('/productos/list_productos', {
      method: 'POST',
      body: JSON.stringify(datos_busqueda),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const datos = data[0];
    const t_filas = data[1];
    let contador = data[2];

    total_paginas = Math.ceil(t_filas / limite_paginas);

    tbody_productos.innerHTML = '';

    for (let i = 0; i < datos.length; i++) {
      contador++;
      tbody_productos.innerHTML += `
        <tr>
          <td class="center_number">${contador}</td>
          <td>${datos[i].cod_producto}</td>
          <td>${datos[i].nombre_producto}</td>
          <td>${datos[i].laboratorio}</td>
          <td>$ ${datos[i].precio_caja}</td>
          <td>$ ${datos[i].precio_blister}</td>
          <td>$ ${datos[i].precio_unitario}</td>
          <td>${datos[i].activo == 1 ? 'Activo' : 'Inactivo'}</td>
          <td class="center_text">
            <button class="btn_table_edit" onclick="cargar_dProducto_edit('${datos[i].cod_producto}')"><i class="ti-pencil-alt"></i></button>
          </td>
          <td class="center_text">
            <button class="btn_table_delete" onclick="eliminar_producto('${datos[i].cod_producto}')"><i class="ti-trash"></i></button>
          </td>
        </tr>
      `;
    }

    actualizarBotonesNumericos();
  } catch (error) {
    console.error('Ocurrió un error: ', error);
  }
};

// Cargar producto para edición.
const cargar_dProducto_edit = async (cod_producto) => {
  await fetch(`/productos/cargar_producto`, {
    method: 'POST',
    body: JSON.stringify({ cod_producto: cod_producto }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((producto) => {
      i_id_producto.value = producto[0].id;
      i_cod_producto.value = producto[0].cod_producto;
      i_nombre_producto.value = producto[0].nombre_producto;
      i_laboratorio.value = producto[0].laboratorio;
      i_precio_caja.value = producto[0].precio_caja;
      i_precio_blister.value = producto[0].precio_blister;
      i_precio_unitario.value = producto[0].precio_unitario;
      i_activo.value = producto[0].activo;

      btn_crear_producto.style.display = 'none';
      btn_editar_producto.style.display = 'block';
      btn_cancelar_edit.style.display = 'block';
    })
    .catch((error) => {
      console.error('Error al cargar producto:', error);
    });
};

// Cancelar edición.
const cancelar_edicion = () => {
  btn_crear_producto.style.display = 'block';
  btn_editar_producto.style.display = 'none';
  btn_cancelar_edit.style.display = 'none';
  formulario_productos.reset();
  i_cod_producto.focus();
};

// Editar producto.
const editar_producto = async () => {
  let data_form_p = {
    id: i_id_producto.value,
    cod_producto: i_cod_producto.value,
    nombre_producto: i_nombre_producto.value,
    laboratorio: i_laboratorio.value,
    precio_caja: i_precio_caja.value,
    precio_blister: i_precio_blister.value,
    precio_unitario: i_precio_unitario.value,
    activo: i_activo.value,
  };

  const isEmpty = (input) => input.value.trim() === '';

  if (isEmpty(i_cod_producto)) {
    i_cod_producto.focus();
  } else if (isEmpty(i_nombre_producto)) {
    i_nombre_producto.focus();
  } else {
    try {
      const response = await fetch('/productos/edit_producto', {
        method: 'POST',
        body: JSON.stringify(data_form_p),
        headers: { 'Content-Type': 'application/json' },
      });
      const datos = await response.json();

      if (datos.mensaje === 'Producto editado con éxito.') {
        Toast.fire({ icon: 'success', title: datos.mensaje });
        formulario_productos.reset();
        list_productos();
        i_cod_producto.focus();
        cancelar_edicion();
      } else {
        Swal.fire({ icon: 'error', title: datos.mensaje });
      }
    } catch (error) {
      console.error('Ocurrió un error: ', error);
    }
  }
};

// Eliminar producto.
const eliminar_producto = async (cod_producto) => {
  let dD = { cod_producto: cod_producto };

  Swal.fire({
    title: '¿Eliminar Producto?',
    text: '¡Los cambios no se podrán revertir!',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, Eliminar',
  }).then((result) => {
    if (result.dismiss == 'cancel') {
      Swal.fire('Operación Cancelada', 'No se eliminó el producto 🙂', 'info');
    } else if (result.value == true) {
      fetch('/productos/eliminar_producto', {
        method: 'POST',
        body: JSON.stringify(dD),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((datos) => {
          const mensaje = datos.mensaje;

          if (mensaje === 'Producto eliminado con éxito.') {
            Swal.fire('¡Eliminado!', mensaje, 'success');
            list_productos();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: mensaje || 'No se pudo completar la operación.' });
          }
        })
        .catch((error) => {
          console.error('Ocurrió un error: ', error);
          Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
        });
    }
  });
};

// Ejecutar al inicio.
setTimeout(() => {
  cancelar_edicion();
  list_productos();
}, 150);

/* -------------------------------------------------------------------------- */
/*                                  EVENTOS                                   */
/* -------------------------------------------------------------------------- */
// Función clic para el botón de crear producto.
btn_crear_producto.addEventListener('click', async (event) => {
  event.preventDefault();
  await add_productos();
});

// Evento de escritura para el campo de búsqueda.
input_dato_busqueda.addEventListener('input', async (event) => {
  event.preventDefault();
  await list_productos();
});

// Evento clic para el botón de buscar.
btn_buscar_productos.addEventListener('click', async (event) => {
  event.preventDefault();
  await list_productos();
});

// Evento clic para el botón de cancelar edición.
btn_cancelar_edit.addEventListener('click', async (event) => {
  event.preventDefault();
  await cancelar_edicion();
});

// Evento clic para el botón de editar producto.
btn_editar_producto.addEventListener('click', async (event) => {
  event.preventDefault();
  await editar_producto();
});

const btn_reporte_productos = document.getElementById('btn_reporte_productos');
btn_reporte_productos?.addEventListener('click', async (event) => {
  event.preventDefault();
  // Aquí la acción para generar/descargar reporte
});
