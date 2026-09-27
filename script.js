
// boton de volver al inicio.
const btnTop = document.getElementById("btnTop");

// esconder con scroll.
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) { //scroll 200px
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
});

// animacion de volver arriba.
btnTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0, behavior: "smooth"
    });
});