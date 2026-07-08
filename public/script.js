const videoForm = document.getElementById('videoForm');
const fileInput = document.getElementById('fileInput');
const promptInput = document.getElementById('promptInput');
const resultSection = document.getElementById('result');
const loadingSection = document.getElementById('loading');
const errorSection = document.getElementById('error');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const promptDisplay = document.getElementById('promptDisplay');
const downloadBtn = document.getElementById('downloadBtn');

// Form submission
videoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  const prompt = promptInput.value.trim();

  if (!file || !prompt) {
    showError('Please select a file and enter a prompt');
    return;
  }

  // Validate file size (50MB max)
  if (file.size > 50 * 1024 * 1024) {
    showError('File size must be less than 50MB');
    return;
  }

  await generateVideo(file, prompt);
});

async function generateVideo(file, prompt) {
  try {
    // Hide previous results
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    loadingSection.style.display = 'block';

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    console.log('Sending request to server...');

    // Call API
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'Failed to generate video');
    }

    const data = await response.json();
    console.log('Video generated:', data);

    // Display video
    displayVideo(data.video_url, prompt);
    loadingSection.style.display = 'none';
    resultSection.style.display = 'block';

  } catch (error) {
    console.error('Error:', error);
    loadingSection.style.display = 'none';
    showError(error.message);
  }
}

function displayVideo(videoUrl, prompt) {
  videoSource.src = videoUrl;
  videoPlayer.load();
  promptDisplay.textContent = prompt;
  downloadBtn.href = videoUrl;
  downloadBtn.download = `video_${Date.now()}.mp4`;
}

function showError(message) {
  errorSection.textContent = `❌ ${message}`;
  errorSection.style.display = 'block';
  loadingSection.style.display = 'none';
}

// Check server health on load
window.addEventListener('load', async () => {
  try {
    const response = await fetch('/api/health');
    if (response.ok) {
      console.log('✅ Server is running');
    }
  } catch (error) {
    console.error('Server not responding:', error);
  }
});
