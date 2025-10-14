export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  familyId?: string;
  personId?: string;
}

export const saveUser = (user: User): void => {
  localStorage.setItem('kulSetuUser', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const stored = localStorage.getItem('kulSetuUser');
  return stored ? JSON.parse(stored) : null;
};

export const logout = (): void => {
  localStorage.removeItem('kulSetuUser');
};

export const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Try backend authentication first
    const response = await fetch('https://kul-setu-backend.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      saveUser(result.user);
      return { success: true, user: result.user };
    } else {
      // Fallback to local storage
      const users = getStoredUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        saveUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
      }
      
      return { success: false, error: result.error || 'Invalid email or password' };
    }
  } catch (error) {
    // Fallback to local storage if backend is unavailable
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      saveUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Invalid email or password' };
  }
};

export const signup = async (email: string, password: string, firstName: string, lastName: string, familyId?: string, personId?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  const users = getStoredUsers();
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }

  try {
    // Call backend to create user with family association
    const response = await fetch('https://kul-setu-backend.onrender.com/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        familyId: familyId || null,
        personId: personId || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Signup failed' };
    }

    const newUser = {
      id: result.userId,
      email,
      password,
      firstName,
      lastName,
      familyId: result.familyId,
      personId: result.personId,
    };
    
    users.push(newUser);
    localStorage.setItem('kulSetuUsers', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    saveUser(userWithoutPassword);
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    // Fallback to local storage if backend is unavailable
    const newUser = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      email,
      password,
      firstName,
      lastName,
      familyId: familyId || undefined,
      personId: personId || undefined,
    };
    
    users.push(newUser);
    localStorage.setItem('kulSetuUsers', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    saveUser(userWithoutPassword);
    
    return { success: true, user: userWithoutPassword };
  }
};

const getStoredUsers = (): Array<User & { password: string }> => {
  const stored = localStorage.getItem('kulSetuUsers');
  return stored ? JSON.parse(stored) : [];
};