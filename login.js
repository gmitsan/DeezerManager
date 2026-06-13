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


