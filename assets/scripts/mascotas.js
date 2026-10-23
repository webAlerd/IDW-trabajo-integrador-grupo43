const CLAVE_MASCOTAS = "mascotas";

const formulario = document.getElementById("formMascota");
const campoId = document.getElementById("idMascota");
const campoNombre = document.getElementById("nombreMascota");
const campoDuenio = document.getElementById("nombreDuenio");
const campoColor = document.getElementById("color");
const campoEdad = document.getElementById("edad");
const campoPeso = document.getElementById("peso");
const tabla = document.getElementById("tablaMascotas");
const total = document.getElementById("totalMascotas");
const mensajeVacio = document.getElementById("mensajeSinMascotas");
const botonGuardar = document.getElementById("btnGuardar");
const botonCancelar = document.getElementById("btnCancelar");

function obtenerMascotas() {
    return JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];
}

function guardarMascotas(mascotas) {
    localStorage.setItem(CLAVE_MASCOTAS, JSON.stringify(mascotas));
}

function generarId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function mostrarMascotas() {
    const mascotas = obtenerMascotas();
    tabla.innerHTML = "";

    mascotas.forEach(function (mascota) {
        const fila = document.createElement("tr");

        const valores = [
            mascota.nombreMascota,
            mascota.nombreDuenio,
            mascota.color,
            mascota.edad,
            Number(mascota.peso).toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) + " kg"
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
            editarMascota(mascota.idMascota);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", function () {
            eliminarMascota(mascota.idMascota);
        });

        celdaAcciones.append(botonEditar, botonEliminar);
        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });

    total.textContent = mascotas.length;
    mensajeVacio.classList.toggle("d-none", mascotas.length > 0);
}

function limpiarFormulario() {
    formulario.reset();
    campoId.value = "";
    botonGuardar.innerHTML = '<i class="bi bi-save"></i> Guardar mascota';
    botonCancelar.classList.add("d-none");
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const mascotas = obtenerMascotas();
    const id = campoId.value;

    const mascota = {
        idMascota: id || generarId(),
        nombreMascota: campoNombre.value.trim(),
        nombreDuenio: campoDuenio.value.trim(),
        color: campoColor.value.trim(),
        edad: Number.parseInt(campoEdad.value, 10),
        peso: Number.parseFloat(campoPeso.value)
    };

    if (!mascota.nombreMascota || !mascota.nombreDuenio || !mascota.color ||
        !Number.isInteger(mascota.edad) || mascota.edad < 0 ||
        !Number.isFinite(mascota.peso) || mascota.peso <= 0) {
        alert("Completá todos los campos con valores válidos. El peso debe ser mayor que cero.");
        return;
    }

    if (id) {
        const indice = mascotas.findIndex(function (item) {
            return item.idMascota === id;
        });

        if (indice !== -1) {
            mascotas[indice] = mascota;
        }
    } else {
        mascotas.push(mascota);
    }

    guardarMascotas(mascotas);
    mostrarMascotas();
    limpiarFormulario();
});

function editarMascota(id) {
    const mascota = obtenerMascotas().find(function (item) {
        return item.idMascota === id;
    });

    if (!mascota) {
        return;
    }

    campoId.value = mascota.idMascota;
    campoNombre.value = mascota.nombreMascota;
    campoDuenio.value = mascota.nombreDuenio;
    campoColor.value = mascota.color;
    campoEdad.value = mascota.edad;
    campoPeso.value = mascota.peso;

    botonGuardar.innerHTML = '<i class="bi bi-save"></i> Guardar cambios';
    botonCancelar.classList.remove("d-none");
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function eliminarMascota(id) {
    if (!confirm("¿Seguro que querés eliminar esta mascota?")) {
        return;
    }

    const mascotas = obtenerMascotas().filter(function (mascota) {
        return mascota.idMascota !== id;
    });

    guardarMascotas(mascotas);
    mostrarMascotas();

    if (campoId.value === id) {
        limpiarFormulario();
    }
}

botonCancelar.addEventListener("click", limpiarFormulario);

mostrarMascotas();