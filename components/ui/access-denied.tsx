"use client";

import { ShieldX, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  icon?: "shield" | "lock" | "warning";
  showContactButton?: boolean;
  onContactClick?: () => void;
  className?: string;
}

/**
 * Componente elegante para mostrar mensajes de acceso denegado
 */
export function AccessDenied({
  title = "Acceso Denegado",
  message = "No tienes permisos para acceder a esta sección",
  icon = "shield",
  showContactButton = true,
  onContactClick,
  className = "",
}: AccessDeniedProps) {
  const IconComponent = {
    shield: ShieldX,
    lock: Lock,
    warning: AlertTriangle,
  }[icon];

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      // Comportamiento por defecto: mostrar información de contacto
      alert("Contacta al administrador del sistema para solicitar acceso.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/20">
            <IconComponent className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Componente específico para acceso denegado a productos
 */
export function ProductsAccessDenied() {
  return (
    <AccessDenied
      title="Sin Acceso a Productos"
      message="No tienes los permisos necesarios para gestionar productos. Contacta al administrador para solicitar acceso."
      icon="lock"
    />
  );
}

/**
 * Componente específico para acceso denegado a ventas
 */
export function SalesAccessDenied() {
  return (
    <AccessDenied
      title="Sin Acceso a Ventas"
      message="No tienes los permisos necesarios para acceder al módulo de ventas. Contacta al administrador para solicitar acceso."
      icon="shield"
    />
  );
}

/**
 * Componente específico para acceso denegado a clientes
 */
export function CustomersAccessDenied() {
  return (
    <AccessDenied
      title="Sin Acceso a Clientes"
      message="No tienes los permisos necesarios para gestionar clientes. Contacta al administrador para solicitar acceso."
      icon="warning"
    />
  );
}
