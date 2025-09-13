function loadMovieCards(containerId, limit = 12) {
    const container = document.getElementById(containerId);
    let htmls = '';
    db.collection('movies-data')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const movies = doc.data();
                const movieId = doc.id; // unique Firestore ID
                // const productId = doc.id;
                htmls += `
  <div class="card" onclick="window.location.href='detail.html?id=${movieId}'">
    <div class="card-image">
      <img src="${movies.imageUrl}" alt="idk">
      <div class="card-hover-content">
        <!-- Bookmark Icon (Top Left) -->
        <div class="icon-bookmark2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24">
            <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,
              0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,
              1,0,0,0,19,21V5A3,3,0,0,0,16,2Zm1,17.27-4.5-2.6a1,
              1,0,0,0-1,0L7,19.27V5A1,1,0,0,1,8,4h8a1,1,0,0,1,1,1Z"/>
          </svg>
        </div>

        <!-- Rating Icon (Top Right) -->
        <div class="icon-rating2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22
              9.24l-7.19-.61L12 2 9.19 8.63 2
              9.24l5.46 4.73L5.82 21z"></path>
          </svg>
          <span>8.6</span>
        </div>

        <!-- Play Button (Centered) -->
        <div class="icon-play-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
               fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22C6.47715 22 2 17.5228 2
              12C2 6.47715 6.47715 2 12 2C17.5228 2
              22 6.47715 22 12C22 17.5228 17.5228 22
              12 22ZM12 20C16.4183 20 20 16.4183 20
              12C20 7.58172 16.4183 4 12 4C7.58172 4
              4 7.58172 4 12C4 16.4183 7.58172 20
              12 20ZM10.6219 8.41459L15.5008 11.6672C15.6846
              11.7897 15.7343 12.0381 15.6117
              12.2219C15.5824 12.2658 15.5447 12.3035
              15.5008 12.3328L10.6219 15.5854C10.4381
              15.708 10.1897 15.6583 10.0672
              15.4745C10.0234 15.4088 10 15.3316 10
              15.2526V8.74741C10 8.52649 10.1791
              8.34741 10.4 8.34741C10.479 8.34741
              10.5562 8.37078 10.6219 8.41459Z"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="card-text">
      <h3>${movies.name}</h3>
      <p>${movies.genre} | ${movies.year}</p>
    </div>
  </div>
`;

            });
            container.innerHTML = htmls;
        })
        .catch((error) => {
            console.error("Error fetching products: ", error);
        });
}

// Usage:
loadMovieCards('movie-container', 12);