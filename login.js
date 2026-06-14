document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
});

function initThemeManager() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    if (!themeToggleBtn || !themeIcon || !themeText) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        htmlElement.classList.add('dark'); 
    }

    if (htmlElement.classList.contains('dark')) {
        themeIcon.className = "fa-solid fa-sun text-amber-500";
        themeText.innerText = "Modo Claro";
    } else {
        themeIcon.className = "fa-solid fa-moon text-purple-600";
        themeText.innerText = "Modo Oscuro";
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            themeIcon.className = "fa-solid fa-moon text-purple-600";
            themeText.innerText = "Modo Oscuro";
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            themeIcon.className = "fa-solid fa-sun text-amber-500";
            themeText.innerText = "Modo Claro";
            localStorage.setItem('theme', 'dark');
        }
    });
}
function registrarUsuario(event) {
    event.preventDefault();
    const formulario = event.target;//Para capturar ese formulario 

    activarSpinnerFormulario(formulario);

    const name = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    setTimeout(() => {
        
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, verifica.");
            desactivarSpinnerFormulario(formulario);
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            desactivarSpinnerFormulario(formulario);
            return;
        }

       const users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.find(user => user.email === email);
        if (userExists) {
            alert(" Este correo ya está registrado.");
            desactivarSpinnerFormulario(formulario);
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);

        localStorage.setItem('users', JSON.stringify(users));

        alert(" ¡Registro exitoso, viajero! Ahora puedes iniciar sesión.");

        // Redirigir a la página establecida en el atributo 'action' (login.html)
        const destino = formulario.getAttribute('action');
        if (destino) {
            window.location.href = destino;
        }

    }, 1500); 
}

function inicioUsuario(event) {
    event.preventDefault();
    const formulario = event.target;//Para capturar ese formulario 

    activarSpinnerFormulario(formulario);
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    setTimeout(() => {

        // Busca si existe un usuario con ese correo y esa contraseña
        const validUser = users.find(user => user.email === email && user.password === password);

        if (validUser) {
            alert(` ¡Acceso concedido! Bienvenido, ${validUser.name}.`);
            
            // Guardamos en la sesión quién ingresó 
            localStorage.setItem('currentUser', JSON.stringify(validUser));

            // Redirigir a la página establecida en el atributo 'action' (login.html)
            const destino = formulario.getAttribute('action');
            if (destino) {
                window.location.href = destino;
            }
        } else {
            alert(" Credenciales inválidas. Verifica tu correo o contraseña.");
            btnSubmit.classList.remove('loading');
            btnSubmit.disabled = false;
        }
    }, 1000);
}

function recuperarContrasena(event) {
    event.preventDefault();
    const formulario = event.target;

    activarSpinnerFormulario(formulario);

    const email = document.getElementById('email').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Remover cualquier mensaje previo antes de validar
    const mensajePrevio = document.getElementById('resultado-recuperacion');
    if (mensajePrevio) mensajePrevio.remove();

    setTimeout(() => {
        const usuarioEncontrado = users.find(user => user.email === email);

        // Creamos el contenedor para el mensaje que irá abajo del formulario
        const contenedorMensaje = document.createElement('div');
        contenedorMensaje.id = 'resultado-recuperacion';
        contenedorMensaje.className = 'mt-6 p-4 rounded-xl text-sm transition-all duration-300 border animate-fade-in shadow-sm';

        if (usuarioEncontrado) {
            // Diseño verde de éxito que revela la contraseña simulada
            contenedorMensaje.classList.add('bg-emerald-50', 'dark:bg-emerald-950/20', 'text-emerald-800', 'dark:text-emerald-400', 'border-emerald-200', 'dark:border-transparent');
            contenedorMensaje.innerHTML = `
                <div class="flex items-start gap-3">
                    <i class="fa-solid fa-circle-check mt-0.5 text-base text-emerald-600 dark:text-emerald-400"></i>
                    <div class="space-y-1">
                        <p class="font-bold">¡Usuario verificado con éxito!</p>
                        <p class="text-xs text-emerald-700/90 dark:text-emerald-400/80">
                            Como este es un entorno de desarrollo local, hemos interceptado las credenciales:
                        </p>
                        <div class="mt-2 p-2 bg-white dark:bg-[#121826] rounded border border-emerald-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs select-all cursor-pointer text-center break-all">
                            <strong>Contraseña:</strong> ${usuarioEncontrado.password}
                        </div>
                    </div>
                </div>
            `;
            
            // Limpiamos el campo del correo electrónico
            if (email) email.value = '';
        } else {
            // Diseño rojo de error si el correo no existe
            contenedorMensaje.classList.add('bg-rose-50', 'dark:bg-rose-950/20', 'text-rose-800', 'dark:text-rose-400', 'border-rose-200', 'dark:border-transparent');
            contenedorMensaje.innerHTML = `
                <div class="flex items-start gap-3">
                    <i class="fa-solid fa-circle-xmark mt-0.5 text-base text-rose-600 dark:text-rose-400"></i>
                    <div>
                        <p class="font-bold">Error de verificación</p>
                        <p class="text-xs text-rose-700/90 dark:text-rose-400/80">El correo electrónico <strong>${email}</strong> no coincide con ninguna cuenta registrada.</p>
                    </div>
                </div>
            `;
        }

        // Insertamos el bloque de respuesta exactamente abajo del formulario
        formulario.parentNode.appendChild(contenedorMensaje);
        
        // Apagamos el spinner de carga para restaurar el botón
        desactivarSpinnerFormulario(formulario);
    }, 1500); 
}



// --- FUNCIONES DEL SPINNER  ---
function activarSpinnerFormulario(formulario) { 
    
    // Buscamos el botón dentro del formulario que recibimos
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    if (!botonSubmit) return formulario;

    const textoBoton = botonSubmit.querySelector('.btn-text');
    const spinnerBoton = botonSubmit.querySelector('.btn-spinner');

    // Bloqueamos el botón
    botonSubmit.disabled = true;
    botonSubmit.classList.add('opacity-75', 'cursor-not-allowed');
    
    // Mostramos el spinner
    if (textoBoton) textoBoton.classList.add('hidden');
    if (spinnerBoton) spinnerBoton.classList.remove('hidden');

    return formulario; 
}
function desactivarSpinnerFormulario(formulario) {
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    if (!botonSubmit) return;

    const textoBoton = botonSubmit.querySelector('.btn-text');
    const spinnerBoton = botonSubmit.querySelector('.btn-spinner');

    botonSubmit.disabled = false;
    botonSubmit.classList.remove('opacity-75', 'cursor-not-allowed');
    if (textoBoton) textoBoton.classList.remove('hidden');
    if (spinnerBoton) spinnerBoton.classList.add('hidden');
}


