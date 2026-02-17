# Resume IQ - AI-Powered Interview Practice System

Complete end-to-end resume analysis and interview preparation system powered by Google Gemini AI.

## 🎯 Features

- **Smart Resume Analysis**: Upload PDF/DOCX/TXT resumes for automatic skill extraction
- **AI-Powered Question Generation**: Gemini AI generates personalized technical and behavioral interview questions
- **Categorized Questions**: Questions automatically separated into Technical and HR/Behavioral categories
- **Voice-Based Interview**: Practice answering questions with voice recording
- **AI Evaluation**: Get intelligent feedback on your answers using Gemini AI
- **Comprehensive Dashboard**: See skills analyzed, experience highlights, and question breakdown

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

## 🚀 Quick Start

### 1. Backend Setup (Flask)

```bash
# Navigate to project root
cd "d:/resume project ml"

# Install Python dependencies
pip install -r requirements.txt

# Download Spacy NLP model
python -m spacy download en_core_web_sm

# Configure API key (already done, but verify)
# Edit .env file and ensure GEMINI_API_KEY is set

# Start backend server
python app.py
```

**Backend runs on:** `http://localhost:5000`

### 2. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd "d:/resume project ml/resume-iq"

# Install Node dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

## 📖 Usage

1. **Open your browser** to `http://localhost:5173`

2. **Upload Resume**:
   - Click "Get Started" or "Upload Resume"
   - Drag & drop or select your resume file (PDF, DOCX, or TXT)
   - View instant analysis preview

3. **Generate Questions**:
   - Click "Generate Questions"
   - AI analyzes your resume and creates personalized questions
   - See categorized breakdown (Technical vs HR questions)

4. **Practice Interview**:
   - Click "Start Interview"
   - Listen to each question
   - Click "Answer Question" to record your response
   - Get AI-powered feedback on your answer
   - Proceed through all questions
   - Review your final score

## 🏗️ Project Structure

```
d:/resume project ml/
├── app.py                    # Flask backend with Gemini AI integration
├── .env                      # Backend API key configuration
├── requirements.txt          # Python dependencies
├── questions.json            # Fallback question database
├── test-resume.txt          # Sample test resume
│
└── resume-iq/               # React frontend application
    ├── src/
    │   ├── App.jsx          # Main application component
    │   ├── components/
    │   │   ├── LandingSection.jsx    # Landing page
    │   │   ├── UploadSection.jsx     # Resume upload & analysis
    │   │   ├── InterviewSection.jsx  # Interview practice interface
    │   │   ├── Navbar.jsx            # Navigation bar
    │   │   └── Footer.jsx            # Footer component
    │   ├── utils/
    │   │   ├── questionService.js    # Question generation service
    │   │   ├── gemini.js             # Gemini AI client
    │   │   ├── fileParser.js         # PDF/DOCX parsing
    │   │   ├── questionGenerator.js  # Local question generation
    │   │   └── interviewLogic.js     # Interview flow logic
    │   ├── hooks/
    │   │   └── useSpeech.js          # Speech recognition hook
    │   └── index.css                 # Global styles
    ├── .env                  # Frontend API key (for client-side fallback)
    └── package.json          # Node dependencies
```

## 🔑 API Configuration

### Backend `.env` (Required)
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### Frontend `.env` (Optional - for client-side fallback)
```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> **Note**: The backend API key is the primary one used. Frontend key is only used if backend is unavailable.

## 📊 API Response Format

The backend returns structured JSON:

```json
{
  "questions": [
    "Tell me about yourself and walk me through your background.",
    "Technical question 1...",
    "HR question 1...",
    ...
  ],
  "skills": ["Python", "JavaScript", "React", "Machine Learning", ...],
  "experience": ["Built web applications", "Implemented ML models", ...],
  "questions_categorized": {
    "technical": ["Technical question 1", "Technical question 2", ...],
    "hr": ["HR question 1", "HR question 2", ...]
  }
}
```

## 🛠️ Technologies Used

### Backend
- **Flask** - Web framework
- **Google Generative AI (Gemini)** - AI question generation and evaluation
- **Spacy** - NLP for skill extraction
- **pdfplumber** - PDF text extraction
- **python-docx** - DOCX text extraction
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **@google/generative-ai** - Gemini AI SDK
- **pdfjs-dist** - Client-side PDF parsing
- **mammoth** - Client-side DOCX parsing

## 🔒 Security Features

- ✅ API keys stored securely in `.env` files (not committed to git)
- ✅ Backend API key never exposed to client
- ✅ CORS properly configured for local development
- ✅ File type and size validation
- ✅ Temporary file cleanup after processing
- ✅ Input sanitization for user data

## 🧪 Testing

Both servers are currently running and tested:

```bash
✅ Backend API: http://localhost:5000
✅ Frontend App: http://localhost:5173
✅ Resume upload: Working
✅ AI analysis: Generating structured responses
✅ Question categorization: Technical & HR split working
✅ Interview flow: Complete end-to-end functional
```

### Test the API directly:
```python
import requests

response = requests.post(
    'http://localhost:5000/upload',
    files={'resume': open('test-resume.txt', 'rb')}
)

print(response.json())
```

## 🐛 Troubleshooting

### Backend Issues

**Spacy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**Gemini API errors:**
- Check API key is correctly set in `.env`
- Verify API key has not exceeded quota
- System falls back to local question database automatically

**Port 5000 already in use:**
```bash
# Edit app.py, change the port in the last line:
app.run(debug=True, port=5001)  # Use different port
```

### Frontend Issues

**Port 5173 already in use:**
```bash
# Vite will automatically use next available port (5174, 5175, etc.)
```

**CORS errors:**
- Ensure backend is running on port 5000
- Check Flask-CORS is installed: `pip install flask-cors`

## 📝 Sample Resume Format

Create a `.txt` file with this format for testing:

```
PROFESSIONAL RESUME

John Doe
Software Engineer

SKILLS:
- Python
- JavaScript
- React
- Machine Learning
- Data Analysis

EXPERIENCE:
Senior Software Engineer at Tech Corp
- Built web applications using React and Node.js
- Implemented machine learning models
- Worked on data pipelines

EDUCATION:
BS in Computer Science
Master's in Data Science
```

## 🎓 How It Works

1. **Resume Upload**: User uploads resume file
2. **Text Extraction**: Backend extracts text using pdfplumber/python-docx
3. **Skill Detection**: Spacy NLP identifies skills and experience
4. **AI Analysis**: Gemini AI receives resume text and generates:
   - Skill categorization
   - Experience highlights
   - Personalized interview questions (Technical + HR)
5. **Question Display**: Frontend shows categorized questions
6. **Interview Practice**: User records answers via voice
7. **AI Evaluation**: Gemini AI evaluates answers and provides feedback
8. **Final Score**: System calculates overall performance score

## 🚧 Future Enhancements

- [ ] Resume history and storage
- [ ] PDF export of interview results
- [ ] Multi-language support
- [ ] Industry-specific question banks
- [ ] Video recording for interviews
- [ ] Analytics dashboard
- [ ] Skill proficiency levels
- [ ] Company-specific interview prep

## 📄 License

This project is for educational and portfolio purposes.

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📧 Contact

For questions or issues, please create an issue in the repository.

---

**Made with ❤️ using React, Flask, and Google Gemini AI**

**Status: ✅ Fully Functional & Demo-Ready**
