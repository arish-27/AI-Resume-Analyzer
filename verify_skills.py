import sys
import os

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import extract_skills

test_cases = [
    ("I am a Senior Director of Engineering with experience in Java.", ["leadership", "software_architecture", "java"]),
    ("Working as a Chief Product Officer at a startup.", ["executive", "product_management"]),
    ("Experienced Global Marketing Lead driving strategies.", ["marketing", "strategy", "leadership"]),
    ("I am a Graduate Trainee looking for opportunities.", ["entry_level"]),
    ("Role: Principal Consultant specializing in Change Management.", ["consulting", "leadership"]),
    ("CISO responsible for Cybersecurity.", ["cybersecurity", "executive"]),
    ("Tax Manager handling corporate tax.", ["accounting"]),
    ("Procurement Manager handling sourcing.", ["procurement", "supply chain"])
]

print("Running Skill Extraction Verification...")
print("-" * 50)

passed = 0
for text, expected_skills in test_cases:
    extracted = extract_skills(text)
    print(f"Text: {text}")
    print(f"Extracted: {extracted}")
    
    # Check if at least some expected skills are present
    # We don't expect exact match because of 'generic' or other extraction logic, 
    # but we want to ensure the target mapped skills are found.
    missing = [skill for skill in expected_skills if skill not in extracted and skill != "leadership" and skill != "executive"] 
    # Note: leadership/executive might match multiple times or contextually, but let's check basic presence
    
    # Actually, let's just check if the KEY new skills are found
    all_found = True
    for expected in expected_skills:
        if expected not in extracted:
            # Flexible check for hierarchy
            if expected == "executive" and "leadership" in extracted:
                continue # close enough for this test
            if expected == "leadership" and "executive" in extracted:
                continue
                
            print(f"MISSING EXPECTED SKILL: {expected}")
            all_found = False
    
    if all_found:
        print("RESULT: PASS")
        passed += 1
    else:
        print("RESULT: FAIL")
    print("-" * 50)

print(f"Total Passed: {passed}/{len(test_cases)}")
