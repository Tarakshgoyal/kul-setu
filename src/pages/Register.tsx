import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Heart } from 'lucide-react';
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

const API_URL = "http://127.0.0.1:5000";

const Register = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    personId: '',
    firstName: '',
    familyLineId: '',
    generation: 1,
    gender: '',
    ethnicity: '',
    motherId: '',
    fatherId: '',
    spouseId: '',
    sharedAncestryKey: '',
    dob: '',
    dod: '',
    longevityAvgLifespan: undefined,
    generationAvgLifespan: undefined,
    causeOfDeath: '',
    eyeColor: '',
    hairColor: '',
    skinTone: '',
    bloodGroup: '',
    birthmark: '',
    freckles: '',
    baldness: '',
    beardStyleTrend: '',
    conditionDiabetes: '',
    conditionHeartIssue: '',
    conditionAsthma: '',
    conditionColorBlindness: '',
    leftHanded: '',
    isTwin: '',
    natureOfPerson: '',
    recipesCuisine: '',
    familyTraditions: '',
    nativeLocation: '',
    migrationPath: '',
    socioeconomicStatus: '',
    educationLevel: ''
  });

  const handleInputChange = (field: keyof FamilyMember, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Family Member Registered! 🌟",
          description: `${formData.firstName} has been added to your spiritual family tree.`,
        });
        
        // Reset form
        setFormData({
          personId: '',
          firstName: '',
          familyLineId: '',
          generation: 1,
          gender: '',
          ethnicity: '',
          motherId: '',
          fatherId: '',
          spouseId: '',
          sharedAncestryKey: '',
          dob: '',
          dod: '',
          longevityAvgLifespan: undefined,
          generationAvgLifespan: undefined,
          causeOfDeath: '',
          eyeColor: '',
          hairColor: '',
          skinTone: '',
          bloodGroup: '',
          birthmark: '',
          freckles: '',
          baldness: '',
          beardStyleTrend: '',
          conditionDiabetes: '',
          conditionHeartIssue: '',
          conditionAsthma: '',
          conditionColorBlindness: '',
          leftHanded: '',
          isTwin: '',
          natureOfPerson: '',
          recipesCuisine: '',
          familyTraditions: '',
          nativeLocation: '',
          migrationPath: '',
          socioeconomicStatus: '',
          educationLevel: ''
        });
      } else {
        throw new Error(result.error || 'Registration failed');
      }
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Register <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Member</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Add a new member to your sacred family tree with their complete lineage information
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
          <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Heart className="w-6 h-6" />
              <span>Complete Family Details</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      required
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-foreground font-medium">Gender *</Label>
                    <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
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
                    <Label htmlFor="ethnicity" className="text-foreground font-medium">Ethnicity</Label>
                    <Select value={formData.ethnicity || ''} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicities.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* IDs and Relationships */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">IDs and Relationships</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personId" className="text-foreground font-medium">Person ID</Label>
                    <Input
                      id="personId"
                      value={formData.personId || ''}
                      onChange={(e) => handleInputChange('personId', e.target.value)}
                      placeholder="Auto-generated if empty"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyLineId" className="text-foreground font-medium">Family Line ID</Label>
                    <Input
                      id="familyLineId"
                      value={formData.familyLineId || ''}
                      onChange={(e) => handleInputChange('familyLineId', e.target.value)}
                      placeholder="Family line identifier"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherId" className="text-foreground font-medium">Father ID</Label>
                    <Input
                      id="fatherId"
                      value={formData.fatherId || ''}
                      onChange={(e) => handleInputChange('fatherId', e.target.value)}
                      placeholder="Father's person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherId" className="text-foreground font-medium">Mother ID</Label>
                    <Input
                      id="motherId"
                      value={formData.motherId || ''}
                      onChange={(e) => handleInputChange('motherId', e.target.value)}
                      placeholder="Mother's person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseId" className="text-foreground font-medium">Spouse ID</Label>
                    <Input
                      id="spouseId"
                      value={formData.spouseId || ''}
                      onChange={(e) => handleInputChange('spouseId', e.target.value)}
                      placeholder="Spouse's person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generation" className="text-foreground font-medium">Generation *</Label>
                    <Input
                      id="generation"
                      type="number"
                      value={formData.generation || 1}
                      onChange={(e) => handleInputChange('generation', parseInt(e.target.value))}
                      min="1"
                      required
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Physical Characteristics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eyeColor" className="text-foreground font-medium">Eye Color *</Label>
                    <Select value={formData.eyeColor || ''} onValueChange={(value) => handleInputChange('eyeColor', value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="hairColor" className="text-foreground font-medium">Hair Color</Label>
                    <Select value={formData.hairColor || ''} onValueChange={(value) => handleInputChange('hairColor', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
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
                    <Label htmlFor="skinTone" className="text-foreground font-medium">Skin Tone</Label>
                    <Select value={formData.skinTone || ''} onValueChange={(value) => handleInputChange('skinTone', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {skinTones.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-foreground font-medium">Blood Group *</Label>
                    <Select value={formData.bloodGroup || ''} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
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
                    <Label htmlFor="birthmark" className="text-foreground font-medium">Birthmark</Label>
                    <Select value={formData.birthmark || ''} onValueChange={(value) => handleInputChange('birthmark', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has birthmark?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freckles" className="text-foreground font-medium">Freckles</Label>
                    <Select value={formData.freckles || ''} onValueChange={(value) => handleInputChange('freckles', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has freckles?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Health Conditions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditionDiabetes" className="text-foreground font-medium">Diabetes</Label>
                    <Select value={formData.conditionDiabetes || ''} onValueChange={(value) => handleInputChange('conditionDiabetes', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has diabetes?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionHeartIssue" className="text-foreground font-medium">Heart Issues</Label>
                    <Select value={formData.conditionHeartIssue || ''} onValueChange={(value) => handleInputChange('conditionHeartIssue', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has heart issues?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionAsthma" className="text-foreground font-medium">Asthma</Label>
                    <Select value={formData.conditionAsthma || ''} onValueChange={(value) => handleInputChange('conditionAsthma', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has asthma?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionColorBlindness" className="text-foreground font-medium">Color Blindness</Label>
                    <Select value={formData.conditionColorBlindness || ''} onValueChange={(value) => handleInputChange('conditionColorBlindness', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Color blind?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Personal Traits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Traits</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="natureOfPerson" className="text-foreground font-medium">Nature *</Label>
                    <Select value={formData.natureOfPerson || ''} onValueChange={(value) => handleInputChange('natureOfPerson', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select nature" />
                      </SelectTrigger>
                      <SelectContent>
                        {natureOptions.map(nature => (
                          <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leftHanded" className="text-foreground font-medium">Left Handed</Label>
                    <Select value={formData.leftHanded || ''} onValueChange={(value) => handleInputChange('leftHanded', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Left handed?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isTwin" className="text-foreground font-medium">Is Twin</Label>
                    <Select value={formData.isTwin || ''} onValueChange={(value) => handleInputChange('isTwin', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Is a twin?" />
                      </SelectTrigger>
                      <SelectContent>
                        {yesNoOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.gender === 'M' && (
                    <div className="space-y-2">
                      <Label htmlFor="beardStyleTrend" className="text-foreground font-medium">Beard Style</Label>
                      <Select value={formData.beardStyleTrend || ''} onValueChange={(value) => handleInputChange('beardStyleTrend', value)}>
                        <SelectTrigger className="border-border/50 focus:border-spiritual">
                          <SelectValue placeholder="Select beard style" />
                        </SelectTrigger>
                        <SelectContent>
                          {beardStyles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Cultural Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Cultural Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipesCuisine" className="text-foreground font-medium">Recipes/Cuisine</Label>
                    <Select value={formData.recipesCuisine || ''} onValueChange={(value) => handleInputChange('recipesCuisine', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select cuisine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipeCuisines.map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyTraditions" className="text-foreground font-medium">Family Traditions</Label>
                    <Select value={formData.familyTraditions || ''} onValueChange={(value) => handleInputChange('familyTraditions', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select tradition type" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyTraditions.map(tradition => (
                          <SelectItem key={tradition} value={tradition}>{tradition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nativeLocation" className="text-foreground font-medium">Native Location</Label>
                    <Input
                      id="nativeLocation"
                      value={formData.nativeLocation || ''}
                      onChange={(e) => handleInputChange('nativeLocation', e.target.value)}
                      placeholder="e.g., City_1, Village_5"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="migrationPath" className="text-foreground font-medium">Migration Path</Label>
                    <Input
                      id="migrationPath"
                      value={formData.migrationPath || ''}
                      onChange={(e) => handleInputChange('migrationPath', e.target.value)}
                      placeholder="Migration history"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>
              </div>

              {/* Socioeconomic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Socioeconomic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel" className="text-foreground font-medium">Education Level</Label>
                    <Select value={formData.educationLevel || ''} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socioeconomicStatus" className="text-foreground font-medium">Socioeconomic Status</Label>
                    <Select value={formData.socioeconomicStatus || ''} onValueChange={(value) => handleInputChange('socioeconomicStatus', value)}>
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {socioeconomicStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Date Information (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-foreground font-medium">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob || ''}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dod" className="text-foreground font-medium">Date of Death</Label>
                    <Input
                      id="dod"
                      type="date"
                      value={formData.dod || ''}
                      onChange={(e) => handleInputChange('dod', e.target.value)}
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-spiritual hover:bg-gradient-spiritual/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg transform transition-transform hover:scale-105"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Registering...' : 'Register Family Member'}
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