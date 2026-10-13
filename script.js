
document.addEventListener("DOMContentLoaded", () => { // espera que el html cargue por completo.

    // ==========================================================================
    // (bonus) MODO CLARO / OSCURO 
    // ==========================================================================
    const btnTheme = document.getElementById("theme-toggle");

    if (btnTheme) {
        btnTheme.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode")

            // cambiar el icono segun el modo
            if (document.body.classList.contains("dark-mode")) {
                btnTheme.textContent = "☀️";
            } else {
                btnTheme.textContent = "🌙";
            }
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
            console.log(clickCont);
            if (clickCont === 10) {
                alert("¡Encontraste el Easter Egg del portafolio!");
                clickCont = 0;
                easterEgg.src = "img/meme.webp";
            }
        });
    }

    // ==========================================================================
    //  DESPLIEGUE INTERACTIVO DE TARJETAS DE PROYECTOS
    // ==========================================================================
    const tarjetasProyectos = document.querySelectorAll(".card-proyecto");

    tarjetasProyectos.forEach((tarjeta) => {
    tarjeta.addEventListener("click", (e) => {
        // Si hace clic en el enlace a GitHub, no desplegar
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
    //  BOTON VER MAS REFERENCIAS
    // ==========================================================================
    const btnVerMas = document.getElementById("btn-ver-mas");
    const referenciasExtra = document.getElementById("referencias-extra");

    if (btnVerMas && referenciasExtra) {
        btnVerMas.addEventListener("click", () => {
            referenciasExtra.classList.toggle("mostrar");

            if (referenciasExtra.classList.contains("mostrar")) {
                btnVerMas.textContent = "Ver menos";
            } else {
                btnVerMas.textContent = "Ver más";
            }
        });
    }


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
    const btnDato = document.getElementById("btn-cargar-dato");
    const apiContenido = document.getElementById("api-contenido");
    const apiError = document.getElementById("api-error");

    if (btnDato) {
        btnDato.addEventListener("click", obtenerDatoGato);
    }

    function obtenerDatoGato() {
        apiError.textContent = "";
        apiContenido.innerHTML = "<p class='cargando'>Buscando un gatito...</p>";

        // desabilitar el boton
        if (btnDato) btnDato.disabled = true;

        // timeout de 5 segundos.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 5000);
        
        // peticion HTTP
        fetch("https://api.thecatapi.com/v1/images/search?has_breeds=1", {signal: controller.signal})
            .then((respuesta) => {
                // responde a tiempo
                clearTimeout(timeoutId);
                if (!respuesta.ok) {
                    throw new Error("Error en el sevidor The Cat API:" + respuesta.status)
                }
                // convertimos el json
                console.log(respuesta)
                return respuesta.json();
            })
            .then((datos) => {
                // The Cat API devuelve un array con un objeto adentro
                const gato = datos[0];
                const imagenUrl = gato.url;
                
                // Extraemos info de la raza si está disponible
                let nombreRaza = "Gatito tierno";
                let descripcionRaza = "Una adorable mascota lista para alegrar tu día.";
                
                if (gato.breeds && gato.breeds.length > 0) {
                    nombreRaza = gato.breeds[0].name;
                    descripcionRaza = gato.breeds[0].description;
                }

                // inyecta el contenido en el HTML
                apiContenido.innerHTML = `
                    <article class="card-cat">
                        <h3>${nombreRaza}</h3>
                        <div class="cat-media">
                            <img src="${imagenUrl}" alt="${nombreRaza}" class="cat-img">
                        </div>
                        <p class="cat-explicacion">${descripcionRaza}</p>
                    </article>
                `;
            })
            .catch((error) => {
                console.log(error);
                apiContenido.innerHTML = ""
                if (error.name === "AbortError") {
                    apiError.textContent = "La conexion con el servidor tardo demasiado tiempo";
                } else {
                    apiContenido.textContent = "No se pudo obtener el gato";
                }
            })
            .finally(() => {
                // reinicia el timeout
                clearTimeout(timeoutId);
                // activa el boton nuevamente
                if (btnDato) btnDato.disabled = false;
            });
    }

    // ==========================================================================
    // FORMULARIO DE CONTACTO.
    // ==========================================================================
    const formContacto = document.getElementById("form-contacto");
    const formEstado = document.getElementById("form-estado");
    const btnEnviar = document.getElementById("btn-enviar");

    if (formContacto) {
        formContacto.addEventListener("submit", function(e) {
            e.preventDefault() // evita que se recargue la pagina por error

            // feedback visual
            formEstado.textContent = "Enviando mensaje...";
            formEstado.className = "form-estado-mensaje";
            btnEnviar.disabled = true;

            const datosFormulario = new FormData(formContacto);

            fetch("https://formspree.io/f/xgaoalqy", {
                method: "POST",
                body: datosFormulario,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then((respuesta) => {
                if (respuesta.ok) {
                    formEstado.textContent = "¡Mensaje enviado con exito!";
                    formEstado.classList.add("exito");
                    formContacto.reset(); // limpia los campos
                } else {
                    throw new Error("Respuesta invalida del servidor");
                }
            })
            .catch((error) => {
                console.log(error);
                formEstado.textContent ="Hubo un problema al enviar el mensaje. Intentalo nuevamente."
                formEstado.classList.add("error")
            })
            .finally(() => {
                btnEnviar.disabled = false; // reactivar el boton
            });
        });
    }
}); // cierre del DOMContentLoaded