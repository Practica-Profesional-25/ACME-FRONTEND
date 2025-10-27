"use client"
import { createContext, useContext } from "react";

export const AccessTokenContext = createContext<string | null>(null);

export function AccessTokenProvider({ value, children }: { value: string | null; children: React.ReactNode }) {
  return (
    <AccessTokenContext.Provider value={value}>
      {children}
    </AccessTokenContext.Provider>
  );
}

export function useToken() {
  return useContext(AccessTokenContext);
}