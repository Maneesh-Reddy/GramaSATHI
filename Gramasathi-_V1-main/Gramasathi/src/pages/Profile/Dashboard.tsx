import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import useApi from '../../hooks/useApi';
import { Calendar, Users, Heart, AlertCircle, ChevronRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'donation' | 'campaign' | 'grievance' | 'other';
  title: string;
  date: string;
  amount?: number;
  status?: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const api = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeCampaigns: 0,
    pendingGrievances: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual API calls
        // const response = await api.get('/user/dashboard');
        // setActivities(response.data.activities);
        // setStats(response.data.stats);
        
        // Mock data for now
        setTimeout(() => {
          setActivities([
            {
              id: '1',
              type: 'donation',
              title: 'Donated to Village School Fund',
              date: '2023-06-15',
              amount: 1000
            },
            {
              id: '2',
              type: 'campaign',
              title: 'Created Campaign for Flood Relief',
              date: '2023-07-01'
            },
            {
              id: '3',
              type: 'grievance',
              title: 'Road Repair Request',
              date: '2023-07-10',
              status: 'In Progress'
            }
          ]);
          
          setStats({
            totalDonations: 3,
            activeCampaigns: 1,
            pendingGrievances: 2
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate, api]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'campaign':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'grievance':
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('dashboard.loading')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('dashboard.welcome')}, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('dashboard.overview')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.totalDonations')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.totalDonations}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <button
                  onClick={() => navigate('/profile/donations')}
                  className="font-medium text-primary-600 hover:text-primary-500 flex items-center"
                >
                  {t('dashboard.viewAll')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.activeCampaigns')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.activeCampaigns}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <button
                  onClick={() => navigate('/profile/campaigns')}
                  className="font-medium text-primary-600 hover:text-primary-500 flex items-center"
                >
                  {t('dashboard.viewAll')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {t('dashboard.pendingGrievances')}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.pendingGrievances}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <button
                  onClick={() => navigate('/profile/grievances')}
                  className="font-medium text-primary-600 hover:text-primary-500 flex items-center"
                >
                  {t('dashboard.viewAll')}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('dashboard.recentActivity')}
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <p className="flex items-center text-sm text-gray-500">
                            {activity.amount && (
                              <span className="truncate">
                                ₹{activity.amount.toLocaleString()}
                              </span>
                            )}
                            {activity.status && (
                              <span className="truncate">
                                {t(`status.${activity.status.toLowerCase().replace(' ', '')}`)}
                              </span>
                            )}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {activity.type === 'donation'
                                ? t('dashboard.donated')
                                : activity.type === 'campaign'
                                ? t('dashboard.created')
                                : t('dashboard.submitted')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                {t('dashboard.noActivity')}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 