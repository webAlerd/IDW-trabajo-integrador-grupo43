const temaGuardado = localStorage.getItem('temaVeterinaria');
document.documentElement.setAttribute('data-bs-theme', temaGuardado === 'dark' ? 'dark' : 'light');

document.addEventListener('DOMContentLoaded', function () {
    const boton = document.getElementById('cambiarTema');

    function actualizarBoton() {
        const modoOscuro = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        boton.textContent = modoOscuro ? 'Modo claro' : 'Modo oscuro';
        boton.setAttribute('aria-pressed', modoOscuro.toString());
    }

    actualizarBoton();

    boton.addEventListener('click', function () {
        const modoOscuro = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const nuevoTema = modoOscuro ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', nuevoTema);
        localStorage.setItem('temaVeterinaria', nuevoTema);
        actualizarBoton();
    });
});
