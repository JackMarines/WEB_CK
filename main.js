// Hàm tải dữ liệu phim
async function fetchAndLoadMovies() {
  try {
    const res = await fetch("./movie.json");
    const data = await res.json();
    const allMovies = Object.values(data).flat();

    // Limit for carousel
    const carouselLimit = 5;
    const limitedMovies = allMovies.slice(0, carouselLimit);
    loadCarousel(limitedMovies);

    // Limit for container
    const containerLimit = 20;
    const limitedMovies2 = allMovies.slice(0, containerLimit);
    loadMovieContainer(limitedMovies2);
  } catch (error) {
    console.error("Error loading movie data:", error);
  }
}

// Load movies into the carousel
function loadCarousel(data) {
  const container = document.getElementById("movie-carousel");
  const html = data
    .map((item) => {
      const imageSrc = item.carouselImage || "default-carousel.jpg";
      return `
      <div class="item" data-id="${item.id}">
        <div class="carousel-card" data-id="${item.id}">
         <a href="detail.html?type=${item.category}&id=${item.id}">
            <img src="${imageSrc}" alt="${item.title}" />
          </a>
          <div class="overlay">
            <div class="icon bookmark">
              <!-- Bookmark SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Z"></path>
              </svg>
            </div>
            <div class="icon rating">
              <!-- Rating Star -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
              </svg>
              <span class="rating-number">${item.rating || "-"}</span>
            </div>
            <div class="card_data">
              <h3>${item.title}</h3>
              <span>${item.price || "Free"} | ${item.category || "Unknown"} | ${
        item.year || "N/A"
      }</span>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = html;

  document.querySelectorAll(".item").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      // load trang chi tiết
      window.location.href = `detail.html?id=${id}`;
    });
  });

  // Initialize OwlCarousel if element exists
  const $carousel = $("#movie-carousel");
  if ($carousel.length) {
    if ($carousel.hasClass("owl-loaded")) {
      $carousel.trigger("destroy.owl.carousel");
      $carousel.find(".owl-stage-outer").children().unwrap();
      $carousel.removeClass("owl-center owl-loaded owl-text-select-on");
    }

    $carousel.owlCarousel({
      center: true,
      autoWidth: false,
      responsiveClass: true,
      stagePadding: 0,
      smartSpeed: 600,
      items: 2,
      loop: true,
      margin: 10,
      nav: false,
      dots: true,
      dotsEach: 1,
      responsive: {
        600: {
          items: 4,
        },
      },
      onInitialized: function () {
        document
          .querySelectorAll("#movie-carousel .item img")
          .forEach((img) => {
            img.style.setProperty("border-radius", "50px", "important");
          });
      },
    });
  }
}

// Load movies into the normal container
function loadMovieContainer(data) {
  const container = document.getElementById("movie-container");
  const html = data
    .map((item) => {
      const imageSrc = item.image || "default.jpg";
      return `
<a href="detail.html?type=${item.category}&id=${
        item.id
      }" class="card-link" data-id="${item.id}">
        <div class="card">
          <div class="card-image">
            <img src="${imageSrc}" alt="${item.title}" />
            <div class="card-hover-content">
              <div class="icon-bookmark2">
                <!-- Bookmark SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M16,2H8A3,3,0,0,0,5,5V21a1,1,0,0,0,.5.87,1,1,0,0,0,1,0L12,18.69l5.5,3.18A1,1,0,0,0,18,22a1,1,0,0,0,.5-.13A1,1,0,0,0,19,21V5A3,3,0,0,0,16,2Z"></path>
                </svg>
              </div>
              <div class="icon-rating2">
                <!-- Rating Star SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                </svg>
                <span>${item.rating || "-"}</span>
              </div>
              <div class="icon-play-button">
                <!-- Play Button -->
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.522 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm-1.378-13.586 4.879 3.253a.5.5 0 0 1 0 .847l-4.879 3.253A.5.5 0 0 1 10 15.253V8.747a.5.5 0 0 1 .622-.333Z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="card-text">
            <h3>${item.title}</h3>
            <p>${item.price || "Free"} | ${item.category || "Unknown"} | ${
        item.year || "N/A"
      }</p>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = html;
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      // load trang chi tiết
      window.location.href = `detail.html?id=${id}`;
    });
  });
}

// Gọi hàm chính sau khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", fetchAndLoadMovies);
