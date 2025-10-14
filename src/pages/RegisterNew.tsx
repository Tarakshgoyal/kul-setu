import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Heart, Skull, Save } from 'lucide-react';
import { apiClient, AliveMemberData, DeadMemberData, RegistrationSchema } from '@/lib/api';

type MemberType = 'alive' | 'dead';

const RegisterNew = () => {
  const { toast } = useToast();
  const [memberType, setMemberType] = useState<MemberType>('alive');
  const [schema, setSchema] = useState<RegistrationSchema | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [aliveFormData, setAliveFormData] = useState<AliveMemberData>({
    first_name: '',
    last_name: '',
    birth_year: undefined,
    blood_group: '',
  });

  const [deadFormData, setDeadFormData] = useState<DeadMemberData>({
    first_name: '',
    last_name: '',
    birth_year: undefined,
    death_year: undefined,
    blood_group: '',
    cause_of_death: '',
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
          description: `${aliveFormData.first_name} ${aliveFormData.last_name} has been added to your family tree. Person ID: ${result.person_id}`,
        });
        
        // Reset form
        setAliveFormData({
          first_name: '',
          last_name: '',
          birth_year: undefined,
          blood_group: '',
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
          description: `${deadFormData.first_name} ${deadFormData.last_name} has been added to your family tree. Person ID: ${result.person_id}`,
        });
        
        // Reset form
        setDeadFormData({
          first_name: '',
          last_name: '',
          birth_year: undefined,
          death_year: undefined,
          blood_group: '',
          cause_of_death: '',
        });
      }
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

  const currentFormData = memberType === 'alive' ? aliveFormData : deadFormData;
  const requiredFields = schema ? (memberType === 'alive' ? schema.alive_required : schema.dead_required) : [];

  // Helper function to check if field is required
  const isFieldRequired = (fieldName: string) => {
    return Array.isArray(requiredFields) && requiredFields.includes(fieldName);
  };

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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Register <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Member</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose whether to register a living or deceased family member
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-spiritual">
          <CardHeader className="bg-gradient-spiritual text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <UserPlus className="w-6 h-6" />
              <span>Member Registration</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
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
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  {memberType === 'alive' ? 'Living' : 'Deceased'} Member Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium">
                      First Name {isFieldRequired('first_name') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="firstName"
                      required={isFieldRequired('first_name')}
                      value={currentFormData.first_name}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('first_name', e.target.value);
                        } else {
                          handleDeadInputChange('first_name', e.target.value);
                        }
                      }}
                      placeholder="Enter first name"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium">
                      Last Name {isFieldRequired('last_name') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="lastName"
                      required={isFieldRequired('last_name')}
                      value={currentFormData.last_name}
                      onChange={(e) => {
                        if (memberType === 'alive') {
                          handleAliveInputChange('last_name', e.target.value);
                        } else {
                          handleDeadInputChange('last_name', e.target.value);
                        }
                      }}
                      placeholder="Enter last name"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthYear" className="text-foreground font-medium">
                      Birth Year {isFieldRequired('birth_year') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="birthYear"
                      type="number"
                      min="1900"
                      max="2024"
                      required={isFieldRequired('birth_year')}
                      value={currentFormData.birth_year || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        if (memberType === 'alive') {
                          handleAliveInputChange('birth_year', value);
                        } else {
                          handleDeadInputChange('birth_year', value);
                        }
                      }}
                      placeholder="e.g., 1975"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>

                  {/* Death Year - only for deceased members */}
                  {memberType === 'dead' && (
                    <div className="space-y-2">
                      <Label htmlFor="deathYear" className="text-foreground font-medium">
                        Death Year {isFieldRequired('death_year') && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id="deathYear"
                        type="number"
                        min="1900"
                        max="2024"
                        required={isFieldRequired('death_year')}
                        value={deadFormData.death_year || ''}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : undefined;
                          handleDeadInputChange('death_year', value);
                        }}
                        placeholder="e.g., 2020"
                        className="border-border/50 focus:border-spiritual"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className="text-foreground font-medium">
                    Blood Group {isFieldRequired('blood_group') && <span className="text-red-500">*</span>}
                  </Label>
                  <Select
                    value={currentFormData.blood_group || ''}
                    onValueChange={(value) => {
                      if (memberType === 'alive') {
                        handleAliveInputChange('blood_group', value);
                      } else {
                        handleDeadInputChange('blood_group', value);
                      }
                    }}
                  >
                    <SelectTrigger className="border-border/50 focus:border-spiritual">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {schema?.field_options?.bloodGroup?.map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      )) || ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cause of Death - only for deceased members */}
                {memberType === 'dead' && (
                  <div className="space-y-2">
                    <Label htmlFor="causeOfDeath" className="text-foreground font-medium">
                      Cause of Death {isFieldRequired('cause_of_death') && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="causeOfDeath"
                      required={isFieldRequired('cause_of_death')}
                      value={deadFormData.cause_of_death || ''}
                      onChange={(e) => handleDeadInputChange('cause_of_death', e.target.value)}
                      placeholder="Enter cause of death"
                      className="border-border/50 focus:border-spiritual"
                    />
                  </div>
                )}
              </div>

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
                  Required: First name, last name, birth year, blood group
                </p>
                <p className="text-xs text-muted-foreground">
                  Register family members who are currently alive. This helps build connections for living relatives.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center text-foreground">
                  <Skull className="h-5 w-5 mr-2 text-gray-600" />
                  Deceased Members
                </h4>
                <p className="text-sm text-muted-foreground">
                  Required: First name, last name, birth year, death year, blood group, cause of death
                </p>
                <p className="text-xs text-muted-foreground">
                  Register family members who have passed away. This preserves their memory and family history.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                💡 Tip: All fields marked with * are required. Choose the appropriate member type before filling the form.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterNew;