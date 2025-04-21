import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getHealthTips } from '../../data/healthData';

interface HealthTipsProps {
  searchQuery: string;
}

const HealthTips: React.FC<HealthTipsProps> = ({ searchQuery }) => {
  const { t } = useTranslation();
  const tips = getHealthTips();
  
  // Apply search filter
  const filteredTips = tips.filter(tip => {
    if (searchQuery && !tip.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tip.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (filteredTips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTips.map((tip) => (
        <Card
          key={tip.id}
          title={tip.title}
          content={tip.content}
          image={tip.image}
          link={tip.link}
          linkText={t('common.readMore')}
        />
      ))}
    </div>
  );
};

export default HealthTips;