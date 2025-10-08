"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2 } from "lucide-react"
import type { SaleData, Product } from "../sales-wizard"

interface ProductSelectionProps {
  saleData: SaleData
  setSaleData: (data: SaleData) => void
}

const mockProducts = [
  // Bicicletas - Carretera
  { id: "B001", name: "Trek Domane SL 5 2024", category: "Bicicletas", subcategory: "Carretera", price: 2899.99 },
  {
    id: "B002",
    name: "Specialized Tarmac SL7 Expert 2024",
    category: "Bicicletas",
    subcategory: "Carretera",
    price: 4299.99,
  },
  { id: "B003", name: "Giant Contend AR 3 2024", category: "Bicicletas", subcategory: "Carretera", price: 1199.99 },
  // Bicicletas - Montaña
  { id: "B004", name: "Trek Fuel EX 8 2024", category: "Bicicletas", subcategory: "Montaña", price: 3499.99 },
  {
    id: "B005",
    name: "Specialized Stumpjumper Comp 2024",
    category: "Bicicletas",
    subcategory: "Montaña",
    price: 3899.99,
  },
  // Bicicletas - Híbridas
  { id: "B006", name: "Trek FX 3 Disc 2024", category: "Bicicletas", subcategory: "Híbridas", price: 899.99 },
  { id: "B007", name: "Giant Escape 3 2024", category: "Bicicletas", subcategory: "Híbridas", price: 549.99 },
  // Bicicletas - Eléctricas
  { id: "B008", name: "Trek Verve+ 2 Lowstep 2024", category: "Bicicletas", subcategory: "Eléctricas", price: 2799.99 },
  // Cascos
  { id: "C001", name: "Casco Giro Syntax MIPS", category: "Cascos", subcategory: "Carretera", price: 149.99 },
  { id: "C002", name: "Casco Specialized Align II", category: "Cascos", subcategory: "Urbanos", price: 49.99 },
  { id: "C003", name: "Casco Bell Super DH MIPS", category: "Cascos", subcategory: "Montaña", price: 299.99 },
  // Guantes
  { id: "G001", name: "Guantes Pearl Izumi Elite Gel", category: "Guantes", subcategory: "Carretera", price: 39.99 },
  { id: "G002", name: "Guantes Specialized BG Grail", category: "Guantes", subcategory: "Carretera", price: 34.99 },
  { id: "G003", name: "Guantes Fox Ranger MTB", category: "Guantes", subcategory: "Montaña", price: 29.99 },
  // Accesorios
  {
    id: "A001",
    name: "Ciclocomputador Wahoo ELEMNT BOLT V2",
    category: "Accesorios",
    subcategory: "Electrónicos",
    price: 279.99,
  },
  {
    id: "A002",
    name: "Ciclocomputador Lezyne Mega XL GPS",
    category: "Accesorios",
    subcategory: "Electrónicos",
    price: 199.99,
  },
  {
    id: "A003",
    name: "Soporte Park Tool PCS-10.2",
    category: "Accesorios",
    subcategory: "Herramientas",
    price: 189.99,
  },
  {
    id: "A004",
    name: "Candado Kryptonite Evolution Series 4",
    category: "Accesorios",
    subcategory: "Candados",
    price: 89.99,
  },
  {
    id: "A005",
    name: "Luz Lezyne Macro Drive 1400XL",
    category: "Accesorios",
    subcategory: "Iluminación",
    price: 149.99,
  },
]

const categories = ["Bicicletas", "Cascos", "Guantes", "Accesorios"]
const subcategories = {
  Bicicletas: ["Carretera", "Montaña", "Híbridas", "Eléctricas"],
  Cascos: ["Carretera", "Montaña", "Urbanos"],
  Guantes: ["Carretera", "Montaña", "Invierno"],
  Accesorios: ["Electrónicos", "Herramientas", "Iluminación", "Candados"],
}

export function ProductSelection({ saleData, setSaleData }: ProductSelectionProps) {
  const [searchForm, setSearchForm] = useState({
    nombre: "",
    identificador: "",
    categoria: "",
    subcategoria: "",
  })
  const [searchResults, setSearchResults] = useState(mockProducts)
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})

  const handleSearch = () => {
    let filtered = mockProducts

    if (searchForm.nombre) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchForm.nombre.toLowerCase()))
    }
    if (searchForm.identificador) {
      filtered = filtered.filter((p) => p.id.toLowerCase().includes(searchForm.identificador.toLowerCase()))
    }
    if (searchForm.categoria) {
      filtered = filtered.filter((p) => p.category === searchForm.categoria)
    }
    if (searchForm.subcategoria) {
      filtered = filtered.filter((p) => p.subcategory === searchForm.subcategoria)
    }

    setSearchResults(filtered)
  }

  const addProduct = (product: any) => {
    const quantity = selectedQuantities[product.id] || 1
    const subtotal = product.price * quantity
    const tax = subtotal * 0.13 // 13% IVA
    const total = subtotal + tax

    const newProduct: Product = {
      id: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      subtotal,
      tax,
      total,
    }

    const existingIndex = saleData.products.findIndex((p) => p.id === product.id)
    let updatedProducts

    if (existingIndex >= 0) {
      updatedProducts = [...saleData.products]
      updatedProducts[existingIndex] = newProduct
    } else {
      updatedProducts = [...saleData.products, newProduct]
    }

    setSaleData({
      ...saleData,
      products: updatedProducts,
    })

    setSelectedQuantities({ ...selectedQuantities, [product.id]: 1 })
  }

  const removeProduct = (productId: string) => {
    setSaleData({
      ...saleData,
      products: saleData.products.filter((p) => p.id !== productId),
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedProducts = saleData.products.map((product) => {
      if (product.id === productId) {
        const subtotal = product.unitPrice * quantity
        const tax = subtotal * 0.13
        const total = subtotal + tax
        return { ...product, quantity, subtotal, tax, total }
      }
      return product
    })

    setSaleData({
      ...saleData,
      products: updatedProducts,
    })
  }

  const totalSale = saleData.products.reduce((sum, product) => sum + product.total, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={searchForm.nombre}
                onChange={(e) => setSearchForm({ ...searchForm, nombre: e.target.value })}
                placeholder="Buscar por nombre..."
              />
            </div>
            <div>
              <Label htmlFor="identificador">Identificador</Label>
              <Input
                id="identificador"
                value={searchForm.identificador}
                onChange={(e) => setSearchForm({ ...searchForm, identificador: e.target.value })}
                placeholder="Código del producto..."
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={searchForm.categoria}
                onValueChange={(value) => {
                  setSearchForm({ ...searchForm, categoria: value, subcategoria: "" })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategoria">Subcategoría</Label>
              <Select
                value={searchForm.subcategoria}
                onValueChange={(value) => setSearchForm({ ...searchForm, subcategoria: value })}
                disabled={!searchForm.categoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {searchForm.categoria &&
                    subcategories[searchForm.categoria as keyof typeof subcategories]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>

          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Resultados de búsqueda</h3>
              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.subcategory}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`qty-${product.id}`}>Cantidad:</Label>
                        <Input
                          id={`qty-${product.id}`}
                          type="number"
                          min="1"
                          value={selectedQuantities[product.id] || 1}
                          onChange={(e) =>
                            setSelectedQuantities({
                              ...selectedQuantities,
                              [product.id]: Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20"
                        />
                      </div>
                      <Button
                        onClick={() => addProduct(product)}
                        size="sm"
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos seleccionados</CardTitle>
        </CardHeader>
        <CardContent>
          {saleData.products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay productos seleccionados. Busque y agregue productos para continuar.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificador</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio unitario</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Impuesto</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleData.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateQuantity(product.id, Number.parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${product.subtotal.toFixed(2)}</TableCell>
                      <TableCell>${product.tax.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${product.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total de la venta:</span>
                  <span className="text-2xl font-bold text-primary">${totalSale.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
