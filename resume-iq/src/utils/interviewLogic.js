import { evaluateAnswer } from './gemini';

// Sample questions for demo
export const sampleQuestions = [
    "Can you explain your experience with Python and how you've applied it in your projects?",
    "How have you used Flask in your web development projects, and what challenges did you face?",
    "What specific NLP techniques are you most familiar with, and can you provide an example?",
    "What was your role in the Resume Question Generator project, and what was most challenging?",
    "How has your education in Computer Science prepared you for practical software development?"
];

// Response analysis (simulated or AI)
export function analyzeResponse(response, question, currentQuestionIndex, currentScore, apiKey = null) {
    return new Promise(async (resolve) => {
        // AI Evaluation Path (if API Key exists)
        if (apiKey && apiKey.trim() !== '') {
            console.log("🤖 Using AI for answer evaluation...");
            try {
                const aiResult = await evaluateAnswer(question, response, apiKey);

                if (aiResult) {
                    console.log("✅ AI Evaluation Result:", aiResult);

                    const newScore = currentQuestionIndex === 0
                        ? aiResult.score
                        : Math.floor((currentScore * currentQuestionIndex + aiResult.score) / (currentQuestionIndex + 1));

                    resolve({
                        score: newScore,
                        html: aiResult.feedback_html,
                        isPositive: aiResult.score > 70
                    });
                    return;
                }
            } catch (error) {
                console.error("AI Evaluation failed, falling back to local logic:", error);
            }
        }

        // Fallback: Local Logic (Length-based)
        console.log("🏠 Using local fallback for evaluation...");
        setTimeout(() => {
            // Calculate score based on response length
            const text = response ? response.trim() : "";
            const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
            let questionScore = 0;

            // Scoring Logic:
            // 0 words = 0 points
            // < 5 words = 20 points (Too short)
            // < 20 words = 50 points (Basic)
            // < 50 words = 75 points (Good)
            // > 50 words = 85-95 points (Excellent)

            if (wordCount === 0) {
                questionScore = 0;
            } else if (wordCount < 5) {
                questionScore = 20;
            } else if (wordCount < 20) {
                questionScore = 50 + Math.floor(Math.random() * 10);
            } else if (wordCount < 50) {
                questionScore = 70 + Math.floor(Math.random() * 10);
            } else {
                questionScore = 85 + Math.floor(Math.random() * 10);
            }

            // Update running score
            // If it's the first question, take the question score.
            // Otherwise, average it.
            const newScore = currentQuestionIndex === 0
                ? questionScore
                : Math.floor((currentScore * currentQuestionIndex + questionScore) / (currentQuestionIndex + 1));

            // Generate feedback based on questionScore
            let feedback = {
                score: newScore,
                html: null,
                isPositive: false
            };

            let feedbackHTML = '';

            if (questionScore >= 85) {
                feedbackHTML = `
                    <div class="feedback-card feedback-positive">
                        <h5><i class="bi bi-check-circle-fill text-success me-2"></i>Excellent Answer!</h5>
                        <p>Your response was comprehensive and demonstrated strong knowledge. You provided specific examples that directly related to the question.</p>
                        <p><strong>Feedback:</strong> You may be selected for the company based on this response. Continue with this level of detail in your answers.</p>
                    </div>
                `;
                feedback.isPositive = true;
            } else if (questionScore >= 70) {
                feedbackHTML = `
                    <div class="feedback-card">
                        <h5><i class="bi bi-info-circle-fill text-primary me-2"></i>Good Answer</h5>
                        <p>Your response addressed the question well but could benefit from more specific examples or details.</p>
                        <p><strong>Feedback:</strong> Try to include more concrete examples from your experience to strengthen your answers.</p>
                    </div>
                `;
            } else if (questionScore > 0) {
                feedbackHTML = `
                    <div class="feedback-card feedback-improvement">
                        <h5><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Needs Improvement</h5>
                        <p>Your response was somewhat generic and didn't fully address the question. Consider practicing this area.</p>
                        <p><strong>Feedback:</strong> You need to develop your communication skills. Focus on being more specific and structured in your responses.</p>
                    </div>
                `;
            } else {
                feedbackHTML = `
                    <div class="feedback-card feedback-improvement">
                        <h5><i class="bi bi-x-circle-fill text-danger me-2"></i>No Response Detected</h5>
                        <p>We didn't hear an answer. Please check your microphone or speak clearly.</p>
                        <p><strong>Feedback:</strong> Make sure to provide a verbal response to get a score.</p>
                    </div>
                `;
            }

            // Language feedback (only if there is a response)
            if (questionScore > 0) {
                const languageTips = [
                    "Try to reduce filler words like 'um' and 'ah' in your responses.",
                    "Your pacing was good, but try to speak a little more slowly for clarity.",
                    "Consider using more industry-specific terminology to sound more professional.",
                    "Good sentence structure, but work on varying your vocabulary.",
                    "Your pronunciation was clear and easy to understand."
                ];
                const randomTip = languageTips[Math.floor(Math.random() * languageTips.length)];

                feedbackHTML += `
                    <div class="feedback-card">
                        <h5><i class="bi bi-chat-square-text-fill text-info me-2"></i>Language & Delivery</h5>
                        <p>${randomTip}</p>
                    </div>
                `;
            }

            feedback.html = feedbackHTML;
            resolve(feedback);
        }, 1000); // Reduced delay for better responsiveness
    });
}

export function getFinalFeedback(score) {
    let finalFeedback = '';

    if (score >= 85) {
        finalFeedback = `
            <div class="feedback-card feedback-positive">
                <h4><i class="bi bi-trophy-fill me-2"></i>Outstanding Performance!</h4>
                <p>Your interview responses were excellent overall. You demonstrated strong knowledge, clear communication, and relevant experience.</p>
                <p><strong>Recommendation:</strong> You are well-prepared for real interviews. Continue practicing to maintain your skills.</p>
            </div>
        `;
    } else if (score >= 70) {
        finalFeedback = `
            <div class="feedback-card">
                <h4><i class="bi bi-check-circle-fill me-2"></i>Good Performance</h4>
                <p>You performed well in the interview practice. There are areas for improvement but overall you're on the right track.</p>
                <p><strong>Recommendation:</strong> Focus on providing more specific examples and reducing hesitation in your responses.</p>
            </div>
        `;
    } else {
        finalFeedback = `
            <div class="feedback-card feedback-improvement">
                <h4><i class="bi bi-exclamation-triangle-fill me-2"></i>Needs More Practice</h4>
                <p>Your interview performance indicates that you need more preparation before facing real interviews.</p>
                <p><strong>Recommendation:</strong> Practice more frequently, work on structuring your answers, and study the required knowledge areas.</p>
            </div>
        `;
    }

    return finalFeedback;
}
