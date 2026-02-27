# Definición del Formulario de Afiliación — AGC

**Proyecto:** Sumate / Formulario de Afiliación  
**Organización:** Asociación Gremial de Computación (AGC)  
**Versión del documento:** 1.1 — 27/02/2026  
**Idioma del formulario:** Español (Argentina)

---

## Descripción general

Formulario de afiliación en tres pasos. Permite que un trabajador o trabajadora informático/a solicite su afiliación al gremio AGC. El proceso es confidencial.

**Intro visible al usuario:**
> "Es simple, confidencial y se completa en 3 pasos.  
> Tu afiliación es privada: tu empleador no será informado."

**Indicadores de progreso (wizard):**
- Paso 1: Personal
- Paso 2: Laboral
- Paso 3: Gremial

**Endpoint de envío:** `POST /public/forms/afiliados`  
**Protección:** Google reCAPTCHA v3 (token enviado en campo `token_captcha`)

---

## Paso 1 — Datos personales

### Campos siempre visibles

| # | Label | ID / Name | Tipo | Requerido | Validación / Máscara | Ayuda |
|---|-------|-----------|------|-----------|----------------------|-------|
| 1 | Apellido(s) | `apellidos` | text | ✅ | Validación HTML5 | — |
| 2 | Nombre(s) | `nombres` | text | ✅ | Validación HTML5 | — |
| 3 | CUIL | `cuil` | text | ✅ | Máscara IMask: `00-00000000-0` | "Formato: 20-12345678-9" |
| 4 | Email | `email` | email | ✅ | `type="email"` | — |
| 5 | Teléfono | `telefono` | tel | ✅ | Texto libre | — |
| 6 | DNI (frente) | `doc_dni_frente` | file | ✅ | Imagen o PDF · Máx. 5 MB | "Usamos esta documentación solo para validar identidad. Es confidencial." |
| 7 | DNI (dorso) | `doc_dni_dorso` | file | ✅ | Imagen o PDF · Máx. 5 MB | "Usamos esta documentación solo para validar identidad. Es confidencial." |

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
| ¿Cuál es tu rol? | `rol_profesional` | text | ✅ | "Por ejemplo: QA Jr., Desarrollador/a Backend, Soporte técnico, etc." |

### Situación laboral

| Label | ID | Tipo | Requerido |
|-------|----|------|-----------|
| ¿Cuál es tu situación laboral? | `tipo_relacion_laboral` | select | ✅ |

**Opciones:**

| Value | Texto visible |
|-------|---------------|
| *(vacío)* | Seleccione... |
| `dependencia_con_recibo` | Trabajo en relación de dependencia (con recibo de sueldo) |
| `facturo_regular` | Facturo de manera regular a una empresa para la que trabajo de forma continua |
| `tercerizado_consultora` | Trabajo tercerizado a través de una consultora o agencia |
| `socio_cooperativa` | Soy socio/a de una cooperativa de trabajo |
| `independiente` | Trabajo de forma independiente (múltiples clientes / proyectos) |
| `no_trabajando` | Actualmente no estoy trabajando en informática |

### Grupo: Lugar de trabajo

**Label del select:** "¿Desde dónde trabajás habitualmente?"

**Opciones:**

| Value | Texto visible |
|-------|---------------|
| *(vacío)* | Seleccione... |
| `sede` | Trabajo en la sede de la empresa |
| `hibrido` | Trabajo en modalidad híbrida |
| `casa` | Trabajo desde mi casa (home office) |

**Ayuda:** "Desde dónde realizás tu trabajo habitualmente."

---

### Grupo: Dirección de la empresa

Visible cuando corresponde (Sede / Híbrido).

| Label | ID | Requerido |
|-------|----|-----------|
| Dirección de la empresa | `empleador_direccion` | ✅ |
| Localidad | `empleador_localidad` | ✅ |
| Código postal | `empleador_cp` | ✅ |
| Provincia | `empleador_provincia` | ✅ |

---

### Grupo: Recibo de sueldo

**Label:** "Último recibo de sueldo"

**Ayuda actualizada:**
> "Cargá el recibo más reciente que tengas.  
> Lo usamos únicamente para validar tu vínculo laboral.  
> Es confidencial y no se informa a tu empleador."

---

### Grupo: Información adicional

**Label:** "Información adicional (opcional)"  
**Placeholder:** "Por ejemplo: facturo para una empresa del exterior, voy una vez al mes a la oficina, etc."

---

### Grupo: Situación actual

**Label:** "Describí tu situación"  
(Requerido cuando `tipo_relacion_laboral` == `no_trabajando`)

---

## Paso 3 — Datos gremiales

### Sección: Aporte mensual

**Título:** "Elegí tu aporte mensual"

**Texto colapsable actualizado:**
> **Cuota sindical, ¿cómo funciona?**  
> El aporte sindical es la forma en que sostenemos el gremio entre todos. Con esa contribución financiamos los servicios, beneficios y la estructura que defiende a los trabajadores y trabajadoras informáticas.  
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

---

### Motivación de afiliación

**Label:** "¿Qué te motivó a afiliarte? (opcional)"  
**Subtexto:** "Podés elegir más de una opción."

---

### Comentarios

**Placeholder:** "Cualquier otra cosa que quieras mencionar..."

---

### Términos y condiciones

**Texto del checkbox:**  
"Acepto mis derechos y obligaciones como afiliado/a de la Asociación Gremial de Computación."

---

### Navegación final

**Botón final:** "**Confirmar afiliación**"
