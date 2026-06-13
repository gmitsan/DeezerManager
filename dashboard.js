document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    obtenerCancionesMejorRankeadas();
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
function cerrarSesion() { //Cerrar sesion
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function obtenerCancionesMejorRankeadas() {
  // Usamos el endpoint /chart de Deezer para traer lo más popular actualmente
  const url = "https://api.deezer.com/chart/0/tracks&output=jsonp";

  // Creamos una petición utilizando JSONP para saltar el bloqueo de CORS del navegador
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(respuesta) {
      // Deezer nos devuelve un objeto con un array dentro de 'data'
      const canciones = respuesta.data;

      console.log("Canciones mejor rankeadas recibidas:", canciones);
      
      // Aquí puedes llamar a una función para pintarlas en tu index.html
      mostrarCancionesEnPantalla(canciones);
    },
    error: function(error) {
      console.error("Error al consultar el top de música:", error);
    }
  });
}

// Función de ejemplo para renderizar las tarjetas en tu HTML
function mostrarCancionesEnPantalla(listaCanciones) {
  const listaContenedor = document.getElementById('contenedor-canciones');
  const htmlTarjetas = listaCanciones.map(cancion => {
    return `
      <div class="music-card bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" 
           data-title="${cancion.title}" data-artist="${cancion.artist.name}">
        <div class="relative mb-3 aspect-square w-full">
          <img src="${cancion.album.cover}" class="rounded w-full h-full object-cover shadow-md" alt="Cover de ${cancion.title}">
          <button class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-purple-600 dark:bg-[#8b5cf6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
        <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${cancion.title}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">${cancion.artist.name}</p>
        <div class="star-rating flex text-sm text-slate-300 dark:text-slate-600 gap-0.5">
          <i class="fa-solid fa-star cursor-pointer hover:text-amber-400" data-value="1"></i>
          <i class="fa-solid fa-star cursor-pointer hover:text-amber-400" data-value="2"></i>
          <i class="fa-solid fa-star cursor-pointer hover:text-amber-400" data-value="3"></i>
          <i class="fa-solid fa-star cursor-pointer hover:text-amber-400" data-value="4"></i>
          <i class="fa-solid fa-star cursor-pointer hover:text-amber-400" data-value="5"></i>
        </div>
      </div>
    `;
  }).join(''); 

  listaContenedor.innerHTML = htmlTarjetas;
}

// Ejecutar la función al cargar la página
obtenerCancionesMejorRankeadas();
