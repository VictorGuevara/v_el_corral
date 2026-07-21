/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Ruta de renderizar la vista de compras.
router.get('/', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
  // Renderizamos la vista de compras...
  await res.render('admin/expedientes');
});

// Ruta para crear el expediente. (Guardar)
router.post('/crear', async (req, res) => {
  const data = req.body;

  try {
    // 1. Buscar propietario por DUI
    const propietarioExistente = await pool.query('SELECT id FROM propietarios WHERE dui = ?', [data.dui]);

    let id_propietario;
    if (propietarioExistente.length > 0) {
      id_propietario = propietarioExistente[0].id;
    } else {
      const propietarioResult = await pool.query(
        'INSERT INTO propietarios (nombre, direccion, correo, telefono, celular, dui) VALUES (?, ?, ?, ?, ?, ?)',
        [data.propietario, data.direccion, data.correo, data.telefono, data.celular, data.dui]
      );
      id_propietario = propietarioResult.insertId;
    }

    // 2. Buscar mascota por nombre + propietario
    const mascotaExistente = await pool.query('SELECT id FROM mascotas WHERE nombre = ? AND id_propietario = ?', [
      data.paciente,
      id_propietario,
    ]);

    let id_mascota;
    if (mascotaExistente.length > 0) {
      id_mascota = mascotaExistente[0].id;
    } else {
      const pacienteResult = await pool.query(
        'INSERT INTO mascotas (nombre, especie, raza, edad, sexo, peso, color, senias, id_propietario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.paciente,
          data.especie,
          data.raza,
          data.edad,
          data.sexo,
          data.peso,
          data.color,
          data.senias,
          id_propietario,
        ]
      );
      id_mascota = pacienteResult.insertId;
    }

    // 3. Verificar si ya existe expediente con mismo DUI y mascota
    const expedienteExistente = await pool.query(
      'SELECT id_expediente FROM expediente WHERE dui = ? AND id_mascota = ?',
      [data.dui, id_mascota]
    );

    if (expedienteExistente.length > 0) {
      return res.status(400).json({ mensaje: 'Ya existe un expediente con este DUI y mascota' });
    }

    // 4. Insertar expediente
    const expedienteResult = await pool.query(
      'INSERT INTO expediente (fecha, dui, motivo_consulta, id_mascota, id_propietario) VALUES (?, ?, ?, ?, ?)',
      [data.fecha, data.dui, data.motivo_consulta, id_mascota, id_propietario]
    );
    const id_expediente = expedienteResult.insertId;

    // 5. Información adicional
    await pool.query(
      `INSERT INTO info_adicional 
      (id_expediente, vacuna_quintuple, vacuna_triple_felina, vacuna_rabia, vacuna_parvovirus, vacuna_leucemia, vacuna_bordetella, vacuna_giardia, vacuna_otra, desparasitacion_fecha, desparasitacion_medicamento, control_garrapatas_medicamento, tiempo_con_mascota, otras_mascotas, habitat, acceso_calle, contacto_enfermos, enfermedades_anteriores, dieta, sintomas, observaciones, medicamentos_casa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_expediente,
        data.vacuna_quintuple,
        data.vacuna_triple_felina,
        data.vacuna_rabia,
        data.vacuna_parvovirus,
        data.vacuna_leucemia,
        data.vacuna_bordetella,
        data.vacuna_giardia,
        data.vacuna_otra,
        data.desparasitacion_fecha,
        data.desparasitacion_medicamento,
        data.control_garrapatas_medicamento,
        data.tiempo_con_mascota,
        data.otras_mascotas,
        data.habitat,
        data.acceso_calle,
        data.contacto_enfermos,
        data.enfermedades_anteriores,
        data.dieta,
        data.sintomas,
        data.observaciones,
        data.medicamentos_casa,
      ]
    );

    // 6. Exploración
    await pool.query(
      `INSERT INTO exploracion 
      (id_expediente, tegumentario_aspecto, tegumentario_lesiones, tegumentario_alopecia, tegumentario_parasitos) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        id_expediente,
        data.tegumentario_aspecto,
        data.tegumentario_lesiones,
        data.tegumentario_alopecia,
        data.tegumentario_parasitos,
      ]
    );

    // 7. Examen físico
    await pool.query(
      `INSERT INTO examen_fisico 
      (id_expediente, fc, fr, temperatura, pulso, reflejo_pupilar, mucosas, dentadura, condicion_corporal, otras_observaciones) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_expediente,
        data.fc,
        data.fr,
        data.temperatura,
        data.pulso,
        data.reflejo_pupilar,
        data.mucosas,
        data.dentadura,
        data.condicion_corporal,
        data.otras_observaciones,
      ]
    );

    // 8. Diagnósticos
    await pool.query(`INSERT INTO diagnosticos (id_expediente, dx_presuntivo, dx_diferencial) VALUES (?, ?, ?)`, [
      id_expediente,
      data.dx_presuntivo,
      data.dx_diferencial,
    ]);

    res.json({ mensaje: 'Expediente guardado correctamente', id_expediente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar expediente', error: error.message });
  }
});

// Ruta para listar los cliente con sus expedientes.
router.post('/listar', async (req, res) => {
  try {
    const { search } = req.body;
    let sql = `
      SELECT e.id_expediente, e.dui, p.nombre AS propietario, m.nombre AS mascota
      FROM expediente e
      INNER JOIN propietarios p ON e.id_propietario = p.id
      INNER JOIN mascotas m ON e.id_mascota = m.id
    `;

    // Variable para los parametros.
    let params = [];

    if (search && search.trim() !== '') {
      sql += ` WHERE p.nombre LIKE ? OR m.nombre LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const expedientes = await pool.query(sql, params);
    res.json(expedientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al listar expedientes', error: error.message });
  }
});

// Ruta para llenar el formulario del expediente...
router.post('/detalle', async (req, res) => {
  const { id } = req.body; // ahora recibes el id en el body
  try {
    const expediente = await pool.query(
      `
      SELECT 
        e.id_expediente,
        DATE(e.fecha) AS fecha,
        e.dui,
        e.motivo_consulta,

        -- Datos del paciente
        m.nombre AS mascota_nombre,
        m.especie,
        m.raza,
        m.edad,
        m.sexo,
        m.peso,
        m.color,
        m.senias,

        -- Datos del propietario
        p.nombre AS propietario_nombre,
        p.correo,
        p.direccion,
        p.telefono,
        p.celular,

        -- Información adicional
        ia.vacuna_quintuple,
        ia.vacuna_triple_felina,
        ia.vacuna_rabia,
        ia.vacuna_parvovirus,
        ia.vacuna_leucemia,
        ia.vacuna_bordetella,
        ia.vacuna_giardia,
        ia.vacuna_otra,
        DATE(ia.desparasitacion_fecha) AS desparasitacion_fecha,
        ia.desparasitacion_medicamento,
        ia.control_garrapatas_medicamento,
        ia.tiempo_con_mascota,
        ia.otras_mascotas,
        ia.habitat,
        ia.acceso_calle,
        ia.contacto_enfermos,
        ia.enfermedades_anteriores,
        ia.dieta,
        ia.sintomas,
        ia.observaciones,
        ia.medicamentos_casa,

        -- Exploración
        ex.tegumentario_lesiones,
        ex.tegumentario_alopecia,
        ex.tegumentario_parasitos,
        ex.tegumentario_aspecto,

        -- Examen físico
        ef.fc,
        ef.fr,
        ef.temperatura,
        ef.pulso,
        ef.reflejo_pupilar,
        ef.mucosas,
        ef.dentadura,
        ef.condicion_corporal,
        ef.otras_observaciones,

        -- Diagnósticos
        d.dx_presuntivo,
        d.dx_diferencial

      FROM expediente e
      INNER JOIN propietarios p ON e.id_propietario = p.id
      INNER JOIN mascotas m ON e.id_mascota = m.id
      LEFT JOIN info_adicional ia ON e.id_expediente = ia.id_expediente
      LEFT JOIN exploracion ex ON e.id_expediente = ex.id_expediente
      LEFT JOIN examen_fisico ef ON e.id_expediente = ef.id_expediente
      LEFT JOIN diagnosticos d ON e.id_expediente = d.id_expediente
      WHERE e.id_expediente = ?
    `,
      [id]
    );

    res.json(expediente[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener expediente', error: error.message });
  }
});

// Ruta para editar el expediente en las 7 tablas...
router.post('/editar', async (req, res) => {
  const data = req.body;
  const { id_expediente } = data;

  try {
    // Obtener IDs relacionados
    const expedienteRow = await pool.query('SELECT id_propietario, id_mascota FROM expediente WHERE id_expediente=?', [
      id_expediente,
    ]);
    const id_propietario = expedienteRow[0].id_propietario;
    const id_mascota = expedienteRow[0].id_mascota;

    // 1. Actualizar expediente
    await pool.query('UPDATE expediente SET fecha=?, dui=?, motivo_consulta=? WHERE id_expediente=?', [
      data.fecha,
      data.dui,
      data.motivo_consulta,
      id_expediente,
    ]);

    // 2. Actualizar propietario
    await pool.query('UPDATE propietarios SET nombre=?, direccion=?, correo=?, telefono=?, celular=? WHERE id=?', [
      data.propietario,
      data.direccion,
      data.correo,
      data.telefono,
      data.celular,
      id_propietario,
    ]);

    // 3. Actualizar mascota
    await pool.query(
      'UPDATE mascotas SET nombre=?, especie=?, raza=?, edad=?, sexo=?, peso=?, color=?, senias=? WHERE id=?',
      [data.paciente, data.especie, data.raza, data.edad, data.sexo, data.peso, data.color, data.senias, id_mascota]
    );

    // 4. Actualizar info adicional
    await pool.query(
      `UPDATE info_adicional SET vacuna_quintuple=?, vacuna_triple_felina=?, vacuna_rabia=?, vacuna_parvovirus=?, vacuna_leucemia=?, vacuna_bordetella=?, vacuna_giardia=?, vacuna_otra=?, desparasitacion_fecha=?, desparasitacion_medicamento=?, control_garrapatas_medicamento=?, tiempo_con_mascota=?, otras_mascotas=?, habitat=?, acceso_calle=?, contacto_enfermos=?, enfermedades_anteriores=?, dieta=?, sintomas=?, observaciones=?, medicamentos_casa=? 
       WHERE id_expediente=?`,
      [
        data.vacuna_quintuple,
        data.vacuna_triple_felina,
        data.vacuna_rabia,
        data.vacuna_parvovirus,
        data.vacuna_leucemia,
        data.vacuna_bordetella,
        data.vacuna_giardia,
        data.vacuna_otra,
        data.desparasitacion_fecha,
        data.desparasitacion_medicamento,
        data.control_garrapatas_medicamento,
        data.tiempo_con_mascota,
        data.otras_mascotas,
        data.habitat,
        data.acceso_calle,
        data.contacto_enfermos,
        data.enfermedades_anteriores,
        data.dieta,
        data.sintomas,
        data.observaciones,
        data.medicamentos_casa,
        id_expediente,
      ]
    );

    // 5. Actualizar exploración
    await pool.query(
      'UPDATE exploracion SET tegumentario_aspecto=?, tegumentario_lesiones=?, tegumentario_alopecia=?, tegumentario_parasitos=? WHERE id_expediente=?',
      [
        data.tegumentario_aspecto,
        data.tegumentario_lesiones,
        data.tegumentario_alopecia,
        data.tegumentario_parasitos,
        id_expediente,
      ]
    );

    // 6. Actualizar examen físico
    await pool.query(
      'UPDATE examen_fisico SET fc=?, fr=?, temperatura=?, pulso=?, reflejo_pupilar=?, mucosas=?, dentadura=?, condicion_corporal=?, otras_observaciones=? WHERE id_expediente=?',
      [
        data.fc,
        data.fr,
        data.temperatura,
        data.pulso,
        data.reflejo_pupilar,
        data.mucosas,
        data.dentadura,
        data.condicion_corporal,
        data.otras_observaciones,
        id_expediente,
      ]
    );

    // 7. Actualizar diagnósticos
    await pool.query('UPDATE diagnosticos SET dx_presuntivo=?, dx_diferencial=? WHERE id_expediente=?', [
      data.dx_presuntivo,
      data.dx_diferencial,
      id_expediente,
    ]);

    res.json({ mensaje: 'Expediente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar expediente', error: error.message });
  }
});

router.post('/agregar_examenes', async (req, res) => {
  const { id_expediente, nombre_examen, resultado, fecha } = req.body;
  try {
    await pool.query('INSERT INTO examenes (id_expediente, nombre_examen, resultado, fecha) VALUES (?, ?, ?, ?)', [
      id_expediente,
      nombre_examen,
      resultado,
      fecha,
    ]);
    res.json({ mensaje: 'Examen agregado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar examen', error: error.message });
  }
});

router.post('/agregar_medicamentos', async (req, res) => {
  const {
    id_expediente,
    nombre_medicamento,
    dosis,
    frecuencia,
    duracion,
    observaciones,
    via_administracion,
    fecha_inicio,
    fecha_fin,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO medicamentos 
       (id_expediente, nombre_medicamento, dosis, frecuencia, duracion, observaciones, via_administracion, fecha_inicio, fecha_fin) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_expediente,
        nombre_medicamento,
        dosis,
        frecuencia,
        duracion,
        observaciones,
        via_administracion,
        fecha_inicio,
        fecha_fin,
      ]
    );

    res.json({ mensaje: 'Medicamento agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar medicamento:', error);
    res.status(500).json({ mensaje: 'Error al agregar medicamento', error: error.message });
  }
});

router.post('/ver_expediente', async (req, res) => {
  const { id } = req.body;
  try {
    // Expediente principal
    const [expediente] = await pool.query(
      `SELECT e.*, 
              p.nombre AS propietario_nombre, p.direccion, p.correo, p.telefono, p.celular,
              m.nombre AS mascota_nombre, m.especie, m.raza, m.edad, m.sexo, m.peso, m.color, m.senias,
              i.vacuna_quintuple, i.vacuna_triple_felina, i.vacuna_rabia, i.vacuna_parvovirus, i.vacuna_leucemia,
              i.vacuna_bordetella, i.vacuna_giardia, i.vacuna_otra, i.desparasitacion_fecha, i.desparasitacion_medicamento,
              i.control_garrapatas_medicamento, i.tiempo_con_mascota, i.otras_mascotas, i.habitat, i.acceso_calle,
              i.contacto_enfermos, i.enfermedades_anteriores, i.dieta, i.sintomas, i.observaciones, i.medicamentos_casa,
              ex.tegumentario_aspecto, ex.tegumentario_lesiones, ex.tegumentario_alopecia, ex.tegumentario_parasitos,
              ef.fc, ef.fr, ef.temperatura, ef.pulso, ef.reflejo_pupilar, ef.mucosas, ef.dentadura, ef.condicion_corporal, ef.otras_observaciones,
              d.dx_presuntivo, d.dx_diferencial
       FROM expediente e
       LEFT JOIN propietarios p ON e.id_propietario = p.id
       LEFT JOIN mascotas m ON e.id_mascota = m.id
       LEFT JOIN info_adicional i ON e.id_expediente = i.id_expediente
       LEFT JOIN exploracion ex ON e.id_expediente = ex.id_expediente
       LEFT JOIN examen_fisico ef ON e.id_expediente = ef.id_expediente
       LEFT JOIN diagnosticos d ON e.id_expediente = d.id_expediente
       WHERE e.id_expediente=?`,
      [id]
    );

    // Exámenes y medicamentos
    const examenes = await pool.query('SELECT * FROM examenes WHERE id_expediente=?', [id]);
    const medicamentos = await pool.query('SELECT * FROM medicamentos WHERE id_expediente=?', [id]);
    // Historial ligado
    const historial = await pool.query(
      'SELECT * FROM expediente_historial WHERE id_expediente=? ORDER BY fecha_evento DESC',
      [id]
    );

    res.json({ expediente, examenes, medicamentos, historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener expediente', error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
