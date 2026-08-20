"use client";

import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";

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
    userCache = data;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage failures
    }
    emit();
  }, []);

  const logout = useCallback(() => {
    userCache = null;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    emit();
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
    mutationFn: async ({ name, email }) => ({ name, email }),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email }) => ({ email }),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => null,
  });
}