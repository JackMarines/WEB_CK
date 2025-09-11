const productForm = document.querySelector("#product-form");

const editingProductId = localStorage.getItem("editingProductId");

if (productForm) {
  productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("movie_title").value.trim();
    const description = document.getElementById("movie_description").value.trim();
    const file = document.getElementById("form__img-upload").files[0];
    const year = document.getElementById("movie_year").value.trim();
    const runtime = document.getElementById("movie_runtime").value.trim();
    const quality = document.getElementById("quality").value;
    const age = document.getElementById("movie_age").value.trim();
    const country = Array.from(document.getElementById("country").selectedOptions).map(opt => opt.value);
    const genre = Array.from(document.getElementById("genre").selectedOptions).map(opt => opt.value);
    const youtubeLink = document.getElementById("youtube_link").value.trim();
    const itemType = document.querySelector('input[name="type"]:checked').value;

    try {
      let imageUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        imageUrl = result.data.secure_url;
      }

      await db.collection("movies-data").add({
        name: title,
        price: description,
        imageUrl: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        youtubeLink: youtubeLink,
        year: year,
        runtime: runtime,
        quality: quality,
        age: age,
        country: country,
        genre: genre,
        type: itemType
      });

      console.log("Product added successfully!");
      await loadMovies();

    } catch (error) {
      console.error("Error adding product:", error);
    }
  });
}


// ============ Load Form Data if Editing ============
document.addEventListener("DOMContentLoaded", async function() {
  const editingProductId = localStorage.getItem("editingProductId");

  if (editingProductId) {
    try {
      const doc = await db.collection("movies-data").doc(editingProductId).get();
      if (doc.exists) {
        const movie = doc.data();
        console.log("Editing movie:", movie);

        // Populate simple fields
        document.getElementById("movie_title").value = movie.name || "";
        document.getElementById("movie_description").value = movie.description || "";
        document.getElementById("movie_year").value = movie.year || "";
        document.getElementById("movie_runtime").value = movie.runtime || "";
        document.getElementById("quality").value = movie.quality || "";
        document.getElementById("movie_age").value = movie.age || "";
        document.getElementById("youtube_link").value = movie.youtubeLink || "";

        // Country multi-select
        if (Array.isArray(movie.country)) {
          [...document.getElementById("country").options].forEach(opt => {
            opt.selected = movie.country.includes(opt.value);
          });
        }


        // Genre multi-select
        if (Array.isArray(movie.genre)) {
          [...document.getElementById("genre").options].forEach(opt => {
            opt.selected = movie.genre.includes(opt.value);
          });
        }

        // Radio for type
        if (movie.type) {
          const radio = document.querySelector(`input[name="type"][value="${movie.type}"]`);
          if (radio) radio.checked = true;
        }

        // Image preview (not input file)
        if (movie.imageUrl) {
          const preview = document.getElementById("image-preview");
          if (preview) {
            preview.src = movie.imageUrl;
            preview.style.display = "block";
          }
        }
      }
    } catch (err) {
      console.error("Error loading movie data:", err);
    }
  }
});


