
const formulario = document.getElementById("formLogin");
const campoUsuario = document.getElementById("usuario");
const campoContrasenia = document.getElementById("contrasenia");
const mensajeError = document.getElementById("mensajeError");
const botonIngresar = document.getElementById("btnIngresar");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    mensajeError.classList.add("d-none");
    botonIngresar.disabled = true;
    botonIngresar.textContent = "Ingresando...";

    const datosUsuario = {
        username: campoUsuario.value.trim(),
        password: campoContrasenia.value
    };

    try {
        const respuesta = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error("Usuario o contraseña incorrectos.");
        }

        sessionStorage.setItem("token", datos.accessToken);

        window.location.href = "mascotas.html";

    } catch (error) {
        mensajeError.textContent = error.message;
        mensajeError.classList.remove("d-none");
    } finally {
        botonIngresar.disabled = false;
        botonIngresar.textContent = "Ingresar";
    }
});
