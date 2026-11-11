
const CLAVE_HISTORIAS = "historiasClinicas";
const CLAVE_MASCOTAS = "mascotas";
const CLAVE_VETERINARIOS = "veterinarios";

const formulario = document.getElementById("formHistoriaClinica");
const campoMascota = document.getElementById("mascota");
const campoVeterinario = document.getElementById("veterinario");
const campoFecha = document.getElementById("fecha");
const campoDiagnostico = document.getElementById("diagnostico");
const campoTratamiento = document.getElementById("tratamiento");
const campoObservaciones = document.getElementById("observaciones");
const campoBuscarMascota = document.getElementById("buscarMascota");
const tabla = document.getElementById("tablaHistorias");
const mensajeVacio = document.getElementById("mensajeSinHistorias");
const detalle = document.getElementById("detalleHistoria");

function obtenerHistorias() {
    return JSON.parse(localStorage.getItem(CLAVE_HISTORIAS)) || [];
}

function guardarHistorias(historias) {
    localStorage.setItem(CLAVE_HISTORIAS, JSON.stringify(historias));
}

function obtenerMascotas() {
    return JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];
}

function obtenerVeterinarios() {
    return JSON.parse(localStorage.getItem(CLAVE_VETERINARIOS)) || [];
}

function generarId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function cargarMascotas() {
    const mascotas = obtenerMascotas();

    campoMascota.innerHTML = '<option value="">Seleccionar mascota</option>';
    campoBuscarMascota.innerHTML = '<option value="">Todas las mascotas</option>';

    mascotas.forEach(function (mascota) {
        const opcion = document.createElement("option");
        opcion.value = mascota.idMascota;
        opcion.textContent = mascota.nombreMascota;
        campoMascota.appendChild(opcion);

        const opcionBusqueda = document.createElement("option");
        opcionBusqueda.value = mascota.idMascota;
        opcionBusqueda.textContent = mascota.nombreMascota;
        campoBuscarMascota.appendChild(opcionBusqueda);
    });
}

function cargarVeterinarios() {
    const veterinarios = obtenerVeterinarios();

    campoVeterinario.innerHTML = '<option value="">Seleccionar veterinario</option>';

    veterinarios.forEach(function (veterinario) {
        const opcion = document.createElement("option");
        opcion.value = veterinario.idVeterinario;
        opcion.textContent = veterinario.nombre;
        campoVeterinario.appendChild(opcion);
    });
}

function mostrarHistorias() {
    const historias = obtenerHistorias();
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();
    const mascotaSeleccionada = campoBuscarMascota.value;

    tabla.innerHTML = "";
    detalle.innerHTML = "";

    const historiasFiltradas = mascotaSeleccionada
        ? historias.filter(function (historia) {
            return historia.idMascota === mascotaSeleccionada;
        })
        : historias;

    historiasFiltradas.forEach(function (historia) {
        const mascota = mascotas.find(function (item) {
            return item.idMascota === historia.idMascota;
        });

        const veterinario = veterinarios.find(function (item) {
            return item.idVeterinario === historia.idVeterinario;
        });

        const fila = document.createElement("tr");

        const valores = [
            mascota ? mascota.nombreMascota : "Mascota no disponible",
            veterinario ? veterinario.nombre : "Veterinario no disponible",
            historia.fecha,
            historia.diagnostico
        ];

        valores.forEach(function (valor) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "text-nowrap";

        const botonVer = document.createElement("button");
        botonVer.type = "button";
        botonVer.className = "btn btn-primary btn-sm";
        botonVer.textContent = "Ver detalle";

        botonVer.addEventListener("click", function () {
            mostrarDetalle(historia);
        });

        celdaAcciones.appendChild(botonVer);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    mensajeVacio.classList.toggle("d-none", historiasFiltradas.length > 0);
}

function mostrarDetalle(historia) {
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    const mascota = mascotas.find(function (item) {
        return item.idMascota === historia.idMascota;
    });

    const veterinario = veterinarios.find(function (item) {
        return item.idVeterinario === historia.idVeterinario;
    });

    detalle.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Detalle de la historia clínica";

    const datos = [
        "Mascota: " + (mascota ? mascota.nombreMascota : "No disponible"),
        "Veterinario: " + (veterinario ? veterinario.nombre : "No disponible"),
        "Fecha: " + historia.fecha,
        "Diagnóstico: " + historia.diagnostico,
        "Tratamiento: " + historia.tratamiento,
        "Observaciones: " + (historia.observaciones || "Sin observaciones")
    ];

    detalle.appendChild(titulo);

    datos.forEach(function (dato) {
        const parrafo = document.createElement("p");
        parrafo.textContent = dato;
        detalle.appendChild(parrafo);
    });
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    const mascotaExiste = mascotas.some(function (mascota) {
        return mascota.idMascota === campoMascota.value;
    });

    const veterinarioExiste = veterinarios.some(function (veterinario) {
        return veterinario.idVeterinario === campoVeterinario.value;
    });

    if (!mascotaExiste || !veterinarioExiste) {
        alert("Seleccioná una mascota y un veterinario registrados.");
        return;
    }

    const historia = {
        idHistoria: generarId(),
        idMascota: campoMascota.value,
        idVeterinario: campoVeterinario.value,
        fecha: campoFecha.value,
        diagnostico: campoDiagnostico.value.trim(),
        tratamiento: campoTratamiento.value.trim(),
        observaciones: campoObservaciones.value.trim()
    };

    if (!historia.fecha || !historia.diagnostico || !historia.tratamiento) {
        alert("Completá los campos obligatorios.");
        return;
    }

    const historias = obtenerHistorias();
    historias.push(historia);

    guardarHistorias(historias);

    formulario.reset();
    mostrarHistorias();
});

campoBuscarMascota.addEventListener("change", mostrarHistorias);

cargarMascotas();
cargarVeterinarios();
mostrarHistorias();
