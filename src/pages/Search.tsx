import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Users, Heart, Eye, Droplets, User, Calendar, MapPin } from 'lucide-react';
import { 
  bloodGroups, 
  eyeColors, 
  hairColors, 
  skinTones, 
  genders, 
  ethnicities, 
  yesNoOptions, 
  educationLevels, 
  socioeconomicStatuses, 
  natureOptions, 
  beardStyles, 
  recipeCuisines, 
  familyTraditions,
  type FamilyMember 
} from '@/lib/familyData';

const API_URL = "https://kul-setu-backend.onrender.com";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<Partial<FamilyMember>>({});
  const [results, setResults] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all members initially
  useEffect(() => {
    console.log("Loading initial data from:", `${API_URL}/search`);
    fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // empty search = return all
    })
      .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Received data:", data?.length, "members");
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          console.error("Expected array but received:", data);
          setResults([]);
        }
      })
      .catch(err => {
        console.error("Error fetching members:", err);
        setResults([]); // Set empty array on error
      });
  }, []);

  // Search button handler → call backend
  const handleSearch = async () => {
    setLoading(true);
    console.log("Searching with query:", searchQuery);
    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchQuery),
      });
      console.log("Search response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Search results:", data?.length, "members");
      
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        console.error("Expected array but received:", data);
        setResults([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
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
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        console.error("Expected array but received:", data);
        setResults([]);
      }
    } catch (err) {
      console.error("Reset failed:", err);
      setResults([]);
    }
    setLoading(false);
  };

  // Input handler
  const handleInputChange = (field: keyof FamilyMember, value: string) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value === "all" || value === "" ? undefined : value || undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-divine/10 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
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
            <div className="space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={searchQuery.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Search by first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personId">Person ID</Label>
                    <Input
                      id="personId"
                      value={searchQuery.personId || ''}
                      onChange={(e) => handleInputChange('personId', e.target.value)}
                      placeholder="Search by person ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyLineId">Family Line ID</Label>
                    <Input
                      id="familyLineId"
                      value={searchQuery.familyLineId || ''}
                      onChange={(e) => handleInputChange('familyLineId', e.target.value)}
                      placeholder="Search by family line"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generation">Generation</Label>
                    <Input
                      id="generation"
                      type="number"
                      value={searchQuery.generation || ''}
                      onChange={(e) => handleInputChange('generation', e.target.value)}
                      placeholder="Search by generation"
                    />
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Demographics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={searchQuery.gender || 'all'} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender === 'M' ? 'Male' : 'Female'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select value={searchQuery.ethnicity || 'all'} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {ethnicities.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={searchQuery.bloodGroup || 'all'} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {bloodGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Physical Characteristics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eyeColor">Eye Color</Label>
                    <Select value={searchQuery.eyeColor || 'all'} onValueChange={(value) => handleInputChange('eyeColor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {eyeColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Select value={searchQuery.hairColor || 'all'} onValueChange={(value) => handleInputChange('hairColor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {hairColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skinTone">Skin Tone</Label>
                    <Select value={searchQuery.skinTone || 'all'} onValueChange={(value) => handleInputChange('skinTone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {skinTones.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Socioeconomic & Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Socioeconomic & Personal</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select value={searchQuery.educationLevel || 'all'} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {educationLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socioeconomicStatus">Socioeconomic Status</Label>
                    <Select value={searchQuery.socioeconomicStatus || 'all'} onValueChange={(value) => handleInputChange('socioeconomicStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {socioeconomicStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="natureOfPerson">Nature</Label>
                    <Select value={searchQuery.natureOfPerson || 'all'} onValueChange={(value) => handleInputChange('natureOfPerson', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {natureOptions.map(nature => (
                          <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nativeLocation">Native Location</Label>
                    <Input
                      id="nativeLocation"
                      value={searchQuery.nativeLocation || ''}
                      onChange={(e) => handleInputChange('nativeLocation', e.target.value)}
                      placeholder="Search by location"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-gradient-spiritual hover:bg-gradient-spiritual/90 text-white px-6 py-2"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  disabled={loading}
                  className="px-6 py-2"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
              <Users className="w-6 h-6 mr-2 text-spiritual" />
              Search Results ({Array.isArray(results) ? results.length : 0})
            </h2>
          </div>

          {loading ? (
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
              <div className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4 animate-spin">⏳</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Searching...</h3>
              <p className="text-muted-foreground">Please wait while we find your family members.</p>
            </Card>
          ) : !Array.isArray(results) || results.length === 0 ? (
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No family members found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria to find more members.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(results) && results.map((member) => (
                <Card key={member.personId} className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">
                        {member.firstName}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Gen {member.generation}
                      </Badge>
                    </div>
                    {member.similarity_score && (
                      <Badge variant="outline" className="text-xs w-fit">
                        {Math.round(member.similarity_score * 100)}% match
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-medium">{member.personId}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Family:</span>
                        <span className="font-medium">{member.familyLineId}</span>
                      </div>

                      {member.gender && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Gender:</span>
                          <span className="font-medium">{member.gender === 'M' ? 'Male' : 'Female'}</span>
                        </div>
                      )}

                      {member.ethnicity && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Ethnicity:</span>
                          <span className="font-medium">{member.ethnicity}</span>
                        </div>
                      )}

                      {member.eyeColor && (
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Eyes:</span>
                          <span className="font-medium">{member.eyeColor}</span>
                        </div>
                      )}

                      {member.bloodGroup && (
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Blood:</span>
                          <span className="font-medium">{member.bloodGroup}</span>
                        </div>
                      )}

                      {member.nativeLocation && (
                        <div className="flex items-center space-x-2 col-span-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{member.nativeLocation}</span>
                        </div>
                      )}

                      {member.natureOfPerson && (
                        <div className="flex items-center space-x-2 col-span-2">
                          <span className="text-muted-foreground">Nature:</span>
                          <Badge variant="outline" className="text-xs">
                            {member.natureOfPerson}
                          </Badge>
                        </div>
                      )}

                      {member.educationLevel && (
                        <div className="flex items-center space-x-2 col-span-2">
                          <span className="text-muted-foreground">Education:</span>
                          <Badge variant="secondary" className="text-xs">
                            {member.educationLevel}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {(member.fatherId || member.motherId || member.spouseId) && (
                      <div className="border-t pt-3 space-y-1">
                        <h4 className="font-medium text-sm text-muted-foreground">Relationships</h4>
                        {member.fatherId && (
                          <p className="text-xs">Father: {member.fatherId}</p>
                        )}
                        {member.motherId && (
                          <p className="text-xs">Mother: {member.motherId}</p>
                        )}
                        {member.spouseId && (
                          <p className="text-xs">Spouse: {member.spouseId}</p>
                        )}
                      </div>
                    )}

                    <div className="pt-3">
                      <Link to={`/profile/${member.personId}`}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full hover:bg-spiritual/10 hover:border-spiritual"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;