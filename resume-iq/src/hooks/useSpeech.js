import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeech = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
                setError(null);
            };

            recognition.onresult = (event) => {
                const results = event.results;
                const latestResult = results[results.length - 1];
                const text = latestResult[0].transcript;
                setTranscript(text);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setError(event.error);
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError('Speech recognition not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = useCallback(() => {
        if (recognitionRef.current) {
            setTranscript(''); // Clear previous transcript
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                // Sometimes it errors if already started, just ignore
            }
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speaking
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported');
        }
    }, []);

    return {
        isRecording,
        transcript,
        error,
        startRecording,
        stopRecording,
        speak
    };
};
