import { createContext, useContext, useState, useCallback, useRef, type ReactNode, type MutableRefObject } from "react";

type AuthModalContextType = {
  isOpen: boolean;
  open: (onSuccess?: () => void) => void;
  close: () => void;
  onSuccessRef: MutableRefObject<(() => void) | undefined>;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const onSuccessRef = useRef<(() => void) | undefined>(undefined);

  const open = useCallback((onSuccess?: () => void) => {
    onSuccessRef.current = onSuccess;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onSuccessRef.current = undefined;
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, open, close, onSuccessRef }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
