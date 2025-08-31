import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, User, Calendar, Droplets, Eye, Users, Star, TreePine, Edit } from 'lucide-react';
import { getFamilyMemberById, getFamilyMembers, type FamilyMember } from '@/lib/familyData';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundMember = getFamilyMemberById(id);
      const allMembers = getFamilyMembers();
      
      setMember(foundMember || null);
      setFamilyMembers(allMembers);
      setLoading(false);
    }
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
        m.familyId === member.familyId ||
        m.fatherId === member.personId ||
        m.motherId === member.personId ||
        m.personId === member.fatherId ||
        m.personId === member.motherId
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
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-lg text-muted-foreground">Sacred Family Profile</p>
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
                      <label className="text-sm font-medium text-muted-foreground">Family ID</label>
                      <p className="text-foreground font-mono">{member.familyId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Birth Year</span>
                      </label>
                      <p className="text-foreground">{member.birthYear}</p>
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
                  </div>
                </div>

                {member.birthmark && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-muted-foreground">Birthmark</label>
                    <p className="text-foreground">{member.birthmark}</p>
                  </div>
                )}

                {member.disease && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Health Conditions</label>
                    <p className="text-foreground">{member.disease}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Spiritual Attributes */}
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-sacred">
              <CardHeader className="bg-gradient-sacred text-sacred-foreground rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6" />
                  <span>Spiritual Essence</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-spiritual flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <label className="text-sm font-medium text-muted-foreground">Passion</label>
                    <p className="text-lg font-semibold text-foreground">{member.passion}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-divine flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <label className="text-sm font-medium text-muted-foreground">Trait</label>
                    <p className="text-lg font-semibold text-foreground">{member.trait}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-sacred flex items-center justify-center">
                      <TreePine className="w-8 h-8 text-white" />
                    </div>
                    <label className="text-sm font-medium text-muted-foreground">Nature</label>
                    <p className="text-lg font-semibold text-foreground">{member.nature}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {member.about && (
              <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-divine">
                <CardHeader className="bg-gradient-divine text-divine-foreground rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="w-6 h-6" />
                    <span>About {member.firstName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{member.about}</p>
                </CardContent>
              </Card>
            )}
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
                              {related.firstName} {related.lastName}
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