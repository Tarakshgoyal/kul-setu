import { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, TrendingUp, Bell, Edit, Trash2, X, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_URL = 'https://kul-setu-backend.onrender.com';

interface Ritual {
  reminderId: string;
  familyId: string;
  personId?: string;
  personName?: string;
  ritualType: string;
  ritualName: string;
  ritualDate: string;
  recurring: boolean;
  recurrencePattern?: string;
  location?: string;
  panditType?: string;
  kulDevta?: string;
  description?: string;
  notes?: string;
  reminderDaysBefore: number;
  isCompleted: boolean;
}

interface RitualTypes {
  ritual_types: Array<{ value: string; label: string }>;
  recurrence_patterns: string[];
  pandit_types: string[];
}

const Rituals = () => {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [filteredRituals, setFilteredRituals] = useState<Ritual[]>([]);
  const [ritualTypes, setRitualTypes] = useState<RitualTypes | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    ritualType: '',
    ritualName: '',
    ritualDate: '',
    familyId: '',
    personId: '',
    recurring: false,
    recurrencePattern: '',
    location: '',
    panditType: '',
    kulDevta: '',
    description: '',
    notes: '',
    reminderDaysBefore: 7,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rituals, filterType, showCompleted]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load ritual types
      const typesRes = await fetch(`${API_URL}/rituals/types`);
      if (typesRes.ok) {
        const types = await typesRes.json();
        setRitualTypes(types);
      }

      // Get user's family ID from localStorage
      const user = JSON.parse(localStorage.getItem('kulSetuUser') || '{}');
      const familyId = user.familyId;

      if (!familyId) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to view your family rituals',
          variant: 'destructive',
        });
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Load family rituals
      const ritualsRes = await fetch(`${API_URL}/rituals/${familyId}`);
      if (ritualsRes.ok) {
        const ritualsData = await ritualsRes.json();
        setRituals(Array.isArray(ritualsData) ? ritualsData : []);
      } else {
        setRituals([]);
      }

      // Load stats
      const statsRes = await fetch(`${API_URL}/rituals/stats?familyId=${familyId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      setFormData(prev => ({ ...prev, familyId }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load rituals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rituals];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.ritualType === filterType);
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(r => !r.isCompleted);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.ritualDate).getTime() - new Date(b.ritualDate).getTime());

    setFilteredRituals(filtered);
  };

  const handleCreateRitual = async () => {
    try {
      // Convert date format from YYYY-MM-DD to DD-MM-YYYY
      const [year, month, day] = formData.ritualDate.split('-');
      const formattedDate = `${day}-${month}-${year}`;

      const response = await fetch(`${API_URL}/rituals/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ritualDate: formattedDate,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Ritual reminder created successfully',
        });
        setShowCreateDialog(false);
        resetForm();
        loadInitialData();
      } else {
        throw new Error('Failed to create ritual');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create ritual reminder',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRitual = async () => {
    if (!selectedRitual) return;

    try {
      const updateData: any = {};
      
      // Only include fields that have changed
      if (formData.ritualName) updateData.ritualName = formData.ritualName;
      if (formData.location) updateData.location = formData.location;
      if (formData.notes) updateData.notes = formData.notes;
      if (formData.reminderDaysBefore) updateData.reminderDaysBefore = formData.reminderDaysBefore;
      if (formData.ritualDate) {
        const [year, month, day] = formData.ritualDate.split('-');
        updateData.ritualDate = `${day}-${month}-${year}`;
      }

      const response = await fetch(`${API_URL}/rituals/update/${selectedRitual.reminderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Ritual updated successfully',
        });
        setShowEditDialog(false);
        loadInitialData();
      } else {
        throw new Error('Failed to update ritual');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ritual',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRitual = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this ritual?')) return;

    try {
      const response = await fetch(`${API_URL}/rituals/delete/${reminderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Ritual deleted successfully',
        });
        loadInitialData();
      } else {
        throw new Error('Failed to delete ritual');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ritual',
        variant: 'destructive',
      });
    }
  };

  const handleMarkComplete = async (ritual: Ritual) => {
    try {
      const response = await fetch(`${API_URL}/rituals/update/${ritual.reminderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !ritual.isCompleted }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: ritual.isCompleted ? 'Ritual marked as pending' : 'Ritual marked as completed',
        });
        loadInitialData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ritual status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    const user = JSON.parse(localStorage.getItem('kulSetuUser') || '{}');
    setFormData({
      ritualType: '',
      ritualName: '',
      ritualDate: '',
      familyId: user.familyId || '',
      personId: '',
      recurring: false,
      recurrencePattern: '',
      location: '',
      panditType: '',
      kulDevta: '',
      description: '',
      notes: '',
      reminderDaysBefore: 7,
    });
  };

  const openEditDialog = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    // Convert date from YYYY-MM-DD to input format
    const dateParts = ritual.ritualDate.split('-');
    const formattedDate = dateParts.length === 3 ? ritual.ritualDate : '';
    
    setFormData({
      ritualType: ritual.ritualType,
      ritualName: ritual.ritualName,
      ritualDate: formattedDate,
      familyId: ritual.familyId,
      personId: ritual.personId || '',
      recurring: ritual.recurring,
      recurrencePattern: ritual.recurrencePattern || '',
      location: ritual.location || '',
      panditType: ritual.panditType || '',
      kulDevta: ritual.kulDevta || '',
      description: ritual.description || '',
      notes: ritual.notes || '',
      reminderDaysBefore: ritual.reminderDaysBefore,
    });
    setShowEditDialog(true);
  };

  const getRitualTypeLabel = (type: string) => {
    const typeObj = ritualTypes?.ritual_types.find(t => t.value === type);
    return typeObj?.label || type;
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading rituals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center h-96 text-center p-8">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view and manage your family's ritual reminders.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Ritual Reminders
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all family rituals and ceremonies
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Ritual
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rituals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.upcoming}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label htmlFor="show-completed">Show Completed</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filter by ritual type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rituals</SelectItem>
              {ritualTypes?.ritual_types.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Rituals List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Only</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-4">
          {filteredRituals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No rituals found. Click "Add Ritual" to create one.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRituals.map(ritual => {
              const daysUntil = getDaysUntil(ritual.ritualDate);
              const isUpcoming = daysUntil >= 0 && daysUntil <= 30;

              return (
                <Card key={ritual.reminderId} className={ritual.isCompleted ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getRitualTypeColor(ritual.ritualType)}>
                            {getRitualTypeLabel(ritual.ritualType)}
                          </Badge>
                          {ritual.recurring && (
                            <Badge variant="outline">
                              🔄 {ritual.recurrencePattern}
                            </Badge>
                          )}
                          {isUpcoming && !ritual.isCompleted && (
                            <Badge variant="destructive">
                              <Bell className="h-3 w-3 mr-1" />
                              {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                            </Badge>
                          )}
                          {ritual.isCompleted && (
                            <Badge variant="secondary">✓ Completed</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{ritual.ritualName}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(ritual.ritualDate)}
                            </span>
                            {ritual.location && (
                              <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {ritual.location}
                              </span>
                            )}
                            {ritual.personName && (
                              <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {ritual.personName}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkComplete(ritual)}
                        >
                          {ritual.isCompleted ? 'Mark Pending' : 'Mark Complete'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(ritual)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRitual(ritual.reminderId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {(ritual.description || ritual.notes || ritual.panditType || ritual.kulDevta) && (
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {ritual.description && (
                          <p className="text-muted-foreground">{ritual.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4">
                          {ritual.panditType && (
                            <span className="text-muted-foreground">
                              <strong>Pandit:</strong> {ritual.panditType}
                            </span>
                          )}
                          {ritual.kulDevta && (
                            <span className="text-muted-foreground">
                              <strong>Kul Devta:</strong> {ritual.kulDevta}
                            </span>
                          )}
                          {ritual.reminderDaysBefore && (
                            <span className="text-muted-foreground">
                              <strong>Reminder:</strong> {ritual.reminderDaysBefore} days before
                            </span>
                          )}
                        </div>
                        {ritual.notes && (
                          <p className="text-muted-foreground italic">
                            <strong>Notes:</strong> {ritual.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {filteredRituals.filter(r => getDaysUntil(r.ritualDate) >= 0 && getDaysUntil(r.ritualDate) <= 30).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No upcoming rituals in the next 30 days.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRituals
              .filter(r => getDaysUntil(r.ritualDate) >= 0 && getDaysUntil(r.ritualDate) <= 30)
              .map(ritual => {
                const daysUntil = getDaysUntil(ritual.ritualDate);
                return (
                  <Card key={ritual.reminderId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRitualTypeColor(ritual.ritualType)}>
                              {getRitualTypeLabel(ritual.ritualType)}
                            </Badge>
                            <Badge variant="destructive">
                              <Bell className="h-3 w-3 mr-1" />
                              {daysUntil === 0 ? 'Today!' : `In ${daysUntil} days`}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{ritual.ritualName}</CardTitle>
                          <CardDescription className="mt-2">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(ritual.ritualDate)}
                              </span>
                              {ritual.location && (
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {ritual.location}
                                </span>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
          setSelectedRitual(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showEditDialog ? 'Edit Ritual' : 'Create New Ritual'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ritualType">Ritual Type *</Label>
                <Select
                  value={formData.ritualType}
                  onValueChange={(value) => setFormData({ ...formData, ritualType: value })}
                  disabled={showEditDialog}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ritualTypes?.ritual_types.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ritualDate">Date *</Label>
                <Input
                  id="ritualDate"
                  type="date"
                  value={formData.ritualDate}
                  onChange={(e) => setFormData({ ...formData, ritualDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ritualName">Ritual Name *</Label>
              <Input
                id="ritualName"
                value={formData.ritualName}
                onChange={(e) => setFormData({ ...formData, ritualName: e.target.value })}
                placeholder="e.g., Grandfather's Barsi"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Family Temple, Delhi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panditType">Pandit Type</Label>
                <Select
                  value={formData.panditType}
                  onValueChange={(value) => setFormData({ ...formData, panditType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pandit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ritualTypes?.pandit_types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kulDevta">Kul Devta</Label>
                <Input
                  id="kulDevta"
                  value={formData.kulDevta}
                  onChange={(e) => setFormData({ ...formData, kulDevta: e.target.value })}
                  placeholder="e.g., Lord Shiva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderDays">Remind Me (Days Before)</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  value={formData.reminderDaysBefore}
                  onChange={(e) => setFormData({ ...formData, reminderDaysBefore: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            {!showEditDialog && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={formData.recurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked })}
                  />
                  <Label htmlFor="recurring">Recurring Ritual</Label>
                </div>

                {formData.recurring && (
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Recurrence Pattern</Label>
                    <Select
                      value={formData.recurrencePattern}
                      onValueChange={(value) => setFormData({ ...formData, recurrencePattern: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {ritualTypes?.recurrence_patterns.map(pattern => (
                          <SelectItem key={pattern} value={pattern}>
                            {pattern}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the ritual..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or reminders..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowEditDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={showEditDialog ? handleUpdateRitual : handleCreateRitual}>
                {showEditDialog ? 'Update' : 'Create'} Ritual
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rituals;
