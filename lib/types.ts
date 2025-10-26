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

// Tipos para la API de ventas
export interface ApiSale {
  id: string
  numero: string
  cliente: string
  total: number
  fecha: string
  estado: string
  createdAt: string
  updatedAt: string
}

export interface SalesApiResponse {
  success: boolean
  message: string
  data: ApiSale[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para filtros de búsqueda de ventas
export interface SaleFilters {
  numero?: string
  cliente?: string
  estado?: string
  fechaInicio?: string
  fechaFin?: string
  page?: number
  limit?: number
}

export interface SaleApiResponse {
  success: boolean
  message: string
  data: ApiSale
}

// Tipos para la API de clientes
export interface ApiCustomer {
  id: string
  nombre: string
  email?: string
  dui?: string
  nit?: string
  registroFiscal?: string
  giro?: string
  telefono?: string
  departamento?: string
  municipio?: string
  distrito?: string
  direccion?: string
  tipo: 'factura' | 'credito-fiscal' | 'default'
  createdAt: string
  updatedAt: string
}

export interface CustomersApiResponse {
  success: boolean
  message: string
  data: ApiCustomer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos para filtros de búsqueda de clientes
export interface CustomerFilters {
  nombre?: string
  dui?: string
  nit?: string
  email?: string
  tipo?: 'factura' | 'credito-fiscal' | 'default'
  page?: number
  limit?: number
}

// Tipos para crear y actualizar clientes
export interface CreateCustomerRequest {
  nombre: string
  email?: string
  dui?: string
  nit?: string
  registroFiscal?: string
  giro?: string
  telefono?: string
  departamento?: string
  municipio?: string
  distrito?: string
  direccion?: string
  tipo: 'Natural'
}

export interface UpdateCustomerRequest {
  nombre?: string
  email?: string
  dui?: string
  nit?: string
  registroFiscal?: string
  giro?: string
  telefono?: string
  departamento?: string
  municipio?: string
  distrito?: string
  direccion?: string
  tipo?: 'factura' | 'credito-fiscal' | 'default'
}

export interface CustomerApiResponse {
  success: boolean
  message: string
  data: ApiCustomer
}

// Tipos para crear ventas
export interface CreateSaleRequest {
  numero: string
  customerId?: string
  customerData: CustomerData
  products: SaleProductRequest[]
  subtotal: number
  impuestos: number
  total: number
  paymentMethod: 'efectivo' | 'tarjeta'
  paymentDetails: PaymentDetails
  fecha: string
}

export interface CustomerData {
  name: string
  email?: string
  telefono?: string
  direccion?: string
  tipoDocumento?: string
  numeroDocumento?: string
  type: 'existing' | 'factura' | 'credito-fiscal' | 'default'
}

export interface PaymentDetails {
  change?: number
  cardType?: string
  transactionId?: string
}

export interface SaleProductRequest {
  productId: string
  quantity: number
  unitPrice: number
  tax: number
  subtotal: number
  total: number
}

export interface CreateSaleResponse {
  success: boolean
  message: string
  data: {
    id: string
    numero: string
    cliente: string
    total: number
    fecha: string
    estado: string
    dte?: string
    qrCode?: string
  }
}