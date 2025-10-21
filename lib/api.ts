import type { ProductsApiResponse, ProductFilters, CreateProductRequest, UpdateProductRequest, ProductApiResponse } from './types'

const API_BASE_URL = 'https://acme.infoking.win/api'

// Función para obtener productos con filtros opcionales
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsApiResponse> {
  try {
    const searchParams = new URLSearchParams()
    
    // Agregar filtros a los parámetros de búsqueda
    if (filters.nombre) searchParams.append('nombre', filters.nombre)
    if (filters.identificador) searchParams.append('identificador', filters.identificador)
    if (filters.categoria) searchParams.append('categoria', filters.categoria)
    if (filters.subcategoria) searchParams.append('subcategoria', filters.subcategoria)
    if (filters.page) searchParams.append('page', filters.page.toString())
    if (filters.limit) searchParams.append('limit', filters.limit.toString())

    const url = `${API_BASE_URL}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data: ProductsApiResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener productos')
    }

    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Función para obtener un producto específico por ID
export async function getProductById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener producto')
    }

    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Función para buscar productos con debounce (útil para búsquedas en tiempo real)
export function createProductSearch() {
  let timeoutId: NodeJS.Timeout | null = null

  return function searchProducts(
    filters: ProductFilters,
    callback: (data: ProductsApiResponse | null, error: Error | null) => void,
    delay: number = 300
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(async () => {
      try {
        const data = await getProducts(filters)
        callback(data, null)
      } catch (error) {
        callback(null, error as Error)
      }
    }, delay)
  }
}

// Función para crear un nuevo producto
export async function createProduct(productData: CreateProductRequest): Promise<ProductApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data: ProductApiResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error al crear producto')
    }

    return data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Función para actualizar un producto existente
export async function updateProduct(id: string, productData: UpdateProductRequest): Promise<ProductApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data: ProductApiResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar producto')
    }

    return data
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}