# ApplyTrack

ApplyTrack is a Chrome extension-based job application tracker that helps you extract key details from job application pages and save them in a structured way for later review.

## What it does

The project combines:
- a Chrome extension UI for collecting application details
- a FastAPI backend that sends page content to an AI model
- a local SQLite database for storing extracted application records

It currently extracts:
- Company name
- Role
- Resume name

## Features

- Extracts application data from the current page content
- Sends extracted fields to a backend service for AI processing
- Stores results in a local SQLite database
- Provides a simple side panel interface inside Chrome

## Project structure

- extension/ - Chrome extension files
  - manifest.json
  - sidePanel.html
  - scripts/ - background and UI logic
- server/ - FastAPI backend
  - app.py - API endpoints and AI integration
  - services/ - email-related service modules
- dashboard/ - frontend assets for the application dashboard

## Prerequisites

- Python 3.10+
- Node.js and npm
- Google Chrome
- A Google Gemini API key

## Setup

1. Install frontend dependencies

```bash
npm install
```

2. Install Python dependencies

```bash
pip install fastapi uvicorn python-dotenv langchain langchain-google-genai google-generativeai
```

If you also plan to use the Gmail integration service, install:

```bash
pip install google-auth google-auth-oauthlib google-api-python-client
```

3. Create a environment variable for the AI model

On Windows PowerShell:

```powershell
$env:GOOGLE_API_KEY="your_google_gemini_api_key"
```

Or create a .env file in the server folder with:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

## Run the application

1. Start the backend server

```bash
cd server
uvicorn app:app --reload
```

The server will run on http://127.0.0.1:8000.

2. Build the extension styles (optional if you already have the generated CSS)

```bash
cd ..
npm run build
```

3. Load the extension in Chrome

- Open Chrome and go to chrome://extensions/
- Enable Developer mode
- Click Load unpacked
- Select the extension folder inside this project

## Usage

1. Open a job application page in your browser.
2. Open the ApplyTrack extension from the Chrome toolbar.
3. Click Run to extract the visible page content.
4. Review the extracted company, role, and resume fields.
5. Click Save Application to store the entry in the local database.

## Data storage

Application records are stored in a local SQLite database file named applications.db inside the server directory.

## Notes

- The backend currently uses the local FastAPI server for processing.
- If the extension cannot connect to the server, make sure the backend is running and that the app is accessible at http://127.0.0.1:8000.
- The Gmail-related service files are present for future or optional integration and may require additional Google Cloud setup.

## Future improvements

Possible enhancements include:
- a full dashboard UI for browsing saved applications
- search and filtering support
- export to CSV or JSON
- better resume-name extraction and validation

