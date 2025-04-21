import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/layout/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import HealthCamps from './HealthCamps';
import HealthTips from './HealthTips';
import HealthResources from './HealthResources';

const HealthSathi: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('camps');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const dateFilterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
  ];

  const locationFilterOptions = [
    { value: 'villageA', label: 'Village A' },
    { value: 'villageB', label: 'Village B' },
    { value: 'villageC', label: 'Village C' },
    { value: 'townX', label: 'Town X' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t('health.title')}
        subtitle={t('health.subtitle')}
        instructionKey="health.voiceInstructions"
      />

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterDropdown
              label={t('health.dateFilter')}
              options={dateFilterOptions}
              value={dateFilter}
              onChange={setDateFilter}
            />
            
            <FilterDropdown
              label={t('health.locationFilter')}
              options={locationFilterOptions}
              value={locationFilter}
              onChange={setLocationFilter}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('camps')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'camps'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('health.camps')}
            </button>
            
            <button
              onClick={() => setActiveTab('tips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tips'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('health.tips')}
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('health.resources')}
            </button>
          </nav>
        </div>
      </div>

      <div className="min-h-96">
        {activeTab === 'camps' && (
          <HealthCamps 
            searchQuery={searchQuery} 
            dateFilter={dateFilter} 
            locationFilter={locationFilter} 
          />
        )}
        
        {activeTab === 'tips' && (
          <HealthTips searchQuery={searchQuery} />
        )}
        
        {activeTab === 'resources' && (
          <HealthResources 
            searchQuery={searchQuery} 
            locationFilter={locationFilter} 
          />
        )}
      </div>
    </div>
  );
};

export default HealthSathi;