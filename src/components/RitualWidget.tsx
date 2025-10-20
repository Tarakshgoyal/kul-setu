import { useState, useEffect } from 'react';
import { Calendar, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = 'https://kul-setu-backend.onrender.com';

interface UpcomingRitual {
  reminderId: string;
  ritualType: string;
  ritualName: string;
  ritualDate: string;
  location?: string;
}

const RitualWidget = () => {
  const [upcomingRituals, setUpcomingRituals] = useState<UpcomingRitual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingRituals();
  }, []);

  const loadUpcomingRituals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('kulSetuUser') || '{}');
      const familyId = user.familyId;

      if (!familyId) {
        setUpcomingRituals([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/rituals/upcoming?familyId=${familyId}&daysAhead=7`);
      if (!response.ok) {
        console.error('API error:', response.status);
        setUpcomingRituals([]);
        return;
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setUpcomingRituals(data.slice(0, 3)); // Show only 3
      } else {
        setUpcomingRituals([]);
      }
    } catch (error) {
      console.error('Failed to load upcoming rituals:', error);
      setUpcomingRituals([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ritualDate = new Date(dateStr);
    ritualDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((ritualDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getRitualTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      barsi: 'bg-purple-100 text-purple-800',
      shraad: 'bg-indigo-100 text-indigo-800',
      marriage: 'bg-pink-100 text-pink-800',
      pooja: 'bg-orange-100 text-orange-800',
      worship: 'bg-yellow-100 text-yellow-800',
      kul_devta: 'bg-red-100 text-red-800',
      festival: 'bg-green-100 text-green-800',
      birth: 'bg-blue-100 text-blue-800',
      death: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading || upcomingRituals.length === 0) {
    return null; // Don't show widget if no rituals or still loading
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Upcoming Rituals
          </CardTitle>
          <Link to="/rituals">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingRituals.map((ritual) => {
          const daysUntil = getDaysUntil(ritual.ritualDate);
          return (
            <div
              key={ritual.reminderId}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-spiritual flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`${getRitualTypeColor(ritual.ritualType)} text-xs`}>
                    {ritual.ritualType}
                  </Badge>
                  <Badge variant="destructive" className="text-xs">
                    {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm truncate">{ritual.ritualName}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(ritual.ritualDate)}
                  {ritual.location && ` • ${ritual.location}`}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RitualWidget;
