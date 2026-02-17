# Resume IQ - Testing Guide

## 🎯 Quick Test (2 minutes)

### Step 1: Verify Servers Are Running
```bash
# Check backend (should show port 5000)
netstat -ano | findstr ":5000"

# Check frontend (should show port 5173)
netstat -ano | findstr ":5173"
```

### Step 2: Open Application
1. Open browser: http://localhost:5173/
2. You should see "Upload Your Resume" page
3. Status badge should show "Local Generation Mode" or "AI-Powered Generation Enabled"

### Step 3: Upload Resume
1. Click upload area or drag & drop a resume file (PDF, DOCX, or TXT)
2. **Watch for:**
   - ✅ File name appears
   - ✅ "Detected Skills" badge shows (if file parsed successfully)
   - ✅ Skills are displayed as blue badges

### Step 4: Generate Questions
1. Click "Generate Questions" button
2. **Watch for:**
   - ✅ Loading spinner appears with "Processing your resume..."
   - ✅ Browser console shows step-by-step logs
   - ✅ Spinner STOPS (within 15 seconds)
   - ✅ Either questions appear OR error message shows

### Step 5: Check Console
Press F12 to open browser console and look for:
```
📄 Step 1: Parsing resume file...
📄 PARSED RESUME TEXT LENGTH: XXX characters
✅ Resume parsed successfully, generating personalized questions...
🚀 Step 3: Calling question generation service...
🌐 Attempting backend API call...
📡 Sending request to http://localhost:5000/upload...
📡 Response status: 200
✅ Backend response received: {...}
✅ Valid questions array received: X questions
🎯 Navigating to interview section...
🛑 Stopping loading spinner...
```

## 🔍 Detailed Testing Scenarios

### Scenario 1: Successful Upload (PDF)
**Test File:** Any PDF resume
**Expected:**
1. File uploads successfully
2. Text extracted from PDF
3. Skills detected and displayed
4. Questions generated (5-8 questions)
5. Interview section loads

**Console Should Show:**
- ✅ All green checkmarks
- ✅ No red error messages
- ✅ Question count matches displayed questions

### Scenario 2: Successful Upload (DOCX)
**Test File:** Any DOCX resume
**Expected:** Same as Scenario 1

### Scenario 3: Successful Upload (TXT)
**Test File:** Any TXT resume
**Expected:** Same as Scenario 1

### Scenario 4: Invalid File Type
**Test File:** .jpg, .png, or other non-resume file
**Expected:**
1. File uploads
2. Error message: "Unsupported file format"
3. Loading spinner stops
4. User can try again

**Console Should Show:**
- ❌ Error message about file type
- 🛑 Loading spinner stopped

### Scenario 5: Empty File
**Test File:** Empty .txt file
**Expected:**
1. File uploads
2. Error message: "Resume content appears to be empty"
3. Loading spinner stops
4. User can try again

### Scenario 6: Backend Offline
**Test:**
1. Stop backend: `Stop-Process -Name python`
2. Try to upload resume

**Expected:**
1. Loading spinner shows
2. After 15 seconds: timeout error
3. Error message: "Cannot connect to server"
4. Loading spinner stops

**Console Should Show:**
- ❌ Backend connection failed
- ⏱️ Timeout message
- 🛑 Loading spinner stopped

### Scenario 7: Large File
**Test File:** Resume > 5MB
**Expected:**
1. File uploads
2. Processing may take longer
3. Should complete within 15 seconds
4. If timeout: clear error message

## 🐛 Debugging Failed Tests

### Problem: Spinner Never Stops
**Check:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check network tab for failed requests
4. Verify backend is running: `netstat -ano | findstr ":5000"`

**Solution:**
- Refresh page and try again
- Check backend logs: `python app.py` output
- Restart backend if needed

### Problem: "Cannot connect to server"
**Check:**
1. Is backend running? `netstat -ano | findstr ":5000"`
2. Check backend logs for errors

**Solution:**
```bash
# Restart backend
python app.py
```

### Problem: "Server error: 500"
**Check:**
1. Backend console for error stack trace
2. Check if GEMINI_API_KEY is set in .env
3. Check if all Python packages are installed

**Solution:**
```bash
# Check environment
python debug-flow.py

# Install missing packages
pip install -r requirements.txt
```

### Problem: Questions Are Generic
**Check:**
1. Is Gemini API working? Check backend logs
2. Are skills being detected? Check "Detected Skills" badge

**Solution:**
- If Gemini fails, app falls back to static questions (expected)
- Check .env file has valid GEMINI_API_KEY
- Verify API key at: https://makersuite.google.com/app/apikey

## 📊 Success Criteria

### ✅ All Tests Pass If:
1. Loading spinner ALWAYS stops (success or error)
2. Error messages are clear and helpful
3. Questions are generated and displayed
4. No JavaScript errors in console
5. Backend logs show successful processing

### ❌ Tests Fail If:
1. Spinner never stops (infinite loading)
2. No error message on failure
3. JavaScript errors in console
4. Backend crashes or returns 500 errors
5. Silent failures (no feedback to user)

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all
Stop-Process -Name python
Stop-Process -Name node

# Start backend
python app.py

# Start frontend (in resume-iq folder)
npm run dev
```

### Fix 2: Clear Browser Cache
1. Press Ctrl+Shift+Delete
2. Clear cached images and files
3. Refresh page (Ctrl+F5)

### Fix 3: Check Logs
```bash
# Backend logs
# Look at terminal running python app.py

# Frontend logs
# Press F12 in browser, check Console tab
```

## 📝 Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can upload PDF file
- [ ] Can upload DOCX file
- [ ] Can upload TXT file
- [ ] Skills are detected and displayed
- [ ] Loading spinner appears
- [ ] Loading spinner stops on success
- [ ] Loading spinner stops on error
- [ ] Questions are displayed
- [ ] Error messages are clear
- [ ] Can retry after error
- [ ] Console logs are helpful
- [ ] No JavaScript errors
- [ ] Backend logs show success

## 🎉 Expected Final Result

When everything works correctly:

1. **Upload:** Smooth file upload with immediate feedback
2. **Processing:** Clear loading indicator with progress logs
3. **Success:** Questions display with skills and experience
4. **Error:** Clear error message with ability to retry
5. **Performance:** Completes within 5-15 seconds
6. **Reliability:** No infinite loading, no silent failures

**The application should feel responsive and reliable!**