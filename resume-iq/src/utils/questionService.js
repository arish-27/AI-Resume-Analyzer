import { generateQuestions as generateWithGemini } from './gemini.js';
import { generateQuestions as generateLocal, getDetectedSkills } from './questionGenerator.js';

/**
 * Unified question generation service that tries Gemini AI first,
 * then falls back to local generation if API key is missing or fails
 */
export const generateQuestions = async (resumeText, file) => {
    console.log("🚀 Starting question generation...");
    console.log("📄 Resume text length:", resumeText?.length || 0);
    console.log("📁 File provided:", !!file);

    // STEP 1: Try Backend Generation (Preferred)
    if (file) {
        console.log("🌐 Attempting backend API call...");
        try {
            const formData = new FormData();
            formData.append('resume', file);

            // CRITICAL: Set timeout to prevent infinite loading
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.warn("⏱️ Backend request timeout after 15 seconds");
                controller.abort();
            }, 15000); // 15 second timeout

            // Use relative path for production (Vercel) or localhost for development
            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000/upload'
                : '/api/upload';

            console.log(`📡 Sending request to ${API_URL}...`);
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log("📡 Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
                console.error("❌ Server returned error:", errorData);
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Backend response received:", data);

            // CRITICAL: Validate response structure
            if (!data || typeof data !== 'object') {
                throw new Error("Invalid response format from server");
            }

            // Handle structured response format
            if (data.questions && Array.isArray(data.questions)) {
                console.log("✅ Valid questions array received:", data.questions.length, "questions");

                // Store additional metadata if available
                if (data.skills || data.experience || data.questions_categorized) {
                    console.log("📊 Structured data available:");
                    console.log("  - Skills:", data.skills?.length || 0);
                    console.log("  - Experience:", data.experience?.length || 0);
                    console.log("  - Technical Questions:", data.questions_categorized?.technical?.length || 0);
                    console.log("  - HR Questions:", data.questions_categorized?.hr?.length || 0);

                    // Return enriched data
                    return {
                        questions: data.questions,
                        metadata: {
                            skills: data.skills || [],
                            experience: data.experience || [],
                            categorized: data.questions_categorized || null
                        }
                    };
                }

                // Return simple questions array
                return data.questions;
            } else {
                console.error("❌ Backend returned invalid format:", data);
                throw new Error("Backend returned invalid question format");
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("❌ Backend request timed out after 15 seconds");
                throw new Error("Server is taking too long to respond. Please try again.");
            } else if (error.message.includes('Failed to fetch')) {
                console.error("❌ Backend connection failed - server may be offline");
                throw new Error("Cannot connect to server. Please ensure the backend is running on port 5000.");
            } else {
                console.error("❌ Backend error:", error);
                throw error; // Re-throw to be handled by caller
            }
        }
    }

    // STEP 2: Fallback to Client-side Generation
    console.log("🔁 Using client-side fallback generation...");

    // Get API key from environment (only in Vite environment)
    let apiKey = '';
    if (typeof import.meta.env !== 'undefined') {
        apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    }

    // Try Gemini AI first if API key is available
    if (apiKey && apiKey.trim() !== '') {
        console.log("🤖 Attempting Gemini AI generation (Client-side)...");
        try {
            const questions = await generateWithGemini(resumeText, apiKey);
            console.log("✅ Gemini AI questions generated:", questions.length, "questions");
            return questions;
        } catch (error) {
            console.warn("⚠️ Gemini AI failed:", error.message);
            // Continue to local fallback
        }
    } else {
        console.log("🔑 No Gemini API key configured");
    }

    // STEP 3: Final Fallback to Local Generation
    console.log("🏠 Using local question generation...");
    try {
        const questions = await generateLocal(resumeText);
        console.log("✅ Local questions generated:", questions.length, "questions");
        return questions;
    } catch (error) {
        console.error("❌ Local generation failed:", error);
        throw new Error("All question generation methods failed. Please try again.");
    }
};

/**
 * Get detected skills from resume for UI display
 */
export const getResumeSkills = (resumeText) => {
    return getDetectedSkills(resumeText);
};

/**
 * Check if Gemini AI is configured
 */
export const isGeminiConfigured = () => {
    // Check if running in Vite environment
    if (typeof import.meta.env !== 'undefined') {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        return apiKey && apiKey.trim() !== '';
    }
    // Fallback for Node.js environment (testing)
    return false;
};