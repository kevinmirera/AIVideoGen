# AI Video Generator with Replicate

Generate stunning AI videos from images and PDFs using the Mochi 1 model on Replicate.

## Features

✨ **Image to Video** - Convert static images into animated videos
✨ **PDF Support** - Upload PDF slides and convert them to videos
✨ **Custom Prompts** - Guide the video generation with natural language descriptions
✨ **Cloud-Based** - No GPU required on your machine
✨ **Web Interface** - Beautiful, responsive UI for easy use

## Setup

### Prerequisites

- Node.js 14+ and npm
- Replicate API token (free account at https://replicate.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevinmirera/AIVideoGen.git
   cd AIVideoGen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your Replicate API Token**
   - Go to https://replicate.com/account/api-tokens
   - Copy your API token

4. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your token:
   ```
   REPLICATE_API_TOKEN=your_token_here
   PORT=3000
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage

1. Upload an image (JPG, PNG, WebP) or PDF file
2. Enter a prompt describing the video you want to create
3. Click "Generate Video"
4. Wait 1-2 minutes for the video to be generated
5. Download or share your video!

### Example Prompts

- "Animate this image with smooth, flowing motion"
- "Add dynamic camera movement and zoom effects"
- "Create a cinematic video with slow pans and transitions"
- "Make this landscape come alive with moving clouds and wind"

## API Endpoints

### Generate Video
**POST** `/api/generate-video`

Request:
```json
{
  "file": "<image_or_pdf>",
  "prompt": "Describe the video you want"
}
```

Response:
```json
{
  "success": true,
  "video_url": "https://...",
  "prompt": "Your prompt",
  "filename": "image.jpg"
}
```

### Health Check
**GET** `/api/health`

### Available Models
**GET** `/api/models`

## Costs

- Mochi 1: ~$0.01-0.05 per video
- You only pay for what you generate
- Free trial credits available on Replicate

## Troubleshooting

### "Error: No API token provided"
- Make sure `.env` file exists and has `REPLICATE_API_TOKEN` set
- Restart the server after updating `.env`

### "Video generation failed"
- Check that your Replicate API token is valid
- Verify file is a valid image or PDF
- Try with a simpler prompt

### Video takes a long time
- First generation may take 1-2 minutes
- Subsequent requests are usually faster
- Check your internet connection

## Project Structure

```
AIVideoGen/
├── server.js              # Express backend
├── package.json          # Dependencies
├── .env.example          # Environment template
└── public/
    ├── index.html        # Main UI
    ├── styles.css        # Styling
    └── script.js         # Frontend logic
```

## Models Available

- **Mochi 1** (default) - High-quality, best for detailed animations
- **LTXVideo** - Fast generation, great for quick prototypes

## Next Steps

- [ ] Add PDF-to-images preprocessing
- [ ] Support multiple image formats
- [ ] Add video history/gallery
- [ ] Batch video generation
- [ ] Custom model selection
- [ ] Video editing features

## License

MIT

## Support

- Replicate Docs: https://replicate.com/docs
- Issues: GitHub Issues
- Email: support@replicate.com
