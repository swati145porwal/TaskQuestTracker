import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "@shared/schema";

type GuestContextType = {
  isGuestMode: boolean;
  guestUser: User | null;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
};

export const GuestContext = createContext<GuestContextType | null>(null);

// Create a mock guest user
const createGuestUser = (): User => ({
  id: -1, // Use a negative ID to ensure it doesn't conflict with real user IDs
  username: "Guest",
  password: "", // Password is never used in the client
  points: 0,
  streak: 0,
  currentAvatarId: null,
  googleRefreshToken: null,
  googleEmail: null,
  googlePictureUrl: null,
});

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [guestUser, setGuestUser] = useState<User | null>(null);

  // Initialize guest mode from localStorage if available
  useEffect(() => {
    const storedGuestMode = localStorage.getItem('guestMode');
    if (storedGuestMode === 'true') {
      console.log('Initializing guest mode from localStorage');
      setIsGuestMode(true);
      setGuestUser(createGuestUser());
    }
  }, []);

  const enableGuestMode = () => {
    console.log('Enabling guest mode');
    setIsGuestMode(true);
    setGuestUser(createGuestUser());
    localStorage.setItem('guestMode', 'true');
  };

  const disableGuestMode = () => {
    console.log('Disabling guest mode');
    setIsGuestMode(false);
    setGuestUser(null);
    localStorage.removeItem('guestMode');
  };

  return (
    <GuestContext.Provider
      value={{
        isGuestMode,
        guestUser,
        enableGuestMode,
        disableGuestMode,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}