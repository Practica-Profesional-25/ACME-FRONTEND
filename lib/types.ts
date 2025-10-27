// Tipos para la API de productos
export interface ApiProduct {
  id: string;
  identificador: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros de búsqueda de productos
export interface ProductFilters {
  nombre?: string;
  identificador?: string;
  categoria?: string;
  subcategoria?: string;
  page?: number;
  limit?: number;
}

// Tipos para crear y actualizar productos
export interface CreateProductRequest {
  identificador: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  stock: number;
}

export interface UpdateProductRequest {
  identificador?: string;
  nombre?: string;
  categoria?: string;
  subcategoria?: string;
  precio?: number;
  stock?: number;
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

// Tipo para producto en el contexto de ventas (compatible con el existente)
export interface SaleProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

// Función helper para convertir ApiProduct a SaleProduct
export function apiProductToSaleProduct(
  apiProduct: ApiProduct,
  quantity: number = 1
): SaleProduct {
  const unitPrice = parseFloat(apiProduct.precio.toFixed(2));
  const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
  const tax = parseFloat((subtotal * 0.13).toFixed(2)); // 13% IVA
  const total = parseFloat((subtotal + tax).toFixed(2));

  return {
    id: apiProduct.id,
    name: apiProduct.nombre,
    quantity,
    unitPrice,
    subtotal,
    tax,
    total,
  };
}

// Tipos para productos en ventas
export interface SaleProductItem {
  id: string;
  saleId: string;
  productId: string;
  productSnapshot: string; // JSON string que contiene los datos del producto
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

// Tipo para los detalles de pago parseados
export interface PaymentDetails {
  cashAmount?: number;
  change?: number;
  posStatus?: 'ready' | 'processing' | 'processed';
  cardType?: string;
  transactionId?: string;
}

// Tipos para la API de ventas
export interface ApiSale {
  id: string;
  numero: string;
  customerId?: string;
  customerData: string; // JSON string que contiene CustomerData
  subtotal: number;
  impuestos: number;
  total: number;
  paymentMethod: string;
  paymentDetails: string; // JSON string que contiene PaymentDetails
  status: string;
  rejectionReason?: string | null;
  dteNumber?: string | null;
  qrCode?: string | null;
  fecha: string;
  createdAt: string;
  updatedAt: string;
  products?: SaleProductItem[];
  // Campos legacy para compatibilidad
  cliente?: string;
  estado?: string;
}

export interface SalesApiResponse {
  success: boolean;
  message: string;
  data: ApiSale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros de búsqueda de ventas
export interface SaleFilters {
  numero?: string;
  cliente?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
}

export interface SaleApiResponse {
  success: boolean;
  message: string;
  data: ApiSale;
}

// Tipos para la API de clientes
export interface ApiCustomer {
  id: string;
  nombre: string;
  email?: string;
  dui?: string;
  nit?: string;
  telefono?: string;
  direccion?: string;
  tipo: "Natural";
  registroFiscal?: string;
  giro?: string;
  departamento?: string;
  municipio?: string;
  distrito?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersApiResponse {
  success: boolean;
  message: string;
  data: ApiCustomer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros de búsqueda de clientes
export interface CustomerFilters {
  nombre?: string;
  dui?: string;
  nit?: string;
  email?: string;
  tipo?: "Natural";
  page?: number;
  limit?: number;
}

// Tipos para crear y actualizar clientes
export interface CreateCustomerRequest {
  nombre: string;
  email?: string;
  dui?: string;
  nit?: string;
  telefono?: string;
  direccion?: string;
  tipo: "Natural";
  registroFiscal?: string;
  giro?: string;
  departamento?: string;
  municipio?: string;
  distrito?: string;
}

export interface UpdateCustomerRequest {
  nombre?: string;
  email?: string;
  dui?: string;
  nit?: string;
  telefono?: string;
  direccion?: string;
  tipo?: "Natural";
  registroFiscal?: string;
  giro?: string;
  departamento?: string;
  municipio?: string;
  distrito?: string;
}

export interface CustomerApiResponse {
  success: boolean;
  message: string;
  data: ApiCustomer;
}

// Tipos para crear ventas
export interface CreateSaleRequest {
  numero: string;
  customerId?: string;
  customerData: CustomerData;
  products: SaleProductRequest[];
  subtotal: number;
  impuestos: number;
  total: number;
  paymentMethod: "efectivo" | "tarjeta";
  paymentDetails: PaymentDetails;
  fecha: string;
}

export interface CustomerData {
  name: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  type: "existing" | "factura" | "credito-fiscal" | "default";
}



export interface SaleProductRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  subtotal: number;
  total: number;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    numero: string;
    cliente: string;
    total: number;
    fecha: string;
    estado: string;
    dte?: string;
    qrCode?: string;
  };
}

// Tipo para la respuesta del reenvío de factura
export interface ResendInvoiceResponse {
  success: boolean;
  message: string;
}