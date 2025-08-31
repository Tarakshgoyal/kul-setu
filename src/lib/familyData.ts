export interface FamilyMember {
  personId: string;
  firstName: string;
  lastName: string;
  familyId: string;
  fatherId?: string;
  motherId?: string;
  generation: number;
  birthYear: number;
  bloodGroup: string;
  eyeColor: string;
  birthmark?: string;
  disease?: string;
  passion: string;
  trait: string;
  nature: string;
  about: string;
  images?: string[];
  videos?: string[];
}

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

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber'];