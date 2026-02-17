import React from 'react';

const SimpleFooter = ({ onNavigate }) => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>ResumeIQ</h5>
                        <p>AI-powered voice interview practice system for job seekers.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <a href="#" className="text-light section-link" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Home</a>
                            </li>
                            <li>
                                <a href="#" className="text-light section-link" onClick={(e) => { e.preventDefault(); onNavigate('upload'); }}>Generate Questions</a>
                            </li>
                            <li>
                                <a href="#" className="text-light section-link" onClick={(e) => { e.preventDefault(); onNavigate('interview'); }}>Practice Interview</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact</h5>
                        <p>Rajalakshmi Engineering College<br />ANNA UNIVERSITY</p>
                    </div>
                </div>
                <hr className="my-4 bg-light" />
                <div className="text-center">
                    <p>&copy; 2025 Mini Project by Arish S -- ResumeIQ. .</p>
                </div>
            </div>
        </footer>
    );
};

export default SimpleFooter;
