# Guía de Migración Técnica (v2) — Formulario de Afiliación AGC

**Origen (Online):** [sumate.informaticos.ar/html/afiliados.html](https://sumate.informaticos.ar/html/afiliados.html)  
**Destino (Final):** Versión Optimizada (HTML5 + Wizard + Inter)  
**Auditoría Técnica:** 27/02/2026

---

## 1. Evolución de la Interfaz y Estilos

### 1.1 Tipografía y Colores
- **Original:** Usa el stack de fuentes del sistema (`-apple-system`, `Roboto`, etc.). Los títulos de sección (`<legend>`) usan un azul brillante (`#0080eb`).
- **Nuevo:** Se migró a la tipografía **Inter** (vía Google Fonts) para un look más moderno y consistente. Los colores se estandarizaron usando las variables de **Bootstrap 4** con acentos en azul primario.

### 1.2 Layout (Estructura de la página)
- **Original:** Formulario de página única ("long scroll") organizado con `<fieldset>` y `<legend>`.
- **Nuevo:** Estructura de **Wizard (Asistente)** en 3 pasos utilizando paneles (`.step-panel`). Esto reduce la carga cognitiva del usuario al mostrar solo la información relevante del paso actual.

---

## 2. Definición de Campos: Antes vs. Después

### 2.1 Datos Personales (Paso 1)

| Campo / ID | Estado en Original | Cambio en Nueva Versión |
| :--- | :--- | :--- |
| `apellidos` | Ya estaba separado. | Se mantiene como campo individual. Label: "Apellido". |
| `nombres` | Ya estaba separado. | Se mantiene como campo individual. Label: "Nombre". |
| `cuil` | `type="number"` | Se cambió a **`type="text"`** con máscara **IMask** (`00-00000000-0`). |
| `dni` (número) | Presente. | **Eliminado.** La identificación se realiza mediante la carga de archivos del DNI. |
| `fecha_nacimiento` | Presente. | **Eliminado.** (Simplificación del formulario). |
| `nacionalidad` | Presente. | **Eliminado.** |
| `genero` / `est_civil`| Presente. | **Eliminado.** |
| `telefono` | Input simple. | Se mantiene como texto libre (sin máscara) para mayor flexibilidad. |

**Importante — Direcciones:**
- El formulario original pedía `calle`, `numero`, `piso`, `depto` por separado.
- La nueva versión consolida esto en un único campo **`personal_direccion`** (con placeholder descriptivo) para agilizar la carga.

---

### 2.2 Datos Laborales (Paso 2)

Este paso presenta los cambios más significativos de lógica.

| Campo / ID | Estado en Original | Cambio en Nueva Versión |
| :--- | :--- | :--- |
| **Relación Laboral** | **No existía.** | Se introdujo el campo `tipo_relacion_laboral`. |
| **Rol / Puesto** | `empleador_puesto` | Renombrado a **`rol_profesional`**. Ahora es el primer campo obligatorio. |
| **Empleador CUIT** | `empleador_cuit` | **Eliminado.** (Simplificación de la declaración inicial). |
| **Razón Social** | `empleador_razon_social` | **Eliminado.** |
| **Lugar de Trabajo** | Radio buttons. | Se migró a un **Select** (`lugar_trabajo`) con opciones refinadas. |
| **Dirección Empresa** | Campos separados. | Consolidados en **`empleador_direccion`**, `localidad`, `cp` y `provincia`. |

> **Nota sobre Compatibilidad:** Se eliminó la dependencia de campos sensibles (CUIT Empleador, Razón Social) en la etapa de solicitud inicial para reducir la fricción, enfocándose en el rol y la ubicación del trabajador.

---

### 2.3 Datos Gremiales y Envío (Paso 3)

| Concepto | Versión Original | Nueva Versión |
| :--- | :--- | :--- |
| **Aporte Mensual** | `input type="number"` | **Slider interactivo + IMask.** Valor mínimo de **$25.000**. |
| **Motivaciones** | No existía. | Nuevos checkboxes opcionales (`motivo_afiliacion[]`). |
| **Comentarios** | No existía. | Nuevo textarea opcional (`comentarios`). |
| **Validación Fin** | Formulario HTML5 estándar. | Validación Bootstrap dinámica que habilita el envío solo si el form es 100% válido. |

---

## 3. Eliminación de Dependencias Críticas

Se detectaron y eliminaron componentes obsoletos para mejorar el rendimiento:

1.  **Bootstrap Fileinput:** Se eliminó este plugin masivo. Ahora la carga de archivos (`doc_dni_frente`, `doc_dni_dorso`, `doc_recibo`) usa un sistema liviano de **Drag-and-Drop** basado en clases CSS (`.upload-zone`) y JS nativo.
2.  **Font Awesome 4 Shims:** Se eliminaron ~8.000 líneas de código inline de íconos. Se utiliza el CDN oficial de **Font Awesome 5**.
3.  **Alertas Bloqueantes:** El uso de `alert()` para errores de validación fue reemplazado por la clase `.is-invalid` de Bootstrap, permitiendo una navegación fluida.

---

## 4. Checklist para el Desarrollo

1.  **Head:** Asegurar la carga de Google Fonts (Inter) y CSS consolidado (`app.css`).
2.  **JS:** Migrar la lógica de envío de `afiliados.js`. Notar que si el backend requiere `dni` (número) o `empleador_cuit`, estos campos deberán ser restaurados en el HTML o pasados como valores por defecto hasta que se actualice la API.
3.  **UI:** El contenedor del Step 3 debe ser `col-md-9` para asegurar el centrado del slider y los nuevos checkboxes.
4.  **Imágenes:** Reemplazar los íconos estáticos por los nuevos componentes `upload-zone` con sus respectivos IDs para que el JS de `app.js` funcione correctamente.
