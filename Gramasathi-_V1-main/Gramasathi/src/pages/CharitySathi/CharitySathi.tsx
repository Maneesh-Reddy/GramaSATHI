import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Elderly, Users, HeartHandshake, Filter, Search, Plus, Calendar } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useVoiceContext } from '../../hooks/VoiceContext';
import { useAuth } from '../../hooks/AuthContext';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  endDate: string;
  images: string[];
  status: 'active' | 'completed' | 'cancelled';
  progressPercentage: number;
  daysRemaining: number;
  organizer: {
    name: string;
    email: string;
  };
}

const CharitySathi: React.FC = () => {
  const { t } = useTranslation();
  const { speak } = useVoiceContext();
  const { isAuthenticated } = useAuth();
  const api = useApi<Campaign[]>();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');
  
  // Load campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await api.request('/charity');
      
      if (response.success && response.data) {
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...campaigns];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(campaign => campaign.status === activeFilter);
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(campaign => campaign.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        campaign => 
          campaign.title.toLowerCase().includes(query) || 
          campaign.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCampaigns(result);
  }, [campaigns, activeFilter, activeCategory, searchQuery]);
  
  // Generate page content for voice narration
  useEffect(() => {
    const content = `
      ${t('charity.title')}. ${t('charity.description')}
      ${filteredCampaigns.length} ${t('charity.campaign.title')} ${t('common.found')}.
      ${filteredCampaigns.slice(0, 5).map(campaign => 
        `${campaign.title}. ${campaign.description.substring(0, 100)}...`
      ).join('. ')}
    `;
    
    setPageContent(content);
  }, [t, filteredCampaigns]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
          {t('charity.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('charity.description')}
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">{t('common.filter')}:</span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'all' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveFilter('all')}
            >
              {t('charity.filters.all')}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'active' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveFilter('active')}
            >
              {t('charity.filters.active')}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'completed' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveFilter('completed')}
            >
              {t('charity.filters.completed')}
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center space-x-2">
            <HeartHandshake size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">{t('charity.form.category')}:</span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeCategory === 'all' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveCategory('all')}
            >
              {t('charity.filters.all')}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeCategory === 'elderly' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveCategory('elderly')}
            >
              {t('charity.categories.elderly')}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full ${activeCategory === 'disabled' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setActiveCategory('disabled')}
            >
              {t('charity.categories.disabled')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Create Campaign Button */}
      {isAuthenticated && (
        <div className="flex justify-end mb-6">
          <Link 
            to="/charity/create" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={18} className="mr-2" />
            {t('charity.campaign.create')}
          </Link>
        </div>
      )}
      
      {/* Campaign Cards */}
      {api.loading ? (
        <div className="flex justify-center py-12">
          <p className="text-lg text-gray-600">{t('common.loading')}</p>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Link
              key={campaign._id}
              to={`/charity/${campaign._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                {campaign.images && campaign.images.length > 0 ? (
                  <img
                    src={campaign.images[0].startsWith('http') ? campaign.images[0] : `http://localhost:5000${campaign.images[0]}`}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <HeartHandshake size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status === 'active' ? t('charity.filters.active') : t('charity.filters.completed')}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-white font-semibold text-lg">{campaign.title}</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{t('charity.campaign.raised')}:</span>
                    <span className="font-medium">{formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.targetAmount)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${campaign.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span>{campaign?.organizer?.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    <span>{campaign.daysRemaining} {t('charity.campaign.days')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <div className="flex flex-col items-center">
            <HeartHandshake size={64} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.noResults')}</h3>
            <p className="text-gray-500 mb-6">{t('common.tryAdjustingFilters')}</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('common.clearFilters')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharitySathi; 