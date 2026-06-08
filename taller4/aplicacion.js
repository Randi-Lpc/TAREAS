// 1. Referencias del DOM
const formulario = document.getElementById('formulario-tareas');
const tituloInput = document.getElementById('titulo-tarea');
const descripcionInput = document.getElementById('descripcion-tarea');
const listaTareas = document.getElementById('lista-tareas');
const btnJson = document.getElementById('btn-exportar-json');
const btnXml = document.getElementById('btn-exportar-xml');

// 2. Cargar tareas guardadas (o empezar vacío)
let tareas = JSON.parse(localStorage.getItem('tareasGuardadas')) || [];

// 3. Guardar en LocalStorage
function guardar() {
    localStorage.setItem('tareasGuardadas', JSON.stringify(tareas));
}

// 4. Mostrar tareas en pantalla
function mostrarTareas() {
    if (tareas.length === 0) {
        listaTareas.innerHTML = '<li style="text-align:center; color:#94a3b8;">✨ No hay tareas. ¡Agrega una! ✨</li>';
        return;
    }
    
    listaTareas.innerHTML = '';
    tareas.forEach((tarea, indice) => {
        listaTareas.innerHTML += `
            <li class="elemento-tarea">
                <div>
                    <h3>📌 ${tarea.titulo}</h3>
                    <p>${tarea.descripcion}</p>
                    <small>🆔 ${tarea.codigo} | 📅 ${tarea.fecha}</small>
                </div>
                <button class="btn-eliminar" onclick="eliminarTarea(${indice})">🗑️ Eliminar</button>
            </li>
        `;
    });
}

// 5. Eliminar tarea
window.eliminarTarea = function(indice) {
    tareas.splice(indice, 1);
    guardar();
    mostrarTareas();
};

// 6. Agregar nueva tarea
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!tituloInput.value.trim() || !descripcionInput.value.trim()) {
        alert('⚠️ Completa todos los campos');
        return;
    }
    
    const nuevaTarea = {
        codigo: Date.now().toString(),
        titulo: tituloInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
        fecha: new Date().toLocaleDateString()
    };
    
    tareas.push(nuevaTarea);
    guardar();
    mostrarTareas();
    formulario.reset();
});

// 7. Exportar a JSON
btnJson.addEventListener('click', () => {
    if (tareas.length === 0) {
        alert('No hay tareas para exportar');
        return;
    }
    
    const json = JSON.stringify(tareas, null, 2);
    console.log('--- JSON GENERADO ---');
    console.log(json);
    descargar(json, 'tareas.json', 'application/json');
});

// 8. Exportar a XML
btnXml.addEventListener('click', () => {
    if (tareas.length === 0) {
        alert('No hay tareas para exportar');
        return;
    }
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<tareas>\n';
    
    tareas.forEach(t => {
        xml += `  <tarea codigo="${t.codigo}">\n`;
        xml += `    <titulo>${escapeXml(t.titulo)}</titulo>\n`;
        xml += `    <descripcion>${escapeXml(t.descripcion)}</descripcion>\n`;
        xml += `    <fecha>${t.fecha}</fecha>\n`;
        xml += `  </tarea>\n`;
    });
    
    xml += '</tareas>';
    console.log('--- XML GENERADO ---');
    console.log(xml);
    descargar(xml, 'tareas.xml', 'application/xml');
});

// 9. Función para descargar archivos
function descargar(contenido, nombre, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

// 10. Evitar errores en XML (reemplazar caracteres especiales)
function escapeXml(texto) {
    return texto.replace(/[<>&'"]/g, (c) => {
        if (c === '<') return '&lt;';
        if (c === '>') return '&gt;';
        if (c === '&') return '&amp;';
        if (c === "'") return '&apos;';
        if (c === '"') return '&quot;';
        return c;
    });
}

// 11. Cargar tareas al iniciar
mostrarTareas();

// Mensaje en consola
console.log('✅ App lista | Tareas:', tareas.length);