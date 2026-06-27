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
    const revealElements = document.querySelectorAll(".pillar-card, .credential-item, .profile-card, .main-chat-card, .social-connect-card");
    
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

    // 4. Formulario de Contacto con EmailJS
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
