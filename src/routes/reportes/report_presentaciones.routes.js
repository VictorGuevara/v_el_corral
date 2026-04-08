const express = require('express');
const router = express.Router();
const pool = require('../../database');
const ExcelJS = require('exceljs');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Configuración de fuentes para pdfmake
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../../fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../../fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf'),
  },
};

const printer = new PdfPrinter(fonts);

router.post('/presentaciones', async (req, res) => {
  try {
    const { formato, desde, hasta } = req.body;

    if (!formato || !desde || !hasta) {
      return res.status(400).send('Parámetros incompletos.');
    }

    const datos = await pool.query(
      `SELECT * FROM presentaciones WHERE STR_TO_DATE(fecha_registro, '%d-%m-%Y') BETWEEN ? AND ? ORDER BY detalle_presentacion ASC`,
      [desde, hasta]
    );

    if (!datos || datos.length === 0) {
      return res.status(404).send('No hay presentaciones en ese rango de fechas.');
    }

    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Presentaciones');

      worksheet.columns = [
        { header: 'Código', key: 'cod_presentacion', width: 20 },
        { header: 'Detalle', key: 'detalle_presentacion', width: 30 },
        { header: 'Cantidad', key: 'cantidad_presentacion', width: 15 },
        { header: 'Fecha Registro', key: 'fecha_registro', width: 20 },
        { header: 'Usuario Registro', key: 'user_registro', width: 25 },
      ];

      datos.forEach((row) => worksheet.addRow(row));

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=presentaciones.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else if (formato === 'pdf') {
      const body = [
        ['#', 'Código', 'Detalle', 'Cantidad', 'Fecha Registro', 'Usuario'],
        ...datos.map((p, i) => [
          i + 1,
          p.cod_presentacion,
          p.detalle_presentacion,
          p.cantidad_presentacion,
          p.fecha_registro,
          p.user_registro,
        ]),
      ];

      const docDefinition = {
        content: [
          { text: 'Reporte de Presentaciones', style: 'header' },
          { text: `Rango: ${desde} al ${hasta}`, style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', 'auto', 'auto', '*'],
              body: [
                [
                  { text: '#', style: 'tableHeader' },
                  { text: 'Código', style: 'tableHeader' },
                  { text: 'Detalle', style: 'tableHeader' },
                  { text: 'Cantidad', style: 'tableHeader' },
                  { text: 'Fecha Registro', style: 'tableHeader' },
                  { text: 'Usuario', style: 'tableHeader' },
                ],
                ...datos.map((p, i) => [
                  { text: i + 1, style: 'tableRow' },
                  { text: p.cod_presentacion, style: 'tableRow' },
                  { text: p.detalle_presentacion, style: 'tableRow' },
                  { text: p.cantidad_presentacion, style: 'tableRow' },
                  { text: p.fecha_registro, style: 'tableRow' },
                  { text: p.user_registro, style: 'tableRow' },
                ]),
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? '#005B8B' : null),
              hLineColor: () => '#CCCCCC',
              vLineColor: () => '#CCCCCC',
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
            },
          },
        ],
        styles: {
          header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
          subheader: { fontSize: 12, alignment: 'center', margin: [0, 0, 0, 10] },
          tableHeader: { fontSize: 10, bold: true, color: 'white', alignment: 'center' },
          tableRow: { fontSize: 8 },
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=presentaciones_${desde}_a_${hasta}.pdf`);
      pdfDoc.pipe(res);
      pdfDoc.end();
    } else {
      res.status(400).send('Formato no válido.');
    }
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).send('Error interno al generar el reporte.');
  }
});

module.exports = router;
