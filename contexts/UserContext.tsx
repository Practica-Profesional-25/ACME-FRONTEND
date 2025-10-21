"use client"
import { User } from "@auth0/nextjs-auth0/types";
import { createContext, useContext } from "react";

export const UserContext = createContext<User | null>(null);

export function UserProvider({ value, children }: { value: User | null; children: React.ReactNode }) {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}