import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useApi from '../../hooks/useApi';
import { Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  createdBy: string;
  createdAt: string;
}

const Campaigns: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const api = useApi();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const result = await api.request('/campaigns');
        if (result.success) {
          setCampaigns(result.data);
        } else {
          setError(result.error || 'Failed to load campaigns');
        }
      } catch (err) {
        setError('Error loading campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-12">Loading campaigns...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('charity.title', 'Charity Campaigns')}</h1>
        {isAuthenticated && (
          <Link 
            to="/charity/create"
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            <Plus size={16} className="mr-2" />
            {t('charity.createCampaign', 'Create Campaign')}
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.search', 'Search campaigns...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">{t('charity.noCampaigns', 'No campaigns found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <Link 
              key={campaign.id}
              to={`/charity/${campaign.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-48 bg-gray-200">
                <img 
                  src={campaign.image || '/placeholder.jpg'} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{campaign.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">₹{campaign.raised} raised</span>
                  <span className="text-gray-600">Goal: ₹{campaign.goal}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns; 