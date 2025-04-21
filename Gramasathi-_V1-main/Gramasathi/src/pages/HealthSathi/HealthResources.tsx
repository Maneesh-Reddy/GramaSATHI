import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getHealthResources } from '../../data/healthData';
import useApi from '../../hooks/useApi';
import {
  GoogleMap,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { useGoogleMaps } from '../../components/GoogleMapsProvider';

const mapStyle = { width: '100%', height: '500px' };

interface HospitalNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: { name?: string; amenity?: string; healthcare?: string; [key: string]: string | undefined };
}

interface HospitalWay {
  type: 'way';
  id: number;
  center: { lat: number; lon: number };
  tags?: { name?: string; amenity?: string; healthcare?: string; [key: string]: string | undefined };
}

type HospitalElement = HospitalNode | HospitalWay;

interface HospitalData {
  elements: HospitalElement[];
}

// Process hospital data into a uniform format
const processHospitalData = (data: HospitalData) => {
  if (!data || !data.elements) return [];

  return data.elements.map(element => {
    const position = element.type === 'node' 
      ? { lat: element.lat, lng: element.lon }
      : { lat: element.center.lat, lng: element.center.lon };
    
    const name = element.tags?.name || 
      (element.tags?.amenity === 'hospital' ? 'Hospital' : 
      (element.tags?.healthcare ? `${element.tags.healthcare} Facility` : 'Health Facility'));
    
    return {
      id: `${element.type}-${element.id}`,
      name,
      position,
      type: element.tags?.amenity || element.tags?.healthcare || 'medical',
      tags: element.tags,
      // Calculate distance from user later
      distance: 0
    };
  });
};

// Calculate distance between two points in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

interface HealthResourcesProps {
  searchQuery?: string;
  locationFilter?: string;
}

const HealthResources: React.FC<HealthResourcesProps> = ({ 
  searchQuery = '', 
  locationFilter = '' 
}) => {
  const { t } = useTranslation();
  const resources = getHealthResources();
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Your Location');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const api = useApi();
  
  // Set default position and try to get actual location
  useEffect(() => {
    // Default position (India)
    setPos({ lat: 20.5937, lng: 78.9629 });
    
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        setPos(position);
        
        // Try to get the name of the current location using reverse geocoding
        if (isLoaded && window.google && window.google.maps) {
          try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, function(results, status) {
              if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                // Extract location name from address components
                const addressComponents = results[0].address_components;
                
                // Try to find a locality or sublocality
                const locality = addressComponents.find(
                  component => component.types.includes("locality") || component.types.includes("sublocality")
                );
                
                // If no locality found, try administrative area
                const adminArea = addressComponents.find(
                  component => component.types.includes("administrative_area_level_1") || 
                               component.types.includes("administrative_area_level_2")
                );
                
                if (locality) {
                  setLocationName(locality.long_name);
                } else if (adminArea) {
                  setLocationName(adminArea.long_name);
                }
              }
            });
          } catch (error) {
            console.error("Geocoding error:", error);
          }
        }
      },
      (err) => {
        console.error("Geo error:", err);
      }
    );
  }, [isLoaded]);
  
  // Fetch real hospital data
  useEffect(() => {
    if (!pos) return;
    
    const fetchHospitals = async () => {
      setIsLoading(true);
      setFetchError(null);
      
      try {
        // First try the external endpoint
        const result = await api.request(`/external/hospitals?lat=${pos.lat}&lng=${pos.lng}&radius=10000`);
        
        if (result.success && result.data?.elements?.length > 0) {
          // Process and use real data
          let processedData = processHospitalData(result.data);
          
          // Calculate distance for each hospital
          processedData = processedData.map(hospital => ({
            ...hospital,
            distance: calculateDistance(
              pos.lat, 
              pos.lng, 
              hospital.position.lat, 
              hospital.position.lng
            )
          }));
          
          // Sort by distance
          processedData.sort((a, b) => a.distance - b.distance);
          
          console.log("Found real hospital data:", processedData.length, "hospitals");
          setHospitals(processedData);
        } else {
          // Try a direct call to Overpass API as backup
          console.log("No hospitals from backend, trying direct Overpass API");
          
          // Build query
          const radius = 10000; // 10km
          const overpassQuery = `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:${radius},${pos.lat},${pos.lng});
              way["amenity"="hospital"](around:${radius},${pos.lat},${pos.lng});
              node["amenity"="clinic"](around:${radius},${pos.lat},${pos.lng});
              way["amenity"="clinic"](around:${radius},${pos.lat},${pos.lng});
              node["healthcare"](around:${radius},${pos.lat},${pos.lng});
              way["healthcare"](around:${radius},${pos.lat},${pos.lng});
            );
            out center;
          `;
          
          const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
          
          const response = await fetch(overpassUrl);
          if (!response.ok) throw new Error('Overpass API request failed');
          
          const data = await response.json();
          let processedData = processHospitalData(data);
          
          // Calculate distance for each hospital
          processedData = processedData.map(hospital => ({
            ...hospital,
            distance: calculateDistance(
              pos.lat, 
              pos.lng, 
              hospital.position.lat, 
              hospital.position.lng
            )
          }));
          
          // Sort by distance
          processedData.sort((a, b) => a.distance - b.distance);
          
          console.log("Direct Overpass API data:", processedData.length, "hospitals");
          
          if (processedData.length > 0) {
            setHospitals(processedData);
          } else {
            setFetchError("No hospitals found in this area");
          }
        }
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setFetchError("Failed to fetch hospital data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHospitals();
  }, [pos]);
  
  // Apply filters
  const filteredResources = resources.filter(resource => {
    // Search filter
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (locationFilter && resource.location !== locationFilter) {
      return false;
    }
    
    return true;
  });

  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">{t('health.nearbyResources')}</h2>
      
      {loadError ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">Failed to load Google Maps. Please check your connection.</p>
        </div>
      ) : !isLoaded ? (
        <div className="p-4 border rounded">
          <p>Loading Google Maps...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Map Section */}
          {pos && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{t('health.nearbyHealthServices')}</h2>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 border border-blue-200">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                  <span className="text-sm font-medium">{locationName}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-2/3">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "600px" }}
                    center={pos || { lat: 0, lng: 0 }}
                    zoom={13}
                    options={{
                      fullscreenControl: true,
                      streetViewControl: false,
                      mapTypeControl: true,
                      zoomControl: true
                    }}
                  >
                    {/* Render User Marker */}
                    {pos && (
                      <Marker
                        position={pos}
                        title="You are here"
                        animation={2}
                        icon={{ 
                          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          scaledSize: new window.google.maps.Size(40, 40)
                        }}
                        onClick={() => {
                          setSelectedPlace({
                            id: 'your-location',
                            name: locationName,
                            position: pos,
                            isUserLocation: true
                          });
                        }}
                      />
                    )}

                    {/* Render Hospital Markers */}
                    {hospitals.map((hospital, index) => (
                      <Marker
                        key={index}
                        position={{
                          lat: hospital.position.lat,
                          lng: hospital.position.lng,
                        }}
                        title={hospital.name}
                        icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                        onClick={() => setSelectedPlace(hospital)}
                      />
                    ))}

                    {/* Info Window for selected hospital */}
                    {selectedPlace && (
                      <InfoWindow
                        position={{
                          lat: selectedPlace.position.lat,
                          lng: selectedPlace.position.lng,
                        }}
                        onCloseClick={() => setSelectedPlace(null)}
                      >
                        {selectedPlace.isUserLocation ? (
                          <div className="p-2 max-w-[300px]">
                            <h3 className="font-semibold text-lg">{selectedPlace.name}</h3>
                            <p className="text-sm text-blue-600 font-medium mt-1">Your current location</p>
                          </div>
                        ) : (
                          <div className="p-2 max-w-[300px]">
                            <h3 className="font-semibold text-lg">{selectedPlace.name}</h3>
                            <p className="text-sm text-blue-600 font-medium mt-1">
                              {selectedPlace.distance.toFixed(1)} km away
                            </p>
                            {selectedPlace.tags && (
                              <div className="mt-2 text-sm">
                                {selectedPlace.tags.healthcare && <p><span className="font-medium">Type:</span> {selectedPlace.tags.healthcare}</p>}
                                {selectedPlace.tags.amenity && <p><span className="font-medium">Amenity:</span> {selectedPlace.tags.amenity}</p>}
                                {selectedPlace.tags.operator && <p><span className="font-medium">Operator:</span> {selectedPlace.tags.operator}</p>}
                                {selectedPlace.tags.address && <p><span className="font-medium">Address:</span> {selectedPlace.tags.address}</p>}
                                {selectedPlace.tags.phone && <p><span className="font-medium">Phone:</span> {selectedPlace.tags.phone}</p>}
                              </div>
                            )}
                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.position.lat},${selectedPlace.position.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm hover:underline"
                              >
                                Get directions
                              </a>
                            </div>
                          </div>
                        )}
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
                
                {/* Nearby Hospitals List */}
                <div className="md:w-1/3">
                  <div className="bg-white rounded-lg shadow-md p-4 h-full">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('health.nearbyHospitals')}</h3>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                      </div>
                    ) : fetchError ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="text-amber-700 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="mt-2">{fetchError}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[530px] overflow-y-auto pr-1">
                        {/* Your Location Item */}
                        <div 
                          className="border border-blue-300 rounded-lg p-3 cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-150 mb-3"
                          onClick={() => setSelectedPlace({
                            id: 'your-location',
                            name: locationName,
                            position: pos,
                            isUserLocation: true
                          })}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 rounded-full p-2 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{locationName}</h4>
                                <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full">You</span>
                              </div>
                              <p className="text-sm text-blue-700 mt-1">Your current location</p>
                            </div>
                          </div>
                        </div>

                        {hospitals.map((hospital, index) => (
                          <div 
                            key={index} 
                            className={`border rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition duration-150 ${selectedPlace && selectedPlace.id === hospital.id ? 'bg-blue-50 border-blue-300' : ''}`}
                            onClick={() => setSelectedPlace(hospital)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-red-100 rounded-full p-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                                <div className="flex items-center mt-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <p className="text-sm text-gray-600 ml-1">{hospital.distance.toFixed(1)} km away</p>
                                </div>
                                {hospital.tags && (
                                  <>
                                    {hospital.tags.healthcare && (
                                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-2">
                                        {hospital.tags.healthcare}
                                      </span>
                                    )}
                                    {hospital.tags.amenity && (
                                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded mt-2 ml-1">
                                        {hospital.tags.amenity}
                                      </span>
                                    )}
                                  </>
                                )}
                                {hospital.tags?.address && (
                                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{hospital.tags.address}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {hospitals.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 mt-2">{t('health.noHospitalsFound')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthResources;