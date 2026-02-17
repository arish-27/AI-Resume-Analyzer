import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingSection from './components/LandingSection';
import UploadSection from './components/UploadSection';
import InterviewSection from './components/InterviewSection';
import Footer from './components/Footer';
import './index.css'; // Global styles

function App() {
  const [currentSection, setCurrentSection] = useState('landing');
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const handleNavigate = (section) => {
    setCurrentSection(section);
    updateProgress(section);
  };

  const handleQuestionsGenerated = (generatedQuestions, questionMetadata = null) => {
    setQuestions(generatedQuestions);
    setMetadata(questionMetadata);
    handleNavigate('interview');
  };

  const updateProgress = (section) => {
    switch (section) {
      case 'landing':
        setProgress(0);
        break;
      case 'upload':
        setProgress(33);
        break;
      case 'interview':
        setProgress(100);
        break;
      default:
        setProgress(0);
    }
  };

  return (
    <>
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <main>
        {currentSection === 'landing' && (
          <LandingSection
            onStart={() => handleNavigate('upload')}
            onDemo={() => handleNavigate('upload')}
          />
        )}

        {currentSection === 'upload' && (
          <UploadSection
            onGenerate={handleQuestionsGenerated}
          />
        )}

        {currentSection === 'interview' && (
          <InterviewSection questions={questions} metadata={metadata} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}

export default App;
