# Resume Matcher & Question Generator

This project analyzes resumes using NLP (Spacy) and generates interview questions.

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Download Spacy Model**:
    The application will attempt to download the model automatically, but you can also install it manually:
    ```bash
    python -m spacy download en_core_web_sm
    ```

## Running the Application

1.  **Start the Backend Server**:
    Run the Flask application:
    ```bash
    python app.py
    ```
    The server will start at `http://localhost:5000`.

2.  **Launch the Frontend**:
    Open the file `resume.html` in your web browser.
    
    *Note: Ensure the backend is running before using the frontend.*

## Usage

1.  Open `resume.html`.
2.  Click "Start".
3.  Upload a Resume (PDF, DOCX, or TXT).
4.  Click "Generate Questions".
5.  Proceed to the interview simulation.
