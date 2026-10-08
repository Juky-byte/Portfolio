
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

    // ==========================================================================
    // CONSUMO DE SERVICIOS WEB (API REST)
    // ==========================================================================
    const btnApod = document.getElementById("btn-cargar-apod");
    const apodContenido = document.getElementById("apod-contenido");
    const apodError = document.getElementById("apod-error");

    if (btnApod) {
        btnApod.addEventListener("click", obtenerDatoNasa);
    }

    function obtenerDatoNasa() {
        apodError.textContent = "";
        apodContenido.innerHTML = "<p class='cargando'> Cargando la imagen del dia desde la NASA...</p> ";

        // timeout de 5 segundos.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 5000);
        
        // peticion HTTP
        fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", {signal: controller.signal})
            .then((respuesta) => {
                // responde a tiempo
                clearTimeout(timeoutId);
                if (!respuesta.ok) {
                    throw new Error("Error en el sevidor de la NASA:" + respuesta.status)
                }
                // convertimos el json
                return respuesta.json();
            })
            .then((datos)=>{
                let recursoMedia;
                
                // verificamos si es una imagen o un video.
                if (datos.media_type === 'image') {
                recursoMedia = `<img src="${datos.url}" alt="${datos.title}" class="nasa-img">`;
                } else {
                recursoMedia = `<iframe src="${datos.url}" frameborder="0" allowfullscreen class="nasa-video"></iframe>`;
                }

                // inyecta el contenido en el HTML
                apodContenido.innerHTML = `
                    <article class="card-nasa">
                        <h3>${datos.title}</h3>
                        <p class="nasa-fecha"><strong>Fecha:</strong> ${datos.date}</p>
                        <div class="nasa-media">
                            ${recursoMedia}
                        </div>
                        <p class="nasa-explicacion">${datos.explanation}</p>
                    </article>
                `;
            })
            .catch((error) => {
                apodContenido.innerHTML = ""
                if (error.name === "AbortError") {
                apodError.textContent = "La conexion con el servidor de la NASA tardo demasiado tiempo";
                } else {
                    apodContenido.textContent = "No se pudo obtener la foto/video del dia";
                }
            });
    }
    
}); // cierre del DOMContentLoaded