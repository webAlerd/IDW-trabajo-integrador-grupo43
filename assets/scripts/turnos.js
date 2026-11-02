
const CLAVE_TURNOS = "turnos";
const CLAVE_MASCOTAS = "mascotas";
const CLAVE_VETERINARIOS = "veterinarios";

const formulario = document.getElementById("formTurno");
const campoMascota = document.getElementById("mascota");
const campoVeterinario = document.getElementById("veterinario");
const campoFecha = document.getElementById("fecha");
const campoHora = document.getElementById("hora");
const campoMotivo = document.getElementById("motivo");
const tabla = document.getElementById("tablaTurnos");
const total = document.getElementById("totalTurnos");
const mensajeVacio = document.getElementById("mensajeSinTurnos");

function obtenerTurnos() {
    return JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];
}

function guardarTurnos(turnos) {
    localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
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

    mascotas.forEach(function (mascota) {
        const opcion = document.createElement("option");
        opcion.value = mascota.idMascota;
        opcion.textContent = mascota.nombreMascota;
        campoMascota.appendChild(opcion);
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

function mostrarTurnos() {
    const turnos = obtenerTurnos();
    const mascotas = obtenerMascotas();
    const veterinarios = obtenerVeterinarios();

    tabla.innerHTML = "";

    turnos.forEach(function (turno) {
        const mascota = mascotas.find(function (item) {
            return item.idMascota === turno.idMascota;
        });

        const veterinario = veterinarios.find(function (item) {
            return item.idVeterinario === turno.idVeterinario;
        });

        const fila = document.createElement("tr");

        const valores = [
            mascota ? mascota.nombreMascota : "Mascota no disponible",
            veterinario ? veterinario.nombre : "Veterinario no disponible",
            turno.fecha,
            turno.hora,
            turno.motivo
        ];

        valores.forEach(function (valor) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");
        celdaAcciones.className = "text-center text-nowrap";

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function () {
            eliminarTurno(turno.idTurno);
        });

        celdaAcciones.appendChild(botonEliminar);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    total.textContent = turnos.length;
    mensajeVacio.classList.toggle("d-none", turnos.length > 0);
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

    const turno = {
        idTurno: generarId(),
        idMascota: campoMascota.value,
        idVeterinario: campoVeterinario.value,
        fecha: campoFecha.value,
        hora: campoHora.value,
        motivo: campoMotivo.value.trim()
    };

    if (!turno.fecha || !turno.hora || !turno.motivo) {
        alert("Completá todos los campos.");
        return;
    }

    const turnos = obtenerTurnos();
    turnos.push(turno);

    guardarTurnos(turnos);
    mostrarTurnos();

    formulario.reset();
});

function eliminarTurno(id) {
    if (!confirm("¿Seguro que querés eliminar este turno?")) {
        return;
    }

    const turnos = obtenerTurnos().filter(function (turno) {
        return turno.idTurno !== id;
    });

    guardarTurnos(turnos);
    mostrarTurnos();
}

cargarMascotas();
cargarVeterinarios();
mostrarTurnos();
