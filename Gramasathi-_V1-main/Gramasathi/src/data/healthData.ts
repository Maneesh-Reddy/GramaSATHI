export interface MedicalCamp {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  link?: string;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  image: string;
  link?: string;
}

export interface HealthResource {
  id: string;
  title: string;
  description: string;
  location: string;
  contactInfo: string;
  image: string;
  link?: string;
}

export const getMedicalCamps = (): MedicalCamp[] => {
  return [
    {
      id: 'camp1',
      title: 'General Health Checkup Camp',
      description: 'Free health checkup including blood pressure, blood sugar, and basic consultation.',
      date: 'May 25, 2025 (This Week)',
      location: 'villageA',
      image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/health-camp',
    },
    {
      id: 'camp2',
      title: 'Women\'s Health Camp',
      description: 'Health camp focusing on women\'s health issues including gynecological consultation.',
      date: 'June 2, 2025 (This Month)',
      location: 'villageB',
      image: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/womens-health-camp',
    },
    {
      id: 'camp3',
      title: 'Eye Checkup Camp',
      description: 'Free eye examination and consultation with ophthalmologists.',
      date: 'May 22, 2025 (Today)',
      location: 'townX',
      image: 'https://images.pexels.com/photos/5752287/pexels-photo-5752287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/eye-camp',
    },
    {
      id: 'camp4',
      title: 'Dental Health Camp',
      description: 'Free dental checkup and basic dental procedures.',
      date: 'May 30, 2025 (This Week)',
      location: 'villageC',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/dental-camp',
    },
    {
      id: 'camp5',
      title: 'Child Vaccination Camp',
      description: 'Free vaccination for children under 5 years.',
      date: 'June 10, 2025 (This Month)',
      location: 'villageB',
      image: 'https://images.pexels.com/photos/5863366/pexels-photo-5863366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/vaccination-camp',
    },
    {
      id: 'camp6',
      title: 'Diabetes Awareness Camp',
      description: 'Free diabetes screening and consultation about management.',
      date: 'June 15, 2025 (This Month)',
      location: 'townX',
      image: 'https://images.pexels.com/photos/7108350/pexels-photo-7108350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/diabetes-camp',
    },
  ];
};

export const getHealthTips = (): HealthTip[] => {
  return [
    {
      id: 'tip1',
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily to stay hydrated, especially during summer.',
      image: 'https://images.pexels.com/photos/1346132/pexels-photo-1346132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/hydration-tips',
    },
    {
      id: 'tip2',
      title: 'Balanced Diet',
      content: 'Include fruits, vegetables, whole grains, and proteins in your daily diet for better health.',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/diet-tips',
    },
    {
      id: 'tip3',
      title: 'Regular Exercise',
      content: 'Engage in at least 30 minutes of physical activity daily to maintain good health.',
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/exercise-tips',
    },
    {
      id: 'tip4',
      title: 'Hand Hygiene',
      content: 'Wash your hands regularly with soap and water to prevent infections.',
      image: 'https://images.pexels.com/photos/7045384/pexels-photo-7045384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/hygiene-tips',
    },
    {
      id: 'tip5',
      title: 'Mental Wellness',
      content: 'Practice meditation or deep breathing exercises to reduce stress and improve mental health.',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/mental-health-tips',
    },
    {
      id: 'tip6',
      title: 'Adequate Sleep',
      content: 'Get 7-8 hours of sleep daily for overall well-being and better health.',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/sleep-tips',
    },
  ];
};

export const getHealthResources = (): HealthResource[] => {
  return [
    {
      id: 'resource1',
      title: 'Primary Health Center',
      description: 'Government Primary Health Center offering basic healthcare services.',
      location: 'villageA',
      contactInfo: 'Phone: 123-456-7890',
      image: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/phc',
    },
    {
      id: 'resource2',
      title: 'Mobile Medical Unit',
      description: 'Mobile medical unit visiting villages weekly for basic consultations.',
      location: 'villageB',
      contactInfo: 'Schedule: Every Monday',
      image: 'https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/mobile-medical',
    },
    {
      id: 'resource3',
      title: 'District Hospital',
      description: 'Government district hospital with advanced medical facilities.',
      location: 'townX',
      contactInfo: 'Phone: 123-789-4560',
      image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/district-hospital',
    },
    {
      id: 'resource4',
      title: 'ASHA Worker',
      description: 'Local ASHA worker providing maternal and child health services.',
      location: 'villageC',
      contactInfo: 'Phone: 987-654-3210',
      image: 'https://images.pexels.com/photos/6823657/pexels-photo-6823657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/asha-workers',
    },
    {
      id: 'resource5',
      title: 'Telemedicine Center',
      description: 'Telemedicine facility for remote consultations with specialists.',
      location: 'villageA',
      contactInfo: 'Operating Hours: 9 AM - 5 PM',
      image: 'https://images.pexels.com/photos/7089397/pexels-photo-7089397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/telemedicine',
    },
    {
      id: 'resource6',
      title: 'Ayushman Bharat Center',
      description: 'Center for accessing Ayushman Bharat healthcare scheme benefits.',
      location: 'townX',
      contactInfo: 'Phone: 456-789-0123',
      image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      link: 'https://example.com/ayushman-bharat',
    },
  ];
};