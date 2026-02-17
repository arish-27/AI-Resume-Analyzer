import React from 'react';

const LandingSection = ({ onStart, onDemo }) => {
    return (
        <section className="section active">
            <div className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">AI-Powered Voice Interview Practice</h1>
                            <p className="lead mb-4">Practice with AI-generated questions and get real-time feedback on your answers.</p>
                            <button className="btn btn-light btn-lg me-3 start-btn" onClick={onStart}>Get Started</button>
                            <button className="btn btn-outline-light btn-lg section-link" onClick={onDemo}>Try Demo</button>
                        </div>
                        <div className="col-lg-6 text-center">
                            <img src="142-1424731_female-graduate-icon-hd-png-download.png" alt="Resume" className="hero-img" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <h2 className="text-center section-title">How It Works</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="bi bi-upload"></i>
                            </div>
                            <h4>Upload Resume</h4>
                            <p>Upload your resume and our AI extracts key information about your skills and experience.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="bi bi-mic"></i>
                            </div>
                            <h4>Voice Interview</h4>
                            <p>Practice answering questions verbally. Our system listens and analyzes your responses.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <h4>Get Feedback</h4>
                            <p>Receive instant feedback on content, language skills, and suggestions for improvement.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingSection;
