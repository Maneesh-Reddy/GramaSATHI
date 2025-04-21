import React, { createContext, useContext, ReactNode } from 'react';
import useVoice from './useVoice';

// Define the context type
type VoiceContextType = ReturnType<typeof useVoice> | undefined;

// Create the context
const VoiceContext = createContext<VoiceContextType>(undefined);

// Create a provider component
interface VoiceProviderProps {
  children: ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const voiceUtils = useVoice();
  
  return (
    <VoiceContext.Provider value={voiceUtils}>
      {children}
    </VoiceContext.Provider>
  );
};

// Custom hook to use the voice context
export const useVoiceContext = () => {
  const context = useContext(VoiceContext);
  
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceProvider');
  }
  
  return context;
};

export default VoiceContext; 