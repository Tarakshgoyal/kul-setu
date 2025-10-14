import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Heart, Skull, Save, User, Users, Calendar, MapPin, Palette, Stethoscope, Home, GraduationCap } from 'lucide-react';
import { apiClient, AliveMemberData, DeadMemberData, RegistrationSchema } from '@/lib/api';

type MemberType = 'alive' | 'dead';

const ComprehensiveRegister = () => {
  const { toast } = useToast();
  const [memberType, setMemberType] = useState<MemberType>('alive');
  const [schema, setSchema] = useState<RegistrationSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for alive members
  const [aliveFormData, setAliveFormData] = useState<AliveMemberData>({
    personId: '',
    familyLineId: '',
    generation: 1,
    firstName: '',
    gender: '',
    ethnicity: '',
    motherId: '',
    fatherId: '',
    spouseId: '',
    sharedAncestryKey: '',
    dob: '',
    longevityAvgLifespan: undefined,
    generationAvgLifespan: undefined,
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
    educationLevel: '',
  });

  // Form state for dead members
  const [deadFormData, setDeadFormData] = useState<DeadMemberData>({
    personId: '',
    familyLineId: '',
    generation: 1,
    firstName: '',
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
    educationLevel: '',
  });

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await apiClient.getRegistrationSchema();
        setSchema(schemaData);
        console.log('Loaded schema:', schemaData);
      } catch (err) {
        console.error('Failed to load schema:', err);
        toast({
          title: "Error",
          description: "Failed to load registration requirements",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadSchema();
  }, [toast]);

  const handleAliveInputChange = (field: keyof AliveMemberData, value: string | number) => {
    setAliveFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeadInputChange = (field: keyof DeadMemberData, value: string | number) => {
    setDeadFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForms = () => {
    setAliveFormData({
      personId: '',
      familyLineId: '',
      generation: 1,
      firstName: '',
      gender: '',
      ethnicity: '',
      motherId: '',
      fatherId: '',
      spouseId: '',
      sharedAncestryKey: '',
      dob: '',
      longevityAvgLifespan: undefined,
      generationAvgLifespan: undefined,
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
      educationLevel: '',
    });

    setDeadFormData({
      personId: '',
      familyLineId: '',
      generation: 1,
      firstName: '',
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
      educationLevel: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (memberType === 'alive') {
        // Validate first
        const validation = await apiClient.validateAliveMember(aliveFormData);
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors?.join(', ')}`);
        }
        result = await apiClient.registerAliveMember(aliveFormData);
        
        toast({
          title: "Living Member Registered! 🌟",
          description: `${aliveFormData.firstName} has been added to your family tree. Person ID: ${result.person_id}`,
        });
      } else {
        // Validate first
        const validation = await apiClient.validateDeadMember(deadFormData);
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors?.join(', ')}`);
        }
        result = await apiClient.registerDeadMember(deadFormData);
        
        toast({
          title: "Deceased Member Registered! 🕊️",
          description: `${deadFormData.firstName} has been added to your family tree. Person ID: ${result.person_id}`,
        });
      }
      
      resetForms();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error registering the family member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredFields = schema ? (memberType === 'alive' ? schema.alive_required : schema.dead_required) : [];

  // Helper function to check if field is required
  const isFieldRequired = (fieldName: string) => {
    return Array.isArray(requiredFields) && requiredFields.includes(fieldName);
  };

  // Get current form data
  const currentFormData = memberType === 'alive' ? aliveFormData : deadFormData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Register <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Member</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete family member registration with comprehensive details
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
          <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <UserPlus className="w-6 h-6" />
              <span>Comprehensive Member Registration</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Member Type Selection */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-foreground">Member Type</Label>
                <RadioGroup
                  value={memberType}
                  onValueChange={(value: MemberType) => setMemberType(value)}
                  className="flex space-x-8"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="alive" id="alive" className="border-2" />
                    <Label htmlFor="alive" className="flex items-center cursor-pointer text-base font-medium">
                      <Heart className="h-5 w-5 mr-2 text-green-600" />
                      Living Member
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="dead" id="dead" className="border-2" />
                    <Label htmlFor="dead" className="flex items-center cursor-pointer text-base font-medium">
                      <Skull className="h-5 w-5 mr-2 text-gray-600" />
                      Deceased Member
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium">
                      First Name {isFieldRequired('firstName') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="firstName"
                      required={isFieldRequired('firstName')}
                      value={currentFormData.firstName}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('firstName', e.target.value);
                        } else {
                          handleDeadInputChange('firstName', e.target.value);
                        }
                      }}
                      placeholder="Enter first name"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-foreground font-medium">
                      Gender {isFieldRequired('gender') && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={currentFormData.gender}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('gender', value);
                        } else {
                          handleDeadInputChange('gender', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generation" className="text-foreground font-medium">
                      Generation {isFieldRequired('generation') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="generation"
                      type="number"
                      min="1"
                      required={isFieldRequired('generation')}
                      value={currentFormData.generation}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        if (memberType === 'alive') {
                          handleAliveInputChange('generation', value);
                        } else {
                          handleDeadInputChange('generation', value);
                        }
                      }}
                      placeholder="e.g., 1"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ethnicity" className="text-foreground font-medium">
                      Ethnicity
                    </Label>
                    <Input
                      id="ethnicity"
                      value={currentFormData.ethnicity || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('ethnicity', e.target.value);
                        } else {
                          handleDeadInputChange('ethnicity', e.target.value);
                        }
                      }}
                      placeholder="e.g., East Asian, South Asian, African, European, etc."
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-foreground font-medium">
                      Blood Group {isFieldRequired('bloodGroup') && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={currentFormData.bloodGroup || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('bloodGroup', value);
                        } else {
                          handleDeadInputChange('bloodGroup', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'AB', 'O'].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Family Relationships */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Family Relationships
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motherId" className="text-foreground font-medium">Mother ID</Label>
                    <Input
                      id="motherId"
                      value={currentFormData.motherId || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('motherId', e.target.value);
                        } else {
                          handleDeadInputChange('motherId', e.target.value);
                        }
                      }}
                      placeholder="Mother's Person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherId" className="text-foreground font-medium">Father ID</Label>
                    <Input
                      id="fatherId"
                      value={currentFormData.fatherId || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('fatherId', e.target.value);
                        } else {
                          handleDeadInputChange('fatherId', e.target.value);
                        }
                      }}
                      placeholder="Father's Person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseId" className="text-foreground font-medium">Spouse ID</Label>
                    <Input
                      id="spouseId"
                      value={currentFormData.spouseId || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('spouseId', e.target.value);
                        } else {
                          handleDeadInputChange('spouseId', e.target.value);
                        }
                      }}
                      placeholder="Spouse's Person ID"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyLineId" className="text-foreground font-medium">Family Line ID</Label>
                    <Input
                      id="familyLineId"
                      value={currentFormData.familyLineId || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('familyLineId', e.target.value);
                        } else {
                          handleDeadInputChange('familyLineId', e.target.value);
                        }
                      }}
                      placeholder="Auto-generated if empty"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sharedAncestryKey" className="text-foreground font-medium">Shared Ancestry Key</Label>
                    <Input
                      id="sharedAncestryKey"
                      value={currentFormData.sharedAncestryKey || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('sharedAncestryKey', e.target.value);
                        } else {
                          handleDeadInputChange('sharedAncestryKey', e.target.value);
                        }
                      }}
                      placeholder="Family ancestry identifier"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Date Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-foreground font-medium">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={currentFormData.dob || ''}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('dob', e.target.value);
                        } else {
                          handleDeadInputChange('dob', e.target.value);
                        }
                      }}
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  {memberType === 'dead' && (
                    <div className="space-y-2">
                      <Label htmlFor="dod" className="text-foreground font-medium">
                        Date of Death {isFieldRequired('dod') && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id="dod"
                        type="date"
                        required={isFieldRequired('dod')}
                        value={deadFormData.dod || ''}
                        onChange={(e) => handleDeadInputChange('dod', e.target.value)}
                        className="border-border/50 focus:border-spiritual"
                      />
                    </div>
                  )}
                </div>

                {memberType === 'dead' && (
                  <div className="space-y-2">
                    <Label htmlFor="causeOfDeath" className="text-foreground font-medium">
                      Cause of Death {isFieldRequired('causeOfDeath') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="causeOfDeath"
                      required={isFieldRequired('causeOfDeath')}
                      value={deadFormData.causeOfDeath || ''}
                      onChange={(e) => handleDeadInputChange('causeOfDeath', e.target.value)}
                      placeholder="Enter cause of death"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                )}
              </div>

              {/* Physical Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Physical Characteristics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eyeColor" className="text-foreground font-medium">Eye Color</Label>
                    <Select
                      value={currentFormData.eyeColor || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('eyeColor', value);
                        } else {
                          handleDeadInputChange('eyeColor', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Hazel">Hazel</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hairColor" className="text-foreground font-medium">Hair Color</Label>
                    <Select
                      value={currentFormData.hairColor || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('hairColor', value);
                        } else {
                          handleDeadInputChange('hairColor', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Blonde">Blonde</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skinTone" className="text-foreground font-medium">Skin Tone</Label>
                    <Select
                      value={currentFormData.skinTone || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('skinTone', value);
                        } else {
                          handleDeadInputChange('skinTone', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Light">Light</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Dark">Dark</SelectItem>
                        <SelectItem value="Olive">Olive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthmark" className="text-foreground font-medium">Birthmark</Label>
                    <Select
                      value={currentFormData.birthmark || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('birthmark', value);
                        } else {
                          handleDeadInputChange('birthmark', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Select birthmark location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Hand">Hand</SelectItem>
                        <SelectItem value="Shoulder">Shoulder</SelectItem>
                        <SelectItem value="Neck">Neck</SelectItem>
                        <SelectItem value="Chest">Chest</SelectItem>
                        <SelectItem value="Back">Back</SelectItem>
                        <SelectItem value="Face">Face</SelectItem>
                        <SelectItem value="Arm">Arm</SelectItem>
                        <SelectItem value="Leg">Leg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="freckles" className="text-foreground font-medium">Freckles</Label>
                    <Select
                      value={currentFormData.freckles || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('freckles', value);
                        } else {
                          handleDeadInputChange('freckles', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has freckles?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baldness" className="text-foreground font-medium">Baldness</Label>
                    <Select
                      value={currentFormData.baldness || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('baldness', value);
                        } else {
                          handleDeadInputChange('baldness', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has baldness?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beardStyleTrend" className="text-foreground font-medium">Beard Style</Label>
                  <Select
                    value={currentFormData.beardStyleTrend || ''}
                    onValueChange={(value) => {
                      if (memberType === 'alive') {
                        handleAliveInputChange('beardStyleTrend', value);
                      } else {
                        handleDeadInputChange('beardStyleTrend', value);
                      }
                    }}
                  >
                    <SelectTrigger className="border-border/50 focus:border-spiritual">
                      <SelectValue placeholder="Select beard style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N/A">N/A</SelectItem>
                      <SelectItem value="Clean Shaven">Clean Shaven</SelectItem>
                      <SelectItem value="Full Beard">Full Beard</SelectItem>
                      <SelectItem value="Goatee">Goatee</SelectItem>
                      <SelectItem value="Mustache">Mustache</SelectItem>
                      <SelectItem value="Stubble">Stubble</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Medical Conditions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conditionDiabetes" className="text-foreground font-medium">Diabetes</Label>
                    <Select
                      value={currentFormData.conditionDiabetes || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('conditionDiabetes', value);
                        } else {
                          handleDeadInputChange('conditionDiabetes', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has diabetes?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionHeartIssue" className="text-foreground font-medium">Heart Issues</Label>
                    <Select
                      value={currentFormData.conditionHeartIssue || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('conditionHeartIssue', value);
                        } else {
                          handleDeadInputChange('conditionHeartIssue', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has heart issues?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionAsthma" className="text-foreground font-medium">Asthma</Label>
                    <Select
                      value={currentFormData.conditionAsthma || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('conditionAsthma', value);
                        } else {
                          handleDeadInputChange('conditionAsthma', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Has asthma?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditionColorBlindness" className="text-foreground font-medium">Color Blindness</Label>
                    <Select
                      value={currentFormData.conditionColorBlindness || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('conditionColorBlindness', value);
                        } else {
                          handleDeadInputChange('conditionColorBlindness', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Color blind?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leftHanded" className="text-foreground font-medium">Left Handed</Label>
                    <Select
                      value={currentFormData.leftHanded || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('leftHanded', value);
                        } else {
                          handleDeadInputChange('leftHanded', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Left handed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isTwin" className="text-foreground font-medium">Is Twin</Label>
                    <Select
                      value={currentFormData.isTwin || ''}
                      onValueChange={(value) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('isTwin', value);
                        } else {
                          handleDeadInputChange('isTwin', value);
                        }
                      }}
                    >
                      <SelectTrigger className="border-border/50 focus:border-spiritual">
                        <SelectValue placeholder="Is a twin?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherDisease" className="text-foreground font-medium">Other Diseases</Label>
                  <Input
                    id="otherDisease"
                    value={currentFormData.otherDisease || ''}
                    onChange={(e) => {
                      if (memberType === 'alive') {
                        handleAliveInputChange('otherDisease', e.target.value);
                      } else {
                        handleDeadInputChange('otherDisease', e.target.value);
                      }
                    }}
                    placeholder="Enter any other diseases or health conditions"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disability" className="text-foreground font-medium">Disability</Label>
                  <Input
                    id="disability"
                    value={currentFormData.disability || ''}
                    onChange={(e) => {
                      if (memberType === 'alive') {
                        handleAliveInputChange('disability', e.target.value);
                      } else {
                        handleDeadInputChange('disability', e.target.value);
                      }
                    }}
                    placeholder="Enter any physical or mental disabilities"
                    className="border-border/50 focus:border-spiritual"
                  />
                </div>
              </div>

              {/* Personal Traits & Culture (Dead members only) */}
              {memberType === 'dead' && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Personal Traits & Culture
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="natureOfPerson" className="text-foreground font-medium">Nature of Person</Label>
                        <Input
                          id="natureOfPerson"
                          value={deadFormData.natureOfPerson || ''}
                          onChange={(e) => handleDeadInputChange('natureOfPerson', e.target.value)}
                          placeholder="e.g., Friendly, Aggressive, Introvert, Artistic"
                          className="border-border/50 focus:border-spiritual"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipesCuisine" className="text-foreground font-medium">Recipes/Cuisine</Label>
                        <Input
                          id="recipesCuisine"
                          value={deadFormData.recipesCuisine || ''}
                          onChange={(e) => handleDeadInputChange('recipesCuisine', e.target.value)}
                          placeholder="e.g., Sweet_R3, Festive_F1"
                          className="border-border/50 focus:border-spiritual"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="familyTraditions" className="text-foreground font-medium">Family Traditions</Label>
                      <Input
                        id="familyTraditions"
                        value={deadFormData.familyTraditions || ''}
                        onChange={(e) => handleDeadInputChange('familyTraditions', e.target.value)}
                        placeholder="e.g., Festival_U1, Cultural celebrations"
                        className="border-border/50 focus:border-spiritual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passion" className="text-foreground font-medium">Passion/Interests</Label>
                      <Input
                        id="passion"
                        value={deadFormData.passion || ''}
                        onChange={(e) => handleDeadInputChange('passion', e.target.value)}
                        placeholder="e.g., Music, Sports, Cooking, Reading, Art"
                        className="border-border/50 focus:border-spiritual"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location & Background
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nativeLocation" className="text-foreground font-medium">Native Location</Label>
                        <Input
                          id="nativeLocation"
                          value={deadFormData.nativeLocation || ''}
                          onChange={(e) => handleDeadInputChange('nativeLocation', e.target.value)}
                          placeholder="e.g., City_8, Village_3"
                          className="border-border/50 focus:border-spiritual"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="migrationPath" className="text-foreground font-medium">Migration Path</Label>
                        <Input
                          id="migrationPath"
                          value={deadFormData.migrationPath || ''}
                          onChange={(e) => handleDeadInputChange('migrationPath', e.target.value)}
                          placeholder="Migration history"
                          className="border-border/50 focus:border-spiritual"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education & Status
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="educationLevel" className="text-foreground font-medium">Education Level</Label>
                        <Input
                          id="educationLevel"
                          value={deadFormData.educationLevel || ''}
                          onChange={(e) => handleDeadInputChange('educationLevel', e.target.value)}
                          placeholder="e.g., High School, Bachelor's, Master's, PhD"
                          className="border-border/50 focus:border-spiritual"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="socioeconomicStatus" className="text-foreground font-medium">Socioeconomic Status</Label>
                        <Select
                          value={deadFormData.socioeconomicStatus || ''}
                          onValueChange={(value) => handleDeadInputChange('socioeconomicStatus', value)}
                        >
                          <SelectTrigger className="border-border/50 focus:border-spiritual">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-spiritual hover:bg-gradient-spiritual/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg transform transition-transform hover:scale-105"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Registering...' : `Register ${memberType === 'alive' ? 'Living' : 'Deceased'} Member`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-card/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center text-foreground">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  Living Members
                </h4>
                <p className="text-sm text-muted-foreground">
                  Required: First name, gender, generation, blood group
                </p>
                <p className="text-xs text-muted-foreground">
                  Includes physical characteristics and medical conditions for living relatives.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center text-foreground">
                  <Skull className="h-5 w-5 mr-2 text-gray-600" />
                  Deceased Members
                </h4>
                <p className="text-sm text-muted-foreground">
                  Additional fields: Date of death, cause of death, personal traits, cultural information
                </p>
                <p className="text-xs text-muted-foreground">
                  Comprehensive information to preserve family history and heritage.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                💡 All fields marked with * are required. Fill in as much information as available to create a rich family history.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveRegister;