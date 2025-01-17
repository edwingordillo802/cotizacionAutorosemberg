import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js"; // Importar html2pdf.js
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from '@mui/material/Grid'; // Importa desde @mui/material

function App() {
  const [counter, setCounter] = useState(1);

  // Cargar el contador desde localStorage al montar el componente
  useEffect(() => {
    const savedCounter = parseInt(localStorage.getItem("counter")) || 1;
    setCounter(savedCounter);
  }, []);

  const [form, setForm] = useState({
    cliente: "",
    direccion: "",
    cc: "",
    descripcion: "",
    valorDescripcion: "",
  });

  const [descriptions, setDescriptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleDeleteDescription = (index) => {
    const updatedDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(updatedDescriptions);
  };

  const handleAddDescription = () => {
    // Verifica que form.descripcion no esté vacío
    if (form.descripcion) {
      // Si form.valorDescripcion tiene un valor, lo convertimos a número, si está vacío lo dejamos como null
      const valor = form.valorDescripcion ? parseFloat(form.valorDescripcion) : null;
  
      // Verifica si el valor ingresado es un número válido (si se proporciona)
      if (form.valorDescripcion && isNaN(valor)) {
        alert("El valor ingresado no es un número válido.");
      } else {
        setDescriptions([
          ...descriptions,
          { descripcion: form.descripcion, valor: valor },
        ]);
        setForm({ ...form, descripcion: "", valorDescripcion: "" });
      }
    } else {
      alert("Por favor completa el campo de descripción.");
    }
  };  

  function formatoPesosColombianos(valor) {
    // Verifica si el valor es válido
    if (valor === null || valor === undefined) {
      return ''; // O devuelve un valor predeterminado
    }
    
    // Si es un número válido, lo formatea
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  }
  

  const handleGenerateInvoice = (e) => {
    e.preventDefault();

    // Validar que hay descripciones y campos obligatorios llenos
    if (!form.cliente) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (descriptions.length === 0) {
      alert("Por favor agrega al menos una descripción.");
      return;
    }

    // Calcular el valor total
    const valorTotal = descriptions.reduce(
      (acc, item) => acc + (item.valor || 0),
      0
    );

    // Incrementar y guardar el contador en localStorage
    const incrementCounter = () => {
      const newCounter = counter + 1;
      setCounter(newCounter);
      localStorage.setItem("counter", newCounter); // Guardar en localStorage
      return newCounter; // Retornar el nuevo valor
    };

    // Crear el objeto de factura
    const factura = {
      cliente: form.cliente,
      direccion: form.direccion,
      cc: form.cc,
      descripciones: descriptions,
      valorTotal,
      fecha: new Date().toLocaleDateString("es-CO"),
      cotizacion: `COT-${incrementCounter()}`
    };

    // Calcular el total acumulado
    const total = factura.descripciones.reduce((sum, desc) => sum + desc.valor, 0);

    // Crear contenido HTML para la factura
    const descripcionRows = factura.descripciones
    .map(
      (desc, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${desc.descripcion}</td>
        <td></td>
        <td>${formatoPesosColombianos(desc.valor)}</td>
      </tr>
    `
    )
    .join('');
    // Simular generación de factura (puedes integrar una API aquí si es necesario)
    console.log("Factura generada:", factura);

    // Crear contenido HTML para la factura
    const invoiceContent = `
       <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Factura Autorosemberg</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto; /* Centra el contenedor en la página */
                    border: 1px solid #ccc;
                    padding: 20px; /* Espacio interno entre el contenido y el borde del contenedor */
                    background-color: #fff;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Da un efecto visual más agradable */
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    position: relative;
                }
                .company-name {
                    font-size: 24px;
                    font-weight: bold;
                }
                .company-name {
                    color: navy;
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 2px;
                }
                .company-details {
                    font-size: 14px;
                    margin: 5px 0;
                }
                .company-logo {
                    margin-top: 20px; /* Espacio entre la información y el logo */
                    text-align: center; /* Centrar el logo horizontalmente */
                }

                .company-logo img {
                    max-width: 100%;  /* Permite que el logo ocupe el ancho completo del contenedor */
                    height: auto;     /* Mantiene la proporción del logo */
                }
                .invoice-info {
                    display: flex;
                    justify-content: space-between;
                    margin: 20px 0;
                    border: 2px solid #0066cc;
                    padding: 10px;
                }
                .client-info {
                    flex: 2;
                }
                .form-row {
                    display: flex;
                    margin-bottom: 10px;
                }
                .form-label {
                    width: 100px;
                    font-weight: bold;
                }
                .form-value {
                    flex: 1;
                    border-bottom: 1px solid #ccc;
                }
                .invoice-table {
                  width: 100%;
                  max-width: 98%; /* Ajusta el ancho máximo para que se acerque más a los bordes */
                  border-collapse: collapse;
                  margin: 10px auto; /* Reduce los márgenes */
                }

                .invoice-table th, .invoice-table td {
                  border: 1px solid #0066cc;
                  padding: 8px;
                }

                .invoice-table th {
                  background-color: #0066cc;
                  color: white;
                  text-align: center;
                }

                .total-row {
                  font-weight: bold;
                }
                .signatures {
                    display: flex;
                    justify-content: space-evenly; /* Distribución uniforme entre las firmas */
                    margin-top: 50px;
                }
                .signature-line {
                    text-align: center;
                    width: 200px; /* Tamaño fijo */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .signature-image, .signature-placeholder {
                    max-width: 200px; /* Mismo tamaño máximo para consistencia */
                    height: 100px; /* Altura fija para alinear ambas secciones */
                    margin-bottom: 2px; /* Reducir el margen inferior para acercar a la línea */
                }
                .signature-placeholder {
                    background-color: transparent; /* Espacio invisible */
                }
                .signature-divider {
                    border-top: 1px solid #000;
                    width: 100%;
                    margin: 5px 0; /* Reducir espacio entre la línea y otros elementos */
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                    <div class="header">
                        <div class="company-name">AUTOROSEMBERG</div>
                        <div class="company-details">LATONERÍA Y PINTURA AUTOMOTRIZ</div>
                    <div class="company-details">Rosemberg Castellanos G.</div>
                        <div class="company-details">Nit. 17.332.303-3 Régimen Simplificado</div>
                        <div class="company-details">Villavicencio: Cra 16 No. 15-37 B. Remanso Cel.: 311 534 72 24</div>
                    </div>
                    <div class="company-logo">
                        <img src="/LOGO.jpg" alt="Logo de la empresa" class="logo">
                    </div>
                <div class="invoice-info">
                        <div class="client-info">
                            <div class="form-row">
                                <div class="form-label">CLIENTE:</div>
                                <div class="form-value">${factura.cliente}</div>
                            </div>
                            <div class="form-row">
                                <div class="form-label">DIRECCION:</div>
                                <div class="form-value">${factura.direccion}</div>
                            </div>
                            <div class="form-row">
                                <div class="form-label">C.C. ó NIT:</div>
                                <div class="form-value">${factura.cc}</div>
                            </div>
                        </div>
                        <div class="invoice-number">
                            <div>COTIZACIÓN</div>
                            <div>N° ${factura.cotizacion}</div>
                            <div>FECHA</div>
                            <div>${factura.fecha}</div>
                        </div>
                    </div>
                </div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Descripción</th>
                            <th>Valor Unitario</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${descripcionRows}
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="3" style="text-align: right;">Total:</td>
                            <td>${formatoPesosColombianos(total)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="signatures">
                    <div class="signature-line">
                        <div class="signature-placeholder"></div> 
                        <div class="signature-divider"></div>
                        FIRMA COMPRADOR
                    </div>
                    <div class="signature-line">
                        <img src="/FIRMA.jpg" alt="Firma del Vendedor" class="signature-image">
                        <div class="signature-divider"></div>
                        FIRMA VENDEDOR
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    // Usar html2pdf para generar el PDF
    const element = document.createElement("div");
    element.innerHTML = invoiceContent;
    html2pdf()
      .from(element)
      .save(`Factura_${factura.cliente}.pdf`);

    alert("Factura generada exitosamente.");

    // Limpiar el formulario y las descripciones
    setForm({
      cliente: "",
      direccion: "",
      cc: "",
      descripcion: "",
      valorDescripcion: "",
    });
    setDescriptions([]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Generar Cotizaciones
      </Typography>
      <Box component="form" onSubmit={handleGenerateInvoice}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cliente"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="C.C. o NIT"
              name="cc"
              value={form.cc}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Valor"
              name="valorDescripcion"
              value={form.valorDescripcion}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleAddDescription}
            >
              Agregar Descripción
            </Button>
          </Grid>
        </Grid>
        <List>
          {descriptions.map((item, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteDescription(index)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText
                primary={item.descripcion}
                secondary={
                  item.valor !== null
                    ? `Valor: ${formatoPesosColombianos(item.valor)}`
                    : null
                }
              />
            </ListItem>
          ))}
        </List>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Generar Factura
        </Button>
      </Box>
    </Container>
  );
}

export default App;
