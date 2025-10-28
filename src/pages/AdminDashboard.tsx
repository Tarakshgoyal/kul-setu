import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Bell, Calendar, BookOpen, Camera, LogOut, Send, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalFamilies: number;
  livingCount: number;
  deceasedCount: number;
  totalPhotos: number;
  totalStories: number;
  totalRituals: number;
  upcomingRituals: number;
  recentUsers: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Notification form state
  const [notificationType, setNotificationType] = useState<'disease' | 'ritual' | 'general'>('general');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'specific'>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [familyLines, setFamilyLines] = useState<string[]>([]);

  const apiBaseUrl = 'https://kul-setu-backend.onrender.com';

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('kulSetuAdmin');
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
    fetchFamilyLines();
  }, [navigate]);

  const fetchFamilyLines = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        const members = data.members || data;
        
        // Extract unique family line IDs
        const uniqueFamilies = Array.from(
          new Set(members.map((m: any) => m.familyLineId).filter(Boolean))
        ).sort() as string[];
        
        setFamilyLines(uniqueFamilies);
      }
    } catch (error) {
      console.error('Error fetching family lines:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/admin/stats`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
        toast.error('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast.error('Please fill in all fields');
      return;
    }

    if (targetAudience === 'specific' && !selectedFamily) {
      toast.error('Please select a family');
      return;
    }

    try {
      setSending(true);
      const response = await fetch(`${apiBaseUrl}/admin/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
          familyLineId: targetAudience === 'specific' ? selectedFamily : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const target = targetAudience === 'all' ? 'all users' : `family ${selectedFamily}`;
        toast.success(`Notification sent to ${target}! (${data.count || 0} users)`);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationType('general');
        setTargetAudience('all');
        setSelectedFamily('');
      } else {
        toast.error(data.error || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleAnalyzeDiseases = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch(`${apiBaseUrl}/admin/analyze-diseases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Disease analysis complete! Sent ${data.totalNotifications} family notifications`);
      } else {
        toast.error(data.error || 'Failed to analyze diseases');
      }
    } catch (error) {
      console.error('Error analyzing diseases:', error);
      toast.error('Failed to analyze diseases');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kulSetuAdmin');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const getNotificationTemplate = (type: string) => {
    switch (type) {
      case 'disease':
        return {
          title: 'Health Alert: Disease Tracking',
          message: 'A hereditary disease has been identified in the family lineage. Please review your family health history and consult with healthcare professionals if needed.'
        };
      case 'ritual':
        return {
          title: 'Upcoming Family Ritual',
          message: 'Important family rituals are scheduled in the coming days. Please check the rituals page for details and mark your attendance.'
        };
      default:
        return {
          title: '',
          message: ''
        };
    }
  };

  const handleTypeChange = (type: 'disease' | 'ritual' | 'general') => {
    setNotificationType(type);
    const template = getNotificationTemplate(type);
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Kul Setu Connect Management</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-100">Total Users</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats?.totalUsers || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm text-blue-100">Registered Members</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Families */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-100">Total Families</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats?.totalFamilies || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm text-purple-100">Family Lines</span>
              </div>
            </CardContent>
          </Card>

          {/* Living Members */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-100">Living Members</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats?.livingCount || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm text-green-100">Active Users</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Rituals */}
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-100">Upcoming Rituals</CardDescription>
              <CardTitle className="text-3xl font-bold">{stats?.upcomingRituals || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm text-orange-100">Next 30 Days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-pink-600" />
                Photo Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalPhotos || 0}</p>
              <p className="text-sm text-gray-600">Total photos uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Life Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalStories || 0}</p>
              <p className="text-sm text-gray-600">Stories shared</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Total Rituals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalRituals || 0}</p>
              <p className="text-sm text-gray-600">All ritual reminders</p>
            </CardContent>
          </Card>
        </div>

        {/* Disease Analysis Card */}
        <Card className="shadow-lg mb-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-red-600" />
                <CardTitle>Disease Analysis & Alert System</CardTitle>
              </div>
            </div>
            <CardDescription>
              Analyze common diseases across all families and send targeted monthly health alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-red-100">
                <p className="text-sm text-gray-700 mb-3">
                  This feature analyzes disease patterns in each family's medical history and automatically generates 
                  personalized health alerts. Each family will receive notifications about the most common diseases 
                  in their lineage with prevention tips and medical recommendations.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Identifies top 3 common diseases per family</li>
                  <li>• Sends targeted notifications to each family</li>
                  <li>• Includes health tips and medical advice</li>
                  <li>• Recommended: Run monthly for health monitoring</li>
                </ul>
              </div>
              
              <Button
                onClick={handleAnalyzeDiseases}
                disabled={analyzing}
                className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <TrendingUp className="w-5 h-5" />
                {analyzing ? 'Analyzing Diseases...' : 'Run Disease Analysis & Send Alerts'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Sender */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600" />
              <CardTitle>Send Notification</CardTitle>
            </div>
            <CardDescription>
              Notify users about diseases, rituals, or general announcements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Target Audience */}
            <div>
              <label className="text-sm font-medium mb-2 block">Target Audience</label>
              <div className="flex gap-2">
                <Button
                  variant={targetAudience === 'all' ? 'default' : 'outline'}
                  onClick={() => {
                    setTargetAudience('all');
                    setSelectedFamily('');
                  }}
                  className="flex-1"
                >
                  All Families
                </Button>
                <Button
                  variant={targetAudience === 'specific' ? 'default' : 'outline'}
                  onClick={() => setTargetAudience('specific')}
                  className="flex-1"
                >
                  Specific Family
                </Button>
              </div>
            </div>

            {/* Family Selector (shown when specific is selected) */}
            {targetAudience === 'specific' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Select Family</label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a family..." />
                  </SelectTrigger>
                  <SelectContent>
                    {familyLines.map((familyId) => (
                      <SelectItem key={familyId} value={familyId}>
                        Family {familyId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notification Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notification Type</label>
              <div className="flex gap-2">
                <Button
                  variant={notificationType === 'disease' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('disease')}
                  className="flex-1"
                >
                  Disease Alert
                </Button>
                <Button
                  variant={notificationType === 'ritual' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('ritual')}
                  className="flex-1"
                >
                  Ritual Update
                </Button>
                <Button
                  variant={notificationType === 'general' ? 'default' : 'outline'}
                  onClick={() => handleTypeChange('general')}
                  className="flex-1"
                >
                  General
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notification Title</label>
              <Input
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Enter notification title"
                className="w-full"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={5}
                className="w-full"
              />
            </div>

            {/* Type Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Type:</span>
              <Badge variant={notificationType === 'disease' ? 'destructive' : notificationType === 'ritual' ? 'default' : 'secondary'}>
                {notificationType.toUpperCase()}
              </Badge>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendNotification}
              disabled={
                sending || 
                !notificationTitle || 
                !notificationMessage || 
                (targetAudience === 'specific' && !selectedFamily)
              }
              className="w-full gap-2"
              size="lg"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${targetAudience === 'all' ? 'All Families' : 'Selected Family'}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
