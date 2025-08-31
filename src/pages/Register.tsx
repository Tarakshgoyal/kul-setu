import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Heart, Upload } from 'lucide-react';
import { saveFamilyMember, generateId, bloodGroups, eyeColors, type FamilyMember } from '@/lib/familyData';

const Register = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    personId: '',
    firstName: '',
    lastName: '',
    familyId: '',
    fatherId: '',
    motherId: '',
    generation: 1,
    birthYear: new Date().getFullYear() - 25,
    bloodGroup: '',
    eyeColor: '',
    birthmark: '',
    disease: '',
    passion: '',
    trait: '',
    nature: '',
    about: ''
  });

  const handleInputChange = (field: keyof FamilyMember, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const member: FamilyMember = {
        personId: formData.personId || generateId(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        familyId: formData.familyId || generateId(),
        fatherId: formData.fatherId || undefined,
        motherId: formData.motherId || undefined,
        generation: formData.generation || 1,
        birthYear: formData.birthYear || new Date().getFullYear(),
        bloodGroup: formData.bloodGroup || '',
        eyeColor: formData.eyeColor || '',
        birthmark: formData.birthmark,
        disease: formData.disease,
        passion: formData.passion || '',
        trait: formData.trait || '',
        nature: formData.nature || '',
        about: formData.about || ''
      };

      saveFamilyMember(member);

      toast({
        title: "Family Member Registered! 🌟",
        description: `${member.firstName} ${member.lastName} has been added to your spiritual family tree.`,
      });

      // Reset form
      setFormData({
        personId: '',
        firstName: '',
        lastName: '',
        familyId: '',
        fatherId: '',
        motherId: '',
        generation: 1,
        birthYear: new Date().getFullYear() - 25,
        bloodGroup: '',
        eyeColor: '',
        birthmark: '',
        disease: '',
        passion: '',
        trait: '',
        nature: '',
        about: ''
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering the family member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Register <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Member</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Add a new member to your sacred family tree with their spiritual essence
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
          <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Heart className="w-6 h-6" />
              <span>Sacred Family Details</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground font-medium">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground font-medium">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* IDs */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personId" className="text-foreground font-medium">Person ID</Label>
                  <Input
                    id="personId"
                    value={formData.personId}
                    onChange={(e) => handleInputChange('personId', e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="border-border/50 focus:border-spiritual"
                  />
                  <p className="text-sm text-muted-foreground">Leave empty for auto-generation</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="familyId" className="text-foreground font-medium">Family ID</Label>
                  <Input
                    id="familyId"
                    value={formData.familyId}
                    onChange={(e) => handleInputChange('familyId', e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generation" className="text-foreground font-medium">Generation *</Label>
                  <Input
                    id="generation"
                    type="number"
                    min="1"
                    value={formData.generation}
                    onChange={(e) => handleInputChange('generation', parseInt(e.target.value))}
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* Parent IDs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fatherId" className="text-foreground font-medium">Father ID</Label>
                  <Input
                    id="fatherId"
                    value={formData.fatherId}
                    onChange={(e) => handleInputChange('fatherId', e.target.value)}
                    placeholder="Enter father's Person ID"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motherId" className="text-foreground font-medium">Mother ID</Label>
                  <Input
                    id="motherId"
                    value={formData.motherId}
                    onChange={(e) => handleInputChange('motherId', e.target.value)}
                    placeholder="Enter mother's Person ID"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* Physical Attributes */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birthYear" className="text-foreground font-medium">Birth Year *</Label>
                  <Input
                    id="birthYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.birthYear}
                    onChange={(e) => handleInputChange('birthYear', parseInt(e.target.value))}
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className="text-foreground font-medium">Blood Group *</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                    <SelectTrigger className="border-border/50 focus:border-spiritual">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eyeColor" className="text-foreground font-medium">Eye Color *</Label>
                  <Select value={formData.eyeColor} onValueChange={(value) => handleInputChange('eyeColor', value)}>
                    <SelectTrigger className="border-border/50 focus:border-spiritual">
                      <SelectValue placeholder="Select eye color" />
                    </SelectTrigger>
                    <SelectContent>
                      {eyeColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birthmark" className="text-foreground font-medium">Birthmark</Label>
                  <Input
                    id="birthmark"
                    value={formData.birthmark}
                    onChange={(e) => handleInputChange('birthmark', e.target.value)}
                    placeholder="Describe any birthmarks"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="disease" className="text-foreground font-medium">Health Conditions</Label>
                  <Input
                    id="disease"
                    value={formData.disease}
                    onChange={(e) => handleInputChange('disease', e.target.value)}
                    placeholder="Any health conditions"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* Spiritual Attributes */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passion" className="text-foreground font-medium">Passion *</Label>
                  <Input
                    id="passion"
                    value={formData.passion}
                    onChange={(e) => handleInputChange('passion', e.target.value)}
                    placeholder="Their main passion"
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trait" className="text-foreground font-medium">Dominant Trait *</Label>
                  <Input
                    id="trait"
                    value={formData.trait}
                    onChange={(e) => handleInputChange('trait', e.target.value)}
                    placeholder="Key personality trait"
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nature" className="text-foreground font-medium">Nature *</Label>
                  <Input
                    id="nature"
                    value={formData.nature}
                    onChange={(e) => handleInputChange('nature', e.target.value)}
                    placeholder="Their spiritual nature"
                    required
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-2">
                <Label htmlFor="about" className="text-foreground font-medium">About the Person</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  placeholder="Write about this person's story, achievements, spiritual journey..."
                  rows={4}
                  className="border-border/50 focus:border-spiritual resize-none"
                />
              </div>

              {/* File Upload Placeholder */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Photos & Videos</Label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-spiritual/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Photo and video uploads will be available soon</p>
                  <p className="text-sm text-muted-foreground mt-2">Currently accepting text-based family information</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-spiritual text-white hover:opacity-90 shadow-spiritual text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Heart className="w-5 h-5 mr-2 animate-pulse" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register Family Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;