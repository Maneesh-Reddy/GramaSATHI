import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';
import { useVoiceContext } from '../../hooks/VoiceContext';

interface VoiceControlProps {
  pageContent?: string;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ pageContent }) => {
  const { t, i18n } = useTranslation();
  const { 
    isListening, 
    transcript, 
    voiceLanguage, 
    startListening, 
    stopListening, 
    speak, 
    changeVoiceLanguage 
  } = useVoiceContext();
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  
  const handleSpeakPage = () => {
    if (pageContent) {
      speak(pageContent);
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleLanguageChange = (lang: 'en' | 'te' | 'hi') => {
    changeVoiceLanguage(lang);
    setShowLanguageOptions(false);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col space-y-2">
        {/* Language options popup */}
        {showLanguageOptions && (
          <div className="bg-white p-2 rounded-lg shadow-lg mb-2">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-2 rounded-md text-sm ${voiceLanguage === 'en' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                {t('voice.langEn')}
              </button>
              <button 
                onClick={() => handleLanguageChange('te')}
                className={`px-3 py-2 rounded-md text-sm ${voiceLanguage === 'te' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                {t('voice.langTe')}
              </button>
              <button 
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-2 rounded-md text-sm ${voiceLanguage === 'hi' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              >
                {t('voice.langHi')}
              </button>
            </div>
          </div>
        )}
        
        {/* Transcript display */}
        {isListening && transcript && (
          <div className="bg-white p-2 rounded-lg shadow-lg mb-2 max-w-xs">
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        )}
        
        {/* Voice control buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
            className="p-3 bg-secondary-500 text-white rounded-full hover:bg-secondary-600 transition-colors shadow-lg"
            aria-label={t('voice.changeLanguage')}
            title={t('voice.changeLanguage')}
          >
            <Languages size={20} />
          </button>
          
          <button
            onClick={handleSpeakPage}
            className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg"
            aria-label={t('voice.speak')}
            title={t('voice.speak')}
          >
            <Volume2 size={20} />
          </button>
          
          <button
            onClick={toggleListening}
            className={`p-3 ${isListening ? 'bg-error-500 hover:bg-error-600' : 'bg-accent-500 hover:bg-accent-600'} text-white rounded-full transition-colors shadow-lg`}
            aria-label={isListening ? t('voice.stop') : t('voice.start')}
            title={isListening ? t('voice.stop') : t('voice.start')}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
        
        {/* Status indicator */}
        {isListening && (
          <div className="text-center mt-2">
            <span className="inline-flex items-center px-2 py-1 text-xs bg-accent-100 text-accent-800 rounded-full">
              <span className="animate-pulse mr-1">●</span>
              {t('voice.listening')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControl; 