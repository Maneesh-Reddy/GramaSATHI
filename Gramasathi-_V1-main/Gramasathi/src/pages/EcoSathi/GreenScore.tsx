import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Leaf } from 'lucide-react';

interface EcoActivity {
  id: string;
  name: string;
  points: number;
  completed: boolean;
}

const GreenScore: React.FC = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [activities, setActivities] = useState<EcoActivity[]>([
    { id: 'tree', name: t('eco.activities.tree'), points: 10, completed: false },
    { id: 'waste', name: t('eco.activities.waste'), points: 5, completed: false },
    { id: 'water', name: t('eco.activities.water'), points: 5, completed: false },
    { id: 'energy', name: t('eco.activities.energy'), points: 5, completed: false },
  ]);

  // Update activity names when language changes
  useEffect(() => {
    setActivities(activities.map(activity => ({
      ...activity,
      name: t(`eco.activities.${activity.id}`)
    })));
  }, [t]);

  const toggleActivity = (id: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        const completed = !activity.completed;
        if (completed) {
          setScore(prev => prev + activity.points);
        } else {
          setScore(prev => prev - activity.points);
        }
        return { ...activity, completed };
      }
      return activity;
    }));
  };

  // Get the green level based on score
  const getGreenLevel = () => {
    if (score >= 20) return { level: 'Expert', color: 'bg-success-600' };
    if (score >= 10) return { level: 'Intermediate', color: 'bg-success-500' };
    if (score > 0) return { level: 'Beginner', color: 'bg-success-400' };
    return { level: 'Novice', color: 'bg-gray-300' };
  };

  const greenLevel = getGreenLevel();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('eco.yourScore')}</h2>
            <div className="flex items-center">
              <Leaf className="text-primary-500 mr-2" size={20} />
              <span className="text-2xl font-bold text-primary-600">{score}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${greenLevel.color} transition-all duration-500`} 
                style={{ width: `${Math.min(score * 3, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Novice</span>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Level: {greenLevel.level}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('eco.trackActivities')}</h3>
          
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  activity.completed 
                    ? 'bg-primary-50 border border-primary-200' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => toggleActivity(activity.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full ${
                      activity.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {activity.completed ? <CheckCircle size={16} /> : <span className="h-3 w-3 rounded-full bg-gray-300"></span>}
                    </div>
                    <span className="ml-3 text-sm font-medium">
                      {activity.name}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${
                    activity.completed ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    +{activity.points} points
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Complete eco-friendly activities to increase your Green Score!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenScore;