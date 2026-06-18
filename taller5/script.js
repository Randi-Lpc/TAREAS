(function() {

    //    ++DOM++
    const form = document.getElementById('formEstudiante');
    const cedula = document.getElementById('cedula');
    const apellidos = document.getElementById('apellidos');
    const nombres = document.getElementById('nombres');
    const direccion = document.getElementById('direccion');
    const telefono = document.getElementById('telefono');
    const correo = document.getElementById('correo');
    const facultad = document.getElementById('facultad');
    const nivel = document.getElementById('nivel');
    const paralelo = document.getElementById('paralelo');

    const cedulaError = document.getElementById('cedulaError');
    const apellidosError = document.getElementById('apellidosError');
    const nombresError = document.getElementById('nombresError');
    const direccionError = document.getElementById('direccionError');
    const telefonoError = document.getElementById('telefonoError');
    const correoError = document.getElementById('correoError');
    const facultadError = document.getElementById('facultadError');
    const nivelError = document.getElementById('nivelError');
    const paraleloError = document.getElementById('paraleloError');

    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const mensajeVacio = document.getElementById('mensajeVacio');
    const contadorSpan = document.getElementById('contadorEstudiantes');
    const regexCedula = /^[0-9]{10}$/;
    const regexApellidos = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}$/;
    const regexNombres = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,50}$/;
    const regexTelefono = /^[0-9]{7,10}$/;
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexDireccion = /^[a-zA-Z0-9\s.,#\-]{3,80}$/;

    function validarCedula() {
        const val = cedula.value.trim();
        if (!regexCedula.test(val)) {
            cedulaError.textContent = 'Cédula: 10 dígitos numéricos.';
            cedula.classList.add('error');
            return false;
        } else {
            cedulaError.textContent = '';
            cedula.classList.remove('error');
            return true;
        }
    }

    function validarApellidos() {
        const val = apellidos.value.trim();
        if (!regexApellidos.test(val)) {
            apellidosError.textContent = 'Apellidos: solo letras y espacios (2-50).';
            apellidos.classList.add('error');
            return false;
        } else {
            apellidosError.textContent = '';
            apellidos.classList.remove('error');
            return true;
        }
    }

    function validarNombres() {
        const val = nombres.value.trim();
        if (!regexNombres.test(val)) {
            nombresError.textContent = 'Nombres: solo letras y espacios (2-50).';
            nombres.classList.add('error');
            return false;
        } else {
            nombresError.textContent = '';
            nombres.classList.remove('error');
            return true;
        }
    }

    function validarDireccion() {
        const val = direccion.value.trim();
        if (val === '') {
            direccionError.textContent = '';
            direccion.classList.remove('error');
            return true;
        }
        if (!regexDireccion.test(val)) {
            direccionError.textContent = 'Dirección: mínimo 3 caracteres (letras,números,espacios)';
            direccion.classList.add('error');
            return false;
        } else {
            direccionError.textContent = '';
            direccion.classList.remove('error');
            return true;
        }
    }

    function validarTelefono() {
        const val = telefono.value.trim();
        if (!regexTelefono.test(val)) {
            telefonoError.textContent = 'Teléfono: 7 a 10 dígitos numéricos.';
            telefono.classList.add('error');
            return false;
        } else {
            telefonoError.textContent = '';
            telefono.classList.remove('error');
            return true;
        }
    }

    function validarCorreo() {
        const val = correo.value.trim();
        if (!regexCorreo.test(val)) {
            correoError.textContent = 'Correo inválido (ej: user@dominio.com)';
            correo.classList.add('error');
            return false;
        } else {
            correoError.textContent = '';
            correo.classList.remove('error');
            return true;
        }
    }

    function validarSelect(select, errorSpan) {
        if (select.value === '') {
            errorSpan.textContent = 'Seleccione una opción.';
            select.classList.add('error');
            return false;
        } else {
            errorSpan.textContent = '';
            select.classList.remove('error');
            return true;
        }
    }
    function validarFormulario() {
        const c = validarCedula();
        const a = validarApellidos();
        const n = validarNombres();
        const d = validarDireccion();
        const t = validarTelefono();
        const e = validarCorreo();
        const f = validarSelect(facultad, facultadError);
        const ni = validarSelect(nivel, nivelError);
        const p = validarSelect(paralelo, paraleloError);
        return c && a && n && d && t && e && f && ni && p;
    }
    function obtenerEstudiantes() {
        const data = localStorage.getItem('estudiantes');
        if (data) {
            try {
                return JSON.parse(data);
            } catch {
                return [];
            }
        }
        return [];
    }

    function guardarEstudiantes(lista) {
        localStorage.setItem('estudiantes', JSON.stringify(lista));
    }
    function renderizarTabla() {
        const estudiantes = obtenerEstudiantes();
        cuerpoTabla.innerHTML = '';
        if (estudiantes.length === 0) {
            mensajeVacio.style.display = 'block';
            contadorSpan.textContent = '0 registros';
            return;
        }
        mensajeVacio.style.display = 'none';
        contadorSpan.textContent = `${estudiantes.length} registros`;

        estudiantes.forEach((est, index) => {
            const fila = document.createElement('tr');
            const celdas = [
                est.cedula || '',
                est.apellidos || '',
                est.nombres || '',
                est.telefono || '',
                est.correo || '',
                est.facultad || '',
                est.nivel || '',
                est.paralelo || ''
            ];
            celdas.forEach(texto => {
                const td = document.createElement('td');
                td.textContent = texto;
                fila.appendChild(td);
            });

            const tdAccion = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.dataset.index = index;
            btnEliminar.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(this.dataset.index);
                eliminarEstudiante(idx);
            });
            tdAccion.appendChild(btnEliminar);
            fila.appendChild(tdAccion);
            cuerpoTabla.appendChild(fila);
        });
    }
    function eliminarEstudiante(index) {
        const estudiantes = obtenerEstudiantes();
        if (index >= 0 && index < estudiantes.length) {
            estudiantes.splice(index, 1);
            guardarEstudiantes(estudiantes);
            renderizarTabla();
        }
    }
    function eliminarTodos() {
        if (confirm('¿Eliminar todos los estudiantes registrados?')) {
            guardarEstudiantes([]);
            renderizarTabla();
        }
    }
    function agregarEstudiante(event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const estudiantes = obtenerEstudiantes();
        const cedulaVal = cedula.value.trim();
        const existe = estudiantes.some(est => est.cedula === cedulaVal);
        if (existe) {
            cedulaError.textContent = '⚠️ Esta cédula ya está registrada.';
            cedula.classList.add('error');
            return;
        } else {
            cedulaError.textContent = '';
            cedula.classList.remove('error');
        }

        const nuevo = {
            cedula: cedulaVal,
            apellidos: apellidos.value.trim(),
            nombres: nombres.value.trim(),
            direccion: direccion.value.trim(),
            telefono: telefono.value.trim(),
            correo: correo.value.trim(),
            facultad: facultad.value,
            nivel: nivel.value,
            paralelo: paralelo.value
        };

        estudiantes.push(nuevo);
        guardarEstudiantes(estudiantes);
        renderizarTabla();
        limpiarCampos();
    }

    function limpiarCampos() {
        form.reset();
        document.querySelectorAll('.campo input, .campo select').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.mensaje-error').forEach(el => {
            el.textContent = '';
        });
        cedula.focus();
    }

    form.addEventListener('submit', agregarEstudiante);

    cedula.addEventListener('blur', validarCedula);
    apellidos.addEventListener('blur', validarApellidos);
    nombres.addEventListener('blur', validarNombres);
    direccion.addEventListener('blur', validarDireccion);
    telefono.addEventListener('blur', validarTelefono);
    correo.addEventListener('blur', validarCorreo);
    facultad.addEventListener('blur', function() { validarSelect(facultad, facultadError); });
    nivel.addEventListener('blur', function() { validarSelect(nivel, nivelError); });
    paralelo.addEventListener('blur', function() { validarSelect(paralelo, paraleloError); });

    document.getElementById('btnLimpiar').addEventListener('click', limpiarCampos);
    document.getElementById('btnEliminarTodos').addEventListener('click', eliminarTodos);


    renderizarTabla();
    limpiarCampos();
})();