// Simple client-side auth stub for the Amrani demo.
import { useEffect, useState } from "react";

const KEY = "amrani.user";
type User = { firstName: string; lastName: string; email: string; phone?: string };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function signIn(u: User) {
  localStorage.setItem(KEY, JSON.stringify(u));
  emit();
}

export function signOut() {
  localStorage.removeItem(KEY);
  emit();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setUser(getUser());
    setHydrated(true);
    const cb = () => setUser(getUser());
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
  }, []);
  return { user, hydrated, isAuthenticated: !!user };
}
