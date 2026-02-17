# AI-Powered Question Generation Setup

## Overview

Resume IQ now supports two modes of question generation:

1. **🤖 AI-Powered (Gemini AI)** - Advanced AI generates highly personalized questions
2. **🏠 Local Generation** - Intelligent local analysis with resume-aware questions

## Quick Start

The application works out of the box with **Local Generation** mode, which analyzes your resume and generates personalized questions based on detected skills, experience, and roles.

## Enable AI-Powered Generation (Optional)

For even better question quality, you can enable Gemini AI:

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

## How It Works

### Local Generation Mode
- ✅ **Always Available** - No API key required
- ✅ **Resume Analysis** - Detects 50+ technologies, roles, and experience indicators
- ✅ **Personalized Questions** - Generates questions specific to your background
- ✅ **Fast Response** - Instant question generation
- ✅ **Privacy Focused** - No data sent to external services

### AI-Powered Mode (with API Key)
- 🤖 **Advanced AI** - Uses Google's Gemini AI for superior question quality
- 🎯 **Highly Personalized** - Deep analysis of resume content
- 📚 **Context Aware** - Understands nuanced experience levels
- 🔄 **Automatic Fallback** - Falls back to local mode if AI fails

## Features

### Resume Analysis
The system automatically detects:
- **Technologies**: JavaScript, Python, React, AWS, Docker, etc.
- **Experience Level**: Years of experience, seniority indicators
- **Roles**: Engineer, Developer, Manager, Architect, etc.
- **Projects**: Application types, system complexity
- **Education**: Degrees, certifications

### Question Types Generated
- **Technical Depth**: Specific to your tech stack
- **Experience-Based**: Related to your background
- **Problem-Solving**: Architecture and design questions
- **Behavioral**: Leadership and collaboration scenarios
- **Role-Specific**: Tailored to your position level

## Troubleshooting

### AI Mode Not Working?
1. Check your API key in `.env` file
2. Verify the key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Check browser console for error messages
4. Restart the development server

### Questions Not Personalized?
1. Ensure your resume has clear technology mentions
2. Include specific project descriptions
3. Mention years of experience and roles
4. Use standard technology names (React, Python, AWS, etc.)

### File Upload Issues?
1. Supported formats: PDF, DOCX, TXT
2. Maximum file size: 5MB
3. Ensure file contains readable text
4. Try converting to TXT format if issues persist

## Testing

Run the test script to verify everything is working:

```bash
node test-question-generation.js
```

This will show:
- Configuration status
- Detected skills from sample resume
- Generated questions
- System performance

## Status Indicators

The upload page shows your current mode:
- 🤖 **AI-Powered Generation Enabled** - Gemini AI is configured
- 🏠 **Local Generation Mode** - Using intelligent local analysis

## Privacy & Security

- **Local Mode**: No data leaves your device
- **AI Mode**: Resume content is sent to Google's Gemini AI
- **API Keys**: Stored locally, never transmitted to our servers
- **File Processing**: All file parsing happens in your browser

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Try the test script to diagnose problems
3. Verify your resume file is readable
4. Test with a simple TXT file first

The system is designed to always work - even if AI fails, local generation provides excellent resume-aware questions!