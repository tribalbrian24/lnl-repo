"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'user' | 'viewer' | 'guest';

interface User {
  role: UserRole;
  stageAccessList: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  updateRole: (role: UserRole, stageId?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  rolesList: UserRole[];
  stagesList: { id: string; label: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [stagesList, setStagesList] = useState<{ id: string; label: string }[]>([]);
  let isNavigating = false;
  let isUnmounted = false;


  const rolesList: UserRole[] = ['admin', 'user', 'viewer', 'guest'];

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/me', {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await response.json();
      setUser({
        role: data.user.role as UserRole,
        stageAccessList: data.user.stageAccessList || [],
      });
    } catch (error) {
      console.error('Error fetching user session:', error);
      setUser({ role: 'guest', stageAccessList: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUser();
    try {
      const response = await fetch('/api/stages', {
        cache: 'no-store',
      });
      if (response.ok || !isNavigating || !isUnmounted) {
        const stages = await response.json();
        setStagesList(stages);
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateRole = async (role: UserRole, stageId?: string) => {
    try {
      const response = await fetch('/api/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, stageId }),
      });
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      await refreshUser();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  useEffect(() => {
    refreshUser();
    return () => {
      // eslint-disable-next-line
      isNavigating = true;
    }
  }, [pathname]);
  useEffect(() => {
    return () => {
      // eslint-disable-next-line
      isUnmounted = true;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, updateRole, refreshUser, rolesList, stagesList }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
