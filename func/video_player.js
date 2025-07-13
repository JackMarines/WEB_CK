const playButton = document.getElementById('playButton');
const videoWrapper = document.getElementById('videoWrapper');
const youtubeFrame = document.getElementById('youtubeFrame');
const videoContainer = document.getElementById('videoContainer');

playButton.addEventListener('click', () => {
  // Hide the wrapper (thumbnail + play button)
  videoWrapper.style.display = 'none';

  // Show the container for the video
  youtubeFrame.style.display = 'block';

  // Dynamically create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = "https://www.youtube.com/embed/VuL9ZnHDVdc?autoplay=1";
  iframe.title = "YouTube video player";
  iframe.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "100%";

  // Insert iframe into the video container
  videoContainer.appendChild(iframe);
});
