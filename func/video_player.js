document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    console.error("No movie ID found in URL");
    return;
  }

  try {
    // Get the movie document from Firestore
    const docSnap = await db.collection("movies-data").doc(movieId).get();
    if (!docSnap.exists) {
      console.error("Movie not found in Firestore");
      return;
    }

    const movie = docSnap.data();

    // Elements
    const playButton = document.getElementById("playButton");
    const videoWrapper = document.getElementById("videoWrapper");
    const youtubeFrame = document.getElementById("youtubeFrame");
    const videoContainer = document.getElementById("videoContainer");

    if (playButton && movie.youtubeLink) {
      playButton.addEventListener("click", () => {
        // Hide thumbnail wrapper
        videoWrapper.style.display = "none";

        // Show video container
        youtubeFrame.style.display = "block";

        // Create iframe with the link from Firestore
        const iframe = document.createElement("iframe");
        iframe.src = movie.youtubeLink.replace("watch?v=", "embed/") + "?autoplay=1";
        iframe.title = "YouTube video player";
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.style.width = "95%";
        iframe.style.height = "95%";

        videoContainer.appendChild(iframe);
      });
    }
  } catch (err) {
    console.error("Error fetching movie data:", err);
  }
});
