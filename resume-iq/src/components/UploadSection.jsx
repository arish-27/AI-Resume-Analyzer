import React, { useState } from 'react';
import { parseFile } from '../utils/fileParser';
import { generateQuestions, isGeminiConfigured, getResumeSkills } from '../utils/questionService';
import { getComprehensiveAnalysis } from '../utils/questionGenerator';

const UploadSection = ({ onGenerate }) => {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiStatus, setAiStatus] = useState(isGeminiConfigured() ? 'ai' : 'local');
    const [detectedSkills, setDetectedSkills] = useState([]);
    const [resumeText, setResumeText] = useState('');
    const [analysisDetails, setAnalysisDetails] = useState(null);

    const handleFileChange = async (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setError('');

            // Parse file immediately to show comprehensive analysis
            try {
                const text = await parseFile(selectedFile);
                if (text && text.trim().length > 10) {
                    setResumeText(text);
                    const skills = getResumeSkills(text);
                    const analysis = getComprehensiveAnalysis(text);
                    setDetectedSkills(skills.slice(0, 15));
                    setAnalysisDetails(analysis);
                    console.log("📄 Resume preview - Comprehensive Analysis:", analysis);
                    console.log("🎯 Total skills detected:", skills.length);
                }
            } catch (err) {
                console.warn("Preview parsing failed:", err);
                // Don't show error for preview, will try again during generation
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            setError('');

            // Parse file immediately to show comprehensive analysis
            try {
                const text = await parseFile(selectedFile);
                if (text && text.trim().length > 10) {
                    setResumeText(text);
                    const skills = getResumeSkills(text);
                    const analysis = getComprehensiveAnalysis(text);
                    setDetectedSkills(skills.slice(0, 15));
                    setAnalysisDetails(analysis);
                    console.log("📄 Resume drop - Comprehensive Analysis:", analysis);
                    console.log("🎯 Total skills detected:", skills.length);
                }
            } catch (err) {
                console.warn("Preview parsing failed:", err);
                // Don't show error for preview, will try again during generation
            }
        }
    };

    const handleGenerate = async () => {
        // CRITICAL: Set loading state and clear any previous errors
        setIsLoading(true);
        setError('');

        try {
            // STEP 1: Parse the file with built-in timeout handling
            console.log("📄 Step 1: Parsing resume file...");
            const text = await parseFile(file);
            console.log("📄 PARSED RESUME TEXT LENGTH:", text.length, "characters");
            console.log("📄 FIRST 200 CHARS:", text.substring(0, 200));

            // STEP 2: Validate extracted text
            if (!text || text.trim().length < 10) {
                throw new Error("Resume content appears to be empty or too short. Please check your file.");
            }

            // Store resume text and detect skills for UI display
            setResumeText(text);
            const skills = getResumeSkills(text);
            setDetectedSkills(skills.slice(0, 10));

            console.log("✅ Resume parsed successfully, generating personalized questions...");

            // STEP 3: Generate Questions using unified service (with timeout)
            console.log("🚀 Step 3: Calling question generation service...");
            const result = await generateQuestions(text, file);
            console.log("📦 Raw result from generateQuestions:", result);

            // STEP 4: Handle both simple array and enriched object response
            let questions = [];
            let metadata = null;

            if (Array.isArray(result)) {
                questions = result;
                console.log("✅ Received array of questions:", questions.length);
            } else if (result && result.questions) {
                questions = result.questions;
                metadata = result.metadata;
                console.log("✅ Received structured response with metadata");
            } else {
                console.error("❌ Unexpected result format:", result);
                throw new Error("Invalid response format from question generation service");
            }

            // STEP 5: Validate questions
            if (!questions || questions.length === 0) {
                throw new Error("No questions were generated. Please try again.");
            }

            console.log("✅ Generated questions:", questions);
            if (metadata) {
                console.log("📊 Metadata:", metadata);
            }

            // STEP 6: Navigate to interview with questions and metadata
            console.log("🎯 Navigating to interview section...");
            onGenerate(questions, metadata);

        } catch (err) {
            // CRITICAL: Always stop loading on error
            console.error("❌ Generation Error:", err);
            console.error("❌ Error stack:", err.stack);
            setError(`Error: ${err.message || 'Unknown error occurred'}`);

            // Don't attempt fallback - just show the error
            // This prevents infinite loading if fallback also fails
        } finally {
            // CRITICAL: Always stop loading spinner
            console.log("🛑 Stopping loading spinner...");
            setIsLoading(false);
        }
    };

    return (
        <section className="section active">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h2 className="text-center section-title">Upload Your Resume</h2>
                        <p className="text-center text-muted mb-4">Supported formats: PDF, DOCX, TXT (Max size: 5MB)</p>

                        {/* AI Status Indicator */}
                        <div className="text-center mb-3">
                            {aiStatus === 'ai' ? (
                                <span className="badge bg-success">
                                    <i className="bi bi-robot me-1"></i>
                                    AI-Powered Generation Enabled
                                </span>
                            ) : (
                                <span className="badge bg-info">
                                    <i className="bi bi-cpu me-1"></i>
                                    Local Generation Mode
                                    <small className="ms-2" style={{ fontSize: '0.75em' }}>
                                        (Add VITE_GEMINI_API_KEY to .env for AI)
                                    </small>
                                </span>
                            )}
                        </div>


                        {!isLoading ? (
                            <>
                                <div
                                    className={`upload-area ${isDragOver ? 'dragover' : ''}`}
                                    id="dropZone"
                                    onClick={() => document.getElementById('fileInput').click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {file ? (
                                        <>
                                            <div className="upload-icon text-success">
                                                <i className="bi bi-check-circle"></i>
                                            </div>
                                            <h4>File Selected: {file.name}</h4>
                                            <p className="text-muted">Click "Generate Questions" to continue</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="upload-icon">
                                                <i className="bi bi-cloud-arrow-up"></i>
                                            </div>
                                            <h4>Drag & Drop your resume here</h4>
                                            <p className="text-muted">or click to browse files</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept=".pdf,.docx,.txt"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {error && <div className="alert alert-danger">{error}</div>}

                                {/* Show comprehensive analysis if resume is parsed */}
                                {detectedSkills.length > 0 && (
                                    <div className="alert alert-info">
                                        <h6><i className="bi bi-cpu-fill me-2"></i>Comprehensive Resume Analysis:</h6>

                                        {/* Skills */}
                                        <div className="mb-2">
                                            <small className="text-muted d-block mb-1"><strong>Detected Skills:</strong></small>
                                            <div className="d-flex flex-wrap gap-1">
                                                {detectedSkills.map((skill, index) => (
                                                    <span key={index} className="badge bg-primary">{skill}</span>
                                                ))}
                                                {detectedSkills.length >= 15 && <span className="badge bg-secondary">+more</span>}
                                            </div>
                                        </div>

                                        {/* Analysis details */}
                                        {analysisDetails && (
                                            <div className="row text-center mt-3">
                                                <div className="col-3">
                                                    <small className="text-muted">Technologies</small>
                                                    <div className="fw-bold">{analysisDetails.technologies.length}</div>
                                                </div>
                                                <div className="col-3">
                                                    <small className="text-muted">Frameworks</small>
                                                    <div className="fw-bold">{analysisDetails.frameworks.length}</div>
                                                </div>
                                                <div className="col-3">
                                                    <small className="text-muted">Roles</small>
                                                    <div className="fw-bold">{analysisDetails.roles.length}</div>
                                                </div>
                                                <div className="col-3">
                                                    <small className="text-muted">Experience</small>
                                                    <div className="fw-bold">{analysisDetails.experience.length}</div>
                                                </div>
                                            </div>
                                        )}

                                        <small className="text-muted mt-2 d-block">
                                            ✅ Questions will be highly personalized with technical & behavioral categories
                                        </small>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <button
                                        id="generateBtn"
                                        className="btn btn-primary btn-lg"
                                        disabled={!file}
                                        onClick={handleGenerate}
                                    >
                                        <i className="bi bi-magic me-2"></i>Generate Questions
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="loading-spinner" style={{ display: 'block' }}>
                                <div className="spinner"></div>
                                <h4>Processing your resume...</h4>
                                <p className="text-muted">This may take a few seconds</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UploadSection;
