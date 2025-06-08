document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const navButtons = document.querySelectorAll('.nav-button');
    const mainContentArea = document.getElementById('mainContentArea');
    const loadingIndicator = document.getElementById('loading-indicator');
    const sidebarOverlay = document.getElementById('sidebarOverlay'); // Usar ID para mayor especificidad
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    const overlay = document.getElementById('sidebarOverlayBackground'); // Usar ID para el overlay

    let currentActiveModule = null; // Para rastrear el módulo actualmente visible

    // --- Funciones del Sidebar ---
    function openSidebar() {
        sidebarOverlay.classList.add('active');
        overlay.classList.add('active'); // Activa el overlay
    }

    function closeSidebar() {
        sidebarOverlay.classList.remove('active');
        overlay.classList.remove('active'); // Desactiva el overlay
    }

    // Event Listeners para el control del sidebar
    menuToggle.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar); // Cierra el sidebar al hacer clic en el overlay

    // --- Funciones de Indicador de Carga ---
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
    }

    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    // --- Función principal para cargar módulos ---
    function loadModule(moduleName) {
        closeSidebar(); // Asegura que el sidebar se cierre al seleccionar un módulo

        const targetModuleId = `${moduleName}-module`; // ID del módulo completo

        // Si ya estamos en este módulo, no hacer nada
        if (currentActiveModule && currentActiveModule.id === targetModuleId) {
            return;
        }

        showLoading(); // Muestra el indicador de carga

        // Retraso para simular la carga y permitir que el indicador se vea
        // También asegura que las transiciones CSS tengan tiempo de aplicarse
        setTimeout(() => {
            // Desactivar el módulo actualmente activo si existe
            if (currentActiveModule) {
                currentActiveModule.classList.remove('active');
            }

            const newModule = document.getElementById(targetModuleId);
            if (newModule) {
                // Desactiva todos los módulos para asegurarse de que solo uno esté activo
                document.querySelectorAll('.pixel-module').forEach(module => {
                    module.classList.remove('active');
                });
                newModule.classList.add('active'); // Activa el nuevo módulo
                currentActiveModule = newModule; // Actualiza el módulo activo

                // Scroll al inicio del área de contenido para módulos largos
                mainContentArea.scrollTop = 0;
            } else {
                // Manejo de error si el módulo no se encuentra (improbable con todo en index.html)
                console.error(`ERROR: Módulo ${targetModuleId} NO ENCONTRADO.`);
                const errorSection = document.createElement('section');
                errorSection.classList.add('pixel-module', 'active');
                errorSection.innerHTML = `<h1>:: ERROR_404_MODULE_NOT_FOUND ::</h1><p class="error">Módulo "${moduleName}" NO CARGADO. COMPRUEBE LA SINTAXIS.</p>`;
                mainContentArea.appendChild(errorSection);
                currentActiveModule = errorSection;
            }

            hideLoading(); // Oculta el indicador de carga
            updateNavButtons(moduleName); // Actualiza el estado de los botones de navegación
        }, 500); // Retraso de 500ms para la "carga" simulada
    }

    // --- Función para actualizar el estado de los botones de navegación ---
    function updateNavButtons(activeModuleName) {
        navButtons.forEach(button => {
            if (button.dataset.module === activeModuleName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // --- Event Listeners para la navegación ---
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto de los botones
            const moduleToLoad = event.target.dataset.module;
            if (moduleToLoad) {
                loadModule(moduleToLoad);
            }
        });
    });

    // Manejar clic en el logo para ir al módulo 'home'
    const homeLink = document.querySelector('.main-header .logo a');
    if (homeLink) {
        homeLink.addEventListener('click', (event) => {
            event.preventDefault();
            loadModule('home');
        });
    }

    // --- Inicialización del sistema: Cargar HOME al inicio ---
    // Un pequeño retraso para simular el "boot up" inicial y asegurar que el DOM esté listo
    setTimeout(() => {
        loadModule('home'); // Carga el módulo HOME al iniciar
        hideLoading(); // Asegura que el indicador de carga inicial esté oculto
    }, 100); // Retraso mínimo para el "boot" visual
});