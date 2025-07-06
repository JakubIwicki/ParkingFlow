
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Car, CreditCard, TrendingUp, MapPin } from 'lucide-react';
import { useDataContext } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Stats } from '@/models/Stats';
import { MonthsDict } from '@/lib/utils';

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, fetchDashboardData } = useDataContext();

  const [stats, setStats] = useState<Stats[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchDashboardData();
  }, [user])

  useEffect(() => {
    if (!dashboardData) {
      return;
    }
    const stats = [
      { title: 'Total Parking Areas', value: dashboardData.totalParkingAreas, icon: MapPin, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'Total Parking Fees', value: dashboardData.totalParkingFees, icon: CreditCard, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'Total Parking Areas Active', value: dashboardData.totalParkingAreasActive, icon: Car, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'Last Month Revenue (USD)', value: `$${dashboardData.lastMonthEarningsTotalUsd}`, icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { title: 'Current Month Revenue (USD)', value: `$${dashboardData.currentMonthEarningsTotalUsd}`, icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    ]
    setStats(stats);
  }, [dashboardData])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your parking management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payments Chart */}
        {dashboardData?.parkingHistoryPayments && dashboardData.parkingHistoryPayments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Monthly Payments</CardTitle>
              <CardDescription>Revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.parkingHistoryPayments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(month) => MonthsDict[month].short || month}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(month) => MonthsDict[month]?.full || month}
                  />
                  <Bar dataKey="amountInUsd" fill="#ea580c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
