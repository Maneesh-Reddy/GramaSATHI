import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoadScript } from '@react-google-maps/api';

// Define the libraries we need
const libraries = ['places'];

// Create context to track if Maps is loaded
interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: false
});

// Hook to use the context
export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Get API key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries as any}
        onLoad={() => setIsLoaded(true)}
        onError={() => setLoadError(true)}
        loadingElement={<div>Loading Google Maps...</div>}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsProvider; 