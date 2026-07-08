const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Replicate = require('replicate');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs allowed.'));
    }
  }
});

// Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Generate video from image/PDF
app.post('/api/generate-video', upload.single('file'), async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    console.log(`Processing file: ${req.file.originalname}`);
    console.log(`Prompt: ${prompt}`);

    // Convert file to base64 for Replicate API
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

    console.log('Calling Replicate API with Mochi 1...');

    // Call Replicate with Mochi 1 model
    const output = await replicate.run(
      "genmo/mochi-1:7d126b99a368a91f4ee3c54d5a69e0a2922bfbde6e6b91a95c09fb0e1d29d999",
      {
        input: {
          prompt: prompt,
          image: imageDataUrl,
          duration: 5,
          num_frames: 120,
          height: 480,
          width: 640
        }
      }
    );

    console.log('Video generated successfully');
    res.json({
      success: true,
      video_url: output[0] || output,
      prompt: prompt,
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Error generating video:', error.message);
    res.status(500).json({
      error: 'Failed to generate video',
      details: error.message
    });
  }
});

// Get generation status (if needed)
app.get('/api/models', async (req, res) => {
  try {
    const models = [
      {
        name: 'Mochi 1',
        id: 'genmo/mochi-1:7d126b99a368a91f4ee3c54d5a69e0a2922bfbde6e6b91a95c09fb0e1d29d999',
        description: 'High-quality image-to-video generation',
        inputTypes: ['image', 'text'],
        speed: 'Medium'
      },
      {
        name: 'LTXVideo',
        id: 'lightricks/ltxvideo:a9a5f98b3c18ae0cbc1a48e1c2654eb0e2fa1b5e5b8bc8c5c8d8e8f8f8f8f8f8',
        description: 'Fast multi-modal video generation',
        inputTypes: ['image', 'text', 'video'],
        speed: 'Fast'
      }
    ];
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎬 AI Video Generator Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`\n⚙️  Setup Instructions:`);
  console.log(`1. Set REPLICATE_API_TOKEN in .env file`);
  console.log(`2. Get token from: https://replicate.com/account/api-tokens`);
  console.log(`3. Upload image/PDF and prompt to generate videos\n`);
});

module.exports = app;
