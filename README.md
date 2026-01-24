# JUDULNYA Frontend MVP

Frontend application for the YouTube Winning Pattern Detector. Built with Next.js 14+, Tailwind CSS, and TypeScript.

## Features
- **Keyword Analysis**: Submit keywords to analyze top YouTube results.
- **Real-time Status**: Polls backend for job status with progress feedback.
- **Winning Patterns**: Displays AI-generated title templates with examples.
- **Video Insights**: Shows Top Search Results, People Also Watched, and Fallbacks.
- **Export Tools**: Copy templates to clipboard, export full results to CSV.

## Prerequisites
- Node.js 18+
- Docker (optional)

## Environment Variables
Create a `.env.local` file for local development or set these in your deployment environment.

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API (e.g. `https://api.example.com`) | `""` (Same Origin) |

## Local Development (Dev Mode)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Docker Deployment

### Build and Run Locally
1. Build the image:
   ```bash
   docker build -t judulnya-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=https://your-backend.com judulnya-frontend
   ```

### Deploying on EasyPanel

1. **Create App**: Create a new "App" in EasyPanel.
2. **Source**: Select "Git" and point to this repository.
3. **Build Method**: Select "Docker" (It will automatically detect the `Dockerfile`).
4. **Environment Variables**:
   - Go to the "Environment" tab.
   - Add `NEXT_PUBLIC_API_BASE_URL` with your backend URL.
   - **Important**: Since `NEXT_PUBLIC_` variables are baked in at build time, you must ensure this variable is set during the BUILD phase in EasyPanel if possible, or build the image with the variable present. 
   - *Note*: For Next.js Output Standalone, runtime runtime variables are often not supported for `NEXT_PUBLIC_` unless you use a runtime config solution. For this MVP, ensure the build arg or environment is present when the image is built. EasyPanel usually builds the image with the provided env vars.
   
   If your backend is on the same EasyPanel network, you might need the internal URL, but since this is a client-side app, you MUST use the **Public URL** of the backend (e.g., `https://api.judulnya.com`). The browser needs to reach it.

5. **Deploy**: Click "Deploy".

## CORS Note
Since this is a client-side Single Page Application (SPA), requests are made directly from the user's browser to the Backend API.
- If Frontend and Backend are on different domains (e.g., `frontend.com` and `api.backend.com`), the Backend **MUST** be configured to allow CORS (Cross-Origin Resource Sharing) from the Frontend origin.
- Ensure your FastAPI backend includes the frontend domain in `allow_origins`.

## Usage
1. Enter a keyword (e.g., "cara diet sehat").
2. Toggle "Force Refresh" if you want fresh data instead of cached.
3. Click "Analyze Keyword".
4. Wait for the process to complete (usually 10-30 seconds).
5. Review generated templates and video data.
6. Use the "Copy" buttons to save templates or "Export CSV" for raw data.
