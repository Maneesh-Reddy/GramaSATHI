import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, CreditCard, LogOut, LayoutDashboard, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import useApi from '../../hooks/useApi';
import { useVoiceContext } from '../../hooks/VoiceContext';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const api = useApi();
  const { speak } = useVoiceContext();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    speak(t('common.loggedOut'));
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-4">
            {t('profile.title')}
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile header */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white overflow-hidden mr-4 flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User size={32} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-primary-100">{user.email}</p>
              </div>
            </div>
          </div>
          
          {/* Profile content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('common.information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t('auth.name')}
                    </label>
                    <div className="mt-1 text-gray-900">{user.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t('auth.email')}
                    </label>
                    <div className="mt-1 text-gray-900">{user.email}</div>
                  </div>
                  
                  {user.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {t('auth.phone')}
                      </label>
                      <div className="mt-1 text-gray-900">{user.phone}</div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      {t('auth.language')}
                    </label>
                    <div className="mt-1 text-gray-900">
                      {user.preferredLanguage === 'en' ? t('voice.langEn') : 
                        user.preferredLanguage === 'te' ? t('voice.langTe') : 
                        user.preferredLanguage === 'hi' ? t('voice.langHi') : 
                        user.preferredLanguage}
                    </div>
                  </div>
                  
                  {(user.village || user.district || user.state) && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">
                        {t('charity.campaign.location')}
                      </label>
                      <div className="mt-1 text-gray-900">
                        {[user.village, user.district, user.state].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions sidebar */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('common.actions')}
                </h3>
                
                <div className="space-y-3">
                  <Link 
                    to="/profile/dashboard" 
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <LayoutDashboard size={18} className="mr-2 text-primary-600" />
                    {t('profile.dashboard')}
                  </Link>

                  <Link 
                    to="/profile/campaigns" 
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <Users size={18} className="mr-2 text-blue-600" />
                    {t('profile.campaigns')}
                  </Link>

                  <Link 
                    to="/profile/donations" 
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <CreditCard size={18} className="mr-2 text-green-600" />
                    {t('profile.donations')}
                  </Link>

                  <Link 
                    to="/profile/grievances" 
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <AlertCircle size={18} className="mr-2 text-amber-600" />
                    {t('profile.grievances')}
                  </Link>
                  
                  <Link 
                    to="#" 
                    className="w-full flex items-center px-4 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <Settings size={18} className="mr-2 text-gray-500" />
                    {t('profile.edit')}
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-left text-red-600 rounded-md hover:bg-red-50"
                  >
                    <LogOut size={18} className="mr-2" />
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 