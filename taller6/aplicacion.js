// Estado inicial de la aplicación
let libros = JSON.parse(localStorage.getItem('listaLibros')) || [];
let estaEditando = false;

// Referencias a elementos del DOM
const formulario = document.getElementById('formulario-crud');
const entradaTitulo = document.getElementById('titulo');
const entradaAutor = document.getElementById('autor');
const entradaId = document.getElementById('id-elemento');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');

// READ - Mostrar todos los libros
function renderizarLibros() {
    cuerpoTabla.innerHTML = '';

    if (libros.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="3" style="text-align:center;">No hay libros registrados.</td></tr>`;
        return;
    }

    libros.forEach(libro => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>
                <button class="btn-editar" onclick="prepararEdicion('${libro.id}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarLibro('${libro.id}')">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    localStorage.setItem('listaLibros', JSON.stringify(libros));
}

// CREATE y UPDATE
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const valorTitulo = entradaTitulo.value.trim();
    const valorAutor = entradaAutor.value.trim();
    const idActual = entradaId.value;

    if (!valorTitulo || !valorAutor) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if (estaEditando) {
        // UPDATE - Actualizar libro existente
        libros = libros.map(libro =>
            libro.id === idActual ? { ...libro, titulo: valorTitulo, autor: valorAutor } : libro
        );
        estaEditando = false;
        botonGuardar.textContent = 'Guardar Libro';
        botonCancelar.classList.add('oculto');
    } else {
        // CREATE - Crear nuevo libro
        const nuevoLibro = {
            id: crypto.randomUUID(),
            titulo: valorTitulo,
            autor: valorAutor
        };
        libros.push(nuevoLibro);
    }

    reiniciarFormulario();
    renderizarLibros();
});

// UPDATE - Preparar edición
window.prepararEdicion = function(id) {
    const libroEncontrado = libros.find(libro => libro.id === id);
    if (!libroEncontrado) return;

    entradaTitulo.value = libroEncontrado.titulo;
    entradaAutor.value = libroEncontrado.autor;
    entradaId.value = libroEncontrado.id;

    estaEditando = true;
    botonGuardar.textContent = 'Actualizar Libro';
    botonCancelar.classList.remove('oculto');
};

// DELETE - Eliminar libro
window.eliminarLibro = function(id) {
    if (confirm('¿Está seguro de que desea eliminar este libro?')) {
        libros = libros.filter(libro => libro.id !== id);

        if (estaEditando && entradaId.value === id) {
            reiniciarFormulario();
        }

        renderizarLibros();
    }
};

// Cancelar edición
botonCancelar.addEventListener('click', reiniciarFormulario);

// Reiniciar formulario
function reiniciarFormulario() {
    formulario.reset();
    entradaId.value = '';
    estaEditando = false;
    botonGuardar.textContent = 'Guardar Libro';
    botonCancelar.classList.add('oculto');
}

// Inicializar aplicación
renderizarLibros();