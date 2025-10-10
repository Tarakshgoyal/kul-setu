

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, User, Calendar, Droplets, Eye, Users, Star, TreePine, Edit, MapPin, GraduationCap, Home } from 'lucide-react';
import { type FamilyMember } from '@/lib/familyData';

// API configuration
const API_BASE_URL = 'https://kul-setu-backend.onrender.com';

// API functions
const searchFamilyMembers = async (query: any = {}): Promise<FamilyMember[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching family members:', error);
    return [];
  }
};

const getFamilyMemberById = async (personId: string): Promise<FamilyMember | null> => {
  const members = await searchFamilyMembers({ personId });
  return members.length > 0 ? members[0] : null;
};

const getFamilyMembers = async (): Promise<FamilyMember[]> => {
  return await searchFamilyMembers({});
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const [foundMember, allMembers] = await Promise.all([
            getFamilyMemberById(id),
            getFamilyMembers()
          ]);
          
          setMember(foundMember);
          setFamilyMembers(allMembers);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-divine/10 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-spiritual mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading spiritual profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-divine/10 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Member Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested family member could not be found.</p>
            <Button asChild>
              <Link to="/search">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRelatedMembers = () => {
    return familyMembers.filter(m => 
      m.personId !== member.personId && (
        m.familyLineId === member.familyLineId ||
        m.fatherId === member.personId ||
        m.motherId === member.personId ||
        m.spouseId === member.personId ||
        m.personId === member.fatherId ||
        m.personId === member.motherId ||
        m.personId === member.spouseId ||
        m.sharedAncestryKey === member.sharedAncestryKey
      )
    );
  };

  const relatedMembers = getRelatedMembers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-divine/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/search">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {member.firstName}
            </h1>
            <p className="text-lg text-muted-foreground">Sacred Family Profile</p>
            <div className="flex justify-center items-center space-x-4 mt-2">
              <Badge className="bg-divine text-divine-foreground">
                Generation {member.generation}
              </Badge>
              {member.familyLineId && (
                <Badge variant="outline">
                  Line: {member.familyLineId}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
              <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Personal Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Person ID</label>
                      <p className="text-foreground font-mono">{member.personId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Family Line ID</label>
                      <p className="text-foreground font-mono">{member.familyLineId || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="text-foreground">{member.gender === 'M' ? 'Male' : member.gender === 'F' ? 'Female' : member.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ethnicity</label>
                      <p className="text-foreground">{member.ethnicity || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Generation</span>
                      </label>
                      <Badge className="bg-divine text-divine-foreground">
                        Generation {member.generation}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <Droplets className="w-4 h-4 text-red-500" />
                        <span>Blood Group</span>
                      </label>
                      <Badge variant="outline" className="border-red-200 text-red-700">
                        {member.bloodGroup}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>Eye Color</span>
                      </label>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {member.eyeColor}
                      </Badge>
                    </div>
                    {member.hairColor && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Hair Color</label>
                        <Badge variant="outline">
                          {member.hairColor}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Information */}
                {(member.dob || member.dod) && (
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    {member.dob && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Date of Birth</span>
                        </label>
                        <p className="text-foreground">{new Date(member.dob).toLocaleDateString()}</p>
                      </div>
                    )}
                    {member.dod && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Date of Death</span>
                        </label>
                        <p className="text-foreground">{new Date(member.dod).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Physical Characteristics */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Physical Characteristics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {member.skinTone && (
                      <div>
                        <label className="text-xs text-muted-foreground">Skin Tone</label>
                        <p className="text-sm text-foreground">{member.skinTone}</p>
                      </div>
                    )}
                    {member.birthmark && (
                      <div>
                        <label className="text-xs text-muted-foreground">Birthmark</label>
                        <p className="text-sm text-foreground">{member.birthmark}</p>
                      </div>
                    )}
                    {member.freckles && (
                      <div>
                        <label className="text-xs text-muted-foreground">Freckles</label>
                        <p className="text-sm text-foreground">{member.freckles}</p>
                      </div>
                    )}
                    {member.beardStyleTrend && (
                      <div>
                        <label className="text-xs text-muted-foreground">Beard Style</label>
                        <p className="text-sm text-foreground">{member.beardStyleTrend}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health & Personal Traits */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-sacred">
              <CardHeader className="bg-gradient-sacred text-sacred-foreground rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6" />
                  <span>Health & Personal Traits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Health Conditions */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Health Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {member.conditionDiabetes && (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <label className="text-xs text-muted-foreground">Diabetes</label>
                        <p className="text-sm font-medium text-foreground">{member.conditionDiabetes}</p>
                      </div>
                    )}
                    {member.conditionHeartIssue && (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <label className="text-xs text-muted-foreground">Heart Issues</label>
                        <p className="text-sm font-medium text-foreground">{member.conditionHeartIssue}</p>
                      </div>
                    )}
                    {member.conditionAsthma && (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                          <Star className="w-6 h-6 text-blue-600" />
                        </div>
                        <label className="text-xs text-muted-foreground">Asthma</label>
                        <p className="text-sm font-medium text-foreground">{member.conditionAsthma}</p>
                      </div>
                    )}
                    {member.conditionColorBlindness && (
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-purple-600" />
                        </div>
                        <label className="text-xs text-muted-foreground">Color Blindness</label>
                        <p className="text-sm font-medium text-foreground">{member.conditionColorBlindness}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Traits */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Personal Traits</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    {member.natureOfPerson && (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-spiritual flex items-center justify-center">
                          <TreePine className="w-8 h-8 text-white" />
                        </div>
                        <label className="text-sm font-medium text-muted-foreground">Nature</label>
                        <p className="text-lg font-semibold text-foreground">{member.natureOfPerson}</p>
                      </div>
                    )}
                    
                    {member.leftHanded && (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-divine flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <label className="text-sm font-medium text-muted-foreground">Left Handed</label>
                        <p className="text-lg font-semibold text-foreground">{member.leftHanded}</p>
                      </div>
                    )}
                    
                    {member.isTwin && (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-sacred flex items-center justify-center">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <label className="text-sm font-medium text-muted-foreground">Twin</label>
                        <p className="text-lg font-semibold text-foreground">{member.isTwin}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cultural & Location Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-divine">
              <CardHeader className="bg-gradient-divine text-divine-foreground rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6" />
                  <span>Cultural Heritage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {member.nativeLocation && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Native Location</span>
                      </label>
                      <p className="text-foreground font-medium">{member.nativeLocation}</p>
                    </div>
                  )}
                  
                  {member.migrationPath && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <Home className="w-4 h-4" />
                        <span>Migration Path</span>
                      </label>
                      <p className="text-foreground">{member.migrationPath}</p>
                    </div>
                  )}

                  {member.recipesCuisine && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cuisine Preference</label>
                      <Badge variant="outline" className="mt-1">
                        {member.recipesCuisine}
                      </Badge>
                    </div>
                  )}

                  {member.familyTraditions && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Family Traditions</label>
                      <Badge variant="outline" className="mt-1">
                        {member.familyTraditions}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Socioeconomic Information */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {member.educationLevel && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>Education Level</span>
                      </label>
                      <Badge className="bg-spiritual text-spiritual-foreground mt-1">
                        {member.educationLevel}
                      </Badge>
                    </div>
                  )}

                  {member.socioeconomicStatus && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Socioeconomic Status</label>
                      <Badge variant="secondary" className="mt-1">
                        {member.socioeconomicStatus}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Family Connections */}
            <Card className="bg-card/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Users className="w-5 h-5 text-spiritual" />
                  <span>Family Connections</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {member.fatherId && (
                  <div className="mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Father ID</label>
                    <p className="text-foreground font-mono text-sm">{member.fatherId}</p>
                  </div>
                )}
                
                {member.motherId && (
                  <div className="mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Mother ID</label>
                    <p className="text-foreground font-mono text-sm">{member.motherId}</p>
                  </div>
                )}

                {member.spouseId && (
                  <div className="mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Spouse ID</label>
                    <p className="text-foreground font-mono text-sm">{member.spouseId}</p>
                  </div>
                )}

                {member.sharedAncestryKey && (
                  <div className="mb-3">
                    <label className="text-sm font-medium text-muted-foreground">Shared Ancestry</label>
                    <p className="text-foreground font-mono text-sm">{member.sharedAncestryKey}</p>
                  </div>
                )}

                {relatedMembers.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Related Members</label>
                      <div className="space-y-2">
                        {relatedMembers.slice(0, 5).map((related) => (
                          <Link
                            key={related.personId}
                            to={`/profile/${related.personId}`}
                            className="block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {related.firstName}
                            </p>
                            <p className="text-xs text-muted-foreground">Gen {related.generation}</p>
                          </Link>
                        ))}
                        {relatedMembers.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{relatedMembers.length - 5} more family members
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/search">
                    <Users className="w-4 h-4 mr-2" />
                    Find More Family
                  </Link>
                </Button>
                <Button asChild className="w-full bg-spiritual text-spiritual-foreground hover:bg-spiritual/90">
                  <Link to="/register">
                    <Heart className="w-4 h-4 mr-2" />
                    Add Family Member
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;