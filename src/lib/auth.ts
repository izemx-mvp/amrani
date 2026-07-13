// Simple client-side auth stub for the Amrani demo.
import { useEffect, useState } from "react";

const KEY = "amrani.user";
export type Role = "client" | "admin";
type User = { firstName: string; lastName: string; email: string; phone?: string; role: Role };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as User;
    if (!u.role) u.role = "client";
    return u;
  } catch {
    return null;
  }
}

export function signIn(u: Partial<User> & { email: string; firstName: string; lastName: string }) {
  const full: User = { role: "client", ...u } as User;
  localStorage.setItem(KEY, JSON.stringify(full));
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
  return { user, hydrated, isAuthenticated: !!user, isAdmin: user?.role === "admin" };
}
