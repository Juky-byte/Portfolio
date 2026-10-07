
document.addEventListener("DOMContentLoaded", () => { // esperamos que el html cargue por completo.

    // ==========================================================================
    // (bonus) MODO CLARO / OSCURO (falta el local storage)
    // ==========================================================================
    const btnTheme = document.getElementById("theme-toggle");

    if (btnTheme) {
        btnTheme.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode")
        });
    }

    // ==========================================================================
    // BOTON VOLVER ARRIBA
    // ==========================================================================
    const btnTop = document.getElementById("btn-top");

    if (btnTop) {
        window.addEventListener("scroll", () => {
            
            // utilizo la clase visible para que la animacion se vea suave 
            if (window.scrollY > 200) {
                btnTop.classList.add("visible");
            } else {
                btnTop.classList.remove("visible");
            }
        });
        btnTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // CONTADOR DE CLICS - EASTER EGG
    // ==========================================================================
    const easterEgg = document.getElementById("easter-egg");
    let clickCont = 0;
    if (easterEgg) {
        easterEgg.addEventListener("click", () => {
            clickCont++;

            if (clickCont === 10) {
                alert("¡Encontraste el Easter Egg del portafolio!");
                clickCont = 0;
            }
        });
    }



    // ==========================================================================
    //  DESPLIEGUE INTERACTIVO DE TARJETAS DE PROYECTOS
    // ==========================================================================
    const tarjetasProyectos = document.querySelectorAll(".card-proyecto");

    tarjetasProyectos.forEach((tarjeta) => {
    tarjeta.addEventListener("click", (e) => {
        // Si hace clic en el enlace a GitHub o Demo, no desplegar
        if (e.target.tagName.toLowerCase() === 'a') return;

        const detalle = tarjeta.querySelector(".proyecto-detalle");
        if (!detalle) return;

        // verificar si esta tarjeta ya estaba abierta
        const estaAbierta = !detalle.classList.contains('oculto');

        // cerrar TODAS las tarjetas primero
        tarjetasProyectos.forEach((otraTarjeta) => {
        const otroDetalle = otraTarjeta.querySelector(".proyecto-detalle");
        if (otroDetalle) {
            otroDetalle.classList.add("oculto");
        }
        otraTarjeta.classList.remove("activa");
        otraTarjeta.setAttribute("aria-expanded", "false");
        });

        // si la tarjeta NO estaba abierta, la abrimos
        if (!estaAbierta) {
        detalle.classList.remove("oculto");
        tarjeta.classList.add("activa");
        tarjeta.setAttribute("aria-expanded", "true");
        }
    });
    });

    // ==========================================================================
    //  CAMBIAR EL AÑO AUTOMATICAMENTE
    // ==========================================================================
    const yearSpan = document.getElementById("current-year");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // cierre del DOMContentLoaded