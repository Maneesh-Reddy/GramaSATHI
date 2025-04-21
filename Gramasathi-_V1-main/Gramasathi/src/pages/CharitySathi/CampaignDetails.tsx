import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/AuthContext';
import useApi from '../../hooks/useApi';
import { formatDistance } from 'date-fns';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { 
  UserIcon, 
  CalendarIcon,
  MapPinIcon, 
  HeartIcon, 
  UsersIcon,
  Share2Icon,
  AlertCircleIcon
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  endDate: string;
  village: string;
  district: string;
  state: string;
  beneficiaries: string;
  images: string[];
  createdBy: {
    name: string;
    id: string;
  };
  createdAt: string;
  donors: number;
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const api = useApi();
  const { isAuthenticated } = useAuth();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        const response = await api.request(`/charity/${id}`);
        if (response.success) {
          setCampaign(response.data);
          setError('');
        } else {
          setError(t('campaign.fetchError'));
        }
      } catch (err) {
        setError(t('campaign.fetchError'));
        console.error('Error fetching campaign:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id, api, t]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircleIcon className="mr-2" size={20} />
            <span className="block sm:inline">{error || t('campaign.notFound')}</span>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(Math.round((campaign.raisedAmount / campaign.targetAmount) * 100), 100);
  const timeLeft = formatDistance(new Date(campaign.endDate), new Date(), { addSuffix: true });
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title: campaign.title,
        text: campaign.description.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {campaign.images && campaign.images.length > 0 ? (
              <div>
                <div className="h-96 overflow-hidden">
                  <img 
                    src={campaign.images[activeImage]} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {campaign.images.length > 1 && (
                  <div className="flex p-2 gap-2 overflow-x-auto">
                    {campaign.images.map((img, index) => (
                      <img 
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-16 w-16 object-cover cursor-pointer rounded ${index === activeImage ? 'border-2 border-primary' : ''}`}
                        onClick={() => setActiveImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">{t('campaign.noImage')}</span>
              </div>
            )}

            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>
              
              <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
                <div className="flex items-center">
                  <UserIcon size={16} className="mr-1" />
                  <span>{campaign.createdBy.name}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{timeLeft}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon size={16} className="mr-1" />
                  <span>{campaign.village}, {campaign.district}, {campaign.state}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon size={16} className="mr-1" />
                  <span>{campaign.donors} {t('campaign.donors')}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('campaign.description')}</h2>
                <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{t('campaign.beneficiaries')}</h2>
                <p className="text-gray-700">{campaign.beneficiaries}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Donation info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-lg">₹{campaign.raisedAmount.toLocaleString()}</span>
                <span className="text-gray-600">of ₹{campaign.targetAmount.toLocaleString()}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-200" />
              <div className="flex justify-between mt-1 text-sm text-gray-600">
                <span>{progressPercentage}% {t('campaign.raised')}</span>
                <span>{timeLeft}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link to={`/charity/${campaign.id}/donate`}>
                <Button className="w-full">
                  <HeartIcon size={16} className="mr-2" />
                  {t('campaign.donate')}
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2Icon size={16} className="mr-2" />
                {t('campaign.share')}
              </Button>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t('campaign.aboutCampaign')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('campaign.category')}:</span>
                  <span>{campaign.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('campaign.location')}:</span>
                  <span>{campaign.village}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('campaign.createdOn')}:</span>
                  <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails; 