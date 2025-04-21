export interface EcoTip {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface WaterTip {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export const getEcoTips = (): EcoTip[] => {
  return [
    {
      id: 'eco1',
      title: 'Use Natural Fertilizers',
      description: 'Make compost from kitchen waste and use it as fertilizer for plants and crops.',
      image: 'https://www.nature-and-garden.com/wp-content/uploads/sites/4/2022/10/Natural-fertilizer-homemade.jpg',
      link: 'https://example.com/natural-fertilizers',
    },
    {
      id: 'eco2',
      title: 'Energy Conservation',
      description: 'Use natural light during the day and LED bulbs to reduce electricity consumption.',
      image: 'https://images.pexels.com/photos/1108311/pexels-photo-1108311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/energy-conservation',
    },
    {
      id: 'eco3',
      title: 'Waste Segregation',
      description: 'Separate biodegradable and non-biodegradable waste for better waste management.',
      image: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/waste-segregation',
    },
    {
      id: 'eco4',
      title: 'Plastic Alternatives',
      description: 'Use cloth bags, paper bags, or jute bags instead of plastic bags for shopping.',
      image: 'https://images.pexels.com/photos/4639792/pexels-photo-4639792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/plastic-alternatives',
    },
    {
      id: 'eco5',
      title: 'Tree Plantation',
      description: 'Plant trees around your home and in community spaces for better air quality.',
      image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/tree-plantation',
    },
    {
      id: 'eco6',
      title: 'Eco-friendly Cleaning',
      description: 'Use natural cleaning agents like vinegar, lemon, and baking soda instead of chemical cleaners.',
      image: 'https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/eco-cleaning',
    },
  ];
};

export const getWaterTips = (): WaterTip[] => {
  return [
    {
      id: 'water1',
      title: 'Rainwater Harvesting',
      description: 'Collect rainwater from rooftops and store it for later use in gardening, washing, etc.',
      image: 'https://images.pexels.com/photos/688835/pexels-photo-688835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/rainwater-harvesting',
    },
    {
      id: 'water2',
      title: 'Drip Irrigation',
      description: 'Use drip irrigation for plants and crops to minimize water wastage.',
      image: 'https://images.pexels.com/photos/2569231/pexels-photo-2569231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/drip-irrigation',
    },
    {
      id: 'water3',
      title: 'Fix Water Leaks',
      description: 'Regularly check and fix water leaks in taps, pipes, and water storage containers.',
      image: 'https://images.pexels.com/photos/5725956/pexels-photo-5725956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/fix-leaks',
    },
    {
      id: 'water4',
      title: 'Reuse Greywater',
      description: 'Reuse water from washing clothes and utensils for cleaning floors or watering plants.',
      image: 'https://images.pexels.com/photos/3215538/pexels-photo-3215538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/reuse-greywater',
    },
    {
      id: 'water5',
      title: 'Use Water Wisely',
      description: 'Use buckets instead of running water for bathing and washing to save water.',
      image: 'https://images.pexels.com/photos/6993626/pexels-photo-6993626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/water-wisely',
    },
    {
      id: 'water6',
      title: 'Community Pond Maintenance',
      description: 'Participate in cleaning and maintaining community ponds and water bodies.',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/community-ponds',
    },
  ];
};