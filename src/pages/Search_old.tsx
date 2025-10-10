import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Users, Heart, Eye, Droplets } from 'lucide-react';
import { bloodGroups, eyeColors } from '@/lib/familyData';
import type { FamilyMember } from '@/lib/familyData';

const API_URL = "http://127.0.0.1:5000";

const Search_old = () => {
  const [searchQuery, setSearchQuery] = useState<Partial<FamilyMember>>({});
  const [results, setResults] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all members initially
  useEffect(() => {
    fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // empty search = return all
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error("Error fetching members:", err));
  }, []);

  // Search button handler → call backend
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchQuery),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  // Reset filters → clear state & fetch all members
  const handleReset = async () => {
    setSearchQuery({});
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Reset failed:", err);
    }
    setLoading(false);
  };

  // Input handler
  const handleInputChange = (field: keyof FamilyMember, value: string) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value === "all" ? undefined : value || undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-divine/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Search <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Tree</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover connections within your sacred family lineage
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-0 shadow-sacred">
          <CardHeader className="bg-gradient-sacred text-sacred-foreground rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <SearchIcon className="w-6 h-6" />
              <span>Find Family Members</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* --- Your existing inputs --- */}
            {/* First Name, Last Name, Person ID */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="searchFirstName">First Name</Label>
                <Input
                  id="searchFirstName"
                  value={searchQuery.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Search by first name"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchLastName">Last Name</Label>
                <Input
                  id="searchLastName"
                  value={searchQuery.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Search by last name"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchPersonId">Person ID</Label>
                <Input
                  id="searchPersonId"
                  value={searchQuery.personId || ""}
                  onChange={(e) => handleInputChange("personId", e.target.value)}
                  placeholder="Search by Person ID"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
            </div>

            {/* --- Family ID, Generation, Blood Group, Eye Color --- */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="searchFamilyId">Family ID</Label>
                <Input
                  id="searchFamilyId"
                  value={searchQuery.familyId || ""}
                  onChange={(e) => handleInputChange("familyId", e.target.value)}
                  placeholder="Family ID"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchFamilyId">Mother ID</Label>
                <Input
                  id="searchFamilyId"
                  value={searchQuery.motherId || ""}
                  onChange={(e) => handleInputChange("motherId", e.target.value)}
                  placeholder="Mother ID"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchGeneration">Generation</Label>
                <Input
                  id="searchGeneration"
                  type="number"
                  value={searchQuery.generation || ""}
                  onChange={(e) => handleInputChange("generation", e.target.value)}
                  placeholder="Generation"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchBloodGroup">Blood Group</Label>
                <Select
                  value={searchQuery.bloodGroup || ""}
                  onValueChange={(value) => handleInputChange("bloodGroup", value)}
                >
                  <SelectTrigger className="border-border/50 focus:border-spiritual">
                    <SelectValue placeholder="Any blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any blood group</SelectItem>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchEyeColor">Eye Color</Label>
                <Select
                  value={searchQuery.eyeColor || ""}
                  onValueChange={(value) => handleInputChange("eyeColor", value)}
                >
                  <SelectTrigger className="border-border/50 focus:border-spiritual">
                    <SelectValue placeholder="Any eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any eye color</SelectItem>
                    {eyeColors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --- Passion, Trait, Nature --- */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="searchPassion">Passion</Label>
                <Input
                  id="searchPassion"
                  value={searchQuery.passion || ""}
                  onChange={(e) => handleInputChange("passion", e.target.value)}
                  placeholder="Search by passion"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchTrait">Trait</Label>
                <Input
                  id="searchTrait"
                  value={searchQuery.trait || ""}
                  onChange={(e) => handleInputChange("trait", e.target.value)}
                  placeholder="Search by trait"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchNature">Nature</Label>
                <Input
                  id="searchNature"
                  value={searchQuery.nature || ""}
                  onChange={(e) => handleInputChange("nature", e.target.value)}
                  placeholder="Search by nature"
                  className="border-border/50 focus:border-spiritual"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-spiritual text-white hover:opacity-90 shadow-spiritual"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search Family"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-spiritual text-spiritual hover:bg-spiritual/10"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
              <Users className="w-6 h-6 text-spiritual" />
              <span>Search Results</span>
            </h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {results.length} member{results.length !== 1 ? "s" : ""} found
            </Badge>
          </div>

          {/* --- Same results rendering as before --- */}
          {results.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-0">
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-muted-foreground mb-2">No family members found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or register new family members
                </p>
                <Button asChild className="mt-4 bg-spiritual text-spiritual-foreground hover:bg-spiritual/90">
                  <Link to="/register">Register New Member</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((member) => (
                <Link key={member.personId} to={`/profile/${member.personId}`}>
                  <Card className="group hover:shadow-spiritual transition-all duration-300 cursor-pointer bg-card/80 backdrop-blur-sm border-0 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-spiritual transition-colors">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">ID: {member.personId}</p>
                        </div>
                        <Heart className="w-5 h-5 text-spiritual group-hover:animate-pulse" />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-divine" />
                          <span>Generation {member.generation}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Droplets className="w-4 h-4 text-red-500" />
                          <span>{member.bloodGroup}</span>
                          <Eye className="w-4 h-4 text-blue-500 ml-4" />
                          <span>{member.eyeColor}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.passion && (
                          <Badge variant="outline" className="text-xs bg-sacred/20 text-sacred-foreground border-sacred/30">
                            {member.passion}
                          </Badge>
                        )}
                        {member.trait && (
                          <Badge variant="outline" className="text-xs bg-spiritual/20 text-spiritual-foreground border-spiritual/30">
                            {member.trait}
                          </Badge>
                        )}
                        {member.nature && (
                          <Badge variant="outline" className="text-xs bg-divine/20 text-divine-foreground border-divine/30">
                            {member.nature}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search_old;
