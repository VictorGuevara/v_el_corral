<p align="center">
  <img src="src/public/img/logo_completo.jpeg" alt="Logo El Corral" width="500"/>
</p>

# 🐾 El Corral - Sistema de Gestión Veterinaria

**El Corral** es un sistema web diseñado para la administración integral de clínicas veterinarias. Permite gestionar expedientes médicos, registrar tratamientos, llevar control de eventos clínicos y mejorar la comunicación con los clientes mediante notificaciones de citas.

Su enfoque está en brindar una experiencia intuitiva, rápida y eficiente tanto para veterinarios como para el personal administrativo.

---

## 📋 Descripción General

El sistema facilita el seguimiento completo de la salud de las mascotas, desde su registro inicial hasta su historial clínico detallado. Está orientado a optimizar procesos, reducir errores y centralizar la información en una plataforma accesible.

---

## 🚀 Funcionalidades Principales

### 🗂️ Expedientes

Gestión completa de expedientes clínicos que incluyen:

- Datos del propietario
- Información de la mascota
- Consultas médicas
- Diagnósticos
- Exploración clínica
- Examen físico

---

### 💊 Exámenes y Medicamentos

Registro detallado de tratamientos y pruebas:

- Fecha de registro
- Dosis
- Frecuencia
- Duración
- Observaciones

---

### 🕒 Historial de Eventos

Seguimiento de acciones realizadas en el sistema mediante la tabla `expediente_historial`:

- Tipo de evento
- Descripción
- Fecha
- Usuario responsable

---

### 🔔 Notificaciones de Citas

Sistema de notificaciones para mejorar la atención:

- Envío de recordatorios
- Estado de la notificación
- Fecha programada de la cita

---

### 🎨 Interfaz y Experiencia de Usuario

Diseño enfocado en usabilidad:

- Formularios dinámicos
- Alertas interactivas con **SweetAlert2**
- Botones de acción intuitivos

---

## 🛠️ Tecnologías Utilizadas

- **Node.js** – Entorno de ejecución backend
- **Express** – Framework para servidor web
- **MySQL** – Base de datos relacional
- **Handlebars** – Motor de plantillas
- **SweetAlert2** – Alertas modernas e interactivas
- **Fetch API** – Comunicación asíncrona con el servidor
- **Font Awesome** – Iconografía
- **SVG / ICO** – Recursos gráficos

---

## 📦 Módulo de Inventario

El sistema cuenta con un completo módulo de **Inventario**, que integra las siguientes secciones:

- **Clientes:** Registro y gestión de clientes con historial de compras y expedientes.
- **Proveedores:** Control de proveedores y sus productos asociados.
- **Productos:** Administración de productos, precios, existencias y categorías.
- **Inventario:** Visualización general del stock disponible y movimientos de entrada/salida.
- **Ventas:** Registro de ventas con generación de reportes y **cierre diario** automático.
- **Compras:** Control de compras y actualización de existencias en tiempo real.
- **Kardex:** Seguimiento detallado de movimientos de inventario por producto.

Cada sección incluye su propio **reporte PDF**, permitiendo obtener información precisa y exportable para auditorías o análisis contables.

---

📊 Los reportes se generan desde las rutas en `src/routes/reportes/`, y cada módulo tiene su plantilla Handlebars personalizada en `src/views/inventario/`.
