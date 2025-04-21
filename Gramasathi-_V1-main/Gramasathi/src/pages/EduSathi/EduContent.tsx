import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getEducationalResources } from '../../data/eduData';

interface EduContentProps {
  searchQuery: string;
  category: string;
}

const EduContent: React.FC<EduContentProps> = ({ 
  searchQuery, 
  category 
}) => {
  const { t } = useTranslation();
  const resources = getEducationalResources();
  
  // Apply filters
  const filteredResources = resources.filter(resource => {
    // Search filter
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (category !== 'all' && resource.category !== category) {
      return false;
    }
    
    return true;
  });

  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  // Group by category for better display
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  if (category !== 'all') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            title={resource.title}
            content={resource.description}
            image={resource.image}
            link={resource.link}
            linkText={t('common.readMore')}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(groupedResources).map(([categoryKey, categoryResources]) => (
        <div key={categoryKey}>
          <h2 className="text-xl font-semibold mb-4 text-primary-700">
            {categoryKey === 'children' ? t('edu.children') : 
             categoryKey === 'women' ? t('edu.women') : 
             categoryKey === 'youth' ? t('edu.youth') : categoryKey}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryResources.map((resource) => (
              <Card
                key={resource.id}
                title={resource.title}
                content={resource.description}
                image={resource.image}
                link={resource.link}
                linkText={t('common.readMore')}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EduContent;