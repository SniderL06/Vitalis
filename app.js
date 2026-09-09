// Interacciones de la Interfaz de Vitalis
document.addEventListener("DOMContentLoaded", () => {
    // 1. Efecto Scroll en la Barra de Navegación
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Menú de Navegación Móvil (Hamburguesa)
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // 3. Animaciones de entrada simples al hacer scroll (Reveal effects)
    const revealElements = document.querySelectorAll(".pillar-card, .credential-item, .profile-card, .gallery-card, .main-chat-card, .social-connect-card");
    
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4.5;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    // Inicializar estilos de animación
    revealElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";
        element.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    window.addEventListener("scroll", revealOnScroll);
    // Ejecutar una vez al cargar por si hay elementos ya visibles
    setTimeout(revealOnScroll, 100);

    // 4. Filtros de la Galería Multimedia
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || filterValue === category) {
                    item.classList.remove("hidden");
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 30);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        item.classList.add("hidden");
                    }, 250);
                }
            });
        });
    });

    // 5. Visor Lightbox para Fotos y Video
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxMedia = document.getElementById("lightbox-media-wrapper");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxOverlay = document.querySelector(".lightbox-overlay");

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Pausar video si está en reproducción dentro del modal
        const video = lightboxMedia.querySelector("video");
        if (video) {
            video.pause();
        }
        setTimeout(() => {
            lightboxMedia.innerHTML = "";
            lightboxTitle.textContent = "";
            lightboxDesc.textContent = "";
        }, 250);
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });

    // Abrir Lightbox al hacer clic en tarjetas de la galería
    const galleryCards = document.querySelectorAll(".gallery-card");
    galleryCards.forEach(card => {
        card.addEventListener("click", () => {
            const isVideo = card.classList.contains("video-card");
            lightboxMedia.innerHTML = "";

            if (isVideo) {
                const videoSrc = card.getAttribute("data-video-src");
                const title = card.getAttribute("data-title") || "Video";
                const desc = card.getAttribute("data-desc") || "";

                const videoEl = document.createElement("video");
                videoEl.src = videoSrc;
                videoEl.controls = true;
                videoEl.autoplay = true;
                videoEl.playsInline = true;
                lightboxMedia.appendChild(videoEl);

                lightboxTitle.textContent = title;
                lightboxDesc.textContent = desc;
            } else {
                const fullSrc = card.getAttribute("data-full-src");
                const title = card.getAttribute("data-title") || "";
                const desc = card.getAttribute("data-desc") || "";

                const imgEl = document.createElement("img");
                imgEl.src = fullSrc;
                imgEl.alt = title;
                lightboxMedia.appendChild(imgEl);

                lightboxTitle.textContent = title;
                lightboxDesc.textContent = desc;
            }

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    });

    // Vista previa suave de video al pasar el cursor
    const videoPreviews = document.querySelectorAll(".video-card");
    videoPreviews.forEach(card => {
        const preview = card.querySelector(".gallery-video-preview");
        if (preview) {
            card.addEventListener("mouseenter", () => {
                preview.play().catch(() => {});
            });
            card.addEventListener("mouseleave", () => {
                preview.pause();
                preview.currentTime = 0.5;
            });
        }
    });

    // 6. Formulario de Contacto con EmailJS
    // ─────────────────────────────────────────────────────────────
    // CONFIGURA ESTAS 3 CLAVES CON TUS DATOS DE EMAILJS:
    const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";   // → Pestaña "Account" en EmailJS
    const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";   // → Pestaña "Email Services"
    const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";  // → Pestaña "Email Templates"
    // ─────────────────────────────────────────────────────────────

    // Inicializar EmailJS con tu Public Key
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const contactForm = document.getElementById("contact-form");
    const submitBtn   = document.getElementById("submit-btn");

    // Notificación de éxito (se inserta una sola vez)
    const successMsg = document.createElement("p");
    successMsg.className = "form-success";
    successMsg.innerHTML = `<i class="fas fa-check-circle"></i>&nbsp; ¡Mensaje enviado! El Lic. Randall lo recibirá en breve.`;
    contactForm.appendChild(successMsg);

    // Notificación de error
    const errorMsg = document.createElement("p");
    errorMsg.className = "form-success form-error";
    errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i>&nbsp; Hubo un error al enviar. Intenta de nuevo.`;
    contactForm.appendChild(errorMsg);

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Estado de carga en el botón
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>&nbsp; Enviando...`;

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
                .then(() => {
                    // Éxito
                    successMsg.classList.add("visible");
                    errorMsg.classList.remove("visible");
                    contactForm.reset();
                    setTimeout(() => successMsg.classList.remove("visible"), 6000);
                })
                .catch((err) => {
                    // Error
                    console.error("EmailJS error:", err);
                    errorMsg.classList.add("visible");
                    successMsg.classList.remove("visible");
                    setTimeout(() => errorMsg.classList.remove("visible"), 6000);
                })
                .finally(() => {
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `Enviar Mensaje <i class="fas fa-paper-plane"></i>`;
                });
        });
    }
});
