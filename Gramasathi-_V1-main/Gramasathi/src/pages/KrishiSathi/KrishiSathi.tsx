import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/layout/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import CropTips from './CropTips';
import WeatherUpdates from './WeatherUpdates';
import MarketRates from './MarketRates';

const KrishiSathi: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('cropTips');
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');

  const cropFilterOptions = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'vegetables', label: 'Vegetables' },
  ];

  const seasonFilterOptions = [
    { value: 'kharif', label: 'Kharif' },
    { value: 'rabi', label: 'Rabi' },
    { value: 'zaid', label: 'Zaid' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t('krishi.title')}
        subtitle={t('krishi.subtitle')}
        instructionKey="krishi.voiceInstructions"
      />

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterDropdown
              label={t('krishi.selectCrop')}
              options={cropFilterOptions}
              value={cropFilter}
              onChange={setCropFilter}
            />
            
            <FilterDropdown
              label={t('krishi.selectSeason')}
              options={seasonFilterOptions}
              value={seasonFilter}
              onChange={setSeasonFilter}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('cropTips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cropTips'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('krishi.cropTips')}
            </button>
            
            <button
              onClick={() => setActiveTab('weather')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'weather'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('krishi.weather')}
            </button>
            
            <button
              onClick={() => setActiveTab('marketRates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'marketRates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('krishi.marketRates')}
            </button>
          </nav>
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === 'cropTips' && (
          <CropTips 
            searchQuery={searchQuery} 
            cropFilter={cropFilter} 
            seasonFilter={seasonFilter} 
          />
        )}
        
        {activeTab === 'weather' && (
          <WeatherUpdates searchQuery={searchQuery} />
        )}
        
        {activeTab === 'marketRates' && (
          <MarketRates 
            searchQuery={searchQuery} 
            cropFilter={cropFilter} 
          />
        )}
      </div>
    </div>
  );
};

export default KrishiSathi;