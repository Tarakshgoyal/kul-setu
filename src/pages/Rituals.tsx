import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar as CalendarIcon, Plus, Trash2, Sparkles, Flame, Flower2, Users, Moon, Sun, Star, Home } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/auth";

const API_URL = "https://kul-setu-backend.onrender.com";

interface Ritual {
  id: string;
  title: string;
  category: string;
  date: Date;
  description: string;
  panditType?: string;
  kulDevta?: string;
  location?: string;
  recurring?: boolean;
  recurrencePattern?: string;
}

const ritualCategories = [
  // House & Property
  { value: "grahparvesh", label: "Grahparvesh (Griha Pravesh)", icon: Home, color: "text-primary" },
  { value: "vehicle_pooja", label: "Vehicle Purchase Pooja", icon: Flame, color: "text-accent" },
  
  // Birth & Child Rituals
  { value: "birth", label: "Birth Rituals", icon: Sun, color: "text-secondary" },
  { value: "child_ritual", label: "Child Rituals (Chati, Mundan, etc.)", icon: Sun, color: "text-sacred" },
  
  // Death & Remembrance
  { value: "death", label: "Death Rituals", icon: Moon, color: "text-muted-foreground" },
  { value: "death_ritual", label: "Death Ceremony (13th Day)", icon: Moon, color: "text-muted-foreground" },
  { value: "shraad", label: "Shraad", icon: Flame, color: "text-spiritual" },
  { value: "barsi", label: "Barsi (Death Anniversary)", icon: Moon, color: "text-muted-foreground" },
  
  // Marriage
  { value: "marriage", label: "Marriage Rituals (Roka, Sagai, etc.)", icon: Flower2, color: "text-accent" },
  
  // Festivals
  { value: "festival", label: "Festival Rituals", icon: Sparkles, color: "text-primary" },
  { value: "navratri", label: "Navratri", icon: Star, color: "text-divine" },
  
  // Pooja & Worship
  { value: "pooja", label: "General Pooja/Worship", icon: Flame, color: "text-sacred" },
  { value: "worship", label: "Worship Ceremony", icon: Flame, color: "text-sacred" },
  { value: "kul_devta", label: "Kul Devta/Devi Pooja", icon: Star, color: "text-divine" },
  { value: "vrat_pooja", label: "Vrat Pooja (Karva Chauth, etc.)", icon: Flame, color: "text-spiritual" },
  { value: "satya_narayan", label: "Satya Narayan Pooja", icon: Star, color: "text-divine" },
  
  // Special Rituals
  { value: "panchang", label: "Panchang Related", icon: Calendar, color: "text-foreground" },
  { value: "kundli_pooja", label: "Kundli Pooja", icon: Star, color: "text-divine" },
  { value: "kul_pooja", label: "Kul Pooja", icon: Users, color: "text-primary" },
];

const panditTypes = [
  "Brahmin Pandit",
  "Purohit",
  "Jyotish",
  "Karmakandi",
  "Local Pandit",
];

const uttarakhandFestivals = [
  { name: "Phool Dei", date: "March-April" },
  { name: "Bikhauti Mela", date: "April" },
  { name: "Nanda Devi Raj Jat", date: "August-September" },
  { name: "Harela", date: "July" },
  { name: "Ghuian Ekadashi", date: "August" },
  { name: "Kandali Festival", date: "Every 12 years" },
  { name: "Uttarayani Mela", date: "January" },
];

const Rituals = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [newRitual, setNewRitual] = useState({
    title: "",
    category: "",
    description: "",
    panditType: "",
    kulDevta: "",
    location: "",
    recurring: false,
    recurrencePattern: "one_time",
  });

  useEffect(() => {
    const user = getUser();
    console.log("Current user:", user);
    console.log("User familyId:", user?.familyId);
    
    // Fetch festivals for all users
    fetchFestivals();
    
    if (user?.familyId) {
      setFamilyId(user.familyId);
      fetchRituals(user.familyId);
    } else {
      setLoading(false);
      console.warn("No familyId found for user");
      toast({
        title: "Please log in",
        description: "You need to be logged in to view rituals",
        variant: "destructive",
      });
    }
  }, []);

  const fetchFestivals = async () => {
    try {
      const response = await fetch(`${API_URL}/festivals`);
      if (response.ok) {
        const data = await response.json();
        console.log("Festivals loaded:", data);
        setFestivals(data);
      }
    } catch (error) {
      console.error("Error fetching festivals:", error);
    }
  };

  const fetchRituals = async (familyId: string) => {
    try {
      setLoading(true);
      console.log("Fetching rituals for familyId:", familyId);
      const response = await fetch(`${API_URL}/rituals/${familyId}`);
      console.log("Fetch response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Rituals data received:", data);
        
        // Backend returns array directly, not wrapped in {rituals: [...]}
        const ritualsData = Array.isArray(data) ? data : (data.rituals || []);
        
        const formattedRituals = ritualsData.map((r: any) => ({
          id: r.reminderId,
          title: r.ritualName,
          category: r.ritualType,
          date: new Date(r.ritualDate),
          description: r.description || "",
          panditType: r.panditType || "",
          kulDevta: r.kulDevta || "",
          location: r.location || "",
          recurring: r.recurring || false,
          recurrencePattern: r.recurrencePattern || "one_time",
        }));
        console.log("Formatted rituals:", formattedRituals);
        setRituals(formattedRituals);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch rituals. Status:", response.status, "Error:", errorText);
      }
    } catch (error) {
      console.error("Error fetching rituals:", error);
      toast({
        title: "Error",
        description: "Failed to load rituals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRitual = async () => {
    if (!newRitual.title || !newRitual.category || !selectedDate || !familyId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestBody = {
        familyId: familyId,
        ritualType: newRitual.category,
        ritualName: newRitual.title,
        ritualDate: format(selectedDate, "yyyy-MM-dd"),
        recurring: newRitual.recurring || false,
        recurrencePattern: newRitual.recurrencePattern || "one_time",
        location: newRitual.location?.trim() || "",
        panditType: newRitual.panditType?.trim() || "",
        kulDevta: newRitual.kulDevta?.trim() || "",
        description: newRitual.description?.trim() || "",
        notes: "",
        reminderDaysBefore: 7,
      };

      console.log("Sending ritual data:", requestBody);

      const response = await fetch(`${API_URL}/rituals/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.success) {
        toast({
          title: "Ritual Added",
          description: "Your ritual reminder has been set successfully",
        });
        
        // Refresh rituals
        await fetchRituals(familyId);
        
        // Reset form
        setIsDialogOpen(false);
        setNewRitual({
          title: "",
          category: "",
          description: "",
          panditType: "",
          kulDevta: "",
          location: "",
          recurring: false,
          recurrencePattern: "one_time",
        });
        setSelectedDate(undefined);
      } else {
        console.error("Backend returned error:", data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to add ritual",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding ritual:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add ritual. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRitual = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/rituals/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setRituals(rituals.filter((r) => r.id !== id));
        toast({
          title: "Ritual Deleted",
          description: "The ritual has been removed",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete ritual",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting ritual:", error);
      toast({
        title: "Error",
        description: "Failed to delete ritual",
        variant: "destructive",
      });
    }
  };

  const upcomingRituals = rituals
    .filter((r) => r.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get rituals and festivals for selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return { rituals: [], festivals: [] };
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dateRituals = rituals.filter(r => 
      format(r.date, 'yyyy-MM-dd') === dateStr
    );
    
    const dateFestivals = festivals.filter(f => 
      format(new Date(f.festivalDate), 'yyyy-MM-dd') === dateStr
    );
    
    return { rituals: dateRituals, festivals: dateFestivals };
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  // Get dates that have events for calendar highlighting
  const getDatesWithEvents = () => {
    const dates: Date[] = [];
    
    // Add ritual dates
    rituals.forEach(ritual => {
      dates.push(ritual.date);
    });
    
    // Add festival dates
    festivals.forEach(festival => {
      dates.push(new Date(festival.festivalDate));
    });
    
    return dates;
  };

  const datesWithEvents = getDatesWithEvents();

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      barsi: "bg-muted/50 text-muted-foreground border-muted",
      shraad: "bg-spiritual/10 text-spiritual border-spiritual/30",
      marriage: "bg-accent/10 text-accent-foreground border-accent/30",
      pooja: "bg-sacred/10 text-sacred-foreground border-sacred/30",
      kuldevta: "bg-divine/10 text-divine-foreground border-divine/30",
      festival: "bg-primary/10 text-primary border-primary/30",
      birth: "bg-secondary/10 text-secondary-foreground border-secondary/30",
      death: "bg-muted/50 text-muted-foreground border-muted",
      uttarakhand: "bg-primary/10 text-primary border-primary/30",
      other: "bg-muted/50 text-foreground border-border",
    };
    return styles[category] || "bg-primary/10 text-primary border-primary/30";
  };

  const getCategoryIcon = (category: string) => {
    const cat = ritualCategories.find(c => c.value === category);
    return cat?.icon || Bell;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-spiritual/5 to-sacred/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-spiritual mb-4 shadow-spiritual animate-glow">
            <Flame className="h-8 w-8 text-spiritual-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-spiritual bg-clip-text text-transparent">
            Rituals & Festivals
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preserve your spiritual traditions and never miss an important ceremony
          </p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-8">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-14 p-1 bg-card/50 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-spiritual data-[state=active]:text-spiritual-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-spiritual data-[state=active]:text-spiritual-foreground">
              <Bell className="mr-2 h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="festivals" className="data-[state=active]:bg-spiritual data-[state=active]:text-spiritual-foreground">
              <Sparkles className="mr-2 h-4 w-4" />
              Festivals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-8">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Calendar Section - More compact */}
              <Card className="lg:col-span-3 shadow-spiritual border-spiritual/20 bg-gradient-to-br from-card to-spiritual/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-lg bg-spiritual/10">
                      <CalendarIcon className="h-6 w-6 text-spiritual" />
                    </div>
                    Select Date
                  </CardTitle>
                  <CardDescription>Choose a date for your sacred ritual or ceremony</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-6">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      modifiers={{
                        hasEvents: datesWithEvents,
                      }}
                      modifiersStyles={{
                        hasEvents: {
                          fontWeight: 'bold',
                          textDecoration: 'underline',
                          color: 'hsl(var(--primary))',
                        }
                      }}
                      className="rounded-xl border-2 border-spiritual/20 shadow-lg bg-card pointer-events-auto scale-110"
                    />
                  </div>
                  
                  {/* Legend */}
                  <div className="text-xs text-center text-muted-foreground">
                    <span className="font-bold text-primary underline">Bold & Underlined dates</span> have events
                  </div>

                  {/* Events on Selected Date */}
                  {selectedDate && (selectedDateEvents.rituals.length > 0 || selectedDateEvents.festivals.length > 0) && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Events on {format(selectedDate, "PPP")}
                      </h4>
                      <div className="space-y-3">
                        {/* Festivals */}
                        {selectedDateEvents.festivals.map(festival => (
                          <div key={festival.festivalId} className="p-3 bg-card rounded-lg border border-primary/20">
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-semibold text-primary">{festival.festivalName}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">{festival.festivalType}</Badge>
                                  {festival.region !== "All India" && (
                                    <Badge variant="outline" className="text-xs">{festival.region}</Badge>
                                  )}
                                </div>
                                {festival.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{festival.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Rituals */}
                        {selectedDateEvents.rituals.map(ritual => {
                          const Icon = getCategoryIcon(ritual.category);
                          const categoryInfo = ritualCategories.find(c => c.value === ritual.category);
                          return (
                            <div key={ritual.id} className="p-3 bg-card rounded-lg border border-spiritual/20">
                              <div className="flex items-start gap-2">
                                <Icon className="h-4 w-4 text-spiritual mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-semibold">{ritual.title}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {categoryInfo?.label || ritual.category}
                                  </Badge>
                                  {ritual.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{ritual.description}</p>
                                  )}
                                  {ritual.location && (
                                    <p className="text-xs text-muted-foreground">📍 {ritual.location}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No events on selected date */}
                  {selectedDate && selectedDateEvents.rituals.length === 0 && selectedDateEvents.festivals.length === 0 && (
                    <div className="p-4 rounded-xl bg-muted/30 border border-muted/50 text-center">
                      <p className="text-sm text-muted-foreground">
                        No events scheduled for {format(selectedDate, "PPP")}
                      </p>
                    </div>
                  )}

                  {/* Today's Rituals */}
                  {upcomingRituals.filter(r => format(r.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length > 0 && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-sacred/10 to-spiritual/10 border-2 border-sacred/30">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-sacred" />
                        Today's Rituals
                      </h4>
                      <div className="space-y-2">
                        {upcomingRituals
                          .filter(r => format(r.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                          .slice(0, 3)
                          .map(ritual => (
                            <div key={ritual.id} className="text-sm p-2 bg-card rounded-lg">
                              <p className="font-medium">{ritual.title}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* Next 7 Days Preview */}
                  <div className="p-4 rounded-xl bg-divine/5 border border-divine/20">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-divine" />
                      Next 7 Days
                    </h4>
                    <div className="space-y-2">
                      {upcomingRituals
                        .filter(r => {
                          const days = Math.ceil((r.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return days >= 0 && days <= 7;
                        })
                        .slice(0, 4)
                        .map(ritual => {
                          const Icon = getCategoryIcon(ritual.category);
                          return (
                            <div key={ritual.id} className="flex items-center gap-3 p-2 bg-card rounded-lg hover:shadow-md transition-shadow">
                              <Icon className="h-4 w-4 text-spiritual flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{ritual.title}</p>
                                <p className="text-xs text-muted-foreground">{format(ritual.date, "MMM dd")}</p>
                              </div>
                            </div>
                          );
                        })
                      }
                      {upcomingRituals.filter(r => {
                        const days = Math.ceil((r.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        return days >= 0 && days <= 7;
                      }).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">No rituals in next 7 days</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Add Section */}
              <Card className="lg:col-span-2 shadow-sacred border-sacred/20 bg-gradient-to-br from-card to-sacred/5 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-sacred/10">
                      <Plus className="h-5 w-5 text-sacred" />
                    </div>
                    Quick Add
                  </CardTitle>
                  <CardDescription>Create a new ritual reminder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-auto py-6 bg-gradient-spiritual hover:opacity-90 shadow-spiritual text-base" size="lg">
                        <Plus className="mr-2 h-6 w-6" />
                        Add Ritual Reminder
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Ritual</DialogTitle>
                        <DialogDescription>
                          Fill in the details for your ritual or ceremony
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Ritual Name *</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Nanda Devi Pooja"
                            value={newRitual.title}
                            onChange={(e) =>
                              setNewRitual({ ...newRitual, title: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={newRitual.category}
                            onValueChange={(value) =>
                              setNewRitual({ ...newRitual, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {ritualCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <div className="border rounded-md p-3 bg-muted/50">
                            {selectedDate ? (
                              <p className="text-sm">
                                {format(selectedDate, "PPP")}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Select a date from the calendar
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Add details about the ritual, significance, preparations needed..."
                            value={newRitual.description}
                            onChange={(e) =>
                              setNewRitual({ ...newRitual, description: e.target.value })
                            }
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pandit">Pandit Type</Label>
                          <Select
                            value={newRitual.panditType}
                            onValueChange={(value) =>
                              setNewRitual({ ...newRitual, panditType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select pandit type" />
                            </SelectTrigger>
                            <SelectContent>
                              {panditTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="kuldevta">Kul Devta (Family Deity)</Label>
                          <Input
                            id="kuldevta"
                            placeholder="e.g., Nanda Devi, Gangnath, Kedarnath"
                            value={newRitual.kulDevta}
                            onChange={(e) =>
                              setNewRitual({ ...newRitual, kulDevta: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="Temple, home, or specific place"
                            value={newRitual.location}
                            onChange={(e) =>
                              setNewRitual({ ...newRitual, location: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddRitual}>Add Ritual</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {selectedDate && (
                    <div className="mt-auto p-4 bg-gradient-to-r from-spiritual/10 to-sacred/10 rounded-xl border-2 border-spiritual/30 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-spiritual/20 rounded-lg">
                          <CalendarIcon className="h-5 w-5 text-spiritual" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Selected Date</p>
                          <p className="font-bold text-spiritual text-lg">
                            {format(selectedDate, "EEEE")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(selectedDate, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ritual Categories Preview */}
                  <div className="space-y-3 mt-auto">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Quick Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ritualCategories.slice(0, 6).map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            className="p-3 rounded-lg border-2 bg-card/50 hover:bg-card hover:border-spiritual/30 transition-all duration-200 group text-left"
                            onClick={() => setNewRitual({ ...newRitual, category: cat.value })}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={cn("h-4 w-4 group-hover:scale-110 transition-transform", cat.color)} />
                              <span className="text-xs font-medium truncate">{cat.label.split(' ')[0]}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="p-3 rounded-lg bg-spiritual/5 text-center">
                      <p className="text-2xl font-bold text-spiritual">{upcomingRituals.length}</p>
                      <p className="text-xs text-muted-foreground">Total Rituals</p>
                    </div>
                    <div className="p-3 rounded-lg bg-sacred/5 text-center">
                      <p className="text-2xl font-bold text-sacred">
                        {upcomingRituals.filter(r => {
                          const days = Math.ceil((r.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return days >= 0 && days <= 30;
                        }).length}
                      </p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Upcoming Rituals</h2>
                <p className="text-muted-foreground">{upcomingRituals.length} sacred event(s) scheduled</p>
              </div>
            </div>

            {upcomingRituals.length === 0 ? (
              <Card className="shadow-divine border-divine/20">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-divine/10 mb-4">
                    <Bell className="h-10 w-10 text-divine/50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Rituals</h3>
                  <p className="text-muted-foreground mb-6">Start by adding your first ritual from the Calendar tab</p>
                  <Button onClick={() => {
                    const calendarTab = document.querySelector('[value="calendar"]') as HTMLElement;
                    calendarTab?.click();
                  }} className="bg-gradient-spiritual">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Ritual
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {upcomingRituals.map((ritual) => {
                  const Icon = getCategoryIcon(ritual.category);
                  const categoryInfo = ritualCategories.find(c => c.value === ritual.category);
                  
                  return (
                    <Card
                      key={ritual.id}
                      className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-spiritual/30"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Date Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-spiritual flex flex-col items-center justify-center text-spiritual-foreground shadow-spiritual">
                              <span className="text-xs font-medium uppercase">{format(ritual.date, "MMM")}</span>
                              <span className="text-3xl font-bold">{format(ritual.date, "dd")}</span>
                              <span className="text-xs">{format(ritual.date, "yyyy")}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={cn("border", getCategoryStyle(ritual.category))}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {categoryInfo?.label}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(ritual.date, "EEEE")}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRitual(ritual.id)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 group-hover:text-spiritual transition-colors">
                              {ritual.title}
                            </h3>

                            {ritual.description && (
                              <p className="text-muted-foreground mb-4 line-clamp-2">
                                {ritual.description}
                              </p>
                            )}

                            {/* Details Grid */}
                            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
                              {ritual.panditType && (
                                <div className="flex items-start gap-2">
                                  <Users className="h-4 w-4 text-spiritual mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Pandit</p>
                                    <p className="text-sm font-medium">{ritual.panditType}</p>
                                  </div>
                                </div>
                              )}
                              {ritual.kulDevta && (
                                <div className="flex items-start gap-2">
                                  <Star className="h-4 w-4 text-sacred mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Kul Devta</p>
                                    <p className="text-sm font-medium">{ritual.kulDevta}</p>
                                  </div>
                                </div>
                              )}
                              {ritual.location && (
                                <div className="flex items-start gap-2">
                                  <CalendarIcon className="h-4 w-4 text-divine mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{ritual.location}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="festivals" className="space-y-8">
            {/* Public Festivals from Pandit */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-sacred shadow-sacred">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Festival Calendar</h2>
                    <p className="text-muted-foreground">Upcoming festivals and celebrations</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/pandit/dashboard'}
                  className="text-sm"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Pandit Dashboard
                </Button>
              </div>

              {festivals.length === 0 ? (
                <Card className="shadow-divine border-divine/20">
                  <CardContent className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-divine/10 mb-4">
                      <CalendarIcon className="h-10 w-10 text-divine/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Festivals Added Yet</h3>
                    <p className="text-muted-foreground mb-4">Pandit can add festivals from the Pandit Dashboard</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {festivals.map((festival, index) => (
                    <Card
                      key={festival.festivalId}
                      className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-sacred/30 bg-gradient-to-br from-card to-sacred/5"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-3 rounded-xl bg-gradient-sacred text-sacred-foreground shadow-lg group-hover:scale-110 transition-transform">
                            <Sparkles className="h-6 w-6" />
                          </div>
                          <Badge variant="outline">{festival.festivalType}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-sacred transition-colors">
                          {festival.festivalName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {format(new Date(festival.festivalDate), "PPP")}
                            </span>
                          </div>
                          {festival.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {festival.description}
                            </p>
                          )}
                          {festival.region && festival.region !== "All India" && (
                            <Badge variant="secondary" className="text-xs">
                              {festival.region}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Uttarakhand Festivals */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-sacred shadow-sacred">
                  <span className="text-3xl">🏔️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Uttarakhand Festivals</h2>
                  <p className="text-muted-foreground">Celebrate the rich cultural heritage of Uttarakhand</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uttarakhandFestivals.map((festival, index) => (
                  <Card
                    key={festival.name}
                    className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-sacred/30 bg-gradient-to-br from-card to-sacred/5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-xl bg-gradient-sacred text-sacred-foreground shadow-lg group-hover:scale-110 transition-transform">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-sacred transition-colors">
                        {festival.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{festival.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Common Rituals */}
            <Card className="shadow-spiritual border-spiritual/20 bg-gradient-to-br from-card to-spiritual/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-spiritual/10">
                    <Flame className="h-6 w-6 text-spiritual" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Traditional Uttarakhand Rituals</CardTitle>
                    <CardDescription className="text-base">Sacred practices passed through generations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Jagra/Jagar",
                      description: "Night-long worship ceremony to invoke local deities",
                      icon: Moon,
                      color: "spiritual"
                    },
                    {
                      title: "Kul Devta Pooja",
                      description: "Worship of family deity at ancestral temples",
                      icon: Star,
                      color: "divine"
                    },
                    {
                      title: "Bhoomi Pooja",
                      description: "Land worship before construction or farming",
                      icon: Flower2,
                      color: "sacred"
                    },
                    {
                      title: "Phool Dei",
                      description: "Spring festival where children offer flowers",
                      icon: Sun,
                      color: "secondary"
                    },
                  ].map((ritual, index) => {
                    const Icon = ritual.icon;
                    return (
                      <div
                        key={ritual.title}
                        className="group p-5 border-2 rounded-xl hover:shadow-lg transition-all duration-300 bg-card hover:border-spiritual/30"
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform",
                            ritual.color === "spiritual" && "bg-spiritual/10 text-spiritual",
                            ritual.color === "divine" && "bg-divine/10 text-divine",
                            ritual.color === "sacred" && "bg-sacred/10 text-sacred-foreground",
                            ritual.color === "secondary" && "bg-secondary/10 text-secondary-foreground"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 group-hover:text-spiritual transition-colors">
                              {ritual.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {ritual.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rituals;