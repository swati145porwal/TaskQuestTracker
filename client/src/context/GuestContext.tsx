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
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check for authenticated user first, then initialize guest mode if needed
  useEffect(() => {
    // Check if user is logged in
    fetch('/api/user')
      .then(res => {
        if (res.ok && res.status !== 401) {
          // User is logged in, disable guest mode
          localStorage.removeItem('guestMode');
          setIsGuestMode(false);
          setGuestUser(null);
        } else {
          // User is not logged in, check for guest mode
          const storedGuestMode = localStorage.getItem('guestMode');
          if (storedGuestMode === 'true') {
            console.log('Initializing guest mode from localStorage');
            setIsGuestMode(true);
            setGuestUser(createGuestUser());
          }
        }
      })
      .catch(err => {
        console.error('Error checking authentication:', err);
        // On error, check for guest mode as fallback
        const storedGuestMode = localStorage.getItem('guestMode');
        if (storedGuestMode === 'true') {
          setIsGuestMode(true);
          setGuestUser(createGuestUser());
        }
      })
      .finally(() => {
        setCheckingAuth(false);
      });
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