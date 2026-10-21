# NekkoReader + AutoComix Integration Guide

## Overview

NekkoReader now integrates with the [AutoComix](https://github.com/SorbP/AutoComix) engine for advanced panel detection using machine learning (YOLO + ONNX Runtime).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NekkoReader (React)                   │
│  - Modern UI with Tailwind CSS                          │
│  - File extraction (CBZ, CBR, PDF)                     │
│  - Reading controls & navigation                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AutoComix Backend (Python/Flask)            │
│  - Panel detection with YOLO + ONNX Runtime            │
│  - GPU acceleration (DirectML on Windows)              │
│  - Auto-rotation logic                                  │
│  - Fallback to OpenCV if AutoComix not available       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AutoComix Engine (Optional)                 │
│  - Full ML pipeline                                     │
│  - Panel detection model (panels_int8.onnx)            │
│  - Advanced geometry analysis                           │
└─────────────────────────────────────────────────────────┘
```

## Installation

### 1. Install NekkoReader (already done)

```bash
npm install
```

### 2. Install AutoComix Backend

```bash
cd autocomix-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. (Optional) Install Full AutoComix

For full ML-powered panel detection:

1. Clone AutoComix:
```bash
git clone https://github.com/SorbP/AutoComix.git
cd AutoComix
```

2. Install AutoComix dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variable:
```bash
# Windows
set AUTOCOMIX_PATH=C:\path\to\AutoComix

# Linux/Mac
export AUTOCOMIX_PATH=/path/to/AutoComix
```

## Running

### Quick Start (with backend)

```bash
START-AUTOCOMIX.cmd
```

This will:
1. Start the AutoComix backend server (Python/Flask)
2. Build the React app
3. Launch NekkoReader with Electron

### Manual Start

**Terminal 1 - Backend:**
```bash
cd autocomix-backend
START-SERVER.cmd
```

**Terminal 2 - NekkoReader:**
```bash
TESTE-NPM.cmd
```

## Features

### Panel Detection

The backend detects panels in comic pages using:

1. **Full AutoComix** (if installed): YOLO model + ONNX Runtime
   - GPU acceleration on Windows (DirectML)
   - High accuracy panel detection
   - Confidence scores

2. **Fallback** (OpenCV only): Edge detection + contour analysis
   - Basic panel detection
   - No ML required
   - Works without AutoComix installation

### Auto-Rotation

Automatically determines if a panel should be rotated to better fit the screen:

- Calculates aspect ratio improvement
- Configurable threshold (default: 1.3x)
- Works with both portrait and landscape screens

### GPU Acceleration

On Windows with compatible GPUs:
- NVIDIA (DirectML)
- AMD (DirectML)
- Intel (DirectML)

Automatic fallback to CPU if:
- No compatible GPU
- GPU initialization fails
- GPU is slower than CPU

## API Endpoints

### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "autocomix_available": true,
  "version": "1.0.0"
}
```

### Detect Panels
```http
POST /detect-panels

Request:
{
  "image_base64": "...",
  "use_gpu": true,
  "confidence_threshold": 0.5
}

Response:
{
  "panels": [
    {
      "x": 10,
      "y": 20,
      "width": 100,
      "height": 150,
      "confidence": 0.95
    }
  ],
  "processing_time": 0.5,
  "image_size": {"width": 800, "height": 1200}
}
```

### Auto-Rotate Check
```http
POST /auto-rotate

Request:
{
  "panel": {"x": 10, "y": 20, "width": 100, "height": 150},
  "screen_aspect_ratio": 1.78,
  "threshold": 1.3
}

Response:
{
  "should_rotate": true,
  "rotation_angle": 90,
  "improvement_factor": 1.5
}
```

### Process Book
```http
POST /process-book

Request:
{
  "file_path": "/path/to/comic.cbz",
  "use_gpu": true
}

Response:
{
  "pages": [
    {
      "page_number": 1,
      "panels": [...],
      "image_base64": "..."
    }
  ],
  "total_pages": 24
}
```

## Configuration

### Environment Variables

```bash
# Path to AutoComix installation (optional)
AUTOCOMIX_PATH=C:\AutoComix

# Backend server port (default: 5000)
AUTOCOMIX_PORT=5000

# Enable debug mode
FLASK_DEBUG=1
```

### NekkoReader Settings

In the AutoComix tab (⚙ Options → AutoComix):

- **Panel Detection**: Enable/disable panel detection
- **Panel Zoom on Double-Click**: Zoom to panel on double-click
- **Auto-Rotate Panels**: Automatically rotate panels
- **Rotation Direction**: Clockwise or counterclockwise
- **Rotation Threshold**: How much larger panel must get (1.1x - 2.0x)
- **GPU Acceleration**: Use GPU if available

## Troubleshooting

### Backend Not Starting

**Error**: "Python not found"
- Install Python 3.10+ from https://python.org
- Make sure Python is in PATH

**Error**: "ModuleNotFoundError: No module named 'flask'"
- Activate virtual environment: `venv\Scripts\activate`
- Install dependencies: `pip install -r requirements.txt`

### Panel Detection Not Working

**Indicator shows "Fallback"**:
- AutoComix is not installed or not found
- Set `AUTOCOMIX_PATH` environment variable
- Or use OpenCV fallback (basic detection)

**No panels detected**:
- Check confidence threshold (lower it)
- Verify image format is supported
- Check backend logs for errors

### GPU Not Being Used

**On Windows**:
- Install DirectML: `pip install onnxruntime-directml`
- Check GPU supports DirectX 12
- Verify GPU drivers are up to date

**Automatic fallback**:
- Backend automatically falls back to CPU if GPU fails
- Check logs for GPU initialization errors

## Performance

### Panel Detection Speed

| Configuration | Speed (per page) |
|--------------|------------------|
| AutoComix + GPU (RTX 3090) | ~0.09s |
| AutoComix + CPU | ~1.0s |
| OpenCV fallback | ~0.5s |

### Memory Usage

- Backend server: ~200MB
- With AutoComix model: ~500MB
- GPU memory: ~1GB (when using GPU)

## Development

### Backend Development

```bash
cd autocomix-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python server.py
```

Backend runs on http://localhost:5000 with hot reload.

### Frontend Development

```bash
npm run dev
```

React dev server runs on http://localhost:3000.

### Testing API

```bash
# Health check
curl http://localhost:5000/health

# Test panel detection
curl -X POST http://localhost:5000/detect-panels \
  -H "Content-Type: application/json" \
  -d '{"image_base64": "...", "use_gpu": true}'
```

## License

- NekkoReader: MIT License
- AutoComix: AGPL-3.0 License
- Backend integration: MIT License

## Credits

- [AutoComix](https://github.com/SorbP/AutoComix) by SorbP
- Panel detection model: `mosesb/best-comic-panel-detection` (fine-tuned)
- NekkoReader UI: Original design

## Support

For issues related to:
- **NekkoReader UI**: Check this repository's issues
- **AutoComix engine**: Check [AutoComix repository](https://github.com/SorbP/AutoComix)
- **Integration**: Check backend logs and API responses
