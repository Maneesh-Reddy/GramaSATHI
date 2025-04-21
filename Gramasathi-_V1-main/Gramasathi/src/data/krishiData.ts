// krishiData.ts

export interface CropTip {
  id: string;
  title: string;
  description: string;
  crop: string;
  season: string;
  image: string;
  link?: string;
}

export interface MarketRate {
  id: string;
  crop: string;
  market: string;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export const getCropTips = (): CropTip[] => {
  return [
    {
      id: 'crop1',
      title: 'Rice Cultivation Tips',
      description: 'Best practices for rice cultivation including water management and pest control.',
      crop: 'rice',
      season: 'kharif',
      image: 'https://images.pexels.com/photos/2100936/pexels-photo-2100936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/rice-tips',
    },
    {
      id: 'crop2',
      title: 'Wheat Farming Guide',
      description: 'Comprehensive guide for wheat cultivation from sowing to harvesting.',
      crop: 'wheat',
      season: 'rabi',
      image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/wheat-guide',
    },
    {
      id: 'crop3',
      title: 'Cotton Farming Best Practices',
      description: 'Tips for better cotton yields and quality improvement.',
      crop: 'cotton',
      season: 'kharif',
      image: 'https://images.pexels.com/photos/1595449/pexels-photo-1595449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/cotton-farming',
    },
    {
      id: 'crop4',
      title: 'Sugarcane Cultivation',
      description: 'Guide for sugarcane cultivation including variety selection and irrigation techniques.',
      crop: 'sugarcane',
      season: 'zaid',
      image: 'https://images.pexels.com/photos/7543108/pexels-photo-7543108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/sugarcane-cultivation',
    },
    {
      id: 'crop5',
      title: 'Vegetable Farming Tips',
      description: 'Tips for growing various vegetables with organic methods.',
      crop: 'vegetables',
      season: 'rabi',
      image: 'https://images.pexels.com/photos/2321837/pexels-photo-2321837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/vegetable-farming',
    },
    {
      id: 'crop6',
      title: 'Organic Pest Management',
      description: 'Natural methods to control pests in various crops without chemicals.',
      crop: 'vegetables',
      season: 'kharif',
      image: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/organic-pest-management',
    },
  ];
};

// krishiData.ts

export const getMarketRates = () => {
  return [
    {
      id: 'market1',
      crop: 'Rice',
      market: 'Amaravati Agricultural Market',
      minPrice: '2100',
      maxPrice: '2300',
      modalPrice: '2200',
      trend: 'up',
      change: '2.5',
    },
    {
      id: 'market2',
      crop: 'Wheat',
      market: 'Guntur Mandi',
      minPrice: '1900',
      maxPrice: '2000',
      modalPrice: '1950',
      trend: 'down',
      change: '1.5',
    },
    {
      id: 'market3',
      crop: 'Cotton',
      market: 'Nellore Mandi',
      minPrice: '5500',
      maxPrice: '6000',
      modalPrice: '5800',
      trend: 'up',
      change: '3.8',
    },
    {
      id: 'market4',
      crop: 'Sugarcane',
      market: 'Vijayawada Agricultural Market',
      minPrice: '290',
      maxPrice: '310',
      modalPrice: '300',
      trend: 'stable',
      change: '0.0',
    },
    {
      id: 'market5',
      crop: 'Vegetables',
      market: 'Krishna District Market',
      minPrice: '1500',
      maxPrice: '2000',
      modalPrice: '1800',
      trend: 'down',
      change: '4.2',
    },
    {
      id: 'market6',
      crop: 'Rice',
      market: 'Amaravati Central Mandi',
      minPrice: '2050',
      maxPrice: '2250',
      modalPrice: '2150',
      trend: 'up',
      change: '1.8',
    },
    {
      id: 'market7',
      crop: 'Wheat',
      market: 'Guntur Town Mandi',
      minPrice: '1900',
      maxPrice: '2000',
      modalPrice: '1950',
      trend: 'down',
      change: '0.9',
    },
    {
      id: 'market8',
      crop: 'Cotton',
      market: 'Nellore Cotton Market',
      minPrice: '6100',
      maxPrice: '6600',
      modalPrice: '6300',
      trend: 'up',
      change: '4.1',
    },
  ];
};