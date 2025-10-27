import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, Calendar, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  notificationId: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const apiBaseUrl = 'https://kul-setu-backend.onrender.com';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/notifications`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'ritual':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'disease':
        return <Badge variant="destructive">Health Alert</Badge>;
      case 'ritual':
        return <Badge className="bg-purple-600">Ritual</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format as: "Jan 27, 2025 at 2:30 PM"
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} at ${formattedTime}`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-4 top-20 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea className="h-[500px]">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center text-gray-500">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification.notificationId}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.isRead ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900">
                                  {notification.title}
                                </h4>
                                {getNotificationBadge(notification.type)}
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
