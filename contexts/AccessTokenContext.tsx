"use client";
import { createContext, useContext, useMemo } from "react";
import {
  extractPermissionsFromToken,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isTokenExpired,
} from "@/lib/jwt-utils";

interface TokenContextValue {
  token: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isExpired: boolean;
  // Permisos específicos para secciones de la aplicación
  canAccessSales: boolean;
  canAccessProducts: boolean;
  canAccessCustomers: boolean;
  canManageProducts: boolean;
  canManageCustomers: boolean;
  canProcessSales: boolean;
  canAdmin: boolean;
}

export const AccessTokenContext = createContext<TokenContextValue>({
  token: null,
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  isExpired: true,
  canAccessSales: false,
  canAccessProducts: false,
  canAccessCustomers: false,
  canManageProducts: false,
  canManageCustomers: false,
  canProcessSales: false,
  canAdmin: false,
});

export function AccessTokenProvider({
  value,
  children,
}: {
  value: string | null;
  children: React.ReactNode;
}) {
  const contextValue = useMemo<TokenContextValue>(() => {
    if (!value) {
      return {
        token: null,
        permissions: [],
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
        isExpired: true,
        canAccessSales: false,
        canAccessProducts: false,
        canAccessCustomers: false,
        canManageProducts: false,
        canManageCustomers: false,
        canProcessSales: false,
        canAdmin: false,
      };
    }

    const permissions = extractPermissionsFromToken(value);
    const expired = isTokenExpired(value);

    return {
      token: value,
      permissions,
      hasPermission: (permission: string) => hasPermission(value, permission),
      hasAnyPermission: (perms: string[]) => hasAnyPermission(value, perms),
      hasAllPermissions: (perms: string[]) => hasAllPermissions(value, perms),
      isExpired: expired,
      // Permisos específicos para secciones de la aplicación
      canAccessSales: hasAnyPermission(value, [
        "read:sales",
        "create:sales",
        "sales:read",
        "sales:create",
      ]),
      canAccessProducts: hasAnyPermission(value, [
        "read:products",
        "create:products",
        "products:read",
        "products:create",
      ]),
      canAccessCustomers: hasAnyPermission(value, [
        "read:customers",
        "create:customers",
        "customers:read",
        "customers:create",
      ]),
      canManageProducts: hasAnyPermission(value, [
        "create:products",
        "update:products",
        "delete:products",
        "products:create",
        "products:update",
        "products:delete",
      ]),
      canManageCustomers: hasAnyPermission(value, [
        "create:customers",
        "update:customers",
        "delete:customers",
        "customers:create",
        "customers:update",
        "customers:delete",
      ]),
      canProcessSales: hasAnyPermission(value, [
        "create:sales",
        "process:sales",
        "sales:create",
        "sales:process",
      ]),
      canAdmin: hasAnyPermission(value, ["admin"]),
    };
  }, [value]);

  return (
    <AccessTokenContext.Provider value={contextValue}>
      {children}
    </AccessTokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(AccessTokenContext);
  return context.token;
}

export function useAuth() {
  return useContext(AccessTokenContext);
}
