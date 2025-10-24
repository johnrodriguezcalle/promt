/**
 * PORTAFOLIO PROFESIONAL - JOHN RODRIGUEZ
 * JavaScript optimizado para performance y UX
 * Diseño Web Senior - Mejores Prácticas
 */

// ========================================
// CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// ========================================

// Configuración de performance
const CONFIG = {
    scrollThrottle: 100, // ms para throttling de scroll
    animationDuration: 300, // ms para animaciones
    debounceDelay: 250 // ms para debounce de resize
};

// Cache de elementos DOM para mejor performance
const DOM = {
    navbar: null,
    navMenu: null,
    hamburger: null,
    navLinks: null,
    contactForm: null,
    modal: null,
    modalOverlay: null,
    modalClose: null,
    modalContent: null,
    projectCards: null
};

// Estado de la aplicación
const state = {
    isMenuOpen: false,
    isModalOpen: false,
    currentProject: null,
    scrollPosition: 0
};

// ========================================
// INICIALIZACIÓN PRINCIPAL
// ========================================

/**
 * Inicializa la aplicación cuando el DOM está listo
 * Patrón de inicialización modular para mejor mantenimiento
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portafolio de John Rodríguez inicializado');
    
    // Inicializar módulos en orden de dependencia
    initializeDOM();
    initializeNavigation();
    initializeSmoothScroll();
    initializeForm();
    initializeModals();
    initializeScrollAnimations();
    initializePerformanceOptimizations();
    
    console.log('✅ Todas las funcionalidades cargadas correctamente');
});

// ========================================
// INICIALIZACIÓN DE ELEMENTOS DOM
// ========================================

/**
 * Cachea elementos DOM para mejor performance
 * Evita múltiples queries al DOM durante la ejecución
 */
function initializeDOM() {
    DOM.navbar = document.getElementById('navbar');
    DOM.navMenu = document.getElementById('nav-menu');
    DOM.hamburger = document.getElementById('hamburger');
    DOM.navLinks = document.querySelectorAll('.nav-link');
    DOM.contactForm = document.getElementById('contactForm');
    DOM.modal = document.getElementById('case-study-modal');
    DOM.modalOverlay = document.getElementById('modal-overlay');
    DOM.modalClose = document.getElementById('modal-close');
    DOM.modalContent = document.getElementById('case-study-content');
    DOM.projectCards = document.querySelectorAll('.project-card');
    
    console.log('📋 Elementos DOM cacheados:', Object.keys(DOM).length);
}

// ========================================
// SISTEMA DE NAVEGACIÓN
// ========================================

/**
 * Inicializa el sistema de navegación móvil y desktop
 * Incluye menú hamburguesa y navegación activa
 */
function initializeNavigation() {
    // Menú hamburguesa para móviles
    if (DOM.hamburger) {
        DOM.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer clic en enlaces
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !DOM.hamburger.contains(e.target) && 
            !DOM.navMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Navegación activa basada en scroll
    window.addEventListener('scroll', throttle(updateActiveNavigation, CONFIG.scrollThrottle));
    
    console.log('🧭 Sistema de navegación inicializado');
}

/**
 * Alterna el menú móvil y actualiza el estado
 * Incluye animación del ícono hamburguesa
 */
function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    
    // Toggle clases CSS
    DOM.navMenu.classList.toggle('active');
    DOM.hamburger.classList.toggle('active');
    
    // Animar ícono hamburguesa
    const bars = DOM.hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (state.isMenuOpen) {
            // Transformar a X
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            // Volver a hamburguesa
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

/**
 * Actualiza la navegación activa basada en la posición de scroll
 * Mejora la UX mostrando la sección actual
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Actualizar enlaces activos
    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// NAVEGACIÓN SUAVE (SMOOTH SCROLL)
// ========================================

/**
 * Inicializa el sistema de navegación suave
 * Optimizado para performance y accesibilidad
 */
function initializeSmoothScroll() {
    // Aplicar smooth scroll a todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    console.log('🎯 Navegación suave inicializada');
}

/**
 * Maneja el scroll suave a secciones
 * Incluye validación y optimización de performance
 */
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    // Calcular posición con offset para la navegación fija
    const offsetTop = targetElement.offsetTop - 80;
    
    // Scroll suave con fallback para navegadores que no lo soportan
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    } else {
        // Fallback para navegadores antiguos
        smoothScrollTo(offsetTop, 800);
    }
}

/**
 * Fallback de scroll suave para navegadores antiguos
 * Implementación manual con requestAnimationFrame
 */
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

/**
 * Función de easing para animación suave
 * Easing cuadrático para movimiento natural
 */
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

// ========================================
// SISTEMA DE FORMULARIO
// ========================================

/**
 * Inicializa el sistema de formulario de contacto
 * Incluye validación, envío y feedback al usuario
 */
function initializeForm() {
    if (!DOM.contactForm) return;
    
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real para mejor UX
    const inputs = DOM.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    console.log('📝 Sistema de formulario inicializado');
}

/**
 * Maneja el envío del formulario de contacto
 * Incluye validación completa y feedback profesional
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(DOM.contactForm);
    const data = {
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim(),
        mensaje: formData.get('mensaje').trim()
    };
    
    // Validar formulario
    const errors = validateForm(data);
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return;
    }
    
    // Simular envío exitoso
    simulateFormSubmission(data);
}

/**
 * Valida los datos del formulario
 * Validación robusta con mensajes específicos
 */
function validateForm(data) {
    const errors = [];
    
    // Validar nombre (mínimo 2 caracteres, solo letras y espacios)
    if (!data.nombre || data.nombre.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
        errors.push('El nombre solo puede contener letras y espacios');
    }
    
    // Validar email (formato estándar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    // Validar mensaje (mínimo 10 caracteres)
    if (!data.mensaje || data.mensaje.length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

/**
 * Valida un campo individual en tiempo real
 * Mejora la UX con feedback inmediato
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.name) {
        case 'nombre':
            if (!value || value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Solo letras y espacios permitidos';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Formato de email inválido';
            }
            break;
            
        case 'mensaje':
            if (!value || value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    // Mostrar/ocultar error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
}

/**
 * Muestra error en un campo específico
 * Estilo consistente con el diseño
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ff6b6b';
}

/**
 * Limpia el error de un campo
 * Restaura el estado visual normal
 */
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

/**
 * Muestra errores del formulario
 * Feedback claro y accionable para el usuario
 */
function showFormErrors(errors) {
    // Limpiar errores anteriores
    const existingErrors = DOM.contactForm.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Mostrar nuevos errores
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.backgroundColor = '#fee';
    errorContainer.style.border = '1px solid #ff6b6b';
    errorContainer.style.borderRadius = '8px';
    errorContainer.style.padding = '1rem';
    errorContainer.style.marginBottom = '1rem';
    
    const errorList = document.createElement('ul');
    errorList.style.margin = '0';
    errorList.style.paddingLeft = '1rem';
    
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        li.style.color = '#ff6b6b';
        li.style.marginBottom = '0.25rem';
        errorList.appendChild(li);
    });
    
    errorContainer.appendChild(errorList);
    DOM.contactForm.insertBefore(errorContainer, DOM.contactForm.firstChild);
}

/**
 * Simula el envío del formulario
 * Incluye feedback profesional y logging
 */
function simulateFormSubmission(data) {
    // Mostrar estado de carga
    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        // Log del envío (requerimiento específico)
        console.log('✅ Formulario de contacto enviado:', data.nombre, '-', data.email);
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Limpiar formulario
        DOM.contactForm.reset();
        
        // Restaurar botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Limpiar errores
        const existingErrors = DOM.contactForm.querySelectorAll('.form-error, .field-error');
        existingErrors.forEach(error => error.remove());
        
    }, 1500);
}

/**
 * Muestra mensaje de éxito del formulario
 * Feedback positivo para mejorar la conversión
 */
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.backgroundColor = '#d4edda';
    successDiv.style.border = '1px solid #c3e6cb';
    successDiv.style.borderRadius = '8px';
    successDiv.style.padding = '1rem';
    successDiv.style.marginBottom = '1rem';
    successDiv.style.color = '#155724';
    successDiv.style.textAlign = 'center';
    successDiv.innerHTML = `
        <strong>¡Mensaje enviado correctamente!</strong><br>
        Te contactaré en menos de 24 horas.
    `;
    
    DOM.contactForm.insertBefore(successDiv, DOM.contactForm.firstChild);
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ========================================
// SISTEMA DE MODALES PARA CASE STUDIES
// ========================================

/**
 * Inicializa el sistema de modales para case studies
 * Incluye apertura, cierre y navegación entre proyectos
 */
function initializeModals() {
    if (!DOM.modal) return;
    
    // Event listeners para abrir modales
    DOM.projectCards.forEach(card => {
        card.addEventListener('click', () => openCaseStudy(card.dataset.project));
    });
    
    // Event listeners para cerrar modales
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', closeModal);
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            closeModal();
        }
    });
    
    console.log('🎭 Sistema de modales inicializado');
}

/**
 * Abre el modal de case study
 * Carga contenido dinámico basado en el proyecto
 */
function openCaseStudy(projectId) {
    state.isModalOpen = true;
    state.currentProject = projectId;
    
    // Mostrar modal
    DOM.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Cargar contenido del case study
    loadCaseStudyContent(projectId);
    
    // Focus en el modal para accesibilidad
    DOM.modalClose.focus();
}

/**
 * Cierra el modal de case study
 * Restaura el estado y limpia el contenido
 */
function closeModal() {
    state.isModalOpen = false;
    state.currentProject = null;
    
    // Ocultar modal
    DOM.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar contenido
    DOM.modalContent.innerHTML = '';
}

/**
 * Carga el contenido del case study
 * Datos simulados con estructura profesional
 */
function loadCaseStudyContent(projectId) {
    const caseStudies = {
        'fintech-rebrand': {
            title: 'Rebranding para Startup de Fintech',
            client: 'TechFinance Startup',
            duration: '3 meses',
            role: 'Lead Designer & Brand Strategist',
            objective: 'Reposicionar la marca para aumentar la confianza del usuario y triplicar las conversiones',
            problem: 'La startup tenía una identidad visual inconsistente que no transmitía confianza en el sector financiero, resultando en bajas tasas de conversión y poca diferenciación en el mercado.',
            process: [
                'Análisis de mercado y competencia',
                'Research de usuarios y pain points',
                'Desarrollo de estrategia de marca',
                'Creación de identidad visual completa',
                'Diseño de sistema de diseño',
                'Implementación en todos los touchpoints'
            ],
            solution: 'Desarrollé una identidad visual moderna y confiable que comunica estabilidad financiera a través de colores corporativos, tipografía profesional y elementos gráficos que transmiten transparencia y seguridad.',
            results: [
                '300% incremento en conversiones',
                '85% mejora en reconocimiento de marca',
                '40% reducción en costo de adquisición',
                '95% satisfacción del cliente'
            ],
            image: 'https://picsum.photos/600/400?random=1'
        },
        'ecommerce-app': {
            title: 'App Móvil E-commerce',
            client: 'RetailPlus',
            duration: '4 meses',
            role: 'UX/UI Designer',
            objective: 'Rediseñar la experiencia de compra móvil para reducir el abandono del carrito y aumentar las ventas',
            problem: 'La app móvil tenía una tasa de abandono del carrito del 70% debido a una experiencia de usuario confusa y procesos de compra complejos.',
            process: [
                'Audit de UX existente',
                'User research y entrevistas',
                'Mapeo de customer journey',
                'Wireframing y prototipado',
                'Testing de usabilidad',
                'Diseño de interfaz final'
            ],
            solution: 'Creé una experiencia de compra simplificada con checkout en un solo paso, navegación intuitiva y elementos visuales que guían al usuario hacia la conversión.',
            results: [
                '35% reducción en abandono del carrito',
                '50% incremento en ventas móviles',
                '4.8/5 rating en app stores',
                '60% mejora en tiempo de checkout'
            ],
            image: 'https://picsum.photos/600/400?random=2'
        },
        'corporate-campaign': {
            title: 'Campaña Corporativa Multichannel',
            client: 'GlobalCorp',
            duration: '2 meses',
            role: 'Creative Director',
            objective: 'Unificar la comunicación de marca en todos los touchpoints para mejorar el reconocimiento y la coherencia',
            problem: 'La empresa tenía múltiples canales de comunicación con mensajes inconsistentes y diseño fragmentado, afectando la percepción de marca.',
            process: [
                'Audit de marca existente',
                'Desarrollo de guidelines',
                'Creación de assets multichannel',
                'Diseño de templates',
                'Capacitación de equipos',
                'Implementación coordinada'
            ],
            solution: 'Desarrollé un sistema de comunicación unificado con guidelines claras, templates reutilizables y una identidad visual consistente en todos los canales.',
            results: [
                '90% consistencia en comunicación',
                '45% mejora en reconocimiento de marca',
                '30% reducción en tiempo de producción',
                '100% adopción por parte de equipos'
            ],
            image: 'https://picsum.photos/600/400?random=3'
        },
        'saas-dashboard': {
            title: 'Dashboard SaaS B2B',
            client: 'DataAnalytics Pro',
            duration: '5 meses',
            role: 'Product Designer',
            objective: 'Rediseñar la interfaz compleja para mejorar la usabilidad y reducir el tiempo de onboarding',
            problem: 'El dashboard tenía una curva de aprendizaje muy alta, con usuarios abandonando la plataforma en las primeras semanas debido a la complejidad de la interfaz.',
            process: [
                'Análisis de datos de uso',
                'User interviews y surveys',
                'Information architecture',
                'Wireframing y prototipado',
                'Usability testing iterativo',
                'Diseño de sistema de componentes'
            ],
            solution: 'Simplifiqué la interfaz agrupando funcionalidades relacionadas, creé un sistema de navegación intuitivo y desarrollé un onboarding progresivo.',
            results: [
                '50% reducción en tiempo de onboarding',
                '70% mejora en task completion rate',
                '4.5/5 satisfacción del usuario',
                '40% reducción en tickets de soporte'
            ],
            image: 'https://picsum.photos/600/400?random=4'
        },
        'sustainable-packaging': {
            title: 'Packaging Sostenible',
            client: 'EcoProducts',
            duration: '2 meses',
            role: 'Packaging Designer',
            objective: 'Crear packaging que comunique valores sostenibles y aumente las ventas en el segmento eco-conscious',
            problem: 'El packaging actual no comunicaba los valores sostenibles de la marca, perdiendo oportunidades en el mercado eco-friendly en crecimiento.',
            process: [
                'Research de mercado eco-friendly',
                'Análisis de materiales sostenibles',
                'Desarrollo de conceptos visuales',
                'Prototipado y testing',
                'Optimización para producción',
                'Implementación en línea de productos'
            ],
            solution: 'Diseñé un sistema de packaging que combina materiales sostenibles con una identidad visual que comunica claramente los valores ecológicos de la marca.',
            results: [
                '60% incremento en ventas eco-segment',
                '85% mejora en percepción sostenible',
                '30% reducción en costos de packaging',
                'Premio de diseño sostenible 2024'
            ],
            image: 'https://picsum.photos/600/400?random=5'
        },
        'brand-identity': {
            title: 'Identidad de Marca Completa',
            client: 'InnovateTech',
            duration: '3 meses',
            role: 'Brand Designer',
            objective: 'Desarrollar identidad visual desde cero para posicionar la empresa como líder en su sector',
            problem: 'La startup necesitaba una identidad visual profesional que comunicara innovación y confiabilidad para competir en el mercado tecnológico.',
            process: [
                'Brand strategy y positioning',
                'Desarrollo de conceptos creativos',
                'Diseño de logo y variaciones',
                'Creación de manual de marca',
                'Diseño de aplicaciones',
                'Implementación en todos los touchpoints'
            ],
            solution: 'Creé una identidad visual moderna y escalable que comunica innovación tecnológica a través de elementos gráficos dinámicos y una paleta de colores distintiva.',
            results: [
                '100% reconocimiento de marca en 6 meses',
                '200% incremento en leads calificados',
                'Premio a mejor identidad corporativa',
                'Expansión a 3 mercados internacionales'
            ],
            image: 'https://picsum.photos/600/400?random=6'
        }
    };
    
    const project = caseStudies[projectId];
    if (!project) return;
    
    // Generar HTML del case study
    const caseStudyHTML = `
        <div class="case-study-header">
            <img src="${project.image}" alt="${project.title}" class="case-study-image">
            <div class="case-study-meta">
                <h1>${project.title}</h1>
                <div class="case-study-info">
                    <div class="info-item">
                        <strong>Cliente:</strong> ${project.client}
                    </div>
                    <div class="info-item">
                        <strong>Duración:</strong> ${project.duration}
                    </div>
                    <div class="info-item">
                        <strong>Rol:</strong> ${project.role}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="case-study-body">
            <section class="case-study-section">
                <h2>Objetivo</h2>
                <p>${project.objective}</p>
            </section>
            
            <section class="case-study-section">
                <h2>El Problema</h2>
                <p>${project.problem}</p>
            </section>
            
            <section class="case-study-section">
                <h2>Proceso</h2>
                <ul class="process-list">
                    ${project.process.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </section>
            
            <section class="case-study-section">
                <h2>La Solución</h2>
                <p>${project.solution}</p>
            </section>
            
            <section class="case-study-section">
                <h2>Resultados</h2>
                <div class="results-grid">
                    ${project.results.map(result => `<div class="result-item">${result}</div>`).join('')}
                </div>
            </section>
        </div>
    `;
    
    DOM.modalContent.innerHTML = caseStudyHTML;
}

// ========================================
// ANIMACIONES DE SCROLL
// ========================================

/**
 * Inicializa las animaciones basadas en scroll
 * Optimizado para performance con Intersection Observer
 */
function initializeScrollAnimations() {
    // Usar Intersection Observer para mejor performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observar elementos animables
        const animatedElements = document.querySelectorAll('.project-card, .experience-item, .skill-category');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    console.log('🎬 Animaciones de scroll inicializadas');
}

// ========================================
// OPTIMIZACIONES DE PERFORMANCE
// ========================================

/**
 * Inicializa optimizaciones de performance
 * Incluye throttling, debouncing y lazy loading
 */
function initializePerformanceOptimizations() {
    // Throttle para eventos de scroll
    window.addEventListener('scroll', throttle(handleScroll, CONFIG.scrollThrottle));
    
    // Debounce para resize
    window.addEventListener('resize', debounce(handleResize, CONFIG.debounceDelay));
    
    // Lazy loading para imágenes
    initializeLazyLoading();
    
    // Preload de recursos críticos
    preloadCriticalResources();
    
    console.log('⚡ Optimizaciones de performance aplicadas');
}

/**
 * Maneja eventos de scroll con throttling
 * Optimiza la performance de animaciones
 */
function handleScroll() {
    state.scrollPosition = window.pageYOffset;
    
    // Actualizar navegación activa
    updateActiveNavigation();
    
    // Efectos de parallax suaves (opcional)
    updateParallaxEffects();
}

/**
 * Maneja eventos de resize con debouncing
 * Optimiza el recálculo de layouts
 */
function handleResize() {
    // Cerrar menú móvil en resize
    if (window.innerWidth > 768 && state.isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Recalcular posiciones si es necesario
    updateScrollPositions();
}

/**
 * Inicializa lazy loading para imágenes
 * Mejora los tiempos de carga inicial
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Precarga recursos críticos
 * Mejora la percepción de velocidad
 */
function preloadCriticalResources() {
    // Preload de fuentes críticas
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
}

// ========================================
// UTILIDADES Y HELPERS
// ========================================

/**
 * Throttle function para limitar la frecuencia de ejecución
 * Optimiza performance en eventos de scroll y resize
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function para retrasar la ejecución
 * Útil para eventos que se disparan frecuentemente
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Actualiza efectos de parallax (opcional)
 * Crea profundidad visual sutil
 */
function updateParallaxEffects() {
    const heroImage = document.querySelector('.profile-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
}

/**
 * Actualiza posiciones de scroll
 * Recalcula offsets después de resize
 */
function updateScrollPositions() {
    // Recalcular posiciones si es necesario
    // Implementación específica según necesidades
}

// ========================================
// MANEJO DE ERRORES
// ========================================

/**
 * Maneja errores de carga de imágenes
 * Fallback para mejorar la experiencia
 */
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/400x250?text=Imagen+no+disponible';
    img.alt = 'Imagen no disponible';
    console.warn('Error cargando imagen:', img.src);
}

// Aplicar manejo de errores a todas las imágenes
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

// ========================================
// LOGGING Y DEBUGGING
// ========================================

/**
 * Sistema de logging para desarrollo
 * Facilita el debugging y monitoreo
 */
const logger = {
    info: (message, data) => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`ℹ️ ${message}`, data || '');
        }
    },
    warn: (message, data) => {
        console.warn(`⚠️ ${message}`, data || '');
    },
    error: (message, data) => {
        console.error(`❌ ${message}`, data || '');
    }
};

// ========================================
// INICIALIZACIÓN FINAL
// ========================================

// Mensaje de bienvenida para desarrolladores
console.log(`
🚀 PORTAFOLIO JOHN RODRIGUEZ - CARGADO
=====================================
✅ Navegación suave
✅ Formulario de contacto
✅ Modales de case studies
✅ Animaciones optimizadas
✅ Performance optimizado
=====================================
Desarrollado con mejores prácticas de UX/UI
`);

// Exportar funciones para testing (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        handleFormSubmit,
        openCaseStudy,
        closeModal
    };
}