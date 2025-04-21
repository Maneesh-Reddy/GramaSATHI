import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useVoiceInstructions = (instructionKey: string) => {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(t(instructionKey));
    
    // Try to find a voice for Telugu when in Telugu mode
    if (i18n.language === 'te') {
      const voices = speechSynthesis.getVoices();
      const teluguVoice = voices.find(voice => 
        voice.lang === 'te-IN' || 
        voice.lang.startsWith('te')
      );
      
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [t, i18n.language, instructionKey]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
};

export default useVoiceInstructions;