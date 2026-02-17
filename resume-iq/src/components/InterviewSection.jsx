
import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { sampleQuestions as defaultQuestions, analyzeResponse, getFinalFeedback } from '../utils/interviewLogic';

const InterviewSection = ({ questions, metadata }) => {
    const { isRecording, startRecording, stopRecording, transcript, speak, error } = useSpeech();

    // Use passed questions or fallback to default
    const interviewQuestions = (questions && questions.length > 0) ? questions : defaultQuestions;

    // Extract categorized questions if available
    const technicalQuestions = metadata?.categorized?.technical || [];
    const hrQuestions = metadata?.categorized?.hr || [];
    const detectedSkills = metadata?.skills || [];
    const experienceHighlights = metadata?.experience || [];

    const [gameState, setGameState] = useState('intro'); // intro, question, recording, processing, feedback, finished
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedbackHTML, setFeedbackHTML] = useState('');
    const [userResponseText, setUserResponseText] = useState('');

    // To safe guard against speech recognition results coming in after we stop
    const isProcessingRef = useRef(false);

    useEffect(() => {
        if (transcript && gameState === 'recording') {
            setUserResponseText(transcript);
        }
    }, [transcript, gameState]);

    const handleStartInterview = () => {
        setGameState('question');
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedbackHTML('');
        setUserResponseText('');
        speak(interviewQuestions[0]);
    };

    const handleRecordToggle = () => {
        if (gameState === 'question' || gameState === 'feedback') {
            // Start recording (answer)
            // If we are in 'feedback' state, it means we are re-recording? No, usually proceed to next question.
            // But the UI has "Answer Question" enabled in 'question' state.
            // Wait, logic in script.js:
            // startInterview -> speak question -> recordBtn enabled.
            // click record -> start recording.
            // click record again -> stop -> processing.

            if (!isRecording) {
                setGameState('recording');
                startRecording();
                setUserResponseText('');
            }
        } else if (gameState === 'recording') {
            handleStopRecording();
        }
    };

    const handleStopRecording = () => {
        stopRecording();
        setGameState('processing');
        isProcessingRef.current = true;

        // Analyze response
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        analyzeResponse(transcript || userResponseText, interviewQuestions[currentQuestionIndex], currentQuestionIndex, score, apiKey)
            .then((result) => {
                setScore(result.score);
                setFeedbackHTML(result.html);
                setGameState('feedback');
                isProcessingRef.current = false;
            });
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < interviewQuestions.length) {
            setCurrentQuestionIndex(nextIndex);
            setGameState('question');
            setFeedbackHTML('');
            setUserResponseText('');
            speak(interviewQuestions[nextIndex]);
        } else {
            setGameState('finished');
            const final = getFinalFeedback(score);
            setFeedbackHTML(final);
        }
    };

    const handleEndInterview = () => {
        stopRecording();
        setGameState('intro');
        setScore(0);
        setCurrentQuestionIndex(0);
        setFeedbackHTML('');
        setUserResponseText('');
    };

    return (
        <section className="section active" id="interview">
            <div className="container">
                <div className="interview-container">
                    <h2 className="text-center section-title">AI Practice Interview</h2>
                    <p className="text-center text-muted mb-3">Answer questions verbally and get instant feedback</p>

                    {/* Show metadata if available */}
                    {metadata && (detectedSkills.length > 0 || technicalQuestions.length > 0) && (
                        <div className="alert alert-success mb-4">
                            <div className="row text-center">
                                {detectedSkills.length > 0 && (
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Skills Analyzed</small>
                                        <strong>{detectedSkills.length}</strong>
                                    </div>
                                )}
                                {technicalQuestions.length > 0 && (
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">Technical Questions</small>
                                        <strong>{technicalQuestions.length}</strong>
                                    </div>
                                )}
                                {hrQuestions.length > 0 && (
                                    <div className="col-md-4">
                                        <small className="text-muted d-block">HR Questions</small>
                                        <strong>{hrQuestions.length}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Question Display */}
                    <div className="question-display">
                        <h3 id="currentQuestion">
                            {gameState === 'intro'
                                ? 'Click "Start Interview" to begin your practice session'
                                : gameState === 'finished'
                                    ? 'Interview completed! Great job!'
                                    : interviewQuestions[currentQuestionIndex]
                            }
                        </h3>
                    </div>

                    {/* Voice Visualization */}
                    {gameState === 'recording' && (
                        <div className="voice-wave" id="voiceWave">
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                            <div className="voice-bar"></div>
                        </div>
                    )}

                    {/* Recording Indicator */}
                    {gameState === 'recording' && (
                        <div className="recording-indicator" id="recordingIndicator">
                            <span className="pulse"></span>
                            <strong>Listening... Speak now</strong>
                        </div>
                    )}

                    {/* Response Display */}
                    {(userResponseText || gameState === 'processing' || gameState === 'feedback') && (
                        <div className="response-container" id="responseContainer" style={{ display: 'block' }}>
                            <h5>Your Response:</h5>
                            <p id="userResponse">{userResponseText || (gameState === 'processing' ? 'Processing...' : '')}</p>
                        </div>
                    )}

                    {/* Feedback Display */}
                    <div id="feedbackArea" dangerouslySetInnerHTML={{ __html: feedbackHTML }}></div>

                    {/* Score Display */}
                    {gameState !== 'intro' && (
                        <div className="score-display" id="scoreDisplay" style={{ display: 'block' }}>
                            Current Score: <span id="scoreValue">{score}</span>/100
                        </div>
                    )}

                    {/* Interview Controls */}
                    <div className="interview-controls">
                        {gameState === 'intro' ? (
                            <button className="btn btn-success btn-lg" onClick={handleStartInterview}>
                                <i className="bi bi-play-circle me-2"></i>Start Interview
                            </button>
                        ) : gameState === 'finished' ? (
                            <button className="btn btn-secondary btn-lg" onClick={handleEndInterview}>
                                <i className="bi bi-arrow-repeat me-2"></i>Restart
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`btn btn-lg ${isRecording ? 'btn-danger' : 'btn-primary'}`}
                                    id="recordBtn"
                                    onClick={handleRecordToggle}
                                    disabled={gameState === 'processing' || gameState === 'finished'}
                                    style={{ display: gameState === 'question' || gameState === 'recording' ? 'inline-block' : 'none' }}
                                >
                                    {isRecording ? (
                                        <><i className="bi bi-stop-circle me-2"></i>Stop Recording</>
                                    ) : (
                                        <><i className="bi bi-mic me-2"></i>Answer Question</>
                                    )}
                                </button>

                                <button
                                    className="btn btn-warning btn-lg"
                                    id="nextQuestionBtn"
                                    onClick={handleNextQuestion}
                                    disabled={gameState !== 'feedback'}
                                    style={{ display: gameState === 'feedback' ? 'inline-block' : 'none' }}
                                >
                                    <i className="bi bi-skip-forward me-2"></i>Next Question
                                </button>

                                <button className="btn btn-secondary btn-lg" onClick={handleEndInterview}>
                                    <i className="bi bi-stop-circle me-2"></i>End Interview
                                </button>
                            </>
                        )}
                    </div>
                    {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
                </div>
            </div>
        </section>
    );
};

export default InterviewSection;
