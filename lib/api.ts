import type {
  ApiProduct,
  ProductsApiResponse,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  ProductApiResponse,
  ApiCustomer,
  CustomersApiResponse,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerApiResponse,
  ApiSale,
  SalesApiResponse,
  SaleFilters,
  SaleApiResponse,
  CreateSaleRequest,
  CreateSaleResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://acme.infoking.win/api";

// Función para obtener productos con filtros opcionales
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsApiResponse> {
  try {
    const searchParams = new URLSearchParams();

    // Agregar filtros a los parámetros de búsqueda
    if (filters.nombre) searchParams.append("nombre", filters.nombre);
    if (filters.identificador)
      searchParams.append("identificador", filters.identificador);
    if (filters.categoria) searchParams.append("categoria", filters.categoria);
    if (filters.subcategoria)
      searchParams.append("subcategoria", filters.subcategoria);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.limit) searchParams.append("limit", filters.limit.toString());

    const url = `${API_BASE_URL}/products${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ProductsApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener productos");
    }

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// ===== FUNCIONES PARA VENTAS =====

// Función para obtener ventas con filtros opcionales
export async function getSales(
  filters: SaleFilters = {}
): Promise<SalesApiResponse> {
  try {
    const searchParams = new URLSearchParams();

    // Agregar filtros a los parámetros de búsqueda
    if (filters.numero) searchParams.append("numero", filters.numero);
    if (filters.cliente) searchParams.append("cliente", filters.cliente);
    if (filters.estado) searchParams.append("estado", filters.estado);
    if (filters.fechaInicio)
      searchParams.append("fechaInicio", filters.fechaInicio);
    if (filters.fechaFin) searchParams.append("fechaFin", filters.fechaFin);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.limit) searchParams.append("limit", filters.limit.toString());

    const url = `${API_BASE_URL}/sales${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: SalesApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener ventas");
    }

    return data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
}

// Función para obtener una venta específica por ID
export async function getSaleById(id: string): Promise<SaleApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: SaleApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener venta");
    }

    return data;
  } catch (error) {
    console.error("Error fetching sale:", error);
    throw error;
  }
}

// Función para buscar ventas con debounce (útil para búsquedas en tiempo real)
export function createSaleSearch() {
  let timeoutId: NodeJS.Timeout | null = null;

  return function searchSales(
    filters: SaleFilters,
    callback: (data: SalesApiResponse | null, error: Error | null) => void,
    delay: number = 300
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        const data = await getSales(filters);
        callback(data, null);
      } catch (error) {
        callback(null, error as Error);
      }
    }, delay);
  };
}

// Función para obtener un producto específico por ID
export async function getProductById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener producto");
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// Función para buscar productos con debounce (útil para búsquedas en tiempo real)
export function createProductSearch() {
  let timeoutId: NodeJS.Timeout | null = null;

  return function searchProducts(
    filters: ProductFilters,
    callback: (data: ProductsApiResponse | null, error: Error | null) => void,
    delay: number = 300
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        const data = await getProducts(filters);
        callback(data, null);
      } catch (error) {
        callback(null, error as Error);
      }
    }, delay);
  };
}

// Función para crear un nuevo producto
export async function createProduct(
  productData: CreateProductRequest
): Promise<ProductApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ProductApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al crear producto");
    }

    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Función para actualizar un producto existente
export async function updateProduct(
  id: string,
  productData: UpdateProductRequest
): Promise<ProductApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ProductApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al actualizar producto");
    }

    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// ===== FUNCIONES PARA CLIENTES =====

// Función para obtener clientes con filtros opcionales
export async function getCustomers(
  filters: CustomerFilters = {}
): Promise<CustomersApiResponse> {
  try {
    const searchParams = new URLSearchParams();

    // Agregar filtros a los parámetros de búsqueda
    if (filters.nombre) searchParams.append("nombre", filters.nombre);
    if (filters.dui) searchParams.append("dui", filters.dui);
    if (filters.nit) searchParams.append("nit", filters.nit);
    if (filters.email) searchParams.append("email", filters.email);
    if (filters.tipo) searchParams.append("tipo", filters.tipo);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.limit) searchParams.append("limit", filters.limit.toString());

    const url = `${API_BASE_URL}/customers${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: CustomersApiResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

// Función para obtener un cliente específico por ID
export async function getCustomerById(
  id: string
): Promise<CustomerApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: CustomerApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener cliente");
    }

    return data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}

// Función para buscar clientes con debounce (útil para búsquedas en tiempo real)
export function createCustomerSearch() {
  let timeoutId: NodeJS.Timeout | null = null;

  return function searchCustomers(
    filters: CustomerFilters,
    callback: (data: CustomersApiResponse | null, error: Error | null) => void,
    delay: number = 300
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        const data = await getCustomers(filters);
        callback(data, null);
      } catch (error) {
        callback(null, error as Error);
      }
    }, delay);
  };
}

// Función para buscar clientes por término de búsqueda
export async function searchCustomers(
  searchTerm: string,
  limit?: number
): Promise<CustomersApiResponse> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("q", searchTerm);
    if (limit) searchParams.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/customers/search?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: CustomersApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al buscar clientes");
    }

    return data;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
}

// Función para obtener estadísticas de clientes por departamento
export async function getCustomerStatsByDepartment(): Promise<{
  success: boolean;
  message: string;
  data: Array<{ departamento: string; count: number }>;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/stats/departamento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener estadísticas por departamento");
    }

    return data;
  } catch (error) {
    console.error("Error fetching customer stats by department:", error);
    throw error;
  }
}

// Función para obtener estadísticas de clientes por tipo
export async function getCustomerStatsByType(): Promise<{
  success: boolean;
  message: string;
  data: Array<{ tipo: string; count: number }>;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/stats/tipo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al obtener estadísticas por tipo");
    }

    return data;
  } catch (error) {
    console.error("Error fetching customer stats by type:", error);
    throw error;
  }
}

// Función para crear un nuevo cliente
export async function createCustomer(
  customerData: CreateCustomerRequest
): Promise<CustomerApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: CustomerApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al crear cliente");
    }

    return data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

// Función para crear una nueva venta
export async function createSale(
  saleData: CreateSaleRequest
): Promise<CreateSaleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      // Try to get detailed error message from response body
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = `Error ${response.status}: ${errorData.message.join(', ')}`;
          } else {
            errorMessage = `Error ${response.status}: ${errorData.message}`;
          }
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        console.warn("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data: CreateSaleResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al crear venta");
    }

    return data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
}

// Función para actualizar un cliente existente
export async function updateCustomer(
  id: string,
  customerData: UpdateCustomerRequest
): Promise<CustomerApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      // Try to get detailed error message from response body
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = `Error ${response.status}: ${errorData.message.join(', ')}`;
          } else {
            errorMessage = `Error ${response.status}: ${errorData.message}`;
          }
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        console.warn("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data: CustomerApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al actualizar cliente");
    }

    return data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

// Función para eliminar un cliente
export async function deleteCustomer(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Try to get detailed error message from response body
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = `Error ${response.status}: ${errorData.message.join(', ')}`;
          } else {
            errorMessage = `Error ${response.status}: ${errorData.message}`;
          }
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        console.warn("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al eliminar cliente");
    }

    return data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

// Función para procesar una venta con DTE
export async function processSale(id: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${id}/process`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al procesar la venta");
    }

    return data;
  } catch (error) {
    console.error("Error processing sale:", error);
    throw error;
  }
}

// Función para reenviar factura y DTE por email
export async function resendInvoice(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${id}/resend-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Try to get detailed error message from response body
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = `Error ${response.status}: ${errorData.message}`;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the default message
        console.warn("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      success: data.success || true,
      message: data.message || "Factura y DTE reenviados exitosamente",
    };
  } catch (error) {
    console.error("Error resending invoice:", error);
    throw error;
  }
}
