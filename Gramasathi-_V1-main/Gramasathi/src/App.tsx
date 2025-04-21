import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import VoiceControl from './components/ui/VoiceControl';
import GoogleMapsProvider from './components/GoogleMapsProvider';

// Pages
import Home from './pages/Home';
import HealthSathi from './pages/HealthSathi/HealthSathi';
import EduSathi from './pages/EduSathi/EduSathi';
import KrishiSathi from './pages/KrishiSathi/KrishiSathi';
import GrievanceReporting from './pages/GrievanceReporting/GrievanceReporting';
import EcoSathi from './pages/EcoSathi/EcoSathi';
import RozgarSathi from './pages/RozgarSathi/RozgarSathi';
import CharitySathi from './pages/CharitySathi/CharitySathi';
import CampaignDetails from './pages/CharitySathi/CampaignDetails';
import CreateCampaign from './pages/CharitySathi/CreateCampaign';
import Donate from './pages/CharitySathi/Donate';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Profile/Dashboard';
import HealthCamps from './pages/HealthSathi/HealthCamps';

// Auth provider
import { AuthProvider } from './hooks/AuthContext';
import { VoiceProvider } from './hooks/VoiceContext';
import JobBoard from './pages/JobBoard';
import AddWorker from './pages/AddWorker';
import AddJobRequest from './pages/AddJobRequest';
import MyJobs from './pages/MyJobs';
import MyApplications from './pages/MyJobs';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <VoiceProvider>
        <GoogleMapsProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow md:ml-64 pt-16 md:pt-0">
              <div className="container mx-auto px-4 py-6">
                <Suspense fallback={<div className="flex justify-center py-12">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/health" element={<HealthSathi />} />
                    <Route path="/health/camps" element={<HealthCamps />} />
                    <Route path="/edu" element={<EduSathi />} />
                    <Route path="/krishi" element={<KrishiSathi />} />
                    <Route path="/grievance" element={<GrievanceReporting />} />
                    <Route path="/eco" element={<EcoSathi />} />
                    <Route path="/rozgar" element={<RozgarSathi />} />
                    <Route path="/job-board" element={<JobBoard />} />
                    <Route path="/add-job-request" element={<AddJobRequest />} />
                    
                    <Route path="/add-worker" element={<AddWorker />} />
                    <Route path="/my-jobs" element={<MyJobs />} />
                    <Route path="/my-applications" element={<MyApplications />} />



                    

                    <Route path="/charity" element={<CharitySathi />} />
                    <Route path="/charity/:id" element={<CampaignDetails />} />
                    <Route path="/charity/create" element={<CreateCampaign />} />
                    <Route path="/charity/:campaignId/donate" element={<Donate />} />
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/dashboard" element={<Dashboard />} />
                    <Route path="/profile/donations" element={<Dashboard />} />
                    <Route path="/profile/campaigns" element={<Dashboard />} />
                    <Route path="/profile/grievances" element={<Dashboard />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
            <Footer />
            <VoiceControl />
          </div>
        </GoogleMapsProvider>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;