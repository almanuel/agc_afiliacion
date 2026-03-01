# Guía de Migración — Formulario de Afiliación AGC

**Origen:** [sumate.informaticos.ar/html/afiliados.html](https://sumate.informaticos.ar/html/afiliados.html) (formulario actual en producción)  
**Destino:** Nueva versión local (`index.html` + `assets/app.js` + `assets/app.css`)  
**Documento de referencia:** [`definicion_formulario.md`](./definicion_formulario.md) v1.2 — 01/03/2026  
**Última actualización de esta guía:** 01/03/2026

---

## 1. Cambios de arquitectura

| Aspecto | Formulario original | Nueva versión |
|---------|-------------------|---------------|
| **Layout** | Página única con `<fieldset>` + `<legend>` (scroll largo) | Wizard de 3 pasos con paneles (`.step-panel`) |
| **Tipografía** | Stack del sistema (`-apple-system`, `Roboto`, etc.) | **Inter** (Google Fonts, pesos 400/500/600) |
| **Carga de archivos** | Plugin `bootstrap-fileinput` (~125 KB de JS) | Drag-and-drop nativo con `.upload-zone` + JS vanilla |
| **Validación** | `alert()` bloqueantes | Clases `.is-invalid` / `.is-valid` de Bootstrap + `reportValidity()` |
| **Iconos** | Font Awesome 4 (con shims inline, ~8.000 líneas) | Font Awesome 5 vía CDN |
| **Máscara CUIL** | `type="number"` sin máscara | `type="text"` con **IMask** (`00-00000000-0`) |
| **Envío** | `afiliados.js` + Axios, POST a `/public/forms/afiliados` | Endpoint **a definir** (misma lógica Axios lista para reutilizar) |
| **Protección** | reCAPTCHA v3 | reCAPTCHA v3 (sin cambios) |

---

## 2. Mapeo completo de campos

### 2.1 Datos personales → Paso 1

| Campo original | ID original | Estado | ID nuevo | Notas |
|---|---|---|---|---|
| Apellidos | `apellidos` | ✅ Se mantiene | `apellidos` | Label: "Apellido(s)" |
| Nombres | `nombres` | ✅ Se mantiene | `nombres` | Label: "Nombre(s)" |
| CUIL | `cuil` | ✅ Se mantiene | `cuil` | Ahora con máscara IMask |
| DNI (número) | `dni` | ❌ Eliminado | — | Reemplazado por carga de foto del DNI |
| Fecha de nacimiento | `fecha_nacimiento` | ❌ Eliminado | — | — |
| Nacionalidad | `nacionalidad` | ❌ Eliminado | — | — |
| Género | `genero` | ❌ Eliminado | — | — |
| Estado civil | `estado_civil` | ❌ Eliminado | — | — |
| Email | `email` | ✅ Se mantiene | `email` | — |
| Teléfono | `telefono` | ✅ Se mantiene | `telefono` | Texto libre, sin máscara |
| Chk domicilio electrónico | `chk_domicilioElectronico` | ❌ Eliminado | — | — |
| Calle / Número / Piso / Depto | `calle`, `numero`, `piso`, `depto` | 🔄 Consolidado | `personal_direccion` | Un solo campo con placeholder descriptivo |
| Localidad | `localidad` | 🔄 Renombrado | `personal_localidad` | — |
| Código postal | `cp` | 🔄 Renombrado | `personal_cp` | — |
| Provincia | `provincia` | 🔄 Renombrado | `personal_provincia` | — |

**Cambios importantes en Paso 1:**

- Los campos de **domicilio personal** ahora son **condicionales**: solo aparecen si el usuario marca el checkbox `chk_domicilio_diferente` ("Vivo en un domicilio diferente al que figura en mi DNI").
- Se agregó un **microcopy** antes de los campos de DNI: _"Para proteger a los afiliados y afiliadas de afiliaciones falsas, necesitamos confirmar que sos vos. Esta documentación es confidencial y se usa únicamente para validar tu identidad."_

---

### 2.2 Datos laborales → Paso 2

| Campo original | ID original | Estado | ID nuevo | Notas |
|---|---|---|---|---|
| CUIT empleador | `empleador_cuit` | ❌ Eliminado | — | — |
| Razón social | `empleador_razon_social` | ❌ Eliminado | — | — |
| Fecha de ingreso | `empleador_fecha_ingreso` | ❌ Eliminado | — | — |
| Puesto desempeñado | `empleador_puesto` | 🔄 Renombrado | `rol_profesional` | Label: "¿Cuál es tu rol?" |
| Ingreso mensual | `ultimo_ingreso_declarado` | ❌ Eliminado | — | — |
| Tipo domicilio laboral | `empleador_tipo_domicilio` (radio) | 🔄 Reemplazado | `lugar_trabajo` (select) | Opciones diferentes (ver abajo) |
| Dirección empresa | `empleador_calle`, `empleador_numero`, etc. | 🔄 Consolidado | `empleador_direccion` | Un solo campo con placeholder |
| Localidad empresa | `empleador_localidad` | ✅ Se mantiene | `empleador_localidad` | — |
| CP empresa | `empleador_cp` | ✅ Se mantiene | `empleador_cp` | — |
| Provincia empresa | `empleador_provincia` | ✅ Se mantiene | `empleador_provincia` | — |

**Campos nuevos en Paso 2:**

| ID nuevo | Tipo | Descripción |
|---|---|---|
| `tipo_relacion_laboral` | select | Campo central que controla la visibilidad de los demás grupos (ver sección 3) |
| `lugar_trabajo` | select | Opciones: `sede`, `casa`, `hibrido` |
| `home_office_dias` | range (slider) | 0–5 días. Visible solo cuando `lugar_trabajo == hibrido` |
| `doc_recibo` | file (upload-zone) | Último recibo de sueldo. Visible solo cuando `tipo_relacion_laboral == dependencia_con_recibo` |
| `observaciones_laborales` | textarea | Label y placeholder **dinámicos** según TRL (ver sección 3.2) |

---

### 2.3 Datos gremiales → Paso 3 (completamente nuevo)

El formulario original no tenía esta sección. Todos los campos son nuevos:

| ID nuevo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cuota_slider` | range | — | Slider $25.000–$100.000, enlazado al campo de texto |
| `cuota_sindical` | text (IMask) | ✅ | Monto del aporte mensual. Desactivable con el checkbox flexible |
| `chk_cuota_flexible` | checkbox | — | "Por ahora no puedo aportar ese monto — quiero que me contacten." Al marcar, deshabilita el slider y el campo de monto (visualmente atenuados) |
| `motivo_afiliacion[]` | checkboxes | ❌ | 5 opciones opcionales de motivación |
| `comentarios` | textarea | ❌ | Texto libre opcional |
| `chk_confirma` | checkbox | ✅ | Aceptación de términos y condiciones |

---

## 3. Lógica condicional (Paso 2)

### 3.1 Visibilidad de grupos según `tipo_relacion_laboral`

| Grupo | `dependencia_con_recibo` | `facturo_regular` | `tercerizado_consultora` | `socio_cooperativa` | `independiente` | `no_trabajando` |
|-------|---|---|---|---|---|---|
| Lugar de trabajo | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Dirección empresa¹ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Home office días² | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Recibo de sueldo | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Textarea (obs/situación) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

¹ Solo visible si `lugar_trabajo == sede` o `hibrido`  
² Solo visible si `lugar_trabajo == hibrido`

### 3.2 Textarea dinámico (`observaciones_laborales`)

El label, placeholder y requisito del textarea cambian según la selección de `tipo_relacion_laboral`:

| TRL | Label | Placeholder | Requerido |
|-----|-------|-------------|-----------|
| `dependencia_con_recibo` | Información adicional (opcional) | "Por ejemplo: tengo dos empleadores, trabajo part-time, etc." | ❌ |
| `facturo_regular` | Información adicional (opcional) | "Por ejemplo: facturo en dólares, trabajo para una empresa del exterior, etc." | ❌ |
| `tercerizado_consultora` | Información adicional (opcional) | "Por ejemplo: estoy asignado a un cliente hace más de un año, trabajo en las oficinas del cliente, etc." | ❌ |
| `socio_cooperativa` | Información adicional (opcional) | "Por ejemplo: nombre de la cooperativa, tipo de proyectos, etc." | ❌ |
| `independiente` | Información adicional (opcional) | "Por ejemplo: tengo 3 clientes fijos, trabajo principalmente para el sector salud, etc." | ❌ |
| `no_trabajando` | Describí tu situación | "Contanos brevemente tu situación: estás buscando trabajo, en pausa, estudiando..." | ✅ |

> **Implementación:** El mapa de configuraciones está en `app.js` en el objeto `obsConfig`. La función `updateStep2Logic()` aplica la configuración dinámicamente.

---

## 4. Estructura de archivos

```
agc_afiliacion/
├── index.html                   ← Formulario completo (3 pasos)
├── assets/
│   ├── app.css                  ← Estilos custom (wizard, upload-zone, slider, etc.)
│   ├── app.js                   ← Lógica principal (wizard, condiciones, IMask, cuota)
│   ├── afiliados.js             ← Lógica de envío (Axios + reCAPTCHA) — REUTILIZAR
│   ├── utils.js                 ← Utilidades menores
│   ├── recaptcha.js             ← Setup de reCAPTCHA v3
│   ├── bootstrap.min.css/.js    ← Bootstrap 4
│   ├── axios.min.js             ← HTTP client
│   └── ti.png / ti-thumbnail.jpg← Assets de marca
└── docs/
    ├── definicion_formulario.md ← Especificación funcional
    └── guia_migracion.md        ← Esta guía
```

---

## 5. Lógica del cuota flexible (Paso 3)

| Estado del checkbox `chk_cuota_flexible` | Slider | Campo monto | Help text | `required` en `cuota_sindical` |
|---|---|---|---|---|
| ❌ Desmarcado | Habilitado | Habilitado | Visible | ✅ Sí |
| ✅ Marcado | Deshabilitado (opacidad 0.45) | Deshabilitado (opacidad 0.45) | Atenuado (opacidad 0.45) | ❌ No |

---

## 6. Checklist para el equipo de desarrollo

### Infraestructura
- [ ] Asegurar la carga de **Google Fonts** (Inter, pesos 400/500/600)
- [ ] Incluir **Font Awesome 5** vía CDN (no la versión 4 inline)
- [ ] Reemplazar **bootstrap-fileinput** por las `.upload-zone` ya implementadas en `app.js`
- [ ] Eliminar scripts/CSS de fileinput del `<head>`

### Backend / Envío
- [ ] Definir el **endpoint de envío** (actualmente `A DEFINIR` en la especificación)
- [ ] Adaptar `afiliados.js` al nuevo endpoint si cambió la URL
- [ ] Considerar que los siguientes campos del formulario original ya **no se envían**: `dni`, `fecha_nacimiento`, `nacionalidad`, `genero`, `estado_civil`, `empleador_cuit`, `empleador_razon_social`, `empleador_fecha_ingreso`, `ultimo_ingreso_declarado`, `chk_domicilioElectronico`
- [ ] Agregar soporte para los **campos nuevos**: `tipo_relacion_laboral`, `lugar_trabajo`, `home_office_dias`, `observaciones_laborales`, `cuota_sindical`, `chk_cuota_flexible`, `motivo_afiliacion[]`, `comentarios`, `chk_domicilio_diferente`

### Frontend
- [ ] Verificar que el objeto **`obsConfig`** en `app.js` coincida con la tabla de la sección 3.2
- [ ] Confirmar que el slider de cuota sindical se deshabilita (no se oculta) al marcar `chk_cuota_flexible`
- [ ] Verificar que `cuota_sindical` pierde su `required` al activar el checkbox flexible
- [ ] Microcopy del DNI: confirmar visibilidad del párrafo introductorio antes de los upload zones

### Pendientes (fuera de scope de la migración)
- [ ] Documento de términos y condiciones (link desde el checkbox `chk_confirma`)
- [ ] Pantalla/mensaje de confirmación post-envío
- [ ] Implementar analytics con eventos por paso para medir abandono
