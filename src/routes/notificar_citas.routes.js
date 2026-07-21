/* -------------------------------------------------------------------------- */
/*                               IMPORTACIONES                                */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../database');
const { isLoggedIn, authCiudad } = require('../lib/auth');
const axios = require('axios');

/* -------------------------------------------------------------------------- */
/*                                   RUTAS                                    */
/* -------------------------------------------------------------------------- */

// Ruta de renderizar la vista de compras.
router.get('/', isLoggedIn, authCiudad(['Administrador', 'Asistente']), async (req, res) => {
	// Renderizamos la vista de compras...
	await res.render('admin/notificar_citas');
});

// 1. Listar notificaciones
router.get('/list', async (req, res) => {
	try {
		const rows = await pool.query(
			`
			  SELECT n.id_notificacion,
			         c.codigo_citas AS codigo_cita,
			         c.nombre_cliente,
			         n.telefono_cliente,
			         n.mensaje,
			         n.fecha_programada,
			         n.estado,
			         n.fecha_envio,
			         n.user_registro
			  FROM notificaciones n
			  LEFT JOIN citas c ON n.id_cita = c.id_cita
			  WHERE DATE(n.fecha_programada) = CURDATE() + INTERVAL 1 DAY
			  ORDER BY n.fecha_programada DESC;
			`
		);

		res.json(rows); // siempre devuelve un array
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al listar notificaciones' });
	}
});

// 2. Actualizar estado
router.put('/estado', async (req, res) => {
	const { id_notificacion, estado } = req.body;
	try {
		await pool.query('UPDATE notificaciones SET estado = ? WHERE id_notificacion = ?', [estado, id_notificacion]);
		res.json({ mensaje: 'Estado actualizado correctamente' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al actualizar estado' });
	}
});

// 3. Notificar individualmente
router.post('/enviar', async (req, res) => {
	const { id_notificacion } = req.body;
	try {
		const [rows] = await pool.query('SELECT telefono_cliente, mensaje FROM notificaciones WHERE id_notificacion = ?', [
			id_notificacion,
		]);
		if (rows.length === 0) return res.status(404).json({ mensaje: 'Notificación no encontrada' });

		const notif = rows[0];

		// Aquí llamas a tu servicio de WhatsApp
		await axios.post(
			`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
			{
				messaging_product: 'whatsapp',
				to: notif.telefono_cliente, // número del cliente en formato internacional (+503...)
				type: 'text',
				text: { body: notif.mensaje }, // el mensaje que guardaste en la BD
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, // token de acceso de Meta
					'Content-Type': 'application/json',
				},
			}
		);

		await pool.query('UPDATE notificaciones SET estado = "enviado", fecha_envio = NOW() WHERE id_notificacion = ?', [
			id_notificacion,
		]);

		res.json({ mensaje: 'Notificación enviada correctamente' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensaje: 'Error al enviar notificación' });
	}
});

/* -------------------------------------------------------------------------- */
/*                               EXPORTACIONES                                */
/* -------------------------------------------------------------------------- */
module.exports = router;
