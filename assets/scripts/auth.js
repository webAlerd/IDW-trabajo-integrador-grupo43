const paginasAdministrativas = [
    "mascotas.html",
    "veterinarios.html",
    "turnos.html",
    "historia-clinica.html"
];

const paginaActual = window.location.pathname.split("/").pop();
const token = sessionStorage.getItem("token");

if (paginasAdministrativas.includes(paginaActual) && !token) {
    window.location.replace("login.html");
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".navbar-nav .nav-link").forEach(function (enlace) {
        const destino = enlace.getAttribute("href");

        if (paginasAdministrativas.includes(destino)) {
            const itemLista = enlace.parentElement;
            if (itemLista) {
                itemLista.classList.toggle("d-none", !token);
            }
        }
    });

    const enlaceLogin = document.getElementById("enlaceLogin");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    if (enlaceLogin) {
        enlaceLogin.classList.toggle("d-none", Boolean(token));
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.classList.toggle("d-none", !token);
    }
});