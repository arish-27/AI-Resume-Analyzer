import os
import tempfile
import json
import logging
import re
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx

from collections import Counter
# CRITICAL: Import will be done dynamically in the function to handle both old and new packages
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load questions database
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    questions_path = os.path.join(current_dir, 'questions.json')
    with open(questions_path, 'r') as f:
        QUESTIONS_DB = json.load(f)
except FileNotFoundError:
    logger.error("questions.json not found!")
    QUESTIONS_DB = {}

# NLP model loading removed - using dictionary matching


# Skill aliases mapping - maps variations to standard skill names
SKILL_ALIASES = {
    # Programming Languages
    "py": "python", "python3": "python", "python2": "python",
    "js": "javascript", "es6": "javascript", "ecmascript": "javascript",
    "ts": "typescript",
    "c#": "c#", "csharp": "c#", "c sharp": "c#",
    "c++": "c++", "cpp": "c++", "cplusplus": "c++",
    "golang": "go", "go lang": "go",
    "rb": "ruby", "rails": "ruby",
    
    # Frameworks
    "reactjs": "react", "react.js": "react", "react js": "react",
    "angularjs": "angular", "angular.js": "angular", "angular js": "angular",
    "vuejs": "vue", "vue.js": "vue", "vue js": "vue",
    "nodejs": "node", "node.js": "node", "node js": "node", "express": "node", "expressjs": "node",
    "spring boot": "spring", "springboot": "spring",
    ".net": "dotnet", "asp.net": "dotnet", "asp net": "dotnet", ".net core": "dotnet",
    
    # Databases
    "postgres": "postgresql", "psql": "postgresql",
    "mongo": "mongodb", "mongo db": "mongodb",
    "mssql": "sql", "sql server": "sql", "t-sql": "sql", "tsql": "sql",
    "oracle db": "sql", "plsql": "sql", "pl/sql": "sql",
    
    # Cloud & DevOps
    "amazon web services": "aws", "amazon": "aws",
    "microsoft azure": "azure", "ms azure": "azure",
    "google cloud": "gcp", "google cloud platform": "gcp",
    "k8s": "kubernetes", "kube": "kubernetes",
    "ci/cd": "devops", "cicd": "devops", "jenkins": "devops", "github actions": "devops",
    "terraform": "devops", "ansible": "devops", "chef": "devops", "puppet": "devops",
    "version control": "git", "github": "git", "gitlab": "git", "bitbucket": "git",
    
    # Data & Analytics
    "ml": "machine learning", "machine-learning": "machine learning",
    "ai": "artificial intelligence", "artificial-intelligence": "artificial intelligence",
    "dl": "deep learning", "deep-learning": "deep learning", "neural network": "deep learning", "tensorflow": "deep learning", "pytorch": "deep learning", "keras": "deep learning",
    "nlp": "artificial intelligence", "natural language processing": "artificial intelligence",
    "computer vision": "deep learning", "cv": "deep learning",
    "data analyst": "data analysis", "analytics": "data analysis",
    "data scientist": "data science", "ds": "data science",
    "bi": "power bi", "business intelligence": "power bi",
    "ms excel": "excel", "microsoft excel": "excel", "spreadsheet": "excel",
    "pandas": "data science", "numpy": "data science", "scikit-learn": "machine learning", "sklearn": "machine learning",
    
    # Business & Finance
    "cpa": "accounting", "bookkeeping": "accounting", "accounts": "accounting", "financial accounting": "accounting",
    "financial analysis": "finance", "financial analyst": "finance", "fp&a": "finance", "investment banking": "investment",
    "stock market": "investment", "equity": "investment", "trading": "investment",
    "bank": "banking", "banker": "banking", "loan": "banking", "credit": "banking",
    "audit": "auditing", "internal audit": "auditing", "external audit": "auditing",
    
    # Marketing
    "digital marketer": "digital marketing", "online marketing": "digital marketing",
    "search engine optimization": "seo", "search engine": "seo",
    "social media marketing": "social media", "smm": "social media", "facebook": "social media", "instagram": "social media", "linkedin": "social media", "twitter": "social media",
    "content marketing": "content", "content writer": "content", "copywriting": "content", "copywriter": "content",
    "email marketing": "digital marketing", "ppc": "digital marketing", "google ads": "digital marketing",
    "brand": "marketing", "branding": "marketing", "market research": "marketing",
    
    # Sales & Business
    "salesperson": "sales", "sales executive": "sales", "sales manager": "sales", "sales rep": "sales",
    "biz dev": "business development", "bd": "business development", "partnerships": "business development",
    "client management": "account management", "client relations": "account management", "crm": "account management",
    
    # HR & Admin
    "hr": "human resources", "hrbp": "human resources", "people operations": "human resources",
    "recruiter": "recruitment", "talent acquisition": "recruitment", "hiring": "recruitment", "staffing": "recruitment",
    "learning and development": "training", "l&d": "training", "trainer": "training",
    
    # Project & Product
    "pm": "project management", "pmp": "project management", "prince2": "project management",
    "scrum master": "scrum", "product owner": "scrum",
    "agile methodology": "agile", "kanban": "agile", "lean": "agile",
    "product manager": "product management", "product owner": "product management",
    
    # Design
    "ui": "ui design", "user interface": "ui design", "figma": "ui design", "sketch": "ui design", "adobe xd": "ui design",
    "ux": "ux design", "user experience": "ux design", "usability": "ux design", "user research": "ux design",
    "photoshop": "graphic design", "illustrator": "graphic design", "indesign": "graphic design", "adobe": "graphic design",
    
    # Healthcare
    "doctor": "medical", "physician": "medical", "md": "medical", "healthcare": "medical", "hospital": "medical",
    "nurse": "nursing", "rn": "nursing", "registered nurse": "nursing", "lpn": "nursing", "patient care": "nursing",
    "pharmacist": "pharmacy", "pharmaceutical": "pharmacy", "drug": "pharmacy",
    "clinical trial": "clinical research", "clinical study": "clinical research", "cra": "clinical research",
    
    # Legal
    "lawyer": "legal", "attorney": "legal", "law": "legal", "litigation": "legal", "contract": "legal",
    "regulatory": "compliance", "regulation": "compliance", "gdpr": "compliance", "hipaa": "compliance", "sox": "compliance",
    
    # Engineering
    "cad": "mechanical engineering", "solidworks": "mechanical engineering", "autocad": "mechanical engineering", "mechanical engineer": "mechanical engineering",
    "structural": "civil engineering", "construction": "civil engineering", "civil engineer": "civil engineering", "architect": "civil engineering",
    "circuit": "electrical engineering", "electronics": "electrical engineering", "pcb": "electrical engineering", "electrical engineer": "electrical engineering", "embedded": "electrical engineering",
    "process engineer": "chemical engineering", "chemical engineer": "chemical engineering",
    
    # Education
    "teacher": "teaching", "professor": "teaching", "instructor": "teaching", "tutor": "teaching", "educator": "education",
    "curriculum": "education", "e-learning": "education", "lms": "education",
    
    # Customer Service & Support
    "customer support": "customer service", "customer care": "customer service", "call center": "customer service",
    "technical support": "support", "help desk": "support", "it support": "support", "desktop support": "support",
    
    # Operations & Supply Chain
    "scm": "supply chain", "supply chain management": "supply chain", "procurement": "supply chain", "sourcing": "supply chain",
    "warehouse": "logistics", "transportation": "logistics", "shipping": "logistics", "freight": "logistics", "distribution": "logistics",
    "inventory": "operations", "process improvement": "operations", "six sigma": "operations", "lean manufacturing": "operations",
    
    # QA & Testing
    "qa": "quality assurance", "quality analyst": "quality assurance", "tester": "quality assurance", "testing": "quality assurance",
    "selenium": "automation testing", "cypress": "automation testing", "test automation": "automation testing", "automated testing": "automation testing",
    
    # Security & Networking
    "security": "cybersecurity", "infosec": "cybersecurity", "information security": "cybersecurity", "penetration testing": "cybersecurity", "ethical hacking": "cybersecurity",
    "networking": "network", "cisco": "network", "ccna": "network", "ccnp": "network", "routing": "network", "switching": "network",
    "sysadmin": "system administration", "linux": "system administration", "windows server": "system administration", "unix": "system administration", "active directory": "system administration",

    # Leadership & Strategy
    "director": "leadership", "vp": "executive", "vice president": "executive", "svp": "executive", "senior vice president": "executive",
    "md": "executive", "managing director": "executive", "country manager": "executive", "regional head": "executive",
    "head of": "leadership", "principal consultant": "consulting", "strategy lead": "strategy", "strategy manager": "strategy",
    "chief executive officer": "executive", "ceo": "executive", "coo": "executive", "cfo": "executive", "cto": "executive", "cmo": "executive", "chro": "executive", "general counsel": "executive",
    
    # Finance & Corporate Attributes
    "tax manager": "accounting", "treasury": "finance", "m&a": "strategy", "mergers": "strategy", "corporate development": "strategy",
    "financial controller": "finance", "risk": "risk_management", "risk manager": "risk_management",
    
    # Advanced Tech & Architecture
    "engineering manager": "leadership", "software architect": "software_architecture", "principal engineer": "software_architecture",
    "ciso": "cybersecurity", "information security officer": "cybersecurity", "platform engineering": "devops",
    "solution architect": "software_architecture", "cloud architect": "software_architecture",
    "data engineer": "data_engineering", "data engineering": "data_engineering", "etl": "data_engineering",
    
    # Specialized Product & Design
    "cpo": "executive", "chief product officer": "executive", "group product manager": "product_management",
    
    # Procurement
    "procurement": "procurement", "purchasing": "procurement", "buyer": "procurement", "sourcing": "procurement",
    
    # Consulting & Advisory
    "engagement manager": "consulting", "transformation": "consulting", "change management": "consulting", "advisory": "consulting",
    
    # Entry Level Indicators
    "graduate trainee": "entry_level", "management trainee": "entry_level", "associate": "entry_level", "junior": "entry_level",
    "intern": "entry_level", "trainee": "entry_level", "entry level": "entry_level"
}

def extract_skills(text):
    """
    Extract skills from text using keyword matching and aliases.
    Refactored to remove Spacy dependency for lighter deployment.
    """
    text_lower = text.lower()
    found_skills = set()
    
    # Check for direct skill matches in the questions database
    for skill in QUESTIONS_DB.keys():
        if skill != "generic" and skill != "communication":
            # Check in full text (simple substring match)
            # Add padding to avoid matching substrings of other words (e.g., "go" in "google")
            # But simple substring is often enough for unique skill names
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
            elif skill in text_lower: # Fallback for multi-word skills where word boundary might fail or be complex
                 found_skills.add(skill)

    # Check for aliases
    for alias, skill in SKILL_ALIASES.items():
        # Use word boundary matching for short aliases to avoid false positives
        if len(alias) <= 3:
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, text_lower):
                if skill in QUESTIONS_DB:
                    found_skills.add(skill)
        else:
            if alias in text_lower:
                if skill in QUESTIONS_DB:
                    found_skills.add(skill)
    
    logger.info(f"Matched skills: {list(found_skills)}")
    return list(found_skills)

def generate_questions_with_ai(resume_text, skills):
    """
    Generate interview questions using Gemini AI API.
    CRITICAL FIX: Use correct model name and handle API properly
    """
    # Try Gemini generation first
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set. Falling back to static questions.")
        return None

    try:
        # Use the installed google.generativeai package
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # CRITICAL FIX: Use correct model name - gemini-pro is the stable model
        model = genai.GenerativeModel('gemini-pro')
        logger.info("Using Gemini Pro model")
        
        skills_str = ", ".join(skills) if skills else "general skills"
        
        # CRITICAL: Use the EXACT prompt format specified in requirements
        prompt = f"""You are an interview preparation assistant.
Analyze the following resume text and return ONLY valid JSON. Do not add explanations or markdown.

Resume Text:
{resume_text[:3000]}

Return JSON in this exact structure:
{{
  "skills": [],
  "experience": [],
  "questions": {{
    "technical": [
      {{
        "level": "beginner",
        "question": "example question"
      }}
    ],
    "hr": ["example HR question"]
  }}
}}"""
        
        logger.info("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        logger.info(f"Raw Gemini response (first 200 chars): {content[:200]}")
        
        # Clean up potential markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        try:
            result = json.loads(content)
            logger.info(f"Successfully parsed JSON response")
            
            # Validate and extract questions
            if isinstance(result, dict) and "questions" in result:
                questions_obj = result.get("questions", {})
                
                # Handle both formats: array of objects or simple strings
                technical_questions = []
                hr_questions = []
                
                if isinstance(questions_obj, dict):
                    tech_list = questions_obj.get("technical", [])
                    hr_list = questions_obj.get("hr", [])
                    
                    # Extract question text from objects or use strings directly
                    for item in tech_list:
                        if isinstance(item, dict):
                            technical_questions.append(item.get("question", str(item)))
                        else:
                            technical_questions.append(str(item))
                    
                    for item in hr_list:
                        if isinstance(item, dict):
                            hr_questions.append(item.get("question", str(item)))
                        else:
                            hr_questions.append(str(item))
                
                if technical_questions or hr_questions:
                    logger.info(f"✅ Extracted {len(technical_questions)} technical, {len(hr_questions)} HR questions")
                    return {
                        "skills": result.get("skills", skills)[:15],
                        "experience": result.get("experience", [])[:5],
                        "questions": {
                            "technical": technical_questions,
                            "hr": hr_questions
                        }
                    }
                else:
                    logger.warning("No questions found in structured response")
                    return None
            else:
                logger.warning(f"Invalid response structure: {type(result)}")
                return None
                
        except json.JSONDecodeError as je:
            logger.error(f"JSON Parse Error: {je}")
            logger.error(f"Content that failed to parse: {content[:500]}")
            return None
        
    except Exception as e:
        logger.error(f"Gemini API error: {e}", exc_info=True)
        return None

@app.route('/upload', methods=['POST'])
@app.route('/api/upload', methods=['POST'])
def upload_resume():
    """
    Upload endpoint for resume processing.
    Returns structured JSON with questions, skills, and experience.
    """
    # STEP 1: Validate file upload
    logger.info("📥 Received upload request")
    
    if 'resume' not in request.files:
        logger.error("❌ No file part in request")
        return jsonify({
            'status': 'error',
            'error': 'No file part in request'
        }), 400
    
    file = request.files['resume']
    if file.filename == '':
        logger.error("❌ No selected file")
        return jsonify({
            'status': 'error',
            'error': 'No file selected'
        }), 400

    filename = file.filename
    file_ext = os.path.splitext(filename)[1].lower()
    logger.info(f"📄 Processing file: {filename} (type: {file_ext})")
    
    # STEP 2: Validate file type
    if file_ext not in ['.pdf', '.docx', '.txt']:
        logger.error(f"❌ Unsupported file format: {file_ext}")
        return jsonify({
            'status': 'error',
            'error': f'Unsupported file format: {file_ext}. Please upload PDF, DOCX, or TXT.'
        }), 400
    
    # Save temporarily to /tmp (or system temp dir) to avoid read-only errors on Vercel
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, "temp_resume" + file_ext)
    
    try:
        file.save(temp_path)
        logger.info(f"✅ File saved temporarily: {temp_path}")
        
        # STEP 3: Extract text from file
        logger.info("📝 Extracting text from file...")
        text = ""
        
        try:
            if file_ext == '.pdf':
                text = extract_text_from_pdf(temp_path)
            elif file_ext == '.docx':
                text = extract_text_from_docx(temp_path)
            elif file_ext == '.txt':
                with open(temp_path, 'r', encoding='utf-8') as f:
                    text = f.read()
        except Exception as extract_error:
            logger.error(f"❌ Text extraction failed: {extract_error}")
            return jsonify({
                'status': 'error',
                'error': f'Failed to extract text from file: {str(extract_error)}'
            }), 500
        
        # STEP 4: Validate extracted text
        logger.info(f"📊 Extracted text length: {len(text)} characters")
        
        if not text or len(text.strip()) < 10:
            logger.error("❌ Extracted text is empty or too short")
            return jsonify({
                'status': 'error',
                'error': 'Resume content appears to be empty or too short. Please check your file.'
            }), 400
        
        logger.info(f"✅ Text extracted successfully. First 100 chars: {text[:100]}...")
        
        # STEP 5: Extract skills using NLP
        logger.info("🔍 Extracting skills from resume...")
        skills = extract_skills(text)
        logger.info(f"✅ Extracted {len(skills)} skills: {skills}")
        
        # STEP 6: Generate questions
        logger.info("🤖 Generating interview questions...")
        
        # Try AI generation first for structured output
        ai_result = generate_questions_with_ai(text, skills)
        
        if ai_result and isinstance(ai_result, dict):
            # AI returned structured format
            logger.info("✅ Successfully generated structured analysis using Gemini AI")
            
            # Build final questions list
            technical_questions = ai_result.get("questions", {}).get("technical", [])
            hr_questions = ai_result.get("questions", {}).get("hr", [])
            
            # Combine all questions with intro first
            final_questions = ["Tell me about yourself and walk me through your background."]
            final_questions.extend(technical_questions)
            final_questions.extend(hr_questions)
            
            logger.info(f"✅ Returning {len(final_questions)} questions ({len(technical_questions)} technical, {len(hr_questions)} HR)")
            
            return jsonify({
                'status': 'success',
                'questions': final_questions,
                'skills': ai_result.get("skills", skills)[:15],
                'experience': ai_result.get("experience", [])[:5],
                'questions_categorized': {
                    'technical': technical_questions,
                    'hr': hr_questions
                }
            }), 200
        else:
            # Fallback to static question database
            logger.info("⚠️ AI generation failed, using static question database")
            
            # ALWAYS add introduction question first
            final_questions = ["Tell me about yourself and walk me through your background."]
            generated_questions = []
            
            # Add skill-specific questions
            for skill in skills:
                skill_questions = QUESTIONS_DB.get(skill, [])
                if skill_questions:
                    count = min(len(skill_questions), 2)
                    generated_questions.extend(random.sample(skill_questions, count))
            
            # Add generic questions if needed
            if len(generated_questions) < 5:
                generic_pool = QUESTIONS_DB.get('generic', [])
                if generic_pool:
                    count = min(len(generic_pool), 5 - len(generated_questions))
                    generated_questions.extend(random.sample(generic_pool, count))
            
            # Shuffle and limit
            random.shuffle(generated_questions)
            final_questions.extend(generated_questions[:7])
            
            # Categorize fallback questions
            tech_count = len(final_questions) // 2
            
            logger.info(f"✅ Returning {len(final_questions)} questions (fallback mode)")
            
            return jsonify({
                'status': 'success',
                'questions': final_questions,
                'skills': skills[:15],
                'experience': [f"Experience in {skills[0]}" if skills else "General experience"],
                'questions_categorized': {
                    'technical': final_questions[1:tech_count+1],
                    'hr': final_questions[tech_count+1:]
                }
            }), 200

    except Exception as e:
        logger.error(f"❌ Unexpected error processing file: {e}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': f'Server error: {str(e)}'
        }), 500
    finally:
        # CRITICAL: Always cleanup temp file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.info(f"🗑️ Cleaned up temp file: {temp_path}")
            except Exception as cleanup_error:
                logger.warning(f"⚠️ Failed to cleanup temp file: {cleanup_error}")

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

if __name__ == '__main__':
    app.run(debug=True, port=5000)
