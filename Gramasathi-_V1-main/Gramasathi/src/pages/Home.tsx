import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Tractor, FileText, Leaf , Briefcase} from 'lucide-react';


const Home: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('nav.health'),
      description: t('health.subtitle'),
      icon: <Heart size={32} className="text-error-500" />,
      path: '/health',
      color: 'bg-error-50 border-error-200 hover:bg-error-100',
    },
   
    {
      title: t('nav.krishi'),
      description: t('krishi.subtitle'),
      icon: <Tractor size={32} className="text-accent-500" />,
      path: '/krishi',
      color: 'bg-accent-50 border-accent-200 hover:bg-accent-100',
    },
    {
      title: t('nav.grievance'),
      description: t('grievance.subtitle'),
      icon: <FileText size={32} className="text-warning-500" />,
      path: '/grievance',
      color: 'bg-warning-50 border-warning-200 hover:bg-warning-100',
    },
    {
      title: t('nav.rozgar'),
      description: t('rozgar.subtitle'),
      icon: <Briefcase size={32} className="text-warning-500" />,
      path: '/rozgar',
      color: 'bg-warning-50 border-warning-200 hover:bg-warning-100',
    },
    {
      title: t('nav.edu'),
      description: t('edu.subtitle'),
      icon: <BookOpen size={32} className="text-secondary-500" />,
      path: '/edu',
      color: 'bg-secondary-50 border-secondary-200 hover:bg-secondary-100',
    },
    {
      title: t('nav.eco'),
      description: t('eco.subtitle'),
      icon: <Leaf size={32} className="text-primary-500" />,
      path: '/eco',
      color: 'bg-primary-50 border-primary-200 hover:bg-primary-100',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-4">
          GramaSathi
        </h1>
        <p className="text-xl text-primary-600 max-w-3xl mx-auto">
          Empowering rural communities with access to health, education, farming, and environmental resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`p-6 rounded-lg border transition-all transform hover:scale-105 ${feature.color}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-primary-900 text-white rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Why GramaSathi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Easy Access</h3>
            <p className="text-gray-300">Access resources and information in your language with voice support</p>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Comprehensive</h3>
            <p className="text-gray-300">Health, education, farming, and environmental resources all in one place</p>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Community Focus</h3>
            <p className="text-gray-300">Designed specifically for the needs of rural communities</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-800">
            Get Started
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.slice(0, 4).map((feature, index) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-md text-center transition-colors"
            >
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600 mb-3">
                {index + 1}
              </span>
              <h3 className="font-medium">{feature.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;