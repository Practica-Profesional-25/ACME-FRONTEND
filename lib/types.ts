// Tipos para la API de productos
export interface ApiProduct {
  id: string
  identificador: string
  nombre: string
  categoria: string
  subcategoria: string
  precio: number
  stock: number
  createdAt: string
  updatedAt: string
}

export interface ProductsApiResponse {
  success: boolean
  message: string
  data: ApiProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para filtros de búsqueda de productos
export interface ProductFilters {
  nombre?: string
  identificador?: string
  categoria?: string
  subcategoria?: string
  page?: number
  limit?: number
}

// Tipos para crear y actualizar productos
export interface CreateProductRequest {
  identificador: string
  nombre: string
  categoria: string
  subcategoria: string
  precio: number
  stock: number
}

export interface UpdateProductRequest {
  identificador?: string
  nombre?: string
  categoria?: string
  subcategoria?: string
  precio?: number
  stock?: number
}

export interface ProductApiResponse {
  success: boolean
  message: string
  data: ApiProduct
}

// Tipo para producto en el contexto de ventas (compatible con el existente)
export interface SaleProduct {
  id: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  tax: number
  total: number
}

// Función helper para convertir ApiProduct a SaleProduct
export function apiProductToSaleProduct(apiProduct: ApiProduct, quantity: number = 1): SaleProduct {
  const subtotal = apiProduct.precio * quantity
  const tax = subtotal * 0.13 // 13% IVA
  const total = subtotal + tax

  return {
    id: apiProduct.id,
    name: apiProduct.nombre,
    quantity,
    unitPrice: apiProduct.precio,
    subtotal,
    tax,
    total,
  }
}