import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseVoiceProps {
  onTranscription?: (text: string) => void;
}

type VoiceLanguage = 'en' | 'te' | 'hi';

const useVoice = ({ onTranscription }: UseVoiceProps = {}) => {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState<VoiceLanguage>('en');
  const [recognition, setRecognition] = useState<any>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    
    // Set language based on current i18n language or voiceLanguage
    const lang = voiceLanguage || i18n.language || 'en';
    recognitionInstance.lang = mapLanguageCode(lang);
    
    recognitionInstance.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
      
      if (result.isFinal && onTranscription) {
        onTranscription(text);
      }
    };
    
    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [i18n.language, voiceLanguage, onTranscription, isListening]);
  
  // Get available voices for speech synthesis
  useEffect(() => {
    const getVoices = () => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      setAvailableVoices(voices);
    };
    
    if (window.speechSynthesis) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
      
      getVoices();
    }
  }, []);
  
  // Start listening
  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  }, [recognition]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);
  
  // Speak text
  const speak = useCallback((text: string, language?: VoiceLanguage) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = language || voiceLanguage || i18n.language || 'en';
    utterance.lang = mapLanguageCode(lang);
    
    // Try to find an appropriate voice
    const langCode = mapLanguageCode(lang).substring(0, 2);
    const voice = availableVoices.find(v => v.lang.startsWith(langCode));
    
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, [voiceLanguage, i18n.language, availableVoices]);
  
  // Map language codes
  const mapLanguageCode = (code: string): string => {
    const langMap: Record<string, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN'
    };
    
    return langMap[code] || 'en-US';
  };
  
  // Change voice language
  const changeVoiceLanguage = (language: VoiceLanguage) => {
    setVoiceLanguage(language);
    
    if (recognition) {
      const wasListening = isListening;
      
      if (wasListening) {
        recognition.stop();
      }
      
      recognition.lang = mapLanguageCode(language);
      
      if (wasListening) {
        recognition.start();
      }
    }
  };
  
  return {
    isListening,
    transcript,
    voiceLanguage,
    startListening,
    stopListening,
    speak,
    changeVoiceLanguage,
    availableVoices
  };
};

export default useVoice; 