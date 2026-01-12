import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Bell,
  Activity
} from 'lucide-react';

interface DashboardData {
  total_plans: { count: number };
  pending_reminders: { count: number };
  today_contacts: { count: number };
  upcoming_contacts: { count: number };
  recent_records: any[];
  upcoming_reminders: any[];
}

export function CommunicationDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/communications/dashboard');
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContactTypeDistribution = (records: any[]) => {
    const distribution: { [key: string]: number } = {};
    records.forEach(record => {
      distribution[record.contact_type] = (distribution[record.contact_type] || 0) + 1;
    });
    return distribution;
  };

  const getSatisfactionTrend = (records: any[]) => {
    const recentRecords = records
      .filter(record => record.satisfaction_rating)
      .slice(0, 10);
    
    if (recentRecords.length === 0) return null;
    
    const average = recentRecords.reduce((sum, record) => 
      sum + record.satisfaction_rating, 0) / recentRecords.length;
    
    return {
      average: Math.round(average * 10) / 10,
      count: recentRecords.length
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContactTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'phone': 'Phone',
      'email': 'Email',
      'video_call': 'Video Call',
      'in_person': 'In Person',
      'meeting': 'Meeting',
      'chat': 'Chat'
    };
    return labels[type] || type;
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return '📞';
      case 'email': return '📧';
      case 'video_call': return '🎥';
      case 'in_person': return '🤝';
      case 'meeting': return '👥';
      case 'chat': return '💬';
      default: return '💬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: { [key: string]: string } = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return labels[priority] || priority;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Unable to load dashboard data</h3>
          <p className="text-muted-foreground text-center">
            Please try again later or check network connection
          </p>
        </CardContent>
      </Card>
    );
  }

  const contactDistribution = getContactTypeDistribution(dashboardData.recent_records || []);
  const satisfactionTrend = getSatisfactionTrend(dashboardData.recent_records || []);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Communication Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <div className="flex gap-1">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_plans.count}</div>
            <p className="text-xs text-muted-foreground">
              Current active communication plans
            </p>
            <div className="mt-2">
              <Progress value={(dashboardData.total_plans.count / 10) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pending_reminders.count}</div>
            <p className="text-xs text-muted-foreground">
              Reminders requiring follow-up
            </p>
            <div className="mt-2 flex items-center">
              {dashboardData.pending_reminders.count > 0 ? (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-xs ml-1">
                {dashboardData.pending_reminders.count > 0 ? 'Needs Attention' : 'All Completed'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.today_contacts.count}</div>
            <p className="text-xs text-muted-foreground">
              Communications completed today
            </p>
            <div className="mt-2 flex items-center">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs ml-1">
                {dashboardData.today_contacts.count > 5 ? 'Active' : 'Normal'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.upcoming_contacts.count}</div>
            <p className="text-xs text-muted-foreground">
              Communications scheduled within the next 7 days
            </p>
            <div className="mt-2 flex items-center">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs ml-1">
                {dashboardData.upcoming_contacts.count > 3 ? 'High' : 'Normal'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(contactDistribution).map(([type, count]) => {
                const total = Object.values(contactDistribution).reduce((sum, c) => sum + c, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getContactTypeIcon(type)}</span>
                        <span className="text-sm font-medium">{getContactTypeLabel(type)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
              
              {Object.keys(contactDistribution).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No communication records data
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {satisfactionTrend ? (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {satisfactionTrend.average}/5
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {satisfactionTrend.count} recent reviews
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = dashboardData.recent_records.filter(
                        record => record.satisfaction_rating === rating
                      ).length;
                      const percentage = satisfactionTrend.count > 0 
                        ? (count / satisfactionTrend.count) * 100 
                        : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating} Stars</span>
                          <Progress value={percentage} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No satisfaction rating data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Upcoming Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Communication Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Communication Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData.recent_records || []).slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="text-lg">{getContactTypeIcon(record.contact_type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{record.customer_name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(record.contact_date)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {record.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getContactTypeLabel(record.contact_type)}
                      </Badge>
                      {record.duration_minutes && (
                        <span className="text-xs text-muted-foreground">
                          {record.duration_minutes} minutes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {(dashboardData.recent_records || []).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No communication records
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData.upcoming_reminders || []).slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(reminder.priority).split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{reminder.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(reminder.due_date)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reminder.customer_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getPriorityColor(reminder.priority)}`}>
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {(dashboardData.upcoming_reminders || []).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming reminders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>New Plan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Record Communication</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Bell className="h-6 w-6" />
              <span>Set Reminder</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span>Team Collaboration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}