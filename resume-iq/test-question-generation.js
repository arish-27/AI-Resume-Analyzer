// Test script to verify question generation is working
import { generateQuestions, getResumeSkills, isGeminiConfigured } from './src/utils/questionService.js';

const testResumeText = `
John Doe
Software Engineer

Experience:
- 3 years of experience as a Full Stack Developer at TechCorp
- Developed web applications using React, Node.js, and MongoDB
- Built REST APIs and microservices using Express.js
- Worked with AWS services including EC2, S3, and Lambda
- Experience with Docker containerization and CI/CD pipelines
- Led a team of 2 junior developers on the e-commerce platform project

Skills:
- JavaScript, TypeScript, Python
- React, Vue.js, Angular
- Node.js, Express.js, Django
- MongoDB, PostgreSQL, MySQL
- AWS, Docker, Kubernetes
- Git, Jenkins, Agile/Scrum

Education:
- Bachelor's Degree in Computer Science from State University
- AWS Certified Solutions Architect

Projects:
- E-commerce Platform: Built a full-stack e-commerce application serving 10,000+ users
- Task Management System: Developed a React-based project management tool
- Data Analytics Dashboard: Created real-time analytics using Python and D3.js
`;

async function testQuestionGeneration() {
    console.log("🧪 Testing Question Generation System");
    console.log("=====================================");
    
    // Test configuration status
    console.log("🔧 Configuration Status:");
    console.log("Gemini AI Configured:", isGeminiConfigured());
    
    // Test skill detection
    console.log("\n🎯 Detected Skills:");
    const skills = getResumeSkills(testResumeText);
    console.log(skills);
    
    // Test question generation
    console.log("\n🚀 Generating Questions...");
    try {
        const questions = await generateQuestions(testResumeText);
        console.log("\n✅ Generated Questions:");
        questions.forEach((question, index) => {
            console.log(`${index + 1}. ${question}`);
        });
        
        console.log(`\n📊 Total Questions: ${questions.length}`);
        console.log("✅ Question generation test completed successfully!");
        
    } catch (error) {
        console.error("❌ Question generation failed:", error.message);
    }
}

// Run the test
testQuestionGeneration().catch(console.error);