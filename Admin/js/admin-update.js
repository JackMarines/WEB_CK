let productForm = document.querySelector("#product-form");

// ============ Switch to Edit Mode ============
function enterEditMode(movie) {
  document.getElementById("form-mode-title").textContent = "Edit Item";
  const dashboardTitle = document.getElementById("dashboard-item-title");
  if (dashboardTitle) dashboardTitle.textContent = "Edit Item";
  const sidebarAddItemLink = document.getElementById("sidebar-add-item-link");
  if (sidebarAddItemLink) sidebarAddItemLink.textContent = "Edit item";

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
  $('#country').val(movie.country).trigger('change');
  $('#genre').val(movie.genre).trigger('change');
}

// ============ Switch to Add Mode ============
function exitEditMode() {
  document.getElementById("form-mode-title").textContent = "Add Item";
  const dashboardTitle = document.getElementById("dashboard-item-title");
  if (dashboardTitle) dashboardTitle.textContent = "Add Item";
  const sidebarAddItemLink = document.getElementById("sidebar-add-item-link");
  if (sidebarAddItemLink) sidebarAddItemLink.textContent = "Add item";
  localStorage.removeItem("editingProductId");
  productForm.reset();
  $('#country').val([]).trigger('change');
  $('#genre').val([]).trigger('change');
  // Optionally hide image preview
  const preview = document.getElementById("image-preview");
  if (preview) preview.style.display = "none";
}

// ============ Load Form Data if Editing ============
document.addEventListener("DOMContentLoaded", async function() {
  const editingProductId = localStorage.getItem("editingProductId");
  if (editingProductId) {
    try {
      const doc = await db.collection("movies-data").doc(editingProductId).get();
      if (doc.exists) {
        enterEditMode(doc.data());
      }
    } catch (err) {
      console.error("Error loading movie data:", err);
    }
  } else {
    exitEditMode();
  }
});

// ============ Listen for navigation clicks to exit edit mode ============
document.querySelectorAll('.sidebar__nav-link, .dashboard__nav-link').forEach(link => {
  link.addEventListener('click', exitEditMode);
});

// ============ Handle Edit Button Clicks in Dashboard ============
document.querySelectorAll(".main__table-btn--edit").forEach(btn => {
  btn.addEventListener("click", async () => {
    const movieId = btn.getAttribute("data-id");
    localStorage.setItem("editingProductId", movieId);
    window.location.href = "add-item.html"; // Go to form
  });
});

// ============ Handle Form Submit ============
productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect form values
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
  const itemType = document.querySelector('input[name="type"]:checked')?.value || "";

  // Upload file if new one selected
  let imageUrl = "";
  // 1. Upload to local server
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    const localUrl = result.data.secure_url || result.data.url; // adjust to your server's response

    // 2. Upload to Firebase Storage
    const responseBlob = await fetch(localUrl);
    const blob = await responseBlob.blob();

    const storageRef = firebase.storage().ref("movie-images/" + file.name);
    await storageRef.put(blob);
    imageUrl = await storageRef.getDownloadURL();
  }

  // Data object
  const productData = {
    name: title,
    description: description,
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
  };

  try {
    const editingProductId = localStorage.getItem("editingProductId");
    if (editingProductId) {
      // 🔹 Update existing
      if (!imageUrl) {
        // keep old image if not replaced
        delete productData.imageUrl;
      }
      await db.collection("movies-data").doc(editingProductId).update(productData);
      alert("🎬 Movie updated successfully!");
      exitEditMode();
      window.location.href = "index.html";
    } else {
      // 🔹 Add new
      await db.collection("movies-data").add(productData);
      alert("✅ Movie added successfully!");
      productForm.reset();
      exitEditMode();
    }
  } catch (err) {
    console.error("Error saving movie:", err);
    alert("❌ Failed to save movie!");
  }
});

