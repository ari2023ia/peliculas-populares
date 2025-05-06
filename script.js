const apiKey = '741cee757b4b4235bfd9f7596906168a'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
const seccion_favoritos = document.getElementById('favorites');
let selectedMovieId = null;

let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];
let pagina = 1;
// Fetch and display popular movies

async function fetchPopularMovies(pagina) {
    const url = `${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=${pagina}`;
    try {   
    //  realiza una solicitud para obtener las películas populares
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        // y llama a displayMovies con los resultados
        displayMovies(data.results);
        //console.log(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
    const li = document.createElement('li');
    li.innerHTML = `<div style="max-width:150px; text-align: center;">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <br>
        <span>${movie.title}</span>
        </div>
        `;
    li.onclick = () => showMovieDetails(movie); // Muestra detalles al hacer clic en la película
    movieList.appendChild(li);
});

}

// Show movie details
function showMovieDetails(movieId) {
    movieList.style.removeProperty('display');
    // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
    detailsContainer.innerHTML = ''; //limpia el contenedor
    movieDetails.style.display = 'block';
    let ul = document.createElement('ul');
    detailsContainer.appendChild(ul);
    ul.setAttribute('style', 'list-style: none;');
    // y actualiza el contenedor de detalles con la información de la película
    let liMovie = document.createElement("li");
        liMovie.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movieId.poster_path}" alt="${movieId.title}">
            <br>
            <span><br>${movieId.title}</span><br>
            <br>
        `;
    ul.appendChild(liMovie);
    let liDetails = document.createElement("li");
    liDetails.innerText = movieId.overview;
    ul.appendChild(liDetails);
    let liReleaseDate = document.createElement("li");
    liReleaseDate.innerText = 'Fecha de lanzamiento: ' + movieId.release_date;
    ul.appendChild(liReleaseDate);

    //guarda el titulo por si el usuario lo añade a favoritos
    selectedMovieId = movieId.title;
}
document.getElementById("quitar-detalles").addEventListener('click', () => {
    movieDetails.style.display= 'none';
});
document.getElementById('quitar-lista-fv').addEventListener('click', () => {
    seccion_favoritos.style.display ='none';
});
// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
        // tu codigo aqui: realiza una solicitud para buscar películas
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            const peliculas = data.results;
        // y llama a displayMovies con los resultados de la búsqueda
            displayMovies(peliculas);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        seccion_favoritos.style.display = 'block';
        const favoriteMovie = {      
            id: selectedMovieId,       
            title: selectedMovieId
        };

        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

const borrarListaFav = document.getElementById('borrar-lista');
borrarListaFav.onclick= () => {
    favoritesList.innerHTML = '';
    localStorage.removeItem('favorites');
    favoriteMovies.length = 0;
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(pagina); // Obtiene y muestra las películas populares

displayFavorites(); // Muestra las películas favoritas guardadas


const totalPaginas = 100;
let paginaActual = 1;
let inicio = 1;
const nav = document.getElementById("nav");

function botones_navegacion() {
    nav.innerHTML = '';
    for (let i = inicio; i < inicio + 3 && i <= totalPaginas; i++){
        const boton = document.createElement('a');
        boton.textContent = `${i}`;
        if (i === paginaActual) {
            boton.classList.add('active');
        }

        boton.addEventListener('click', () => {
            if (i !== paginaActual) {
                paginaActual = i;

                if (i === inicio + 2 && inicio + 3 <= totalPaginas) {
                    inicio++;
                }

                if (i === inicio && inicio > 1) {
                    inicio--;
                }

                botones_navegacion();
                cambiar_contenido(i);
            }
        });
        nav.appendChild(boton);
    }
}

function cambiar_contenido(pagina) {
    fetchPopularMovies(pagina);
}

botones_navegacion();
