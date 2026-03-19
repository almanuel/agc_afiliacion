# Definición del Formulario de Afiliación — AGC

**Proyecto:** Sumate / Formulario de Afiliación  
**Organización:** Asociación Gremial de Computación (AGC)  
**Versión del documento:** 1.5 — 19/03/2026  
**Idioma del formulario:** Español (Argentina)

---

## Descripción general

Formulario de afiliación en tres pasos. Permite que un trabajador o trabajadora informático/a solicite su afiliación al gremio AGC. El proceso es confidencial.

**URL del formulario:** https://sumate.informaticos.ar/

**Intro visible al usuario:**
> "Es simple, confidencial y se completa en 3 pasos.  
> Tu afiliación es privada: tu empleador no será informado."

**Indicadores de progreso (wizard):**
- Paso 1: Personal
- Paso 2: Profesional
- Paso 3: Gremial

**Endpoint de envío:** `A DEFINIR`  
**Protección:** Google reCAPTCHA v3 (token enviado en campo `token_captcha`)

---

## Paso 1 — Datos personales

### Campos siempre visibles

| # | Label | ID / Name | Tipo | Requerido | Validación / Máscara | Ayuda |
|---|-------|-----------|------|-----------|----------------------|-------|
| 1 | Apellido(s) | `apellidos` | text | ✅ | Validación HTML5 | — |
| 2 | Nombre(s) | `nombres` | text | ✅ | Validación HTML5 | — |
| 3 | CUIL | `cuil` | text | ✅ | Máscara IMask: `00-00000000-0` | "Formato: 20-12345678-9" |
| 4 | Teléfono | `telefono` | tel | ✅ | Texto libre | — |
| 5 | Email | `email` | email | ✅ | `type="email"` | — |
| 6 | DNI (frente) | `doc_dni_frente` | file | ✅ | Imagen o PDF · Máx. 5 MB | Ver microcopy abajo |
| 7 | DNI (dorso) | `doc_dni_dorso` | file | ✅ | Imagen o PDF · Máx. 5 MB | Ver microcopy abajo |

**Microcopy previo a los campos de DNI:**
> "Para proteger a los afiliados y afiliadas de afiliaciones falsas, necesitamos confirmar que sos vos. Esta documentación es confidencial y se usa para validar tu identidad."

### Checkbox condicional

| ID | Label | Comportamiento |
|----|-------|----------------|
| `chk_domicilio_diferente` | Vivo en un domicilio diferente al que figura en mi DNI | Muestra grupo `grupo_direccion_personal` |

### Grupo condicional: Domicilio actual

Visible solo si el checkbox está marcado.

| Label | ID / Name | Tipo | Requerido |
|-------|-----------|------|-----------|
| Dirección | `personal_direccion` | text | ✅ |
| Localidad | `personal_localidad` | text | ✅ |
| Código postal | `personal_cp` | text | ✅ |
| Provincia | `personal_provincia` | select | ✅ |

---

## Paso 2 — Datos laborales

### Campo principal

| Label | ID | Tipo | Requerido | Ayuda |
|-------|----|------|-----------|-------|
| ¿Cuál es tu rol profesional? | `rol_profesional` | text (auto-suggest) | ✅ | "Por ejemplo: Programador/a Jr, Soporte técnico, QA Sr, etc." |

**Sugerencias iniciales de rol profesional:**

| Sugerencia |
|------------|
| Programador/a de software |
| Analista de calidad de software |
| Analista funcional |
| Analista de seguridad informática |
| Devops |
| Administrador de sistemas |
| Diseñador/a de UX / UI |
| Administrador de redes e infraestructura |
| Gestor/a de proyecto TI |
| Implementador de proyectos TI |
| Soporte técnico |
| Mesa de ayuda |
| Analista de datos |
| Analista en marketing digital |
| Operador de datos |
| Administrador base de datos |
| Administrador de comunidades (C.M.) |
| Soporte de línea de producción de hardware |
| Control de calidad en hardware |
| Diseñador de línea de producción de hardware |
| Analista de recursos humanos TI |
| Vendedor TI |
| Administrativo TI |
| RRPP, comunicaciones y asuntos institucionales TI |
| Servicios generales y mantenimiento |

> El usuario puede escribir libremente o seleccionar una sugerencia del desplegable. Las sugerencias seleccionadas también pueden editarse.

### Situación laboral

| Label | ID | Tipo | Requerido |
|-------|----|------|-----------|
| ¿Cuál es tu situación laboral? | `tipo_relacion_laboral` | select | ✅ |

**Opciones:**

| Value | Texto visible |
|-------|---------------|
| *(vacío — placeholder)* | Modalidad de trabajo... |
| `dependencia_con_recibo` | Trabajo en relación de dependencia (con recibo de sueldo) |
| `dependencia_no_registrada` | Trabajo en relación de dependencia no registrada (informal) |
| `facturo_regular` | Facturo a una empresa de forma continua (“contractor”) |
| `socio_cooperativa` | Soy socio/a de una cooperativa de trabajo |
| `independiente` | Trabajo de forma independiente (múltiples clientes / proyectos) |
| `no_trabajando` | Actualmente no estoy trabajando |

---

### Campo: Actividad del empleador

Visible y requerido solo cuando `tipo_relacion_laboral` == `dependencia_con_recibo` o `facturo_regular`.

| Label | ID | Tipo | Requerido |
|-------|----|------|-----------|
| ¿Cuál es la actividad de tu empleador? | `empleador_actividad` | select | ✅ (condicional) |

**Placeholder option:** "Actividad principal..."

**Opciones:**

| Value | Texto visible |
|-------|---------------|
| *(vacío — placeholder)* | Actividad principal... |
| `informatica` | Informática (software, hardware y servicios TI) |
| `otro_sector` | Otro sector |
| `no_se` | No lo sé |

### Grupo: Lugar de trabajo

Visible y requerido cuando `tipo_relacion_laboral` == `dependencia_con_recibo`, `facturo_regular` o `socio_cooperativa`.  
No se muestra para `independiente`, `no_trabajando` ni `dependencia_no_registrada`.

**Label del select:** "¿Desde dónde trabajás habitualmente?"

**Opciones:**

| Value | Texto visible |
|-------|---------------|
| *(vacío)* | Seleccione... |
| `sede` | Trabajo en sede de la empresa |
| `casa` | Trabajo desde casa (remoto) |
| `calle` | Hago trabajo de calle |
| `hibrido` | Trabajo en modalidad híbrida |

**Ayuda:** "Desde dónde realizás tu trabajo habitualmente."

---

### Grupo: Días de home office

Visible cuando `lugar_trabajo` == `hibrido`.

**Label:** "¿Cuántos días hacés de home office?"  
**Tipo:** range slider (0–5, paso 1)  
**Ayuda:** "Indicá cuántos días por semana solés trabajar desde casa."

---

### Grupo: Dirección de la empresa

Visible cuando `lugar_trabajo` == `sede` o `hibrido`.

| Label | ID | Requerido |
|-------|----|-----------|
| Dirección de la empresa | `empleador_direccion` | ✅ |
| Localidad | `empleador_localidad` | ✅ |
| Código postal | `empleador_cp` | ✅ |
| Provincia | `empleador_provincia` | ✅ |

---

### Grupo: Recibo de sueldo

Visible y requerido cuando `tipo_relacion_laboral` == `dependencia_con_recibo`.

**Label:** "Último recibo de sueldo"

**Ayuda:**
> "Cargá el recibo más reciente que tengas.  
> Lo usamos para validar tu vínculo laboral.  
> Es confidencial y no se informa a tu empleador."

---

### Grupo: Información adicional

**Label dinámico según `tipo_relacion_laboral`:**

| Value | Label | Requerido |
|-------|-------|-----------|
| `dependencia_con_recibo` | "Información adicional (opcional)" | ❌ |
| `facturo_regular` | "Información adicional (opcional)" | ❌ |
| `dependencia_no_registrada` | "Información adicional (opcional)" | ❌ |
| `socio_cooperativa` | "Información adicional (opcional)" | ❌ |
| `independiente` | "Información adicional (opcional)" | ❌ |
| `no_trabajando` | "Describí tu situación" | ✅ |

**Placeholder dinámico según `tipo_relacion_laboral`:**

| Value | Placeholder |
|-------|-------------|
| `dependencia_con_recibo` | "Por ejemplo: trabajo part-time, estoy tercerizado, tengo dos empleadores, etc." |
| `facturo_regular` | "Por ejemplo: Sobre tu facturación y/o estructura de tus 'clientes'" |
| `dependencia_no_registrada` | "Contanos dónde trabajás y tu situación, nos pondremos en contacto." |
| `socio_cooperativa` | "Por ejemplo: nombre de la cooperativa, tipo de proyectos, etc." |
| `independiente` | "Por ejemplo: tengo 3 clientes fijos, trabajo principalmente para el sector salud, etc." |
| `no_trabajando` | "Contanos brevemente tu situación: estás buscando trabajo, en pausa, estudiando..." |

---

## Paso 3 — Datos gremiales

### Sección: Aporte mensual

**Título:** "Elegí tu aporte mensual"

**Valor inicial del slider:** $40.000 (mínimo × 1,6)  
**Rango:** $25.000 (mínimo) — $100.000+  
**Paso:** $1.000  
**Campo de texto:** Prefijo `$ ARS` y sufijo `/mes`

**Sección colapsable (cerrada por defecto, componente `pago-contexto`):**
> ¿Cómo funciona? La cuota sindical es la forma en que sostenemos el gremio entre todos. Con esa contribución financiamos los servicios, beneficios y la estructura que defiende a los trabajadores y trabajadoras informáticas.  
> En muchos gremios equivale al 3% del salario bruto. En AGC elegimos un modelo flexible: podés definir un monto mensual fijo según tus posibilidades.  
> Tu aporte permite sostener:  
> • Asesoramiento legal y gremial  
> • Beneficios y descuentos para afiliados/as  
> • Formación profesional y gremial  
> • Defensa ante conflictos laborales  
> • Negociación colectiva en la industria  
> Periódicamente te invitamos a revisar y actualizar tu aporte.

**Referencia dinámica:**
> "Como referencia: equivale aproximadamente al 3% de un salario bruto de $X."

**Opción de cuota flexible:**  
Checkbox visible debajo del slider:
> "Por ahora no puedo aportar ni el mínimo — quiero que me contacten."

Al marcarse, el slider y el campo de monto se deshabilitan (visualmente atenuados) y se registra la solicitud de contacto. El valor de cuota elegido se mantiene sin cambios.

---

### Motivación de afiliación

**Label:** "¿Qué te motivó a afiliarte? (opcional)"  
**Subtexto:** "Podés elegir más de una opción."

**Opciones (checkboxes):**

| ID | Texto visible |
|----|---------------|
| `motivo_beneficios` | Acceder a beneficios y descuentos |
| `motivo_legal` | Contar con asesoramiento legal |
| `motivo_derechos` | Estar informado sobre mis derechos laborales |
| `motivo_acomp` | Acompañar la organización del sector IT |
| `motivo_participar` | Participar activamente en el gremio |

---

### Comentarios

**Placeholder:** "Cualquier otra cosa que quieras mencionar..."

---

### Términos y condiciones

**Texto del checkbox:**  
"Acepto mis [derechos y obligaciones](derechos-y-obligaciones) como afiliado/a de la Asociación Gremial de Computación."

> ⚠️ El texto debe incluir un link al documento de términos y condiciones (en elaboración).

---

### Navegación final

**Botón final:** "**Confirmar afiliación**"

---

## Pantalla de confirmación (`confirmacion.html`)

Página que se muestra al afiliado/a tras enviar el formulario correctamente.

**URL:** `confirmacion.html`  
**Archivo:** `confirmacion.html`

### Jumbotron

| Elemento | Texto |
|----------|-------|
| Título | Recibimos tu solicitud ¡Bienvenido/a a AGC! |
| Subtítulo | Revisaremos tu documentación y confirmaremos tu afiliación en un plazo máximo de 48 horas. Te enviamos un mail con esta información. |

### Sección "Cómo sigue el proceso"

**Título de sección:** "Cómo sigue el proceso"

| # | Estado | Título | Descripción |
|---|--------|--------|-------------|
| 1 | ✅ Completado | Solicitud enviada | Recibimos tus datos y documentación. |
| 2 | Pendiente | Validación — hasta 48 hs | Nuestro equipo revisa tu documentación y confirma tu afiliación. Te avisamos por mail. |
| 3 | Pendiente | Afiliación confirmada | Accedés a todos los beneficios y servicios del gremio. Te vamos a enviar un mail con información sobre cómo podes abonar tu cuota. |

### Link al pie

> "Conocé más sobre AGC en [informaticos.ar](https://informaticos.ar)"

---

## Pendientes

- Documento de términos y condiciones
- Implementar analytics con eventos por paso para medir abandono