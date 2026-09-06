"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "./types";

const KEY = "placerambo:users";
const SESSION = "placerambo:session";

export interface RegisterInput {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  allUsers: UserProfile[];
  register: (input: RegisterInput) => UserProfile | null;
  login: (email: string, password: string) => UserProfile | null;
  demoLogin: () => UserProfile;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: UserProfile = {
  id: "u0",
  name: "Amina Hassan",
  email: "amina@placerambo.dj",
  username: "amina",
  phone: "+253 77 00 00 00",
  location: "Djibouti City",
  bio: "Buyer, seller and small business owner.",
  verified: true,
  joined: "2025-09-01T00:00:00.000Z",
};

function readUsers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const users = readUsers();
    setAllUsers(users);
    const session = localStorage.getItem(SESSION);
    if (session) {
      const uid = JSON.parse(session).uid as string;
      const found = users.find((u) => u.id === uid);
      if (found) setUser(found);
    }
  }, []);

  const persist = (users: UserProfile[]) => {
    localStorage.setItem(KEY, JSON.stringify(users));
    setAllUsers(users);
  };

  const register = (input: RegisterInput): UserProfile | null => {
    const users = readUsers();
    if (users.some((u) => u.email === input.email)) return null;
    const newUser: UserProfile = {
      id: `u${Date.now()}`,
      name: input.name,
      email: input.email,
      username: input.username || input.name.toLowerCase().replace(/\s+/g, "_"),
      phone: input.phone,
      location: "Djibouti City",
      joined: new Date().toISOString(),
    };
    const next = [...users, newUser];
    persist(next);
    localStorage.setItem(SESSION, JSON.stringify({ uid: newUser.id }));
    setUser(newUser);
    return newUser;
  };

  const login = (email: string, _password: string): UserProfile | null => {
    const users = readUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return null;
    localStorage.setItem(SESSION, JSON.stringify({ uid: found.id }));
    setUser(found);
    setAllUsers(users);
    return found;
  };

  const demoLogin = (): UserProfile => {
    const users = readUsers();
    const exists = users.find((u) => u.id === DEMO_USER.id);
    if (!exists) {
      const next = [DEMO_USER, ...users];
      persist(next);
    } else {
      setAllUsers(users);
    }
    localStorage.setItem(SESSION, JSON.stringify({ uid: DEMO_USER.id }));
    setUser(DEMO_USER);
    return DEMO_USER;
  };

  const logout = () => {
    localStorage.removeItem(SESSION);
    setUser(null);
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    if (!user) return;
    const users = readUsers();
    const next = users.map((u) =>
      u.id === user.id ? { ...u, ...patch, id: user.id } : u
    );
    persist(next);
    const updated = { ...user, ...patch, id: user.id };
    setUser(updated);
    localStorage.setItem(SESSION, JSON.stringify({ uid: user.id }));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      allUsers,
      register,
      login,
      demoLogin,
      logout,
      updateProfile,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, allUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
