import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX } from 'lucide-react';
import useVoiceInstructions from '../../hooks/useVoiceInstructions';

interface VoiceInstructionButtonProps {
  instructionKey: string;
}

const VoiceInstructionButton: React.FC<VoiceInstructionButtonProps> = ({ instructionKey }) => {
  const { t } = useTranslation();
  const { speak, stop, isSpeaking } = useVoiceInstructions(instructionKey);

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors 
        ${isSpeaking 
          ? 'bg-accent-500 text-white hover:bg-accent-600' 
          : 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200'
        }`}
      aria-label={isSpeaking ? t('common.stopSpeaking') : t('common.speakInstructions')}
    >
      {isSpeaking ? (
        <>
          <VolumeX size={20} className="mr-2" />
          {t('common.stopSpeaking')}
        </>
      ) : (
        <>
          <Volume2 size={20} className="mr-2" />
          {t('common.speakInstructions')}
        </>
      )}
    </button>
  );
};

export default VoiceInstructionButton;