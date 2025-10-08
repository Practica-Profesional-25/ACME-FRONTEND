"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"

const mockProducts = [
  // Bicicletas - Carretera
  {
    id: "B001",
    identificador: "TREK-DOMANE-SL5-2024",
    nombre: "Trek Domane SL 5 2024",
    categoria: "Bicicletas",
    subcategoria: "Carretera",
    precio: 2899.99,
    stock: 3,
  },
  {
    id: "B002",
    identificador: "SPECIALIZED-TARMAC-SL7-2024",
    nombre: "Specialized Tarmac SL7 Expert 2024",
    categoria: "Bicicletas",
    subcategoria: "Carretera",
    precio: 4299.99,
    stock: 2,
  },
  {
    id: "B003",
    identificador: "GIANT-CONTEND-AR-2024",
    nombre: "Giant Contend AR 3 2024",
    categoria: "Bicicletas",
    subcategoria: "Carretera",
    precio: 1199.99,
    stock: 5,
  },
  // Bicicletas - Montaña
  {
    id: "B004",
    identificador: "TREK-FUEL-EX-2024",
    nombre: "Trek Fuel EX 8 2024",
    categoria: "Bicicletas",
    subcategoria: "Montaña",
    precio: 3499.99,
    stock: 4,
  },
  {
    id: "B005",
    identificador: "SPECIALIZED-STUMPJUMPER-2024",
    nombre: "Specialized Stumpjumper Comp 2024",
    categoria: "Bicicletas",
    subcategoria: "Montaña",
    precio: 3899.99,
    stock: 2,
  },
  // Bicicletas - Híbridas
  {
    id: "B006",
    identificador: "TREK-FX3-DISC-2024",
    nombre: "Trek FX 3 Disc 2024",
    categoria: "Bicicletas",
    subcategoria: "Híbridas",
    precio: 899.99,
    stock: 8,
  },
  {
    id: "B007",
    identificador: "GIANT-ESCAPE-3-2024",
    nombre: "Giant Escape 3 2024",
    categoria: "Bicicletas",
    subcategoria: "Híbridas",
    precio: 549.99,
    stock: 6,
  },
  // Bicicletas - Eléctricas
  {
    id: "B008",
    identificador: "TREK-VERVE-PLUS-2024",
    nombre: "Trek Verve+ 2 Lowstep 2024",
    categoria: "Bicicletas",
    subcategoria: "Eléctricas",
    precio: 2799.99,
    stock: 3,
  },
  // Cascos
  {
    id: "C001",
    identificador: "GIRO-SYNTAX-MIPS-2024",
    nombre: "Casco Giro Syntax MIPS",
    categoria: "Cascos",
    subcategoria: "Carretera",
    precio: 149.99,
    stock: 15,
  },
  {
    id: "C002",
    identificador: "SPECIALIZED-ALIGN-II-2024",
    nombre: "Casco Specialized Align II",
    categoria: "Cascos",
    subcategoria: "Urbanos",
    precio: 49.99,
    stock: 20,
  },
  {
    id: "C003",
    identificador: "BELL-SUPER-DH-MIPS-2024",
    nombre: "Casco Bell Super DH MIPS",
    categoria: "Cascos",
    subcategoria: "Montaña",
    precio: 299.99,
    stock: 8,
  },
  // Guantes
  {
    id: "G001",
    identificador: "PEARL-IZUMI-ELITE-GEL",
    nombre: "Guantes Pearl Izumi Elite Gel",
    categoria: "Guantes",
    subcategoria: "Carretera",
    precio: 39.99,
    stock: 25,
  },
  {
    id: "G002",
    identificador: "SPECIALIZED-BG-GRAIL-2024",
    nombre: "Guantes Specialized BG Grail",
    categoria: "Guantes",
    subcategoria: "Carretera",
    precio: 34.99,
    stock: 18,
  },
  {
    id: "G003",
    identificador: "FOX-RANGER-MTB-2024",
    nombre: "Guantes Fox Ranger MTB",
    categoria: "Guantes",
    subcategoria: "Montaña",
    precio: 29.99,
    stock: 22,
  },
  // Accesorios
  {
    id: "A001",
    identificador: "WAHOO-ELEMNT-BOLT-V2",
    nombre: "Ciclocomputador Wahoo ELEMNT BOLT V2",
    categoria: "Accesorios",
    subcategoria: "Electrónicos",
    precio: 279.99,
    stock: 10,
  },
  {
    id: "A002",
    identificador: "LEZYNE-MEGA-XL-GPS",
    nombre: "Ciclocomputador Lezyne Mega XL GPS",
    categoria: "Accesorios",
    subcategoria: "Electrónicos",
    precio: 199.99,
    stock: 12,
  },
  {
    id: "A003",
    identificador: "PARK-TOOL-PCS-10-2",
    nombre: "Soporte Park Tool PCS-10.2",
    categoria: "Accesorios",
    subcategoria: "Herramientas",
    precio: 189.99,
    stock: 5,
  },
  {
    id: "A004",
    identificador: "KRYPTONITE-EVOLUTION-4",
    nombre: "Candado Kryptonite Evolution Series 4",
    categoria: "Accesorios",
    subcategoria: "Candados",
    precio: 89.99,
    stock: 15,
  },
  {
    id: "A005",
    identificador: "LEZYNE-MACRO-DRIVE-1400XL",
    nombre: "Luz Lezyne Macro Drive 1400XL",
    categoria: "Accesorios",
    subcategoria: "Iluminación",
    precio: 149.99,
    stock: 8,
  },
]

const categories = ["Bicicletas", "Cascos", "Guantes", "Accesorios"]
const subcategories = {
  Bicicletas: ["Carretera", "Montaña", "Híbridas", "Eléctricas"],
  Cascos: ["Carretera", "Montaña", "Urbanos"],
  Guantes: ["Carretera", "Montaña", "Invierno"],
  Accesorios: ["Electrónicos", "Herramientas", "Iluminación", "Candados"],
}

export function ProductManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    identificador: "",
    nombre: "",
    categoria: "",
    subcategoria: "",
    precio: "",
    stock: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      identificador: "",
      nombre: "",
      categoria: "",
      subcategoria: "",
      precio: "",
      stock: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      identificador: product.identificador,
      nombre: product.nombre,
      categoria: product.categoria,
      subcategoria: product.subcategoria,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                identificador: formData.identificador,
                nombre: formData.nombre,
                categoria: formData.categoria,
                subcategoria: formData.subcategoria,
                precio: Number.parseFloat(formData.precio),
                stock: Number.parseInt(formData.stock),
              }
            : p,
        ),
      )
    } else {
      // Create new product
      const newProduct = {
        id: `P${Date.now()}`,
        identificador: formData.identificador,
        nombre: formData.nombre,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock),
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Sin stock</Badge>
    if (stock <= 5)
      return (
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          Stock bajo
        </Badge>
      )
    return <Badge className="bg-secondary text-secondary-foreground">En stock</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mantenimiento de productos</h1>
          <p className="text-muted-foreground">Gestión del catálogo de bicicletas y complementos</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catálogo de productos
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Subcategoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.identificador}</TableCell>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.subcategoria}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${product.precio.toFixed(2)}</TableCell>
                  <TableCell>{getStockBadge(product.stock)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="identificador">Identificador</Label>
              <Input
                id="identificador"
                value={formData.identificador}
                onChange={(e) => setFormData({ ...formData, identificador: e.target.value })}
                placeholder="Ej: TREK-DOMANE-SL5-2024"
              />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value, subcategoria: "" })}
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
                value={formData.subcategoria}
                onValueChange={(value) => setFormData({ ...formData, subcategoria: value })}
                disabled={!formData.categoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {formData.categoria &&
                    subcategories[formData.categoria as keyof typeof subcategories]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                {editingProduct ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
