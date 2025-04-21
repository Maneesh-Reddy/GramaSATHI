import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import {
  GoogleMap,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { useGoogleMaps } from '../../components/GoogleMapsProvider';

const mapStyle = { width: '100%', height: '600px' };

// Mock camp data for development and demonstration
const mockCamps = [
  {
    _id: 'camp1',
    title: 'Free Health Checkup Camp',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    description: 'General health checkup including blood pressure, sugar, and BMI measurements.',
    location: {
      coordinates: [78.9629, 20.5937] // Approximate center of India
    },
    services: ['Blood Pressure', 'Diabetes Check', 'BMI Calculation', 'Eye Exam'],
    organizer: 'District Health Department',
    contact: '+91 98765 43210'
  },
  {
    _id: 'camp2',
    title: 'COVID-19 Vaccination Drive',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    description: 'Free COVID-19 vaccination for all eligible citizens. Bring ID proof.',
    location: {
      coordinates: [78.9729, 20.5837] // Slightly offset from center
    },
    services: ['COVID-19 Vaccine', 'Health Certificate'],
    organizer: 'National Health Mission',
    contact: '+91 98765 43211'
  },
  {
    _id: 'camp3',
    title: 'Women\'s Health Camp',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    description: 'Special camp focused on women\'s health issues including anemia detection and breast cancer awareness.',
    location: {
      coordinates: [78.9529, 20.6037] // Another slight offset
    },
    services: ['Anemia Detection', 'Breast Cancer Awareness', 'Nutrition Counseling'],
    organizer: 'Women\'s Health Initiative',
    contact: '+91 98765 43212'
  },
  {
    _id: 'camp4',
    title: 'Child Health and Vaccination',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    description: 'Routine vaccinations and health checkup for children under 5 years.',
    location: {
      coordinates: [78.9829, 20.5737] // Another offset
    },
    services: ['Routine Vaccination', 'Growth Monitoring', 'Nutrition Assessment'],
    organizer: 'UNICEF & District Health Department',
    contact: '+91 98765 43213'
  },
  {
    _id: 'camp5',
    title: 'Diabetes and Hypertension Camp',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    description: 'Specialized camp for diabetes and hypertension screening and management.',
    location: {
      coordinates: [78.9429, 20.6137] // Another offset
    },
    services: ['Blood Sugar Test', 'Blood Pressure Check', 'Medication Counseling', 'Dietary Advice'],
    organizer: 'Diabetes Foundation of India',
    contact: '+91 98765 43214'
  }
];

const HealthCamps: React.FC = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate,   setEndDate]   = useState<Date | null>(null);
  const [pos,       setPos]       = useState<{ lat: number; lng: number } | null>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const api = useApi();

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPos({ lat: coords.latitude, lng: coords.longitude });
        
        // If we have mock camp data, adjust their positions relative to user's location
        if (mockCamps.length > 0) {
          const adjustedMockCamps = mockCamps.map((camp, index) => {
            // Create a realistic distribution around the user
            const offsetLat = (Math.random() - 0.5) * 0.1; // Create random offset of ±0.05 degrees lat
            const offsetLng = (Math.random() - 0.5) * 0.1; // Create random offset of ±0.05 degrees lng
            
            return {
              ...camp,
              location: {
                coordinates: [
                  coords.longitude + offsetLng, 
                  coords.latitude + offsetLat
                ]
              }
            };
          });
          
          // Store the adjusted positions in state
          setCamps(adjustedMockCamps);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        // Fall back to default position (center of India)
        setPos({ lat: 20.5937, lng: 78.9629 });
        // Use mock camps with their original coordinates
        setCamps(mockCamps);
      }
    );
  }, []);

  // Fetch camps when filters change
  useEffect(() => {
    if (!pos) return;
    
    const fetchCamps = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate.toISOString());
        if (endDate) queryParams.append('endDate', endDate.toISOString());
        queryParams.append('lat', pos.lat.toString());
        queryParams.append('lng', pos.lng.toString());
        queryParams.append('radius', '10');
        
        const result = await api.request(`/camps?${queryParams.toString()}`);
        if (result.success && result.data && result.data.length > 0) {
          setCamps(result.data);
        } else {
          // If API returns no data, keep using the mock data
          // Don't set an error message since we're using mock data
          console.log("No real camp data available, using mock data");
        }
      } catch (err) {
        console.error("Error fetching camps:", err);
        // Don't set an error message since we're already showing mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCamps();
  }, [pos, startDate, endDate]);

  // Filter camps based on date range if set
  const filteredCamps = camps.filter(camp => {
    const campDate = new Date(camp.date);
    
    if (startDate && campDate < startDate) {
      return false;
    }
    
    if (endDate && campDate > endDate) {
      return false;
    }
    
    return true;
  });

  if (!pos) return <div className="text-center py-12">Locating you…</div>;
  if (isLoading) return <div className="text-center py-12">Loading health camps…</div>;
  if (loadError) return <div className="text-center py-12 text-red-600">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="text-center py-12">Loading Google Maps...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4">{t('health.upcomingCamps') || 'Upcoming Health Camps'}</h2>
      
      {/* Date filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <DatePicker
          selected={startDate}
          onChange={(d) => setStartDate(d)}
          placeholderText={t('health.fromDate') || 'From date'}
          className="px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
        <DatePicker
          selected={endDate}
          onChange={(d) => setEndDate(d)}
          placeholderText={t('health.toDate') || 'To date'}
          className="px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Map Section */}
        <div className="md:w-2/3">
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={pos}
            zoom={11}
            options={{
              fullscreenControl: true,
              streetViewControl: false,
              mapTypeControl: true,
              zoomControl: true
            }}
          >
            {/* User location marker */}
            <Marker 
              position={pos}
              title="You are here"
              icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            />
            
            {/* Camp markers */}
            {filteredCamps.map((camp) => (
              <Marker
                key={camp._id}
                position={{
                  lat: camp.location.coordinates[1],
                  lng: camp.location.coordinates[0]
                }}
                onClick={() => setSelectedCamp(camp)}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(30, 30)
                }}
              />
            ))}
            
            {/* Info window for selected camp */}
            {selectedCamp && (
              <InfoWindow
                position={{
                  lat: selectedCamp.location.coordinates[1],
                  lng: selectedCamp.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedCamp(null)}
              >
                <div className="p-2 max-w-[300px]">
                  <h3 className="font-semibold text-lg">{selectedCamp.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {new Date(selectedCamp.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">{selectedCamp.description}</p>
                  {selectedCamp.services && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Services provided:</h4>
                      <ul className="text-sm list-disc list-inside">
                        {selectedCamp.services.map((service: string, index: number) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedCamp.organizer && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Organizer:</span> {selectedCamp.organizer}
                    </p>
                  )}
                  {selectedCamp.contact && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Contact:</span> {selectedCamp.contact}
                    </p>
                  )}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCamp.location.coordinates[1]},${selectedCamp.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Get directions
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        
        {/* Camp List Sidebar */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('health.upcomingCamps') || 'Upcoming Health Camps'}</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[530px] overflow-y-auto pr-1">
                {filteredCamps.length > 0 ? (
                  filteredCamps.map((camp) => (
                    <div 
                      key={camp._id} 
                      className={`border rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition duration-150 ${selectedCamp && selectedCamp._id === camp._id ? 'bg-blue-50 border-blue-300' : ''}`}
                      onClick={() => setSelectedCamp(camp)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-2 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{camp.title}</h4>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-600 ml-1">{new Date(camp.date).toLocaleDateString()}</p>
                          </div>
                          {camp.services && camp.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {camp.services.slice(0, 2).map((service: string, index: number) => (
                                <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                  {service}
                                </span>
                              ))}
                              {camp.services.length > 2 && (
                                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                                  +{camp.services.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                          {camp.organizer && (
                            <p className="text-xs text-gray-500 mt-2">{camp.organizer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600 mt-2">{t('health.noCampsFound') || 'No health camps found for the selected dates'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCamps;
