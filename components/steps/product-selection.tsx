"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import type { SaleData, Product } from "../sales-wizard";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/lib/api";
import type { ApiProduct } from "@/lib/types";
import { apiProductToSaleProduct } from "@/lib/types";

const mockProducts = [
  // Bikes - Road
  {
    id: "B001",
    name: "Trek Domane SL 5 2024",
    category: "Bikes",
    subcategory: "Road",
    price: 2899.99,
  },
  {
    id: "B002",
    name: "Specialized Tarmac SL7 Expert 2024",
    category: "Bikes",
    subcategory: "Road",
    price: 4299.99,
  },
  {
    id: "B003",
    name: "Giant Contend AR 3 2024",
    category: "Bikes",
    subcategory: "Road",
    price: 1199.99,
  },
  // Bikes - Mountain
  {
    id: "B004",
    name: "Trek Fuel EX 8 2024",
    category: "Bikes",
    subcategory: "Mountain",
    price: 3499.99,
  },
  {
    id: "B005",
    name: "Specialized Stumpjumper Comp 2024",
    category: "Bikes",
    subcategory: "Mountain",
    price: 3899.99,
  },
  // Bikes - Hybrid
  {
    id: "B006",
    name: "Trek FX 3 Disc 2024",
    category: "Bikes",
    subcategory: "Hybrid",
    price: 899.99,
  },
  {
    id: "B007",
    name: "Giant Escape 3 2024",
    category: "Bikes",
    subcategory: "Hybrid",
    price: 549.99,
  },
  // Bikes - Electric
  {
    id: "B008",
    name: "Trek Verve+ 2 Lowstep 2024",
    category: "Bikes",
    subcategory: "Electric",
    price: 2799.99,
  },
  // Clothing - Road
  {
    id: "C001",
    name: "Casco Giro Syntax MIPS",
    category: "Clothing",
    subcategory: "Road",
    price: 149.99,
  },
  {
    id: "C002",
    name: "Casco Specialized Align II",
    category: "Clothing",
    subcategory: "Road",
    price: 49.99,
  },
  {
    id: "C003",
    name: "Casco Bell Super DH MIPS",
    category: "Clothing",
    subcategory: "Mountain",
    price: 299.99,
  },
  // Clothing - Road
  {
    id: "G001",
    name: "Guantes Pearl Izumi Elite Gel",
    category: "Clothing",
    subcategory: "Road",
    price: 39.99,
  },
  {
    id: "G002",
    name: "Guantes Specialized BG Grail",
    category: "Clothing",
    subcategory: "Road",
    price: 34.99,
  },
  {
    id: "G003",
    name: "Guantes Fox Ranger MTB",
    category: "Clothing",
    subcategory: "Mountain",
    price: 29.99,
  },
  // Accessories
  {
    id: "A001",
    name: "Ciclocomputador Wahoo ELEMNT BOLT V2",
    category: "Accessories",
    subcategory: "Electronics",
    price: 279.99,
  },
  {
    id: "A002",
    name: "Ciclocomputador Lezyne Mega XL GPS",
    category: "Accessories",
    subcategory: "Electronics",
    price: 199.99,
  },
  {
    id: "A003",
    name: "Soporte Park Tool PCS-10.2",
    category: "Accessories",
    subcategory: "Tools",
    price: 189.99,
  },
  {
    id: "A004",
    name: "Candado Kryptonite Evolution Series 4",
    category: "Accessories",
    subcategory: "Locks",
    price: 89.99,
  },
  {
    id: "A005",
    name: "Luz Lezyne Macro Drive 1400XL",
    category: "Accessories",
    subcategory: "Lighting",
    price: 149.99,
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

interface ProductSelectionProps {
  saleData: SaleData;
  setSaleData: (data: SaleData) => void;
}

export function ProductSelection({
  saleData,
  setSaleData,
}: ProductSelectionProps) {
  const [searchForm, setSearchForm] = useState({
    nombre: "",
    identificador: "",
    categoria: "",
    subcategoria: "",
  });
  const [searchResults, setSearchResults] = useState<ApiProduct[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Cargar productos iniciales
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters = {
        ...(searchForm.nombre && { nombre: searchForm.nombre }),
        ...(searchForm.identificador && {
          identificador: searchForm.identificador,
        }),
        ...(searchForm.categoria && searchForm.categoria !== "all" && { categoria: searchForm.categoria }),
        ...(searchForm.subcategoria && searchForm.subcategoria !== "all" && {
          subcategoria: searchForm.subcategoria,
        }),
        limit: 50,
      };

      const response = await getProducts(filters);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (apiProduct: ApiProduct) => {
    const quantity = selectedQuantities[apiProduct.id] || 1;
    
    // Validar stock disponible
    if (quantity > apiProduct.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${apiProduct.stock} unidades disponibles de ${apiProduct.nombre}`,
        variant: "destructive",
      });
      return;
    }

    // Verificar si ya existe el producto y calcular cantidad total
    const existingProduct = saleData.products.find((p) => p.id === apiProduct.id);
    const totalQuantityAfterAdd = existingProduct ? existingProduct.quantity + quantity : quantity;
    
    if (totalQuantityAfterAdd > apiProduct.stock) {
      toast({
        title: "Stock insuficiente",
        description: `No se puede agregar ${quantity} unidades. Ya tienes ${existingProduct?.quantity || 0} en el carrito. Stock disponible: ${apiProduct.stock}`,
        variant: "destructive",
      });
      return;
    }

    const saleProduct = apiProductToSaleProduct(apiProduct, quantity);

    // Convertir SaleProduct a Product para el wizard
    const product: Product = {
      id: saleProduct.id,
      name: saleProduct.name,
      unitPrice: saleProduct.unitPrice,
      quantity: quantity,
      subtotal: saleProduct.subtotal,
      tax: saleProduct.tax,
      total: saleProduct.total,
    };

    if (existingProduct) {
      // Si ya existe, incrementar cantidad
      setSaleData({
        ...saleData,
        products: saleData.products.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + quantity,
                total: parseFloat((p.unitPrice * (p.quantity + quantity)).toFixed(2)),
              }
            : p
        ),
      });
      toast({
        title: "Cantidad actualizada",
        description: `${product.name} - Nueva cantidad: ${
          existingProduct.quantity + quantity
        }`,
      });
    } else {
      // Si no existe, agregarlo
      setSaleData({
        ...saleData,
        products: [...saleData.products, product],
      });
      toast({
        title: "Producto agregado",
        description: product.name,
      });
    }

    // Reset quantity for this product
    setSelectedQuantities({
      ...selectedQuantities,
      [apiProduct.id]: 1,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    // Encontrar el producto en los resultados de búsqueda para obtener el stock
    const apiProduct = searchResults.find(p => p.id === productId);
    if (apiProduct && newQuantity > apiProduct.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${apiProduct.stock} unidades disponibles de ${apiProduct.nombre}`,
        variant: "destructive",
      });
      return;
    }

    setSaleData({
      ...saleData,
      products: saleData.products.map((p) =>
        p.id === productId
          ? { ...p, quantity: newQuantity, total: parseFloat((p.unitPrice * newQuantity).toFixed(2)) }
          : p
      ),
    });
  };

  const removeProduct = (productId: string) => {
    const product = saleData.products.find((p) => p.id === productId);
    setSaleData({
      ...saleData,
      products: saleData.products.filter((p) => p.id !== productId),
    });
    if (product) {
      toast({
        title: "Producto eliminado",
        description: product.name,
        variant: "destructive",
      });
    }
  };

  const totalSale = saleData.products.reduce(
    (sum, product) => sum + product.total,
    0
  );

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar productos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Buscar por nombre..."
                  value={searchForm.nombre}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, nombre: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="identificador">Identificador</Label>
                <Input
                  id="identificador"
                  placeholder="Código del producto..."
                  value={searchForm.identificador}
                  onChange={(e) =>
                    setSearchForm({
                      ...searchForm,
                      identificador: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={searchForm.categoria}
                  onValueChange={(value) =>
                    setSearchForm({
                      ...searchForm,
                      categoria: value,
                      subcategoria: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
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
              </div>
              <div>
                <Label htmlFor="subcategoria">Subcategoría</Label>
                <Select
                  value={searchForm.subcategoria}
                  onValueChange={(value) =>
                    setSearchForm({ ...searchForm, subcategoria: value })
                  }
                  disabled={!searchForm.categoria || searchForm.categoria === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las subcategorías</SelectItem>
                    {searchForm.categoria && searchForm.categoria !== "all" &&
                      subcategories[
                        searchForm.categoria as keyof typeof subcategories
                      ]?.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar productos
            </Button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Buscando productos...</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron productos</p>
                    <p className="text-sm">Ajusta los criterios de búsqueda</p>
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.nombre}</h4>
                          <p className="text-sm text-muted-foreground">
                            ID: {product.identificador}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {product.categoria || "Sin categoría"}
                            </Badge>
                            {product.subcategoria && (
                              <Badge variant="outline">
                                {product.subcategoria}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {product.precio > 0
                              ? `$${product.precio.toFixed(2)}`
                              : "Sin precio"}
                          </p>
                          {getStockBadge(product.stock)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`qty-${product.id}`}
                            className="text-sm"
                          >
                            Cantidad:
                          </Label>
                          <Input
                            id={`qty-${product.id}`}
                            type="number"
                            min="1"
                            max={product.stock}
                            value={selectedQuantities[product.id] || 1}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value) || 1;
                              const maxValue = Math.min(value, product.stock);
                              setSelectedQuantities({
                                ...selectedQuantities,
                                [product.id]: maxValue,
                              });
                              
                              // Mostrar advertencia si se intenta exceder el stock
                              if (value > product.stock) {
                                toast({
                                  title: "Cantidad ajustada",
                                  description: `La cantidad se ajustó a ${product.stock} (stock disponible)`,
                                  variant: "default",
                                });
                              }
                            }}
                            className="w-20"
                          />
                        </div>
                        <Button
                          onClick={() => addProduct(product)}
                          size="sm"
                          disabled={product.stock === 0}
                          className="bg-secondary hover:bg-secondary/90"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Productos seleccionados
                {saleData.products.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {saleData.products.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {saleData.products.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No hay productos seleccionados
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                    {saleData.products.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <p className="font-medium text-sm leading-tight">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {product.id}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`selected-qty-${product.id}`}
                            className="text-xs"
                          >
                            Cant:
                          </Label>
                          <Input
                            id={`selected-qty-${product.id}`}
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => {
                              const newQuantity = Number.parseInt(e.target.value) || 1;
                              updateQuantity(product.id, newQuantity);
                            }}
                            className="h-8 w-16 text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            ×
                          </span>
                          <span className="text-sm">
                            ${product.unitPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            Total:
                          </span>
                          <span className="font-semibold text-sm">
                            ${product.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">
                        ${totalSale.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
