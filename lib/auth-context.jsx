'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const STORAGE_KEY = 'fades.domains.auth.v1';

const AuthContext = createContext(null);

function readStoredAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredAuth(value) {
  if (typeof window === 'undefined') return;
  if (!value) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored) {
      setToken(stored.token);
      setUser(stored.user || null);
      // Re-validate in the background; log out silently if the token has expired.
      api
        .me(stored.token)
        .then((res) => {
          if (res?.user) {
            setUser(res.user);
            writeStoredAuth({ token: stored.token, user: res.user });
          }
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          writeStoredAuth(null);
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.user);
    writeStoredAuth({ token: res.token, user: res.user });
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.register(name, email, password);
    setToken(res.token);
    setUser(res.user);
    writeStoredAuth({ token: res.token, user: res.user });
    return res.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    writeStoredAuth(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, ready, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
