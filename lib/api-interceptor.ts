import { toast } from "@/hooks/use-toast";

/**
 * Maneja errores de autenticación y autorización
 */
export function handleAuthError(status: number, permissions?: string[]) {
  if (status === 401) {
    toast({
      title: "Sesión expirada",
      description: "Por favor, inicia sesión nuevamente",
      variant: "destructive",
    });
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      window.location.href = '/api/auth/login';
    }, 2000);
  } else if (status === 403) {
    let description = "No tienes permisos para realizar esta acción";
    
    // Si tenemos información de permisos, podemos ser más específicos
    if (permissions && permissions.length > 0) {
      description = `Esta acción requiere uno de los siguientes permisos: ${permissions.join(', ')}`;
    }
    
    toast({
      title: "Acceso denegado",
      description,
      variant: "destructive",
    });
  }
}

/**
 * Wrapper para fetch que maneja automáticamente errores 401/403
 */
export async function apiRequest(
  url: string, 
  options: RequestInit = {},
  requiredPermissions?: string[]
): Promise<Response> {
  const response = await fetch(url, options);
  
  if (response.status === 401 || response.status === 403) {
    handleAuthError(response.status, requiredPermissions);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response;
}

/**
 * Wrapper para fetch que maneja automáticamente errores 401/403 y parsea JSON
 */
export async function apiRequestJson<T = any>(
  url: string, 
  options: RequestInit = {},
  requiredPermissions?: string[]
): Promise<T> {
  const response = await apiRequest(url, options, requiredPermissions);
  return response.json();
}