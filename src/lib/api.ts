import API_CONFIG from '@/config/api';

export interface FamilyMember {
  person_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  family_id: string;
  father_id?: string;
  mother_id?: string;
  generation?: number;
  birth_year?: number;
  death_year?: number;
  blood_group?: string;
  eye_color?: string;
  birthmark?: string;
  disease?: string;
  passion?: string;
  trait?: string;
  nature?: string;
  cause_of_death?: string;
  father_name?: string;
  mother_name?: string;
  children_count: number;
  created_at: string;
  updated_at: string;
}

export interface SearchParams {
  first_name?: string;
  last_name?: string;
  family_id?: string;
  birth_year?: string;
  blood_group?: string;
  eye_color?: string;
  birthmark?: string;
  disease?: string;
  passion?: string;
  trait?: string;
  nature?: string;
  father_id?: string;
  mother_id?: string;
}

export interface SearchResponse {
  count: number;
  results: FamilyMember[];
}

export interface AliveMemberData {
  personId?: string;
  familyLineId?: string;
  generation: number;
  firstName: string;
  gender: string;
  ethnicity?: string;
  motherId?: string;
  fatherId?: string;
  spouseId?: string;
  sharedAncestryKey?: string;
  dob?: string;
  longevityAvgLifespan?: number;
  generationAvgLifespan?: number;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  bloodGroup?: string;
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
  natureOfPerson?: string;
  recipesCuisine?: string;
  familyTraditions?: string;
  nativeLocation?: string;
  migrationPath?: string;
  socioeconomicStatus?: string;
  educationLevel?: string;
  otherDisease?: string;
  disability?: string;
}

export interface DeadMemberData {
  personId?: string;
  familyLineId?: string;
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
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  bloodGroup?: string;
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
  natureOfPerson?: string;
  recipesCuisine?: string;
  familyTraditions?: string;
  nativeLocation?: string;
  migrationPath?: string;
  socioeconomicStatus?: string;
  educationLevel?: string;
  otherDisease?: string;
  passion?: string;
  disability?: string;
}

export interface RegistrationSchema {
  alive_required: string[];
  dead_required: string[];
  field_options: Record<string, string[]>;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('API Request:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async searchMembers(params: SearchParams): Promise<SearchResponse> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<SearchResponse>(`/search?${query}`);
  }

  // Registration Schema and Validation
  async getRegistrationSchema(): Promise<RegistrationSchema> {
    return this.request<RegistrationSchema>('/register/schema');
  }

  async validateAliveMember(data: AliveMemberData): Promise<{ valid: boolean; errors?: string[] }> {
    return this.request<{ valid: boolean; errors?: string[] }>('/register/validate', {
      method: 'POST',
      body: JSON.stringify({ type: 'alive', data }),
    });
  }

  async validateDeadMember(data: DeadMemberData): Promise<{ valid: boolean; errors?: string[] }> {
    return this.request<{ valid: boolean; errors?: string[] }>('/register/validate', {
      method: 'POST',
      body: JSON.stringify({ type: 'dead', data }),
    });
  }

  async registerAliveMember(data: AliveMemberData): Promise<FamilyMember> {
    return this.request<FamilyMember>('/register/alive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerDeadMember(data: DeadMemberData): Promise<FamilyMember> {
    return this.request<FamilyMember>('/register/dead', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  async getDashboardStats(): Promise<{
    total_families: number;
    total_members: number;
    recent_members: number;
    blood_group_distribution: Record<string, number>;
  }> {
    return this.request('/stats');
  }
}

export const apiClient = new ApiClient();