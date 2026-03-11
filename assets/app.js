document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Upload zones (drag-and-drop + click) ---
    function setupUploadZone(zoneId, inputId, fnLabelId) {
        var zone = document.getElementById(zoneId);
        var input = document.getElementById(inputId);
        var fn = document.getElementById(fnLabelId);
        if (!zone || !input) return;

        function showFile(name) {
            fn.textContent = '✅ ' + name;
            fn.style.display = 'block';
            zone.classList.add('has-file');
        }

        input.addEventListener('change', function () {
            if (this.files && this.files[0]) showFile(this.files[0].name);
            else { fn.style.display = 'none'; zone.classList.remove('has-file'); }
        });
        zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            zone.classList.remove('dragover');
            var file = e.dataTransfer.files[0];
            if (file) {
                var dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                showFile(file.name);
            }
        });
    }

    setupUploadZone('zone_dni_frente', 'doc_dni_frente', 'fname_dni_frente');
    setupUploadZone('zone_dni_dorso', 'doc_dni_dorso', 'fname_dni_dorso');
    setupUploadZone('zone_recibo', 'doc_recibo', 'fname_recibo');

    // --- 2. Validación en tiempo real ---
    document.querySelectorAll('input[required], select[required]').forEach(function (el) {
        el.addEventListener('blur', function () {
            if (!this.checkValidity()) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        el.addEventListener('input', function () {
            if (this.classList.contains('is-invalid') && this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });

    // --- 3. IMask ---
    var cuotaMask;
    if (typeof IMask !== 'undefined') {
        var cuilEl = document.getElementById('cuil');
        var cuotaEl = document.getElementById('cuota_sindical');

        if (cuilEl) IMask(cuilEl, { mask: '00-00000000-0' });


        if (cuotaEl) {
            cuotaMask = IMask(cuotaEl, {
                mask: Number,
                scale: 0,
                thousandsSeparator: '.',
                min: 25000,
                max: 9999999
            });
        }
    }

    // --- 4. Slider cuota sindical ---
    var cuotaSlider = document.getElementById('cuota_slider');
    var cuotaEl2 = document.getElementById('cuota_sindical');
    var cuotaHelp = document.getElementById('cuota_help');

    function updateSliderFill(slider) {
        var pct = ((parseFloat(slider.value) - parseFloat(slider.min)) /
            (parseFloat(slider.max) - parseFloat(slider.min))) * 100;
        slider.style.setProperty('--slider-fill', pct.toFixed(1) + '%');
    }

    function updateCuotaHelp(source) {
        var v = parseFloat(cuotaMask ? cuotaMask.unmaskedValue : (cuotaEl2 ? cuotaEl2.value : 0)) || 0;
        if (cuotaHelp) {
            cuotaHelp.textContent = 'Como referencia: este monto de cuota sindical equivaldría al 3% de un salario bruto de $ ' +
                Math.round(v * 100 / 3).toLocaleString('es-AR');
        }
        if (source !== 'slider' && cuotaSlider && v >= 25000 && v <= 100000) {
            cuotaSlider.value = v;
            updateSliderFill(cuotaSlider);
        }
    }

    if (cuotaSlider) {
        updateSliderFill(cuotaSlider);
        cuotaSlider.addEventListener('input', function () {
            updateSliderFill(this);
            if (cuotaMask) {
                cuotaMask.unmaskedValue = this.value.toString();
                cuotaMask.updateValue();
            } else if (cuotaEl2) {
                cuotaEl2.value = this.value;
            }
            updateCuotaHelp('slider');
        });
    }

    if (cuotaEl2) {
        cuotaEl2.addEventListener('input', function () { updateCuotaHelp('input'); });
        updateCuotaHelp('init');
    }

    // --- 5. Navegación por pasos ---
    var currentStep = 1;
    var totalSteps = 3;
    var formEl = document.querySelector('form');

    function showStep(stepIndex) {
        document.querySelectorAll('.step-panel').forEach(function (panel) {
            panel.classList.remove('active');
        });
        document.querySelectorAll('.step-indicator').forEach(function (indicator, index) {
            if (index < stepIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        document.getElementById('step-' + stepIndex).classList.add('active');
        window.scrollTo({ top: formEl.offsetTop - 100, behavior: 'smooth' });
    }

    // --- 6. Lógica Condicional del Paso 2 ---

    // Dynamic label/placeholder map per TRL
    var obsConfig = {
        dependencia_con_recibo: {
            label: 'Información adicional (opcional)',
            placeholder: 'Por ejemplo: tengo dos empleadores, trabajo part-time, etc.',
            required: false
        },
        facturo_regular: {
            label: 'Información adicional (opcional)',
            placeholder: "Por ejemplo: Sobre tu facturación y/o estructura de tus 'clientes'",
            required: false
        },
        tercerizado_consultora: {
            label: 'Información adicional (opcional)',
            placeholder: 'Por ejemplo: estoy asignado a un cliente hace más de un año, trabajo en las oficinas del cliente, etc.',
            required: false
        },
        socio_cooperativa: {
            label: 'Información adicional (opcional)',
            placeholder: 'Por ejemplo: nombre de la cooperativa, tipo de proyectos, etc.',
            required: false
        },
        independiente: {
            label: 'Información adicional (opcional)',
            placeholder: 'Por ejemplo: tengo 3 clientes fijos, trabajo principalmente para el sector salud, etc.',
            required: false
        },
        no_trabajando: {
            label: 'Describí tu situación',
            placeholder: 'Contanos brevemente tu situación: estás buscando trabajo, en pausa, estudiando...',
            required: true
        }
    };

    function updateStep2Logic() {
        var trl = document.getElementById('tipo_relacion_laboral').value;
        var lugar = document.getElementById('lugar_trabajo').value;

        var grpLugar = document.getElementById('grupo_lugar_trabajo');
        var grpDir = document.getElementById('grupo_direccion');
        var grpRecibo = document.getElementById('grupo_recibo');
        var grpHomeOffice = document.getElementById('grupo_home_office');
        var grpObs = document.getElementById('grupo_observaciones');
        var selLugar = document.getElementById('lugar_trabajo');
        var lblObs = document.getElementById('lbl_observaciones');
        var txtObs = document.getElementById('observaciones_laborales');
        var fgObs = document.getElementById('fg_observaciones');
        var grpActividad = document.getElementById('grupo_empleador_actividad');
        var selActividad = document.getElementById('empleador_actividad');
        // Reset all conditional groups
        grpLugar.style.display = 'none';
        selLugar.removeAttribute('required');
        selLugar.classList.remove('is-invalid', 'is-valid');

        grpDir.style.display = 'none';
        grpDir.querySelectorAll('input, select').forEach(function (el) {
            el.removeAttribute('required');
            el.classList.remove('is-invalid', 'is-valid');
        });
        grpDir.querySelectorAll('.form-group').forEach(function (fg) { fg.classList.remove('required'); });

        grpHomeOffice.style.display = 'none';

        grpRecibo.style.display = 'none';
        var grpReciboFG = grpRecibo.querySelector('.form-group');
        if (grpReciboFG) grpReciboFG.classList.remove('required');
        grpRecibo.querySelector('input').removeAttribute('required');
        grpRecibo.querySelector('input').required = false;
        grpRecibo.querySelector('input').classList.remove('is-invalid', 'is-valid');

        grpObs.style.display = 'none';
        txtObs.removeAttribute('required');
        txtObs.classList.remove('is-invalid', 'is-valid');
        fgObs.classList.remove('required');

        if (grpActividad) {
            grpActividad.style.display = 'none';
            if (selActividad) { selActividad.removeAttribute('required'); selActividad.classList.remove('is-invalid', 'is-valid'); }
        }

        // Apply dynamic config for the textarea
        var cfg = obsConfig[trl];
        if (cfg) {
            lblObs.textContent = cfg.label;
            txtObs.placeholder = cfg.placeholder;
            if (cfg.required) {
                txtObs.setAttribute('required', 'required');
                fgObs.classList.add('required');
            }
            grpObs.style.display = 'flex';
        }

        // Helper: show employer address fields (and mark form-groups as required)
        function showDirRequired() {
            grpDir.style.display = 'block';
            grpDir.querySelectorAll('.form-group').forEach(function (fg) { fg.classList.add('required'); });
            grpDir.querySelectorAll('input, select').forEach(function (el) { el.setAttribute('required', 'required'); });
        }

        if (trl === 'dependencia_con_recibo' || trl === 'tercerizado_consultora') {
            grpLugar.style.display = 'flex'; selLugar.setAttribute('required', 'required');
            grpRecibo.style.display = 'flex';
            if (grpReciboFG) grpReciboFG.classList.add('required');
            grpRecibo.querySelector('input').setAttribute('required', 'required');
            grpRecibo.querySelector('input').required = true;

            if (trl === 'dependencia_con_recibo' && grpActividad) {
                grpActividad.style.display = 'flex';
                if (selActividad) selActividad.setAttribute('required', 'required');
            }

            if (lugar === 'sede' || lugar === 'hibrido') {
                showDirRequired();
            }
            if (lugar === 'hibrido') {
                grpHomeOffice.style.display = 'flex';
            }

        } else if (trl === 'facturo_regular' || trl === 'socio_cooperativa') {
            grpLugar.style.display = 'flex'; selLugar.setAttribute('required', 'required');

            if (trl === 'facturo_regular' && grpActividad) {
                grpActividad.style.display = 'flex';
                if (selActividad) selActividad.setAttribute('required', 'required');
            }

            if (lugar === 'sede' || lugar === 'hibrido') {
                showDirRequired();
            }
            if (lugar === 'hibrido') {
                grpHomeOffice.style.display = 'flex';
            }

        } else if (trl === 'independiente') {
            // Solo observaciones, sin lugar de trabajo
        } else if (trl === 'no_trabajando') {
            // Solo textarea (ya configurado arriba como required)
        }
    }

    var trlSelect = document.getElementById('tipo_relacion_laboral');
    var lugarSelect = document.getElementById('lugar_trabajo');
    if (trlSelect) trlSelect.addEventListener('change', updateStep2Logic);
    if (lugarSelect) lugarSelect.addEventListener('change', updateStep2Logic);

    // Run on init
    updateStep2Logic();

    // --- 7. Lógica Domicilio DNI (Paso 1) ---
    var chkDomicilio = document.getElementById('chk_domicilio_diferente');
    var grpDirPersonal = document.getElementById('grupo_direccion_personal');
    if (chkDomicilio) {
        chkDomicilio.addEventListener('change', function () {
            if (this.checked) {
                grpDirPersonal.style.display = 'block';
                grpDirPersonal.querySelectorAll('input, select').forEach(function (el) {
                    el.setAttribute('required', 'required');
                });
            } else {
                grpDirPersonal.style.display = 'none';
                grpDirPersonal.querySelectorAll('input, select').forEach(function (el) {
                    el.removeAttribute('required');
                    el.classList.remove('is-invalid', 'is-valid');
                });
            }
        });
    }

    function validateStep(stepIndex) {
        var stepPanel = document.getElementById('step-' + stepIndex);
        var requiredInputs = stepPanel.querySelectorAll('[required]');
        var isValid = true;
        var firstInvalidInput = null;

        requiredInputs.forEach(function (input) {
            if (!input.checkValidity()) {
                input.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid && firstInvalidInput && firstInvalidInput.reportValidity) {
            firstInvalidInput.reportValidity();
        }
        return isValid;
    }

    document.querySelectorAll('.btn-next').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    if (formEl) {
        formEl.addEventListener('input', function (e) {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid');
            }
        });

        var submitBtn = document.getElementById('btn_submit');
        if (submitBtn) {
            submitBtn.classList.add('disabled');
            submitBtn.style.pointerEvents = 'none';

            var updateSubmitStatus = function () {
                if (formEl.checkValidity()) {
                    submitBtn.classList.remove('disabled');
                    submitBtn.style.pointerEvents = 'auto';
                } else {
                    submitBtn.classList.add('disabled');
                    submitBtn.style.pointerEvents = 'none';
                }
            };

            formEl.addEventListener('input', updateSubmitStatus);
            formEl.addEventListener('change', updateSubmitStatus);
        }
    }
    // --- 8. Cuota flexible checkbox ---
    var chkFlexible = document.getElementById('chk_cuota_flexible');
    if (chkFlexible) {
        chkFlexible.addEventListener('change', function () {
            var step3 = document.getElementById('step-3');
            var step3SliderContainer = step3 ? step3.querySelector('.cuota-slider-container') : null;
            var cuotaInputGroup = cuotaEl2 ? cuotaEl2.closest('.input-group') : null;
            var cuotaHelpEl = document.getElementById('cuota_help');
            var disabled = this.checked;

            if (disabled) {
                // Reset cuota to default value
                var defaultValue = cuotaSlider ? cuotaSlider.min : '25000';
                if (cuotaSlider) {
                    cuotaSlider.value = defaultValue;
                    updateSliderFill(cuotaSlider);
                }
                if (cuotaMask) {
                    cuotaMask.unmaskedValue = defaultValue.toString();
                    cuotaMask.updateValue();
                } else if (cuotaEl2) {
                    cuotaEl2.value = defaultValue;
                }
                updateCuotaHelp('reset');
            }

            if (cuotaSlider) cuotaSlider.disabled = disabled;
            if (cuotaEl2) { cuotaEl2.disabled = disabled; }
            if (disabled) { if (cuotaEl2) cuotaEl2.removeAttribute('required'); }
            else { if (cuotaEl2) cuotaEl2.setAttribute('required', 'required'); }

            var opacity = disabled ? '0.45' : '';
            if (step3SliderContainer) step3SliderContainer.style.opacity = opacity;
            if (cuotaInputGroup) cuotaInputGroup.style.opacity = opacity;
            if (cuotaHelpEl) cuotaHelpEl.style.opacity = opacity;
        });
    }

});
