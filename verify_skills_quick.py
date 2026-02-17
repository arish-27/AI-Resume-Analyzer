
import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app import extract_skills

# Test text
text = """
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
"""

print("Extracting skills...")
skills = extract_skills(text)
print(f"Extracted skills: {skills}")

expected_skills = ["python", "javascript", "react", "machine learning", "data analysis", "node"]
missing_skills = [s for s in expected_skills if s not in skills]

if not missing_skills:
    print("SUCCESS: All expected skills found!")
else:
    print(f"FAILURE: Missing skills: {missing_skills}")
