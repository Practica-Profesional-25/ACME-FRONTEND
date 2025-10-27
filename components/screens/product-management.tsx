"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Package, Loader2 } from "lucide-react";
import { getProducts, createProduct, updateProduct } from "@/lib/api";
import type { ApiProduct, ProductFilters, CreateProductRequest, UpdateProductRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const mockProducts = [
  // Bikes - Road
  {
    id: "B001",
    identificador: "TREK-DOMANE-SL5-2024",
    nombre: "Trek Domane SL 5 2024",
    categoria: "Bikes",
    subcategoria: "Road",
    precio: 2899.99,
    stock: 3,
  },
  {
    id: "B002",
    identificador: "SPECIALIZED-TARMAC-SL7-2024",
    nombre: "Specialized Tarmac SL7 Expert 2024",
    categoria: "Bikes",
    subcategoria: "Road",
    precio: 4299.99,
    stock: 2,
  },
  {
    id: "B003",
    identificador: "GIANT-CONTEND-AR-2024",
    nombre: "Giant Contend AR 3 2024",
    categoria: "Bikes",
    subcategoria: "Road",
    precio: 1199.99,
    stock: 5,
  },
  // Bikes - Mountain
  {
    id: "B004",
    identificador: "TREK-FUEL-EX-2024",
    nombre: "Trek Fuel EX 8 2024",
    categoria: "Bikes",
    subcategoria: "Mountain",
    precio: 3499.99,
    stock: 4,
  },
  {
    id: "B005",
    identificador: "SPECIALIZED-STUMPJUMPER-2024",
    nombre: "Specialized Stumpjumper Comp 2024",
    categoria: "Bikes",
    subcategoria: "Mountain",
    precio: 3899.99,
    stock: 2,
  },
  // Bikes - Hybrid
  {
    id: "B006",
    identificador: "TREK-FX3-DISC-2024",
    nombre: "Trek FX 3 Disc 2024",
    categoria: "Bikes",
    subcategoria: "Hybrid",
    precio: 899.99,
    stock: 8,
  },
  {
    id: "B007",
    identificador: "GIANT-ESCAPE-3-2024",
    nombre: "Giant Escape 3 2024",
    categoria: "Bikes",
    subcategoria: "Hybrid",
    precio: 549.99,
    stock: 6,
  },
  // Bikes - Electric
  {
    id: "B008",
    identificador: "TREK-VERVE-PLUS-2024",
    nombre: "Trek Verve+ 2 Lowstep 2024",
    categoria: "Bikes",
    subcategoria: "Electric",
    precio: 2799.99,
    stock: 3,
  },
  // Clothing - Road
  {
    id: "C001",
    identificador: "GIRO-SYNTAX-MIPS-2024",
    nombre: "Casco Giro Syntax MIPS",
    categoria: "Clothing",
    subcategoria: "Road",
    precio: 149.99,
    stock: 15,
  },
  {
    id: "C002",
    identificador: "SPECIALIZED-ALIGN-II-2024",
    nombre: "Casco Specialized Align II",
    categoria: "Clothing",
    subcategoria: "Road",
    precio: 49.99,
    stock: 20,
  },
  {
    id: "C003",
    identificador: "BELL-SUPER-DH-MIPS-2024",
    nombre: "Casco Bell Super DH MIPS",
    categoria: "Clothing",
    subcategoria: "Mountain",
    precio: 299.99,
    stock: 8,
  },
  // Clothing - Road
  {
    id: "G001",
    identificador: "PEARL-IZUMI-ELITE-GEL",
    nombre: "Guantes Pearl Izumi Elite Gel",
    categoria: "Clothing",
    subcategoria: "Road",
    precio: 39.99,
    stock: 25,
  },
  {
    id: "G002",
    identificador: "SPECIALIZED-BG-GRAIL-2024",
    nombre: "Guantes Specialized BG Grail",
    categoria: "Clothing",
    subcategoria: "Road",
    precio: 34.99,
    stock: 18,
  },
  {
    id: "G003",
    identificador: "FOX-RANGER-MTB-2024",
    nombre: "Guantes Fox Ranger MTB",
    categoria: "Clothing",
    subcategoria: "Mountain",
    precio: 29.99,
    stock: 22,
  },
  // Accessories
  {
    id: "A001",
    identificador: "WAHOO-ELEMNT-BOLT-V2",
    nombre: "Ciclocomputador Wahoo ELEMNT BOLT V2",
    categoria: "Accessories",
    subcategoria: "Electronics",
    precio: 279.99,
    stock: 10,
  },
  {
    id: "A002",
    identificador: "LEZYNE-MEGA-XL-GPS",
    nombre: "Ciclocomputador Lezyne Mega XL GPS",
    categoria: "Accessories",
    subcategoria: "Electronics",
    precio: 199.99,
    stock: 12,
  },
  {
    id: "A003",
    identificador: "PARK-TOOL-PCS-10-2",
    nombre: "Soporte Park Tool PCS-10.2",
    categoria: "Accessories",
    subcategoria: "Tools",
    precio: 189.99,
    stock: 5,
  },
  {
    id: "A004",
    identificador: "KRYPTONITE-EVOLUTION-4",
    nombre: "Candado Kryptonite Evolution Series 4",
    categoria: "Accessories",
    subcategoria: "Locks",
    precio: 89.99,
    stock: 15,
  },
  {
    id: "A005",
    identificador: "LEZYNE-MACRO-DRIVE-1400XL",
    nombre: "Luz Lezyne Macro Drive 1400XL",
    categoria: "Accessories",
    subcategoria: "Lighting",
    precio: 149.99,
    stock: 8,
  },
];

const categories = [
  "Bikes",
  "Components", 
  "Clothing",
  "Accessories",
];
const subcategories = {
  Bikes: ["Road", "Mountain", "Hybrid", "Electric"],
  Components: ["Pedals", "Chains", "Gears", "Brakes"],
  Clothing: ["Road", "Mountain", "Winter"],
  Accessories: ["Electronics", "Tools", "Lighting", "Locks"],
};

export function ProductManagement() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [formData, setFormData] = useState({
    identificador: "",
    nombre: "",
    categoria: "",
    subcategoria: "",
    precio: "",
    stock: "",
  });
  const { toast } = useToast();

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      const response = await getProducts({
        ...filters,
        limit: 100, // Cargar más productos para la gestión
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los productos. Usando datos de ejemplo.",
        variant: "destructive",
      });
      // Fallback a datos mock en caso de error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos localmente para búsqueda rápida
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.identificador.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.categoria === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleSearch = () => {
    const filters: ProductFilters = {};
    if (searchTerm) filters.nombre = searchTerm;
    if (categoryFilter && categoryFilter !== "all") filters.categoria = categoryFilter;
    loadProducts(filters);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      identificador: "",
      nombre: "",
      categoria: "",
      subcategoria: "",
      precio: "",
      stock: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: ApiProduct) => {
    setEditingProduct(product);
    setFormData({
      identificador: product.identificador,
      nombre: product.nombre,
      categoria: product.categoria,
      subcategoria: product.subcategoria,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validar campos requeridos
      if (!formData.identificador || !formData.nombre || !formData.categoria || 
          !formData.subcategoria || !formData.precio || !formData.stock) {
        toast({
          title: "Error",
          description: "Todos los campos son requeridos.",
          variant: "destructive",
        });
        return;
      }

      // Validar que precio y stock sean números válidos
      const precio = parseFloat(parseFloat(formData.precio).toFixed(2));
      const stock = parseInt(formData.stock);
      
      if (isNaN(precio) || precio <= 0) {
        toast({
          title: "Error",
          description: "El precio debe ser un número válido mayor a 0.",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(stock) || stock < 0) {
        toast({
          title: "Error",
          description: "El stock debe ser un número válido mayor o igual a 0.",
          variant: "destructive",
        });
        return;
      }

      if (editingProduct) {
        // Actualizar producto existente
        const updateData: UpdateProductRequest = {
          identificador: formData.identificador,
          nombre: formData.nombre,
          categoria: formData.categoria,
          subcategoria: formData.subcategoria,
          precio: precio,
          stock: stock,
        };

        await updateProduct(editingProduct.id, updateData);
        
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente.",
        });
      } else {
        // Crear nuevo producto
        const createData: CreateProductRequest = {
          identificador: formData.identificador,
          nombre: formData.nombre,
          categoria: formData.categoria,
          subcategoria: formData.subcategoria,
          precio: precio,
          stock: stock,
        };

        await createProduct(createData);
        
        toast({
          title: "Éxito",
          description: "Producto creado correctamente.",
        });
      }

      // Recargar la lista de productos
      await loadProducts();
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: editingProduct 
          ? "No se pudo actualizar el producto. Intente nuevamente."
          : "No se pudo crear el producto. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (productId: string) => {
    // Nota: En una implementación real, aquí se haría una llamada a la API
    // para eliminar el producto
    toast({
      title: "Información",
      description:
        "La funcionalidad de eliminar productos requiere implementar los endpoints correspondientes en la API.",
      variant: "default",
    });
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sin stock</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="secondary">Stock bajo ({stock})</Badge>;
    } else {
      return <Badge variant="default">{stock} unidades</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Mantenimiento de productos
          </h1>
          <p className="text-muted-foreground">
            Gestión del catálogo de bicicletas y complementos
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90"
        >
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando productos...</span>
            </div>
          ) : (
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
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.identificador}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.nombre}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.categoria || "Sin categoría"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.subcategoria || "Sin subcategoría"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {product.precio > 0
                          ? `$${product.precio.toFixed(2)}`
                          : "Sin precio"}
                      </TableCell>
                      <TableCell>{getStockBadge(product.stock)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="identificador">Identificador</Label>
              <Input
                id="identificador"
                value={formData.identificador}
                onChange={(e) =>
                  setFormData({ ...formData, identificador: e.target.value })
                }
                placeholder="Código del producto"
              />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoria: value,
                    subcategoria: "",
                  })
                }
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
                onValueChange={(value) =>
                  setFormData({ ...formData, subcategoria: value })
                }
                disabled={!formData.categoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar subcategoría" />
                </SelectTrigger>
                <SelectContent>
                  {formData.categoria &&
                    subcategories[
                      formData.categoria as keyof typeof subcategories
                    ]?.map((subcat) => (
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
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
