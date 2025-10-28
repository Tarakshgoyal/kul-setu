import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Users, Heart, Eye, Droplets, User, Calendar, MapPin } from 'lucide-react';
import { apiClient, FamilyMember, SearchParams } from '@/lib/api';
import { 
  bloodGroups, 
  eyeColors, 
  hairColors, 
  skinTones, 
  genders, 
  ethnicities, 
  yesNoOptions, 
  socioeconomicStatuses, 
  natureOptions, 
  beardStyles, 
  familyTraditions 
} from '@/lib/familyData';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<SearchParams>({});
  const [results, setResults] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [userFamilyLineId, setUserFamilyLineId] = useState<string>('');

  // Get logged-in user's family line ID
  useEffect(() => {
    const getUserFamilyLineId = () => {
      const userData = localStorage.getItem('kulSetuUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.familyLineId) {
            setUserFamilyLineId(user.familyLineId);
            // Set family line ID in search query
            setSearchQuery(prev => ({
              ...prev,
              familyLineId: user.familyLineId
            }));
          }
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    };
    getUserFamilyLineId();
  }, []);

  // Load all members initially (filtered by family line)
  useEffect(() => {
    const loadAllMembers = async () => {
      if (!userFamilyLineId) return; // Wait for family line ID
      
      try {
        console.log("Loading all members for family:", userFamilyLineId);
        const response = await apiClient.searchMembers({ familyLineId: userFamilyLineId });
        console.log("Received data:", response);
        setResults(response.results || []);
        setTotalCount(response.count || 0);
      } catch (err) {
        console.error("Error fetching members:", err);
        setResults([]);
        setTotalCount(0);
      }
    };
    loadAllMembers();
  }, [userFamilyLineId]);

  // Search button handler → call backend
  const handleSearch = async () => {
    setLoading(true);
    // Ensure family line ID is always included in search
    const searchWithFamilyId = {
      ...searchQuery,
      familyLineId: userFamilyLineId
    };
    console.log("Searching with query:", searchWithFamilyId);
    try {
      const response = await apiClient.searchMembers(searchWithFamilyId);
      console.log("Search results:", response);
      setResults(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  // Reset filters → clear state & fetch all members (keep family line ID)
  const handleReset = async () => {
    setSearchQuery({ familyLineId: userFamilyLineId });
    setLoading(true);
    try {
      const response = await apiClient.searchMembers({ familyLineId: userFamilyLineId });
      setResults(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error("Reset failed:", err);
      setResults([]);
      setTotalCount(0);
    }
    setLoading(false);
  };  // Input handler
  const handleInputChange = (field: keyof SearchParams, value: string) => {
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
                <div className="grid md:grid-cols-2 gap-4">
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
                    <Select value={searchQuery.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender === 'M' ? 'Male' : 'Female'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select value={searchQuery.ethnicity || ''} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicities.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={searchQuery.bloodGroup || ''} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Select value={searchQuery.eyeColor || ''} onValueChange={(value) => handleInputChange('eyeColor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        {eyeColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Select value={searchQuery.hairColor || ''} onValueChange={(value) => handleInputChange('hairColor', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        {hairColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skinTone">Skin Tone</Label>
                    <Select value={searchQuery.skinTone || ''} onValueChange={(value) => handleInputChange('skinTone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {skinTones.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Physical Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Additional Features</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthmark">Birthmark</Label>
                    <Input
                      id="birthmark"
                      value={searchQuery.birthmark || ''}
                      onChange={(e) => handleInputChange('birthmark', e.target.value)}
                      placeholder="Search by birthmark"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freckles">Freckles</Label>
                    <Select value={searchQuery.freckles || ''} onValueChange={(value) => handleInputChange('freckles', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select freckles" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baldness">Baldness</Label>
                    <Select value={searchQuery.baldness || ''} onValueChange={(value) => handleInputChange('baldness', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select baldness" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beardStyle">Beard Style</Label>
                    <Input
                      id="beardStyle"
                      value={searchQuery.beardStyleTrend || ''}
                      onChange={(e) => handleInputChange('beardStyleTrend', e.target.value)}
                      placeholder="Search by beard style"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Medical Conditions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diabetes">Diabetes</Label>
                    <Select value={searchQuery.conditionDiabetes || ''} onValueChange={(value) => handleInputChange('conditionDiabetes', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heartIssue">Heart Issue</Label>
                    <Select value={searchQuery.conditionHeartIssue || ''} onValueChange={(value) => handleInputChange('conditionHeartIssue', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asthma">Asthma</Label>
                    <Select value={searchQuery.conditionAsthma || ''} onValueChange={(value) => handleInputChange('conditionAsthma', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorBlindness">Color Blindness</Label>
                    <Select value={searchQuery.conditionColorBlindness || ''} onValueChange={(value) => handleInputChange('conditionColorBlindness', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherDisease">Other Disease</Label>
                    <Input
                      id="otherDisease"
                      value={searchQuery.otherDisease || ''}
                      onChange={(e) => handleInputChange('otherDisease', e.target.value)}
                      placeholder="Search by disease"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disability">Disability</Label>
                    <Input
                      id="disability"
                      value={searchQuery.disability || ''}
                      onChange={(e) => handleInputChange('disability', e.target.value)}
                      placeholder="Search by disability"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Traits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Traits</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leftHanded">Left Handed</Label>
                    <Select value={searchQuery.leftHanded || ''} onValueChange={(value) => handleInputChange('leftHanded', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isTwin">Is Twin</Label>
                    <Select value={searchQuery.isTwin || ''} onValueChange={(value) => handleInputChange('isTwin', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passion">Passion</Label>
                    <Input
                      id="passion"
                      value={searchQuery.passion || ''}
                      onChange={(e) => handleInputChange('passion', e.target.value)}
                      placeholder="Search by passion"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="natureOfPerson">Nature</Label>
                    <Select value={searchQuery.natureOfPerson || ''} onValueChange={(value) => handleInputChange('natureOfPerson', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nature" />
                      </SelectTrigger>
                      <SelectContent>
                        {natureOptions.map(nature => (
                          <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Socioeconomic & Cultural */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Socioeconomic & Cultural</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Input
                      id="educationLevel"
                      value={searchQuery.educationLevel || ''}
                      onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                      placeholder="Search by education level"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socioeconomicStatus">Socioeconomic Status</Label>
                    <Select value={searchQuery.socioeconomicStatus || ''} onValueChange={(value) => handleInputChange('socioeconomicStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {socioeconomicStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipesCuisine">Recipe Cuisine</Label>
                    <Input
                      id="recipesCuisine"
                      value={searchQuery.recipesCuisine || ''}
                      onChange={(e) => handleInputChange('recipesCuisine', e.target.value)}
                      placeholder="Search by cuisine type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyTraditions">Family Traditions</Label>
                    <Select value={searchQuery.familyTraditions || ''} onValueChange={(value) => handleInputChange('familyTraditions', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tradition" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyTraditions.map(tradition => (
                          <SelectItem key={tradition} value={tradition}>{tradition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location & Migration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Location & Migration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nativeLocation">Native Location</Label>
                    <Input
                      id="nativeLocation"
                      value={searchQuery.nativeLocation || ''}
                      onChange={(e) => handleInputChange('nativeLocation', e.target.value)}
                      placeholder="Search by location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="migrationPath">Migration Path</Label>
                    <Input
                      id="migrationPath"
                      value={searchQuery.migrationPath || ''}
                      onChange={(e) => handleInputChange('migrationPath', e.target.value)}
                      placeholder="Search by migration path"
                    />
                  </div>
                </div>
              </div>

              {/* Dates & Lifespan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dates & Lifespan</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={searchQuery.dob || ''}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dod">Date of Death</Label>
                    <Input
                      id="dod"
                      type="date"
                      value={searchQuery.dod || ''}
                      onChange={(e) => handleInputChange('dod', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="causeOfDeath">Cause of Death</Label>
                    <Input
                      id="causeOfDeath"
                      value={searchQuery.causeOfDeath || ''}
                      onChange={(e) => handleInputChange('causeOfDeath', e.target.value)}
                      placeholder="Search by cause"
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
              Search Results ({totalCount} total, {Array.isArray(results) ? results.length : 0} shown)
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