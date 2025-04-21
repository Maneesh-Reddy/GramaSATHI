import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/layout/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import EcoTips from './EcoTips';
import WaterConservation from './WaterConservation';
import GreenScore from './GreenScore';

const EcoSathi: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ecoTips');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t('eco.title')}
        subtitle={t('eco.subtitle')}
        instructionKey="eco.voiceInstructions"
      />

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ecoTips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ecoTips'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('eco.ecoTips')}
            </button>
            
            <button
              onClick={() => setActiveTab('water')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'water'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('eco.waterConservation')}
            </button>
            
            <button
              onClick={() => setActiveTab('greenScore')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'greenScore'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('eco.greenScore')}
            </button>
          </nav>
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === 'ecoTips' && (
          <EcoTips searchQuery={searchQuery} />
        )}
        
        {activeTab === 'water' && (
          <WaterConservation searchQuery={searchQuery} />
        )}
        
        {activeTab === 'greenScore' && (
          <GreenScore />
        )}
      </div>
    </div>
  );
};

export default EcoSathi;