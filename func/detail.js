const searchQuery = new URLSearchParams(location.search)

const id = searchQuery.get("id")
const type = searchQuery.get("type")

console.log("id: ",id)
console.log("type: ", typeof type)

fetch("./movie.json")
.then(response => response.json())
.then(data => {
  const moviesOfType = data[type]; // or data[type] if your JSON keys are the types
  if (!moviesOfType) {
    console.error(`No movies found for type "${type}"`);
    return;
  }

  // Find the movie with matching id inside this type array
  const movie = moviesOfType.find(m => String(m.id) === id);

  if (movie) {
    loadData(movie);
  } else {
    console.error("Movie not found");
  }
});


function loadData(data) {
    console.log(data)
    let main = document.getElementById("trailer-container")

    const hero = document.querySelector(".hero")
    console.log(hero)
    hero.style.background = "url('Img/details.jpg') center/cover, linear-gradient(180deg, rgba(19,23,32,0.5) 0%, #131720 100%)";
    
    main.innerHTML += `
    <div class="play-container">
        <button class="play-button">
            <!-- Play SVG icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM10.6219 8.41459L15.5008 11.6672C15.6846 11.7897 15.7343 12.0381 15.6117 12.2219C15.5824 12.2658 15.5447 12.3035 15.5008 12.3328L10.6219 15.5854C10.4381 15.708 10.1897 15.6583 10.0672 15.4745C10.0234 15.4088 10 15.3316 10 15.2526V8.74741C10 8.52649 10.1791 8.34741 10.4 8.34741C10.479 8.34741 10.5562 8.37078 10.6219 8.41459Z"></path>
            </svg>
        </button>
        <span class="trailer-text">Trailer</span>
    </div>
    <h1>${data.title}</h1>
    <div class="blurred-line"></div>
    <div class="movie-details">
        <div class="detail">
            <!-- Star Icon (Rating) -->
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path fill="#1e90ff" d="M8 12l-3.5 2.1 1-4.4L1 6.9l4.4-.4L8 2l2.6 4.5 4.4.4-3.5 3.8 1 4.4L8 12z"/>
            </svg>
            <span class="rating">${data.rating || "8.3"}</span>
        </div>
        <div class="detail">
            <!-- Dot Icon for Release Date -->
            <svg width="1" height="1" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="1" fill="#1e90ff"/>
            </svg>
            <span class="release-date">${data.year || "2001"}</span>
        </div>
        <div class="detail">
            <!-- Dot Icon for Duration -->
            <svg width="1" height="1" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="1" fill="#1e90ff"/>
            </svg>
            <span class="duration">${data.duration || "106 min"}</span>
        </div>
        <div class="detail">
            <!-- Dot Icon for Age Limit -->
            <svg width="1" height="1" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="4" r="1" fill="#1e90ff"/>
            </svg>
            <span class="age-limit">${data.age || "PG-13"}</span>
        </div>
    </div>
  `;
}






