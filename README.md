# ELOY Awards Nominator

A web application for automating ELOY Awards nominations with proper token handling and submission tracking.

## Features

- React frontend with clean, modern UI
- Flask API backend with web scraping
- SQLite database for submission tracking
- Proper token and referer handling
- Unique submission validation
- Real Facebook click ID generation
- Actual ELOY website integration

## Quick Start

```bash
# Option 1: Use the startup script (auto-detects virtual env)
./start.sh

# Option 2: Manual setup with virtual environment
./.venv/bin/pip install -r requirements.txt
npm install
./.venv/bin/python app.py &
npm start

# Option 3: Just run backend
./run_backend.sh
```

## Usage

1. Run `./start.sh` or start both servers manually
2. Navigate to http://localhost:3000
3. Fill out the nomination form
4. View submissions in the submissions tab
5. Test with `python test_submission.py`

## Technical Details

- Scrapes actual ELOY website for valid tokens and categories
- Generates realistic Facebook click IDs matching original URL pattern
- Submits to actual ELOY WordPress admin-ajax.php endpoint
- Includes all required form fields: token, timestamps, page_url, etc.
- Stores all submissions with unique tokens in SQLite database
- Clean React frontend with responsive design

## Files Structure

```
eloy-Award/
├── app.py              # Flask API backend
├── requirements.txt    # Python dependencies
├── package.json       # React dependencies
├── start.sh           # Startup script
├── test_submission.py # Test script
├── src/
│   ├── App.js         # Main React component
│   ├── App.css        # Styles
│   └── components/
│       ├── NominationForm.js
│       └── SubmissionsList.js
└── public/
    └── index.html
```