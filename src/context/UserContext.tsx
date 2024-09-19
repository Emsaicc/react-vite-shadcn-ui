// context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
  theme: any;
  user: any | null;
  isLoadingUser: boolean;
  setUser: (user: any | null) => void;
  updateUserImage: (imageUrl: string) => void;
  setTheme: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUserState] = useState<any | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [theme, setTheme] = useState<any>(null);

  // Load user from local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: any = JSON.parse(storedUser);
      setUserState(parsedUser);
      // Set theme from user.themes
      if (parsedUser.theme) {
        setTheme(JSON.parse(parsedUser.theme));
      }
    }
    setIsLoadingUser(false);
  }, []);

  // Update local storage and state when setUser is called
  const setUser = (user: any | null) => {
    console.log('User changed:', user); // Log user change
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Update theme when user is set
      if (user.theme) {
        setTheme(JSON.parse(user.theme));
      }
    } else {
      localStorage.removeItem('user');
      setTheme(null); // Ensure theme is reset when user logs out
    }
    setUserState(user);
    setIsLoadingUser(false);
  };

  const updateUserImage = (imageUrl: string) => {
    setUserState((prevUser: any) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, image: imageUrl };
        console.log('User image updated:', updatedUser); // Log user image update
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prevUser;
    });
  };

  // Log user changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  return (
    <UserContext.Provider value={{ theme, user, isLoadingUser, setUser, updateUserImage, setTheme }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
