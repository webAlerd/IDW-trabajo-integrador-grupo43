const CLAVE_VETERINARIOS = "veterinarios";

const formulario = document.getElementById("formVeterinario");
const campoId = document.getElementById("idVeterinario");
const campoMatricula = document.getElementById("matricula");
const campoNombre = document.getElementById("nombre");
const campoEspecializacion = document.getElementById("especializacion");
const campoValorConsulta = document.getElementById("valorConsulta");
const tabla = document.getElementById("tablaVeterinarios");
const total = document.getElementById("totalVeterinarios");
const mensajeVacio = document.getElementById("mensajeSinVeterinarios");
const botonGuardar = document.getElementById("btnGuardar");
const botonCancelar = document.getElementById("btnCancelar");

function obtenerVeterinarios() {
    return JSON.parse(localStorage.getItem(CLAVE_VETERINARIOS)) || [];
}

function guardarVeterinarios(veterinarios) {
    localStorage.setItem(CLAVE_VETERINARIOS, JSON.stringify(veterinarios));
}

function generarId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function formatoMoneda(valor) {
    return Number(valor).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
    });
}

function mostrarVeterinarios() {
    const veterinarios = obtenerVeterinarios();
    tabla.innerHTML = "";

    veterinarios.forEach(function (veterinario) {
        const fila = document.createElement("tr");

        const valores = [
            veterinario.matricula,
            veterinario.nombre,
            veterinario.especializacion,
            formatoMoneda(veterinario.valorConsulta)
        ];

        valores.forEach(function (valor) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "text-center text-nowrap";

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "btn btn-warning btn-sm me-2";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", function () {
            editarVeterinario(veterinario.idVeterinario);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", function () {
            eliminarVeterinario(veterinario.idVeterinario);
        });

        celdaAcciones.append(botonEditar, botonEliminar);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    total.textContent = veterinarios.length;
    mensajeVacio.classList.toggle("d-none", veterinarios.length > 0);
}

function limpiarFormulario() {
    formulario.reset();
    campoId.value = "";
    botonGuardar.innerHTML = '<i class="bi bi-save"></i> Guardar veterinario';
    botonCancelar.classList.add("d-none");
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const veterinarios = obtenerVeterinarios();
    const id = campoId.value;

    const veterinario = {
        idVeterinario: id || generarId(),
        matricula: Number.parseInt(campoMatricula.value, 10),
        nombre: campoNombre.value.trim(),
        especializacion: campoEspecializacion.value.trim(),
        valorConsulta: Number.parseFloat(campoValorConsulta.value)
    };

    if (!Number.isInteger(veterinario.matricula) || veterinario.matricula <= 0 ||
        !veterinario.nombre || !veterinario.especializacion ||
        !Number.isFinite(veterinario.valorConsulta) || veterinario.valorConsulta < 0) {
        alert("Completá todos los campos con valores válidos.");
        return;
    }

    if (id) {
        const indice = veterinarios.findIndex(function (item) {
            return item.idVeterinario === id;
        });

        if (indice !== -1) {
            veterinarios[indice] = veterinario;
        }
    } else {
        veterinarios.push(veterinario);
    }

    guardarVeterinarios(veterinarios);
    mostrarVeterinarios();
    limpiarFormulario();
});

function editarVeterinario(id) {
    const veterinario = obtenerVeterinarios().find(function (item) {
        return item.idVeterinario === id;
    });

    if (!veterinario) {
        return;
    }

    campoId.value = veterinario.idVeterinario;
    campoMatricula.value = veterinario.matricula;
    campoNombre.value = veterinario.nombre;
    campoEspecializacion.value = veterinario.especializacion;
    campoValorConsulta.value = veterinario.valorConsulta;

    botonGuardar.innerHTML = '<i class="bi bi-save"></i> Guardar cambios';
    botonCancelar.classList.remove("d-none");
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function eliminarVeterinario(id) {
    if (!confirm("¿Seguro que querés eliminar este veterinario?")) {
        return;
    }

    const veterinarios = obtenerVeterinarios().filter(function (veterinario) {
        return veterinario.idVeterinario !== id;
    });

    guardarVeterinarios(veterinarios);
    mostrarVeterinarios();

    if (campoId.value === id) {
        limpiarFormulario();
    }
}

botonCancelar.addEventListener("click", limpiarFormulario);

mostrarVeterinarios();