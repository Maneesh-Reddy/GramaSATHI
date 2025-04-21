import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, MinusIcon } from 'lucide-react';
import { getMarketRates } from '../../data/krishiData';

interface MarketRatesProps {
  searchQuery: string;
  cropFilter: string;
}

const MarketRates: React.FC<MarketRatesProps> = ({ 
  searchQuery, 
  cropFilter 
}) => {
  const { t } = useTranslation();
  const rates = getMarketRates();
  
  // Apply filters
  const filteredRates = rates.filter(rate => {
    // Search filter
    if (searchQuery && !rate.crop.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !rate.market.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Crop filter
    if (cropFilter && rate.crop !== cropFilter) {
      return false;
    }
    
    return true;
  });

  const renderTrend = (trend: string) => {
    switch(trend) {
      case 'up':
        return <TrendingUp size={16} className="text-success-500" />;
      case 'down':
        return <TrendingDown size={16} className="text-error-500" />;
      default:
        return <MinusIcon size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">{t('krishi.marketRates')}</h2>
        <p className="text-gray-600 mt-1">Current market rates for crops as of today</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crop
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modal Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRates.length > 0 ? (
              filteredRates.map((rate, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rate.crop}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rate.market}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{rate.minPrice}/quintal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{rate.maxPrice}/quintal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{rate.modalPrice}/quintal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {renderTrend(rate.trend)}
                      <span className={`ml-1 ${
                        rate.trend === 'up' ? 'text-success-600' : 
                        rate.trend === 'down' ? 'text-error-600' : ''
                      }`}>
                        {rate.change}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketRates;