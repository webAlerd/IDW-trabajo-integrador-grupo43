

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

document.querySelectorAll("a").forEach(function (enlace) {
    const destino = enlace.getAttribute("href");

    if (paginasAdministrativas.includes(destino)) {
        enlace.classList.toggle("d-none", !token);
    }
});

function cerrarSesion() {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
}
  const enlaceLogin = document.getElementById("enlaceLogin");

if (enlaceLogin) {
    enlaceLogin.classList.toggle("d-none", Boolean(token));
}