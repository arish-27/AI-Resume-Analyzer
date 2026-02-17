import React from 'react';

const Navbar = ({ currentSection, onNavigate }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
            <div className="container">
                <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>
                    <i className="bi bi-journal-text me-2"></i>ResumeIQ
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a
                                className={`nav-link section-link ${currentSection === 'landing' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
                            >
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link section-link ${currentSection === 'upload' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate('upload'); }}
                            >
                                Generate Questions
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link section-link ${currentSection === 'interview' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate('interview'); }}
                            >
                                Practice Interview
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
