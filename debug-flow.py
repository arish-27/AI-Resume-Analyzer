#!/usr/bin/env python3
"""
Debug script to test the resume upload flow
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("RESUME IQ - DEBUG FLOW TEST")
print("=" * 60)

# Test 1: Check environment variables
print("\n1️⃣ Checking Environment Variables...")
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    print(f"✅ GEMINI_API_KEY is set: {api_key[:10]}...{api_key[-5:]}")
else:
    print("❌ GEMINI_API_KEY is NOT set!")
    print("   Please set it in .env file")

# Test 2: Check required packages
print("\n2️⃣ Checking Required Packages...")
required_packages = [
    'flask',
    'flask_cors',
    'pdfplumber',
    'docx',
    'spacy',
    'google.generativeai'
]

for package in required_packages:
    try:
        __import__(package.replace('.', '_'))
        print(f"✅ {package}")
    except ImportError:
        print(f"❌ {package} - NOT INSTALLED")

# Test 3: Check Spacy model
print("\n3️⃣ Checking Spacy Model...")
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    print("✅ Spacy model 'en_core_web_sm' loaded successfully")
except OSError:
    print("❌ Spacy model 'en_core_web_sm' not found")
    print("   Run: python -m spacy download en_core_web_sm")

# Test 4: Check questions.json
print("\n4️⃣ Checking Questions Database...")
if os.path.exists('questions.json'):
    import json
    with open('questions.json', 'r') as f:
        questions_db = json.load(f)
    print(f"✅ questions.json found with {len(questions_db)} categories")
    print(f"   Categories: {list(questions_db.keys())[:10]}...")
else:
    print("❌ questions.json NOT FOUND!")

# Test 5: Test Gemini API
print("\n5️⃣ Testing Gemini API Connection...")
if api_key:
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Simple test
        response = model.generate_content("Say 'Hello, Gemini API is working!'")
        print(f"✅ Gemini API Response: {response.text[:50]}...")
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
else:
    print("⏭️ Skipping (no API key)")

# Test 6: Check Flask server
print("\n6️⃣ Checking Flask Server...")
import socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('127.0.0.1', 5000))
if result == 0:
    print("✅ Flask server is running on port 5000")
else:
    print("❌ Flask server is NOT running on port 5000")
    print("   Start it with: python app.py")
sock.close()

print("\n" + "=" * 60)
print("DEBUG TEST COMPLETE")
print("=" * 60)
