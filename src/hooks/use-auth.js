"use client";

import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";
import { api, clearToken, setToken } from "@/lib/api";
import { fetchApplications } from "@/lib/store";

const STORAGE_KEY = "job-flow.user";

let userCache = null;
let hydrated = false;
const listeners = new Set();

function subscribeToStore(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emit() {
  for (const listener of listeners) listener();
}

function readUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    userCache = raw ? JSON.parse(raw) : null;
  } catch {
    userCache = null;
  }
  return userCache;
}

function getSnapshot() {
  return userCache;
}

function getServerSnapshot() {
  return null;
}

function getHydratedSnapshot() {
  return hydrated;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  useEffect(() => {
    readUser();
    hydrated = true;
    emit();
  }, []);

  const user = useSyncExternalStore(subscribeToStore, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeToStore, getHydratedSnapshot, getHydratedSnapshot);

  const login = useCallback((data) => {
    if (!data) return;
    const userData = data.user || data;
    const token = data.token;
    if (token) {
      setToken(token);
    }
    userCache = userData;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // ignore storage failures
    }
    emit();
    fetchApplications();
  }, []);

  const logout = useCallback(() => {
    userCache = null;
    clearToken();
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    emit();
    fetchApplications();
  }, []);

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await api.post("/auth/register", { name, email, password });
      const user = res.user || res;
      const token = res.token;
      if (token) {
        setToken(token);
      }
      return { user, token };
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.post("/auth/login", { email, password });
      const user = res.user || res;
      const token = res.token;
      if (token) {
        setToken(token);
      }
      return { user, token };
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore logout errors on client
      }
      clearToken();
      return null;
    },
  });
}