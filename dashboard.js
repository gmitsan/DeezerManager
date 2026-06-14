document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    initThemeManager();
    obtenerCancionesMejorRankeadas();

    const closeBtn = document.getElementById('closePanelRight');
    const panelDerecho = document.getElementById('panel-derecho');
    
    if (closeBtn && panelDerecho) {
        closeBtn.addEventListener('click', () => {
            panelDerecho.classList.remove('lg:flex');
            panelDerecho.classList.add('hidden');
        });
    }

    const btnAtras = document.getElementById('nav-atras');
    const btnAdelante = document.getElementById('nav-adelante');

    if (btnAtras && btnAdelante) {
        btnAtras.addEventListener('click', () => {
            if (indiceHistorial > 0) {
                indiceHistorial--;
                ejecutarVistaHistorial(historialVistas[indiceHistorial]);
            }
        });

        btnAdelante.addEventListener('click', () => {
            if (indiceHistorial < historialVistas.length - 1) {
                indiceHistorial++;
                ejecutarVistaHistorial(historialVistas[indiceHistorial]);
            }
        });
    }

    // Click para ver la colección en el contenedor principal
    const btnMisAlbumes = document.getElementById('btn-mis-albumes');
    if (btnMisAlbumes) {
        btnMisAlbumes.addEventListener('click', () => {
            registrarVista('mis_albumes', null);
            verMisAlbumesGuardados();
        });
    }
    const filtroCalificacion = document.getElementById('filtroCalificacion');
    if (filtroCalificacion) {
        filtroCalificacion.addEventListener('change', () => {
            aplicarFiltroCalificacionVisual();
        });
    }
    registrarVista('inicio', null);
    
    // Carga tus álbumes favoritos en la barra lateral apenas entras
    actualizarSidebarFavoritos();

    //Boton de la musica
    const masterPlayBtn = document.getElementById('masterPlay');
    if (masterPlayBtn) {
        masterPlayBtn.addEventListener('click', () => {
            alternarReproduccionMaestra();
        });
    }
});

function aplicarFiltroCalificacionVisual() {
    const reglaFiltro = $('#filtroCalificacion').val() || 'todos';

    const calificacionesCanciones = obtenerCalificacionesCanciones();

    $('#contenedor-canciones .music-card').each(function() {
        const tarjeta = $(this);

        if (tarjeta.hasClass('album-item') || tarjeta.hasClass('artista-item')) {
            tarjeta.show();
            return;
        }
        const cancionTitle = tarjeta.attr('data-title');
        const puntuacionCancion = calificacionesCanciones[cancionTitle] || 0;

        if (reglaFiltro === 'todos') {
            tarjeta.show();
        } else if (reglaFiltro === '5' && puntuacionCancion === 5) {
            tarjeta.show();
        } else if (reglaFiltro === '4' && puntuacionCancion >= 4) {
            tarjeta.show();
        } else if (reglaFiltro === '3' && puntuacionCancion >= 3) {
            tarjeta.show();
        } else if (reglaFiltro === '1' && puntuacionCancion >= 1) {
            tarjeta.show();
        } else if (reglaFiltro === '0' && puntuacionCancion === 0) {
            tarjeta.show();
        } else {
            tarjeta.hide(); 
        }
    });
}

function ajustarVisibilidadSubtitulos() {
    $('#contenedor-canciones h2').each(function() {
        const h2 = $(this);
        const contenedorSeccion = h2.parent();
        const tarjetasHermanas = contenedorSeccion.nextAll('.music-card').not(contenedorSeccion.nextAll('div:has(h2)').nextAll());
    });
}
function ejecutarVistaHistorial(vista) {
    navegandoHistorial = true;
    
    if (vista.tipo === 'inicio') {
        document.getElementById('searchInput').value = '';
        const tituloSeccion = document.querySelector('h2.text-xl');
        if (tituloSeccion) tituloSeccion.textContent = "Recomendado para ti";
        
        const panelDerecho = document.getElementById('panel-derecho');
        if (panelDerecho) {
            panelDerecho.classList.remove('lg:flex');
            panelDerecho.classList.add('hidden');
        }
        obtenerCancionesMejorRankeadas();
    } 
    else if (vista.tipo === 'mis_albumes') { 
        verMisAlbumesGuardados();
    }
    else if (vista.tipo === 'artista') {
        verDetalleArtista(vista.id);
    } 
    else if (vista.tipo === 'album') {
        verDetalleAlbum(vista.id);
    } 
    else if (vista.tipo === 'todos_los_albumes') {
        verTodosLosAlbumesArtista(vista.id);
    }
    
    navegandoHistorial = false;
    actualizarBotonesNavegacion();
}

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

function cerrarSesion() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// HISTORIAL DE PANTALLAS
let historialVistas = [];
let indiceHistorial = -1;
let navegandoHistorial = false; 

function registrarVista(tipo, id, extraData = null) {
    if (navegandoHistorial) return; 

    if (indiceHistorial < historialVistas.length - 1) {
        historialVistas = historialVistas.slice(0, indiceHistorial + 1);
    }

    historialVistas.push({ tipo, id, extraData });
    indiceHistorial++;
    actualizarBotonesNavegacion();
}

function actualizarBotonesNavegacion() {
    const btnAtras = document.getElementById('nav-atras');
    const btnAdelante = document.getElementById('nav-adelante');

    if (btnAtras && btnAdelante) {
        btnAtras.disabled = indiceHistorial <= 0;
        btnAdelante.disabled = indiceHistorial >= historialVistas.length - 1;
    }
}

function obtenerCancionesMejorRankeadas() {
  const url = "https://api.deezer.com/chart/0/tracks&output=jsonp";
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(respuesta) {
      const canciones = respuesta.data;
      mostrarCancionesEnPantalla(canciones);
    },
    error: function(error) {
      console.error("Error al consultar el top de música:", error);
    }
  });
}

function buscarCanciones() {
  const query = document.getElementById('searchInput').value.trim();
  const tituloSeccion = document.querySelector('h2.text-xl');
  const listaContenedor = document.getElementById('contenedor-canciones');

  if (!query) {
    if (tituloSeccion) {
      tituloSeccion.textContent = "Recomendado para ti";
    }
    const panelDerecho = document.getElementById('panel-derecho');
    if (panelDerecho) {
      panelDerecho.classList.remove('lg:flex');
      panelDerecho.classList.add('hidden');
    }
    obtenerCancionesMejorRankeadas();
    return; 
  }

  if (tituloSeccion) {
    tituloSeccion.textContent = `Resultados de búsqueda para "${query}"`;
  }

  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp`;

  if (listaContenedor) {
    listaContenedor.innerHTML = `
      <p class="text-slate-500 dark:text-slate-400 text-center col-span-full py-8">
        <i class="fa-solid fa-spinner animate-spin mr-2"></i> Buscando "${query}" en todo Deezer...
      </p>
    `;
  }

  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(respuesta) {
      const resultados = respuesta.data;            
      if (resultados && resultados.length > 0) {
        mostrarCancionesEnPantalla(resultados);
      } else {
        listaContenedor.innerHTML = `
            <p class="text-slate-500 dark:text-slate-400 text-center col-span-full py-8">
                No encontramos canciones, álbumes ni artistas para "${query}".
            </p>
        `;
      }
    },
    error: function(error) {
      console.error("Error crítico al buscar en Deezer:", error);
      if (listaContenedor) {
        listaContenedor.innerHTML = `
          <p class="text-red-500 text-center col-span-full py-8">
              Hubo un error en la conexión. Inténtalo de nuevo.
          </p>
        `;
      }
    }
  });
}

function verDetalleArtista(idArtista) {

  registrarVista('artista', idArtista);

  const panelDerecho = document.getElementById('panel-derecho');
  if (panelDerecho) {
    panelDerecho.classList.remove('hidden');
    panelDerecho.classList.add('lg:flex'); 
  }

  const tituloSeccion = document.querySelector('h2.text-xl');
  const listaContenedor = document.getElementById('contenedor-canciones');
  
  if (listaContenedor) {
    listaContenedor.innerHTML = `
      <p class="text-slate-500 dark:text-slate-400 text-center col-span-full py-8">
        <i class="fa-solid fa-spinner animate-spin mr-2"></i> Cargando catálogo del artista...
      </p>
    `;
  }

  const urlArtista = `https://api.deezer.com/artist/${idArtista}&output=jsonp`;
  const urlTopCanciones = `https://api.deezer.com/artist/${idArtista}/top?limit=10&output=jsonp`;
  const urlAlbumes = `https://api.deezer.com/artist/${idArtista}/albums?limit=50&output=jsonp`;

  // Detalles del Artista
  $.ajax({
    url: urlArtista,
    dataType: "jsonp",
    success: function(artista) {
      document.getElementById('panelRightTitle').textContent = "Detalles del artista";
      document.getElementById('detailTitle').textContent = artista.name;
      document.getElementById('detailArtist').textContent = `${artista.nb_fan.toLocaleString()} Fans`;
      
      const extraInfoText = document.getElementById('extraInfoText');
      if (extraInfoText) {
        extraInfoText.innerHTML = `
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <i class="fa-solid fa-record-vinyl text-purple-600 dark:text-purple-400 w-4 text-center"></i>
                <span>${artista.nb_album} álbumes en total</span>
            </div>
        `;
        document.getElementById('extraArtistInfo').classList.remove('hidden');
      }

      const imgContainer = document.getElementById('detailImgContainer');
      if (imgContainer) {
        imgContainer.innerHTML = `<img src="${artista.picture_big || artista.picture_medium}" class="w-full h-full object-cover" alt="${artista.name}">`;
      }
      
      if (tituloSeccion) {
        tituloSeccion.textContent = `Discografía de ${artista.name}`;
      }
    },
    error: function(err) {
      console.error("Error al traer info del artista:", err);
    }
  });

  // Álbumes y Canciones
  $.when(
    $.ajax({ url: urlTopCanciones, dataType: "jsonp" }),
    $.ajax({ url: urlAlbumes, dataType: "jsonp" })
  ).done(function(resCanciones, resAlbumes) {
    const canciones = resCanciones[0].data || [];
    const albumesCat = resAlbumes[0].data || [];

    if (listaContenedor) {
        listaContenedor.innerHTML = '';
    }

    let htmlFinal = '';

    // SECCIÓN ÁLBUMES DEL ARTISTA - MODIFICADA CON CORAZÓN
    if (albumesCat.length > 0) {
      htmlFinal += `
        <div class="col-span-full mt-4 mb-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Álbumes</h2>
          ${albumesCat.length > 4 ? `
            <button id="btnVerMasAlbumes" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer">
              Ver más <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          ` : ''}
        </div>
      `;
      
      const favoritos = obtenerAlbumesFavoritos();
      albumesCat.slice(0, 4).forEach(album => {
        const esFavorito = favoritos.some(fav => fav.id == album.id);
        const iconoCorazon = esFavorito ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-slate-400 hover:text-red-500';

        htmlFinal += `
          <div class="music-card album-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" data-album-id="${album.id}">
            <div class="relative mb-3 aspect-square w-full">
              <img src="${album.cover_medium || album.cover}" class="rounded w-full h-full object-cover shadow-md" alt="${album.title}">
              <button class="btn-favorito-corazon absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121826]/90 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
                      data-id="${album.id}" 
                      data-title="${album.title}" 
                      data-cover="${album.cover_medium || album.cover}">
                <i class="${iconoCorazon} text-sm"></i>
              </button>
            </div>
            <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${album.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">Lanzamiento: ${album.release_date ? album.release_date.split('-')[0] : 'N/A'}</p>
          </div>
        `;
      });
    }

    // SECCIÓN CANCIONES POPULARES
    if (canciones.length > 0) {
      htmlFinal += `
        <div class="col-span-full mt-8 mb-2">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Canciones populares</h2>
        </div>
      `;
      
      const calificacionesCanciones = obtenerCalificacionesCanciones();

      canciones.forEach(cancion => {
        const coverImg = (cancion.album && (cancion.album.cover_medium || cancion.album.cover)) ? cancion.album.cover_medium || cancion.album.cover : 'https://www.deezer.com/images/cover/1000x1000.jpg';
        
        const calificacionActual = calificacionesCanciones[cancion.title] || 0;
        let estrellasHTML = '<div class="star-rating flex text-sm gap-0.5 z-20 relative mt-2">';
        for (let i = 1; i <= 5; i++) {
            const claseEstrella = i <= calificacionActual 
                ? 'fa-solid fa-star text-amber-400' 
                : 'fa-regular fa-star text-slate-300 dark:text-slate-600 hover:text-amber-400';
            
            estrellasHTML += `<i class="${claseEstrella} cursor-pointer estrella-cancion-voto" data-cancion-title="${cancion.title}" data-valor="${i}"></i>`;
        }
        estrellasHTML += '</div>';

        htmlFinal += `
          <div class="music-card bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" 
                data-title="${cancion.title}" data-artist="${cancion.artist.name}">
            <div class="relative mb-3 aspect-square w-full">
              <img src="${coverImg}" class="rounded w-full h-full object-cover shadow-md" alt="Cover">
              <button class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-purple-600 dark:bg-[#8b5cf6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
                <i class="fa-solid fa-play"></i>
              </button>
            </div>
            <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${cancion.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">${cancion.artist.name}</p>
            
            ${estrellasHTML}
          </div>
        `;
      });
    }

    if (listaContenedor) {
      listaContenedor.innerHTML = htmlFinal;
    }

        $('#btnVerMasAlbumes').on('click', function() {
            verTodosLosAlbumesArtista(idArtista);
        });
        mapearEventosAlbumes();
        mapearEventosCalificacionesCanciones(); 
        aplicarFiltroCalificacionVisual();

  }).fail(function(err) {
    console.error("Error cargando componentes del artista:", err);
  });
}
function obtenerCalificacionesCanciones() {
    const calificaciones = localStorage.getItem('calificaciones_canciones');
    return calificaciones ? JSON.parse(calificaciones) : {};
}

function guardarCalificacionCancion(cancionTitle, puntuacion) {
    const calificaciones = obtenerCalificacionesCanciones();
    calificaciones[cancionTitle] = parseInt(puntuacion);
    localStorage.setItem('calificaciones_canciones', JSON.stringify(calificaciones));
}
function verTodosLosAlbumesArtista(idArtista) {
  registrarVista('todos_los_albumes', idArtista);
  const tituloSeccion = document.querySelector('h2.text-xl');
  const listaContenedor = document.getElementById('contenedor-canciones');

  if (listaContenedor) {
    listaContenedor.innerHTML = `
      <p class="text-slate-500 dark:text-slate-400 text-center col-span-full py-8">
        <i class="fa-solid fa-spinner animate-spin mr-2"></i> Desplegando discografía completa...
      </p>
    `;
  }

  const urlAlbumesCompleto = `https://api.deezer.com/artist/${idArtista}/albums?limit=100&output=jsonp`;

  $.ajax({
    url: urlAlbumesCompleto,
    dataType: "jsonp",
    success: function(respuesta) {
      const albumes = respuesta.data || [];
      
      if (albumes.length > 0 && tituloSeccion) {
        tituloSeccion.textContent = `Todos los álbumes`;
      }

      if (listaContenedor) {
        listaContenedor.innerHTML = '';
      }

      let htmlFinal = '';
      const favoritos = obtenerAlbumesFavoritos();
      
      albumes.forEach(album => {
        const esFavorito = favoritos.some(fav => fav.id == album.id);
        const iconoCorazon = esFavorito ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-slate-400 hover:text-red-500';

        htmlFinal += `
          <div class="music-card album-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" data-album-id="${album.id}">
            <div class="relative mb-3 aspect-square w-full">
              <img src="${album.cover_medium || album.cover}" class="rounded w-full h-full object-cover shadow-md" alt="${album.title}">
              <button class="btn-favorito-corazon absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121826]/90 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
                      data-id="${album.id}" 
                      data-title="${album.title}" 
                      data-cover="${album.cover_medium || album.cover}">
                <i class="${iconoCorazon} text-sm"></i>
              </button>
            </div>
            <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${album.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">Lanzamiento: ${album.release_date ? album.release_date.split('-')[0] : 'N/A'}</p>
          </div>
        `;
      });

      if (listaContenedor) {
        listaContenedor.innerHTML = htmlFinal;
      }

      mapearEventosAlbumes();
      },
    error: function(err) {
        console.error("Error al traer discografía completa:", err);
    }
  }); // Cierre correcto de $.ajax
}

function verDetalleAlbum(idAlbum){
  registrarVista('album', idAlbum);
  const panelDerecho = document.getElementById('panel-derecho');
  if (panelDerecho) {
    panelDerecho.classList.remove('hidden');
    panelDerecho.classList.add('lg:flex');
  }

  const tituloSeccion = document.querySelector('h2.text-xl');
  const listaContenedor = document.getElementById('contenedor-canciones');
  
  if (listaContenedor) {
    listaContenedor.innerHTML = `
      <p class="text-slate-500 dark:text-slate-400 text-center col-span-full py-8">
        <i class="fa-solid fa-spinner animate-spin mr-2"></i> Cargando canciones del álbum...
      </p>
    `;
  }

  const urlAlbum = `https://api.deezer.com/album/${idAlbum}&output=jsonp`;

  $.ajax({
    url: urlAlbum,
    dataType: "jsonp",
    success: function(album) {
      document.getElementById('panelRightTitle').textContent = "Detalles del álbum";
      document.getElementById('detailTitle').textContent = album.title;
      document.getElementById('detailArtist').textContent = `Por ${album.artist.name}`;
      
      const imgContainer = document.getElementById('detailImgContainer');
      if (imgContainer) {
        imgContainer.innerHTML = `<img src="${album.cover_big || album.cover_medium || album.cover}" class="w-full h-full object-cover" alt="${album.title}">`;
      }

      const extraInfoText = document.getElementById('extraInfoText');
      if (extraInfoText) {
        const releaseYear = album.release_date ? album.release_date.split('-')[0] : 'N/A';
        extraInfoText.innerHTML = `
          <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <i class="fa-solid fa-calendar text-purple-600 dark:text-purple-400 w-4 text-center"></i>
            <span>Lanzamiento: ${releaseYear}</span>
          </div>
          <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <i class="fa-solid fa-music text-purple-600 dark:text-purple-400 w-4 text-center"></i>
            <span>Contiene ${album.nb_tracks} canciones</span>
          </div>
        `;
        document.getElementById('extraArtistInfo').classList.remove('hidden');
      }

      if (tituloSeccion) {
        tituloSeccion.textContent = `Canciones de ${album.title}`;
      }

      if (album.tracks && album.tracks.data) {
        const cancionesFormateadas = album.tracks.data.map(cancion => {
          return {
            ...cancion,
            album: {
                id: album.id,
                title: album.title,
                cover_medium: album.cover_medium,
                cover: album.cover
            },
            artist: cancion.artist || {
                id: album.artist.id,
                name: album.artist.name
            }
          };
        });

        mostrarCancionesEnPantalla(cancionesFormateadas, true);
      } else {
        listaContenedor.innerHTML = '<p class="text-center col-span-full py-8 text-slate-400">No se encontraron pistas en este álbum.</p>';
      }
    },
    error: function(err) {
      console.error("Error al traer info del álbum:", err);
      if (listaContenedor) {
        listaContenedor.innerHTML = '<p class="text-center col-span-full py-8 text-red-500">Error al cargar las canciones del álbum.</p>';
      }
    }
  }); // Cierre correcto de $.ajax
}

function mostrarCancionesEnPantalla(listaElementos, ocultarSeccionArtistas = false) {
  const listaContenedor = document.getElementById('contenedor-canciones');
  listaContenedor.innerHTML = ''; 
  
  if (!listaElementos || listaElementos.length === 0) return;

  const canciones = listaElementos.filter(item => item && item.title);

  const albumesVistos = new Set();
  const albumes = canciones.reduce((acc, item) => {
    if (item.album && item.album.id && !albumesVistos.has(item.album.id)) {
      albumesVistos.add(item.album.id);
      acc.push({
        id: item.album.id,
        title: item.album.title,
        cover: item.album.cover_medium || item.album.cover,
        artistName: item.artist ? item.artist.name : 'Artista Desconocido'
      });
    }
    return acc;
  }, []);

  const artistasVistos = new Set();
  const artistas = canciones.reduce((acc, item) => {
    if (item.artist && item.artist.id && !artistasVistos.has(item.artist.id)) {
      artistasVistos.add(item.artist.id);
      acc.push({
        id: item.artist.id,
        name: item.artist.name,
        picture: item.artist.picture_medium || `https://api.deezer.com/artist/${item.artist.id}/image`
      });
    }
    return acc;
  }, []);

  let htmlFinal = '';

  // SECCIÓN DE ARTISTAS
  if (artistas.length > 0 && !ocultarSeccionArtistas) {
    htmlFinal += `
      <div class="col-span-full mt-4 mb-2">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Artistas</h2>
      </div>
    `;
    artistas.slice(0, 4).forEach(artista => {
      htmlFinal += `
        <div class="music-card artista-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative text-center cursor-pointer border border-slate-200 dark:border-transparent" data-artist-id="${artista.id}">
          <div class="relative mb-3 aspect-square w-28 h-28 mx-auto">
            <img src="${artista.picture}" class="rounded-full w-full h-full object-cover shadow-md" alt="${artista.name}">
          </div>
          <h3 class="text-sm font-bold truncate text-slate-900 dark:text-white">${artista.name}</h3>
          <p class="text-xs text-purple-500 mt-1 font-medium">Artista</p>
        </div>
      `;
    });
  }

  // SECCIÓN DE ÁLBUMES - MODIFICADA CON CORAZÓN
  if (albumes.length > 0 && !ocultarSeccionArtistas) {
    htmlFinal += `
      <div class="col-span-full mt-8 mb-2">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Álbumes</h2>
      </div>
    `;
    const favoritos = obtenerAlbumesFavoritos();
    albumes.slice(0, 4).forEach(album => {
      const esFavorito = favoritos.some(fav => fav.id == album.id);
      const iconoCorazon = esFavorito ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-slate-400 hover:text-red-500';

      htmlFinal += `
        <div class="music-card album-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" data-album-id="${album.id}">
          <div class="relative mb-3 aspect-square w-full">
            <img src="${album.cover}" class="rounded w-full h-full object-cover shadow-md" alt="${album.title}">
            <button class="btn-favorito-corazon absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121826]/90 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
              data-id="${album.id}" 
              data-title="${album.title}" 
              data-cover="${album.cover}">
              <i class="${iconoCorazon} text-sm"></i>
            </button>
          </div>
          <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${album.title}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${album.artistName}</p>
        </div>
      `;
    });
  }

  // SECCIÓN DE CANCIONES
  if (canciones.length > 0) {
    htmlFinal += `
      <div class="col-span-full mt-8 mb-2">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Canciones</h2>
      </div>
    `;

    const calificacionesCanciones = obtenerCalificacionesCanciones();

    canciones.forEach(cancion => {
      const coverImg = (cancion.album && (cancion.album.cover_medium || cancion.album.cover)) ? cancion.album.cover_medium || cancion.album.cover : 'https://www.deezer.com/images/cover/1000x1000.jpg';
      const artistaName = cancion.artist ? cancion.artist.name : 'Artista Desconocido';
      const artistaId = cancion.artist ? cancion.artist.id : '';
      const albumTitle = cancion.album ? cancion.album.title : 'Álbum Desconocido';
      const albumId = cancion.album ? cancion.album.id : '';
      const duracion = cancion.duration || 0;
      const ranking = cancion.rank || 0;
      const esExplicito = cancion.explicit_lyrics ? 'true' : 'false';
      const badgeExplicito = cancion.explicit_lyrics 
        ? `<span class="inline-flex items-center justify-center bg-red-500 text-white text-[9px] font-extrabold px-1 rounded ml-1.5 shadow-sm h-3.5 w-3.5 select-none shrink-0" title="Contenido Explícito">E</span>` 
        : '';

      // Generar estrellas según el LocalStorage
      const calificacionActual = calificacionesCanciones[cancion.title] || 0;
      let estrellasHTML = '<div class="star-rating flex text-sm gap-0.5 z-20 relative mt-2">';
      for (let i = 1; i <= 5; i++) {
          const claseEstrella = i <= calificacionActual 
              ? 'fa-solid fa-star text-amber-400' 
              : 'fa-regular fa-star text-slate-300 dark:text-slate-600 hover:text-amber-400';
          
          estrellasHTML += `<i class="${claseEstrella} cursor-pointer estrella-cancion-voto" data-cancion-title="${cancion.title}" data-valor="${i}"></i>`;
      }
      estrellasHTML += '</div>';

      htmlFinal += `
        <div class="music-card cancion-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" 
          data-title="${cancion.title}" 
          data-artist="${artistaName}"
          data-artist-id="${artistaId}"
          data-preview="${cancion.preview}"
          data-cover="${coverImg}"
          data-album-title="${albumTitle}"
          data-album-id="${albumId}"
          data-duration="${duracion}"
          data-rank="${ranking}"
          data-explicit="${esExplicito}">
          <div class="relative mb-3 aspect-square w-full">
            <img src="${coverImg}" class="rounded w-full h-full object-cover shadow-md" alt="Cover">
            <button class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-purple-600 dark:bg-[#8b5cf6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
              <i class="fa-solid fa-play"></i>
            </button>
          </div>
          <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white flex items-center">
              <span class="truncate">${cancion.title}</span> ${badgeExplicito}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">${artistaName}</p>
          
          ${estrellasHTML}
        </div>
      `;
    });
  }

  listaContenedor.innerHTML = htmlFinal;

  // ... Eventos de artistas y álbumes existentes ...
  $('.artista-item').off('click').on('click', function() {
    const idArtista = $(this).attr('data-artist-id');
    verDetalleArtista(idArtista);
  });

  mapearEventosAlbumes();

  //  CONTROL CLICKS DE CANCIONES (ABRE PANEL Y REPRODUCE)
  $('.cancion-item').off('click').on('click', function() {
    const urlPreview = $(this).attr('data-preview');
    const titulo = $(this).attr('data-title');
    const artista = $(this).attr('data-artist');
    const artistaId = $(this).attr('data-artist-id');
    const portada = $(this).attr('data-cover');
    const albumTitle = $(this).attr('data-album-title');
    const albumId = $(this).attr('data-album-id');
    const segundos = parseInt($(this).attr('data-duration')) || 0;
    const ranking = $(this).attr('data-rank');
    const esExplicito = $(this).attr('data-explicit') === 'true';
    
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    const duracionFormateada = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const panelDerecho = document.getElementById('panel-derecho');
    if (panelDerecho) {
      panelDerecho.classList.remove('hidden');
      panelDerecho.classList.add('lg:flex');
    }

    // 1. Cargamos el panel lateral con la foto de la canción, título y artista
    document.getElementById('panelRightTitle').textContent = "Detalles de la canción";
    document.getElementById('detailTitle').textContent = titulo;
    document.getElementById('detailArtist').textContent = `Por ${artista}`;
    
    const imgContainer = document.getElementById('detailImgContainer');
    if (imgContainer) {
      imgContainer.innerHTML = `
        <div class="relative w-full h-full group/panelImg">
            <img src="${portada}" class="w-full h-full object-cover" alt="${titulo}">
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/panelImg:opacity-100 transition-opacity duration-200">
              <button id="panelPlayBtn" class="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <i class="fa-solid fa-pause"></i>
              </button>
            </div>
        </div>
      `;
    }

    // SECCIÓN DE CANCIONES (CORREGIDA Y COMPLETA)
    if (canciones.length > 0) {
        htmlFinal += `
            <div class="col-span-full mt-8 mb-2">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Canciones</h2>
            </div>
        `;
        
        const calificacionesCanciones = obtenerCalificacionesCanciones();

        canciones.forEach(cancion => {
            const coverImg = (cancion.album && (cancion.album.cover_medium || cancion.album.cover)) ? cancion.album.cover_medium || cancion.album.cover : 'https://www.deezer.com/images/cover/1000x1000.jpg';
            const artistaName = cancion.artist ? cancion.artist.name : 'Artista Desconocido';

            const calificacionActual = calificacionesCanciones[cancion.title] || 0;
            let estrellasHTML = '<div class="star-rating flex text-sm gap-0.5 z-20 relative mt-2">';
            for (let i = 1; i <= 5; i++) {
                const claseEstrella = i <= calificacionActual 
                    ? 'fa-solid fa-star text-amber-400' 
                    : 'fa-regular fa-star text-slate-300 dark:text-slate-600 hover:text-amber-400';
                
                estrellasHTML += `<i class="${claseEstrella} cursor-pointer estrella-cancion-voto" data-cancion-title="${cancion.title}" data-valor="${i}"></i>`;
            }
            estrellasHTML += '</div>';

            htmlFinal += `
              <div class="music-card bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" 
                  data-title="${cancion.title}" data-artist="${artistaName}">
                <div class="relative mb-3 aspect-square w-full">
                  <img src="${coverImg}" class="rounded w-full h-full object-cover shadow-md" alt="Cover">
                  <button class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-purple-600 dark:bg-[#8b5cf6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
                    <i class="fa-solid fa-play"></i>
                  </button>
                </div>
                <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${cancion.title}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">${artistaName}</p>
                
                ${estrellasHTML}

              </div>
            `;
        });
    }

    listaContenedor.innerHTML = htmlFinal;

    $('.artista-item').off('click').on('click', function() {
        const idArtista = $(this).attr('data-artist-id');
        verDetalleArtista(idArtista);
    });

    
    const badgeExplicitoPanel = esExplicito 
      ? `<div class="flex items-center gap-2 text-red-500 font-bold bg-red-50 dark:bg-red-950/20 p-1.5 rounded border border-red-200 dark:border-transparent text-[11px]">
            <i class="fa-solid fa-triangle-exclamation"></i> <span>Contenido Explícito (Explicit Lyrics)</span>
          </div>` 
      : '';

    const extraInfoText = document.getElementById('extraInfoText');
    if (extraInfoText) {
      extraInfoText.innerHTML = `
        <div class="space-y-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
            ${badgeExplicitoPanel}
            <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 animate-pulse font-semibold">
                <i class="fa-solid fa-wave-square w-4 text-center"></i>
                <span>Sonando preview...</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-clock w-4 text-center text-slate-400"></i>
                <span><strong>Duración total:</strong> ${duracionFormateada} mins</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-chart-line w-4 text-center text-slate-400"></i>
                <span><strong>Ranking:</strong> ${Number(ranking).toLocaleString()} pts</span>
            </div>
            <hr class="border-slate-200 dark:border-slate-800 my-2">
            <div class="space-y-2">
                <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Navegación rápida</p>
                <button id="lnk-ver-artista" class="w-full text-left flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-[#1a2333] hover:bg-purple-100 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer font-medium" data-id="${artistaId}">
                    <span><i class="fa-solid fa-user-music mr-2"></i> Ver perfil de ${artista}</span>
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
                <button id="lnk-ver-album" class="w-full text-left flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-[#1a2333] hover:bg-purple-100 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer font-medium" data-id="${albumId}">
                    <span><i class="fa-solid fa-disc mr-2"></i> Ir al álbum: ${albumTitle}</span>
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
            </div>
        </div>
      `;
      document.getElementById('extraArtistInfo').classList.remove('hidden');

      // Listeners de los enlaces rápidos
      $('#lnk-ver-artista').on('click', function() { verDetalleArtista($(this).attr('data-id')); });
      $('#lnk-ver-album').on('click', function() { verDetalleAlbum($(this).attr('data-id')); });

      // Sincronizar el botón del panel
      $('#panelPlayBtn').on('click', function(e) {
          e.stopPropagation();
          alternarReproduccionMaestra();
      });
    }

    if (urlPreview) {
      reproducirCancion(urlPreview, titulo, artista);
    }
  });
  mapearEventosAlbumes();
    mapearEventosCalificacionesCanciones(); // <-- Activamos los clics de votación de las canciones
    aplicarFiltroCalificacionVisual();  
};

// --- SISTEMA COMPLETO DE ÁLBUMES FAVORITOS ---

function obtenerAlbumesFavoritos() {
  const favs = localStorage.getItem('albumes_favoritos');
  return favs ? JSON.parse(favs) : [];
};

function alternarFavoritoAlbum(albumData) {
  let favorites = obtenerAlbumesFavoritos();
  const index = favorites.findIndex(fav => fav.id == albumData.id);
  if (index > -1) {
    favorites.splice(index, 1); 
  } else {
    favorites.push(albumData); 
  }
  localStorage.setItem('albumes_favoritos', JSON.stringify(favorites));
}

function actualizarSidebarFavoritos() {
  const sidebar = document.getElementById('lista-favoritos-sidebar');
  if (!sidebar) return;

  const favoritos = obtenerAlbumesFavoritos();
  if (favoritos.length === 0) {
    sidebar.innerHTML = `<p class="text-[11px] text-slate-400 text-center py-2 italic">Biblioteca vacía</p>`;
    return;
  }

  let html = '';
  favoritos.forEach(album => {
    html += `
      <div class="sidebar-album-item flex items-center gap-3 p-1.5 hover:bg-slate-100 dark:hover:bg-[#1f293d]/40 rounded-md transition-colors duration-200 cursor-pointer" data-album-id="${album.id}">
        <img src="${album.cover}" class="w-9 h-9 object-cover rounded shadow-sm flex-shrink-0" alt="${album.title}">
        <div class="flex-1 min-w-0">
          <h5 class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">${album.title}</h5>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 truncate">Álbum guardado</p>
        </div>
      </div>
    `;
  });
  sidebar.innerHTML = html;

  $('.sidebar-album-item').off('click').on('click', function() {
    verDetalleAlbum($(this).attr('data-album-id'));
  });
}

function verMisAlbumesGuardados() {
    const titulo = document.querySelector('h2.text-xl');
    const contenedor = document.getElementById('contenedor-canciones');
    if (titulo) titulo.textContent = "Mis Álbumes Guardados";
    if (!contenedor) return;

    const favoritos = obtenerAlbumesFavoritos();
    if (favoritos.length === 0) {
        contenedor.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400"><p>No tienes álbumes guardados.</p></div>`;
        return;
    }

    let html = '';
    favoritos.forEach(album => {
        html += `
          <div class="music-card album-item bg-slate-50 dark:bg-[#1a2333] p-4 rounded-md hover:bg-slate-100 dark:hover:bg-[#243147] transition-colors duration-200 group relative cursor-pointer border border-slate-200 dark:border-transparent" data-album-id="${album.id}">
            <div class="relative mb-3 aspect-square w-full">
              <img src="${album.cover}" class="rounded w-full h-full object-cover shadow-md" alt="${album.title}">
              <button class="btn-favorito-corazon absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121826]/90 text-red-500 flex items-center justify-center shadow-md z-10"
                      data-id="${album.id}" data-title="${album.title}" data-cover="${album.cover}">
                <i class="fa-solid fa-heart text-sm"></i>
              </button>
            </div>
            <h3 class="text-sm font-bold truncate mb-1 text-slate-900 dark:text-white">${album.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">Álbum</p>
          </div>
        `;
    });
    contenedor.innerHTML = html;
    mapearEventosAlbumes();
    aplicarFiltroCalificacionVisual();
}

function mapearEventosAlbumes() {
  $('.album-item').off('click').on('click', function(e) {
    if ($(e.target).closest('.btn-favorito-corazon').length > 0) return;
    verDetalleAlbum($(this).attr('data-album-id'));
  });

  $('.btn-favorito-corazon').off('click').on('click', function(e) {
    e.stopPropagation();
    const btn = $(this);
    const albumData = { id: btn.attr('data-id'), title: btn.attr('data-title'), cover: btn.attr('data-cover') };

    alternarFavoritoAlbum(albumData);
    actualizarSidebarFavoritos(); 

    const icono = btn.find('i');
    if (icono.hasClass('fa-regular')) {
      icono.attr('class', 'fa-solid fa-heart text-red-500');
    } else {
      icono.attr('class', 'fa-regular fa-heart text-slate-400 hover:text-red-500');
      if (document.querySelector('h2.text-xl')?.textContent === "Mis Álbumes Guardados") {
          verMisAlbumesGuardados();
      }
    }
  });
}

// REPRDUCCIÓN SIMULADA DE CANCIONES

let miAudioActual = null;       // Guardará el objeto nativo new Audio()
let cancionActualInfo = null;   // Guardará los datos de la canción activa
let estaReproduciendo = false;  // Estado de la reproducción

function reproducirCancion(urlPreview, titulo, artista) {
  if (miAudioActual) {
    miAudioActual.pause();
  }

  miAudioActual = new Audio(urlPreview);
  cancionActualInfo = { urlPreview, titulo, artista };
  
  // Cambiar datos del Footer
  const playerTitle = document.getElementById('playerTitle'); 
  const playerArtist = document.getElementById('playerArtist');
  if (playerTitle) playerTitle.textContent = titulo;
  if (playerArtist) playerArtist.textContent = artista;

  // Capturar nuevos elementos del rango interactivo
  const barraProgreso = document.getElementById('playerProgress');
  const tiempoActualTxt = document.getElementById('tiempoActual'); 
  const tiempoTotalTxt = document.getElementById('tiempoTotal');

  if (tiempoTotalTxt) tiempoTotalTxt.textContent = "0:30"; // Los previews siempre miden 30s

  // Evento de actualización de tiempo de HTML5
  miAudioActual.addEventListener('timeupdate', () => {
    if (!miAudioActual) return;
    
    const actual = miAudioActual.currentTime;
    const total = miAudioActual.duration || 30;
    
    // Mover barra (de 0 a 100 por ciento)
    if (barraProgreso) {
      barraProgreso.value = (actual / total) * 100;
    }

    // Pintar segundos actuales (0:01, 0:15...)
    if (tiempoActualTxt) {
      const secs = Math.floor(actual);
      tiempoActualTxt.textContent = `0:${secs < 10 ? '0' : ''}${secs}`;
    }
  });

  // Permitir arrastrar la bolita de la barra para adelantar o retrasar el sonido
  if (barraProgreso) {
    $(barraProgreso).off('input').on('input', function() {
      if (miAudioActual && miAudioActual.duration) {
        const nuevoTiempo = ($(this).val() / 100) * miAudioActual.duration;
        miAudioActual.currentTime = nuevoTiempo;
      }
    });
  }

  miAudioActual.play()
    .then(() => {
      estaReproduciendo = true;
      actualizarIconoBotonMaestro(true);
    })
    .catch(error => console.error("Error al arrancar el preview de audio:", error));

  // Resetear todo al terminar la canción
  miAudioActual.addEventListener('ended', () => {
    estaReproduciendo = false;
    if (barraProgreso) barraProgreso.value = 0;
    if (tiempoActualTxt) tiempoActualTxt.textContent = "0:00";
    actualizarIconoBotonMaestro(false);
  });
}
function mapearEventosCalificacionesCanciones() {
    $('.estrella-cancion-voto').off('click').on('click', function(e) {
        e.stopPropagation(); 
        
        const estrella = $(this);
        const cancionTitle = estrella.attr('data-cancion-title');
        const nuevaPuntuacion = parseInt(estrella.attr('data-valor'));

        guardarCalificacionCancion(cancionTitle, nuevaPuntuacion);

        const contenedorEstrellas = estrella.parent();
        contenedorEstrellas.find('.estrella-cancion-voto').each(function() {
            const valorEstrella = parseInt($(this).attr('data-valor'));
            if (valorEstrella <= nuevaPuntuacion) {
                $(this).attr('class', 'fa-solid fa-star cursor-pointer estrella-cancion-voto text-amber-400');
            } else {
                $(this).attr('class', 'fa-regular fa-star cursor-pointer estrella-cancion-voto text-slate-300 dark:text-slate-600 hover:text-amber-400');
            }
        });

        // NUEVO: Ejecuta el filtro inmediatamente tras votar para refrescar la vista
        aplicarFiltroCalificacionVisual(); 
    });
}

function alternarReproduccionMaestra() {
  if (!miAudioActual) return;

  if (estaReproduciendo) {
    miAudioActual.pause();
    estaReproduciendo = false;
    actualizarIconoBotonMaestro(false);
  } else {
    miAudioActual.play();
    estaReproduciendo = true;
    actualizarIconoBotonMaestro(true);
  }
}

function actualizarIconoBotonMaestro(reproduciendo) {
  const botonMaestro = document.getElementById('masterPlay');
  const botonPanel = document.getElementById('panelPlayBtn');
  
  if (reproduciendo) {
    if (botonMaestro) botonMaestro.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (botonPanel) botonPanel.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    if (botonMaestro) botonMaestro.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    if (botonPanel) botonPanel.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
  }
};