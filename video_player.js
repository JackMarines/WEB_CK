  const playButton = document.getElementById('playButton');
  const videoWrapper = document.getElementById('videoWrapper');
  const youtubeFrame = document.getElementById('youtubeFrame');

  playButton.addEventListener('click', () => {
    videoWrapper.style.display = 'none';      // Hide the image + play button
    youtubeFrame.style.display = 'block';     // Show and autoplay the YouTube video
  });
