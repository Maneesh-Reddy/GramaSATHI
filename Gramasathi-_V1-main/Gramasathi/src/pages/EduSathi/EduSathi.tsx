import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/layout/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import EduContent from './EduContent';

const EduSathi: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={t('edu.title')}
        subtitle={t('edu.subtitle')}
        instructionKey="edu.voiceInstructions"
      />

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All
            </button>
            
            <button
              onClick={() => setActiveCategory('children')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'children'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('edu.children')}
            </button>
            
            <button
              onClick={() => setActiveCategory('women')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'women'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('edu.women')}
            </button>
            
            <button
              onClick={() => setActiveCategory('youth')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'youth'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('edu.youth')}
            </button>
          </nav>
        </div>
      </div>

      <EduContent 
        searchQuery={searchQuery} 
        category={activeCategory} 
      />
    </div>
  );
};

export default EduSathi;