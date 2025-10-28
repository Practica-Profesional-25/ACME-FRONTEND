/**
 * Utilidades para manejar tokens JWT y extraer permisos de Auth0
 */

export interface DecodedToken {
  sub: string;
  aud: string | string[];
  iss: string;
  exp: number;
  iat: number;
  permissions?: string[];
  scope?: string;
  [key: string]: any;
}

/**
 * Decodifica un token JWT sin verificar la firma
 * NOTA: Solo para extraer información del payload, no para validación de seguridad
 */
export function decodeJWT(token: string): DecodedToken | null {
  try {
    // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido: formato incorrecto');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    
    // Agregar padding si es necesario para base64
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decodificar de base64
    const decodedPayload = atob(paddedPayload);
    
    // Parsear JSON
    const tokenData: DecodedToken = JSON.parse(decodedPayload);
    
    return tokenData;
  } catch (error) {
    console.error('Error al decodificar token JWT:', error);
    return null;
  }
}

/**
 * Extrae los permisos de un token JWT de Auth0
 */
export function extractPermissionsFromToken(token: string): string[] {
  const decodedToken = decodeJWT(token);
  
  if (!decodedToken) {
    return [];
  }

  // Auth0 puede almacenar permisos en diferentes campos
  // 1. Campo 'permissions' (más común)
  if (decodedToken.permissions && Array.isArray(decodedToken.permissions)) {
    return decodedToken.permissions;
  }

  // 2. Campo 'scope' como string separado por espacios
  if (decodedToken.scope && typeof decodedToken.scope === 'string') {
    return decodedToken.scope.split(' ').filter(scope => scope.length > 0);
  }

  // 3. Buscar en namespace personalizado (común en Auth0)
  const namespaceKeys = Object.keys(decodedToken).filter(key => 
    key.includes('permissions') || key.includes('/permissions')
  );
  
  for (const key of namespaceKeys) {
    const value = decodedToken[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

/**
 * Verifica si el token tiene un permiso específico
 */
export function hasPermission(token: string, permission: string): boolean {
  const permissions = extractPermissionsFromToken(token);
  return permissions.includes(permission);
}

/**
 * Verifica si el token tiene alguno de los permisos especificados
 */
export function hasAnyPermission(token: string, permissions: string[]): boolean {
  const tokenPermissions = extractPermissionsFromToken(token);
  return permissions.some(permission => tokenPermissions.includes(permission));
}

/**
 * Verifica si el token tiene todos los permisos especificados
 */
export function hasAllPermissions(token: string, permissions: string[]): boolean {
  const tokenPermissions = extractPermissionsFromToken(token);
  return permissions.every(permission => tokenPermissions.includes(permission));
}

/**
 * Verifica si el token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const decodedToken = decodeJWT(token);
  
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  // exp está en segundos, Date.now() en milisegundos
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

/**
 * Obtiene información básica del usuario desde el token
 */
export function getUserInfoFromToken(token: string): {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
} | null {
  const decodedToken = decodeJWT(token);
  
  if (!decodedToken) {
    return null;
  }

  return {
    sub: decodedToken.sub,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
  };
}