"use client"

import { useAuth } from "@/contexts/AccessTokenContext";
import { ReactNode } from "react";

interface ProtectedSectionProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean; // Si true, requiere TODOS los permisos. Si false, requiere AL MENOS UNO
  fallback?: ReactNode;
  showFallback?: boolean;
}

/**
 * Componente que protege secciones basado en permisos del usuario
 */
export function ProtectedSection({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  showFallback = true,
}: ProtectedSectionProps) {
  const auth = useAuth();

  // Si no hay token, no mostrar nada
  if (!auth.token || auth.isExpired) {
    return showFallback ? fallback : null;
  }

  // Si no se especifican permisos, mostrar el contenido
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Verificar permisos
  const hasAccess = requireAll
    ? auth.hasAllPermissions(requiredPermissions)
    : auth.hasAnyPermission(requiredPermissions);

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? fallback : null;
}

/**
 * Componente específico para proteger acceso a la sección de ventas
 */
export function SalesSection({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const auth = useAuth();
  
  if (!auth.canAccessSales) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

/**
 * Componente específico para proteger acceso a la sección de productos
 */
export function ProductsSection({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const auth = useAuth();
  
  if (!auth.canAccessProducts) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

/**
 * Componente específico para proteger acceso a la sección de clientes
 */
export function CustomersSection({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const auth = useAuth();
  
  if (!auth.canAccessCustomers) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

/**
 * Componente para mostrar información de permisos (útil para debugging)
 */
export function PermissionsDebug() {
  const auth = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Permisos del Usuario:</h4>
      <div className="space-y-1">
        <div>Token: {auth.token ? '✓' : '✗'}</div>
        <div>Expirado: {auth.isExpired ? '✓' : '✗'}</div>
        <div>Ventas: {auth.canAccessSales ? '✓' : '✗'}</div>
        <div>Productos: {auth.canAccessProducts ? '✓' : '✗'}</div>
        <div>Clientes: {auth.canAccessCustomers ? '✓' : '✗'}</div>
        <div>Gestionar Productos: {auth.canManageProducts ? '✓' : '✗'}</div>
        <div>Gestionar Clientes: {auth.canManageCustomers ? '✓' : '✗'}</div>
        <div>Procesar Ventas: {auth.canProcessSales ? '✓' : '✗'}</div>
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer">Permisos Raw</summary>
        <pre className="mt-1 text-xs overflow-auto max-h-32">
          {JSON.stringify(auth.permissions, null, 2)}
        </pre>
      </details>
    </div>
  );
}