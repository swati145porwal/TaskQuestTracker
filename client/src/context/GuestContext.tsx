import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type GuestContextType = {
  isGuestMode: boolean;
  guestUser: User | null;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
};

export const GuestContext = createContext<GuestContextType | null>(null);

// Create mock guest user data
const createGuestUser = (): User => ({
  id: -1, // Use negative ID to indicate guest user
  username: "Guest",
  password: "", // Password is required in the type but not used for guest
  points: 0,
  streak: 0,
  googleRefreshToken: null,
  googleEmail: null,
  googlePictureUrl: null,
  currentAvatarId: null
});

export function GuestProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [guestUser, setGuestUser] = useState<User | null>(null);

  // Check if guest mode was previously enabled
  useEffect(() => {
    const storedGuestMode = localStorage.getItem("guestMode");
    if (storedGuestMode === "true") {
      setIsGuestMode(true);
      setGuestUser(createGuestUser());
    }
  }, []);

  const enableGuestMode = () => {
    setIsGuestMode(true);
    const newGuestUser = createGuestUser();
    setGuestUser(newGuestUser);
    localStorage.setItem("guestMode", "true");
    
    toast({
      title: "Guest Mode Enabled",
      description: "You're browsing as a guest. Your data won't be saved.",
    });
  };

  const disableGuestMode = () => {
    setIsGuestMode(false);
    setGuestUser(null);
    localStorage.removeItem("guestMode");
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