/**
 * DEEZER-MANAGER: SCRIPT ESTÉTICO Y CONTROL DE APARIENCIA
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initStarsRating();
    initPlayerSelection();
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

// --- 2. SISTEMA DE ESTRELLAS INTERACTIVAS ---
function initStarsRating() {
    const starContainers = document.querySelectorAll('.star-rating');

    starContainers.forEach(container => {
        const stars = container.querySelectorAll('i');

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que al calificar se reproduzca la canción
                const selectedValue = parseInt(e.target.getAttribute('data-value'));

                stars.forEach(s => {
                    const starValue = parseInt(s.getAttribute('data-value'));
                    if (starValue <= selectedValue) {
                        s.className = "fa-solid fa-star cursor-pointer text-amber-400 scale-110 transition-transform duration-100";
                    } else {
                        s.className = "fa-solid fa-star cursor-pointer text-slate-300 dark:text-slate-600";
                    }
                });
            });
        });
    });
}

// --- 3. SELECCIÓN DE PISTAS EN EL REPRODUCTOR ---
function initPlayerSelection() {
    const cards = document.querySelectorAll('.music-card');
    const masterPlay = document.getElementById('masterPlay');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const artist = card.getAttribute('data-artist');

            // Actualiza textos en el reproductor inferior
            document.getElementById('playerTitle').innerText = title;
            document.getElementById('playerArtist').innerText = artist;
            
            // Actualiza textos en el panel lateral de detalles
            document.getElementById('detailTitle').innerText = title;
            document.getElementById('detailArtist').innerText = artist;

            // Cambia el icono del reproductor a pausa indicando que "reproduce"
            if (masterPlay) {
                masterPlay.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            }
        });
    });
}