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
import { Plus, Trash2, Calendar as CalendarIcon, Star, LogOut } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const API_URL = "https://kul-setu-backend.onrender.com";

interface Festival {
  festivalId: number;
  festivalName: string;
  festivalDate: string;
  festivalType: string;
  description: string;
  region: string;
  isPublic: boolean;
  createdBy: string;
}

interface PanditUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const festivalTypes = [
  "Religious",
  "Cultural",
  "Regional",
  "National",
  "Spiritual",
  "General",
];

const regions = [
  "All India",
  "North India",
  "South India",
  "East India",
  "West India",
  "Uttarakhand",
  "Punjab",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
];

const PanditDashboard = () => {
  const navigate = useNavigate();
  const [panditUser, setPanditUser] = useState<PanditUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [newFestival, setNewFestival] = useState({
    festivalName: "",
    festivalType: "Religious",
    description: "",
    region: "All India",
  });

  useEffect(() => {
    // Check if pandit is already logged in
    const storedPandit = localStorage.getItem('panditUser');
    if (storedPandit) {
      setPanditUser(JSON.parse(storedPandit));
      setIsLoginOpen(false);
      fetchFestivals();
    }
  }, []);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      const response = await fetch(`${API_URL}/pandit/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPanditUser(data.user);
        localStorage.setItem('panditUser', JSON.stringify(data.user));
        setIsLoginOpen(false);
        fetchFestivals();
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.user.firstName}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('panditUser');
    setPanditUser(null);
    setIsLoginOpen(true);
    navigate('/');
  };

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/festivals`);
      
      if (response.ok) {
        const data = await response.json();
        setFestivals(data);
      } else {
        console.error("Failed to fetch festivals");
      }
    } catch (error) {
      console.error("Error fetching festivals:", error);
      toast({
        title: "Error",
        description: "Failed to load festivals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFestival = async () => {
    if (!newFestival.festivalName || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in festival name and date",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/festivals/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          festivalName: newFestival.festivalName,
          festivalDate: format(selectedDate, "yyyy-MM-dd"),
          festivalType: newFestival.festivalType,
          description: newFestival.description,
          region: newFestival.region,
          isPublic: true,
          createdBy: panditUser?.id || 'PANDIT001',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Festival Added",
          description: "Festival has been added to the calendar successfully",
        });
        
        // Refresh festivals
        await fetchFestivals();
        
        // Reset form
        setIsDialogOpen(false);
        setNewFestival({
          festivalName: "",
          festivalType: "Religious",
          description: "",
          region: "All India",
        });
        setSelectedDate(undefined);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add festival",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding festival:", error);
      toast({
        title: "Error",
        description: "Failed to add festival",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFestival = async (festivalId: number) => {
    try {
      const response = await fetch(`${API_URL}/festivals/delete/${festivalId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Festival Deleted",
          description: "Festival has been removed from the calendar",
        });
        
        // Refresh festivals
        await fetchFestivals();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete festival",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting festival:", error);
      toast({
        title: "Error",
        description: "Failed to delete festival",
        variant: "destructive",
      });
    }
  };

  // Login Dialog
  if (isLoginOpen || !panditUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spiritual via-background to-divine flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-spiritual to-divine rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Pandit Dashboard</CardTitle>
            <CardDescription>Login to manage festivals and rituals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spiritual via-background to-divine p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-spiritual to-divine bg-clip-text text-transparent">
              Pandit Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome, {panditUser.firstName} {panditUser.lastName}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Festivals</CardDescription>
              <CardTitle className="text-3xl">{festivals.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Upcoming</CardDescription>
              <CardTitle className="text-3xl">
                {festivals.filter(f => new Date(f.festivalDate) >= new Date()).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">
                {festivals.filter(f => {
                  const date = new Date(f.festivalDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && 
                         date.getFullYear() === now.getFullYear();
                }).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Add Festival Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Add New Festival
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Festival</DialogTitle>
                <DialogDescription>
                  Add a festival to the calendar. It will be visible to all users.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="festivalName">Festival Name *</Label>
                  <Input
                    id="festivalName"
                    placeholder="e.g., Diwali, Holi, Navratri"
                    value={newFestival.festivalName}
                    onChange={(e) => setNewFestival({ ...newFestival, festivalName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Festival Type</Label>
                    <Select
                      value={newFestival.festivalType}
                      onValueChange={(value) => setNewFestival({ ...newFestival, festivalType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {festivalTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={newFestival.region}
                      onValueChange={(value) => setNewFestival({ ...newFestival, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter festival description..."
                    value={newFestival.description}
                    onChange={(e) => setNewFestival({ ...newFestival, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleAddFestival} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Festival
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Festivals List */}
        <Card>
          <CardHeader>
            <CardTitle>All Festivals</CardTitle>
            <CardDescription>
              Manage festivals visible to all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading festivals...</p>
            ) : festivals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No festivals added yet. Click "Add New Festival" to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {festivals.map((festival) => (
                  <div
                    key={festival.festivalId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{festival.festivalName}</h3>
                        <Badge variant="secondary">{festival.festivalType}</Badge>
                        {festival.region !== "All India" && (
                          <Badge variant="outline">{festival.region}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {format(new Date(festival.festivalDate), "PPP")}
                      </div>
                      {festival.description && (
                        <p className="text-sm text-muted-foreground mt-2">{festival.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFestival(festival.festivalId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PanditDashboard;
