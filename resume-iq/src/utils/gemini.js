import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (resumeText, apiKey) => {
    try {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error("API key is required for Gemini AI");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert technical interviewer conducting a behavioral and technical interview.
            Analyze the following resume content and generate exactly 5 specific, high-quality interview questions that are directly relevant to the candidate's background.

            Resume Content:
            ${resumeText}

            Requirements:
            1. Questions should be technically challenging but appropriate for the experience level shown in the resume
            2. Focus on specific technologies, projects, and experiences mentioned in the resume
            3. Include a mix of technical depth questions and behavioral questions
            4. Make questions specific to the candidate's background (avoid generic questions)
            5. Each question should be interview-ready and encourage detailed responses

            Return ONLY a JSON array of exactly 5 questions as strings. No markdown formatting, no explanations, just the raw JSON array.

            Example format: ["Question 1 here", "Question 2 here", "Question 3 here", "Question 4 here", "Question 5 here"]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 Gemini AI raw response:", text);

        // Clean up the response if it contains markdown code blocks or extra text
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Try to extract JSON array if there's extra text
        const jsonMatch = cleanText.match(/\[.*\]/s);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }

        try {
            const questions = JSON.parse(cleanText);

            // Validate the response
            if (!Array.isArray(questions)) {
                throw new Error("Response is not an array");
            }

            if (questions.length === 0) {
                throw new Error("No questions returned");
            }

            // Ensure we have exactly 5 questions
            const validQuestions = questions
                .filter(q => typeof q === 'string' && q.trim().length > 10)
                .slice(0, 5);

            if (validQuestions.length < 3) {
                throw new Error("Insufficient valid questions returned");
            }

            console.log("✅ Gemini AI questions validated:", validQuestions);
            return validQuestions;

        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            console.error("Parse error:", parseError);

            // Try to extract questions from plain text as fallback
            const lines = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 10 && (line.includes('?') || line.includes('Tell me') || line.includes('Describe') || line.includes('How') || line.includes('What')))
                .slice(0, 5);

            if (lines.length >= 3) {
                console.log("📝 Extracted questions from text:", lines);
                return lines;
            }

            throw new Error("Could not parse valid questions from response");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);

        // Provide more specific error messages
        if (error.message.includes('API_KEY')) {
            throw new Error("Invalid API key. Please check your Gemini API key configuration.");
        } else if (error.message.includes('quota')) {
            throw new Error("API quota exceeded. Please check your Gemini API usage limits.");
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        } else {
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }
};

export const evaluateAnswer = async (question, answer, apiKey) => {
    try {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error("API key is required for Gemini AI");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert technical interviewer. Evaluate the candidate's answer to the following question.

            Question: "${question}"
            Candidate Answer: "${answer}"

            Task:
            1. Determine if the answer is RELEVANT to the question or if it is random noise/gibberish.
            2. If it is noise (e.g., "blah blah", random words, silence, or completely off-topic), assign a score of 0.
            3. If it is relevant, assign a score between 1-100 based on quality (accuracy, depth, examples).

            Return ONLY a JSON object in this format:
            {
                "score": <number>,
                "is_relevant": <boolean>,
                "feedback_html": "<string with html tags for feedback card>"
            }

            Feedback HTML Guidelines:
            - Use <div class="feedback-card">...</div> wrapper.
            - Use bootstrap icons (bi-check-circle-fill, bi-exclamation-triangle-fill).
            - Provide specific constructive feedback.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 Gemini Evaluation:", text);

        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        return null; // Fallback to local logic
    }
};
