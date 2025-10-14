export interface FamilyMember {
  personId: string;
  familyLineId: string;
  generation: number;
  firstName: string;
  gender: string;
  ethnicity?: string;
  motherId?: string;
  fatherId?: string;
  spouseId?: string;
  sharedAncestryKey?: string;
  dob?: string;
  dod?: string;
  longevityAvgLifespan?: number;
  generationAvgLifespan?: number;
  causeOfDeath?: string;
  eyeColor: string;
  hairColor?: string;
  skinTone?: string;
  bloodGroup: string;
  birthmark?: string;
  freckles?: string;
  baldness?: string;
  beardStyleTrend?: string;
  conditionDiabetes?: string;
  conditionHeartIssue?: string;
  conditionAsthma?: string;
  conditionColorBlindness?: string;
  leftHanded?: string;
  isTwin?: string;
  natureOfPerson: string;
  recipesCuisine?: string;
  familyTraditions?: string;
  nativeLocation?: string;
  migrationPath?: string;
  socioeconomicStatus?: string;
  educationLevel?: string;
  passion?: string;
  disability?: string;
  similarity_score?: number;
}

// Blood group options
export const bloodGroups = ['A', 'B', 'AB', 'O'];

// Eye color options
export const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel'];

// Hair color options  
export const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray'];

// Skin tone options
export const skinTones = ['Light', 'Medium', 'Dark'];

// Gender options
export const genders = ['M', 'F'];

// Ethnicity options
export const ethnicities = [
  'East Asian', 'South Asian', 'Western European', 'African', 'Mixed'
];

// Yes/No options for conditions
export const yesNoOptions = ['Yes', 'No'];

// Education levels
export const educationLevels = [
  'High School', 'Bachelor\'s', 'Master\'s', 'PhD'
];

// Socioeconomic status options
export const socioeconomicStatuses = ['Low', 'Medium', 'High'];

// Nature of person options
export const natureOptions = [
  'Aggressive', 'Artistic', 'Calm', 'Extrovert', 'Introvert', 'Spiritual'
];

// Beard style options (for males)
export const beardStyles = [
  'Clean Shaven', 'Stubble', 'Moustache', 'Full Beard', 'Hipster Beard', 'Designer Stubble'
];

// Recipe cuisine options
export const recipeCuisines = [
  'Sweet_R1', 'Sweet_R2', 'Sweet_R3', 'Festive_F1', 'Festive_F2', 'Festive_F3'
];

// Family traditions options
export const familyTraditions = [
  'Festival_U1', 'Festival_U2', 'Festival_U3', 'Ritual_S1', 'Ritual_S2', 'Ritual_S3'
];

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Local storage functions
export const saveFamilyMember = (member: FamilyMember): void => {
  const members = getFamilyMembers();
  const existingIndex = members.findIndex(m => m.personId === member.personId);
  
  if (existingIndex >= 0) {
    members[existingIndex] = member;
  } else {
    members.push(member);
  }
  
  localStorage.setItem('kulSetuFamilyMembers', JSON.stringify(members));
};

export const getFamilyMembers = (): FamilyMember[] => {
  const stored = localStorage.getItem('kulSetuFamilyMembers');
  return stored ? JSON.parse(stored) : [];
};

export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  const members = getFamilyMembers();
  return members.find(member => member.personId === id);
};

export const searchFamilyMembers = (query: Partial<FamilyMember>): FamilyMember[] => {
  const members = getFamilyMembers();
  
  return members.filter(member => {
    return Object.entries(query).every(([key, value]) => {
      if (!value) return true;
      
      const memberValue = member[key as keyof FamilyMember];
      if (typeof memberValue === 'string') {
        return memberValue.toLowerCase().includes(value.toString().toLowerCase());
      }
      if (typeof memberValue === 'number') {
        return memberValue === Number(value);
      }
      return false;
    });
  });
};