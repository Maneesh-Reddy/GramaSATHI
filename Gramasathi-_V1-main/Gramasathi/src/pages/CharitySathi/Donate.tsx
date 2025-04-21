import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import useApi from '../../hooks/useApi';
import { useVoiceContext } from '../../hooks/VoiceContext';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
}

const Donate: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { speak } = useVoiceContext();
  const api = useApi();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const result = await api.request(`/campaigns/${campaignId}`);
        if (result.success) {
          setCampaign(result.data);
          
          // If user is authenticated, pre-fill the form
          if (isAuthenticated && user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
          }
        } else {
          setError(result.error || 'Failed to load campaign');
          speak(t('charity.campaignLoadError', 'Failed to load campaign details'));
        }
      } catch (err) {
        setError('Error loading campaign');
        speak(t('charity.campaignLoadError', 'Failed to load campaign details'));
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!amount || parseFloat(amount) <= 0) {
      setError(t('charity.donationAmountError', 'Please enter a valid donation amount'));
      speak(t('charity.donationAmountError', 'Please enter a valid donation amount'));
      return;
    }

    if (!isAuthenticated && (!name || !email || !phone)) {
      setError(t('charity.donationDetailsError', 'Please provide your contact details'));
      speak(t('charity.donationDetailsError', 'Please provide your contact details'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // In a real application, this would connect to a payment gateway
      const donationData = {
        campaignId,
        amount: parseFloat(amount),
        name: anonymous ? 'Anonymous' : name,
        email: email,
        phone: phone,
        message: message,
        anonymous
      };

      const result = await api.request('/donations', {
        method: 'POST',
        data: donationData
      });

      if (result.success) {
        setSuccess(true);
        speak(t('charity.donationSuccess', 'Thank you for your generous donation!'));
      } else {
        setError(result.error || t('charity.donationError', 'Failed to process donation'));
        speak(t('charity.donationError', 'Failed to process donation'));
      }
    } catch (err) {
      setError(t('charity.donationError', 'Error processing donation'));
      speak(t('charity.donationError', 'Error processing donation'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error && !campaign) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!campaign) return <div className="text-center py-12 text-red-500">{t('charity.campaignNotFound', 'Campaign not found')}</div>;

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Heart className="mx-auto mb-4 text-green-500" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('charity.thankYou', 'Thank You!')}</h1>
          <p className="text-gray-600 mb-6">
            {t('charity.donationConfirmation', 'Your donation of ₹{{amount}} to {{campaign}} has been received.', {
              amount,
              campaign: campaign.title
            })}
          </p>
          <button
            onClick={() => navigate(`/charity/${campaignId}`)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            {t('charity.backToCampaign', 'Back to Campaign')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/charity/${campaignId}`)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        {t('common.back', 'Back to Campaign')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img 
                src={campaign.image || '/placeholder.jpg'} 
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{campaign.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
              
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
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('charity.makeDonation', 'Make a Donation')}</h1>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 text-gray-700">{t('charity.donationAmount', 'Donation Amount')} *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    min="1"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              {!isAuthenticated && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700">{t('common.name', 'Your Name')} *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required={!anonymous}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700">{t('common.email', 'Email')} *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700">{t('common.phone', 'Phone Number')} *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-gray-700">{t('charity.message', 'Message (Optional)')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{t('charity.donateAnonymously', 'Donate anonymously')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50"
              >
                {submitting 
                  ? t('common.processing', 'Processing...') 
                  : t('charity.donate', 'Donate Now')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate; 