"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Eye,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SaleDetailsDialog } from "@/components/ui/sale-details-dialog";
import { getSales } from "@/lib/api";
import type { ApiSale, SaleFilters } from "@/lib/types";

interface SalesMainProps {
  onStartSale: () => void;
}

export function SalesMain({ onStartSale }: SalesMainProps) {
  const [sales, setSales] = useState<ApiSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const itemsPerPage = 10;

  // Función para cargar las ventas desde la API
  const loadSales = async (filters: SaleFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSales({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      });

      setSales(response.data);
      setTotalPages(response.totalPages);
      setTotalSales(response.total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las ventas"
      );
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas al montar el componente y cuando cambie la página
  useEffect(() => {
    loadSales();
  }, [currentPage]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        loadSales({
          numero: searchTerm,
          cliente: searchTerm,
        });
      } else {
        loadSales();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredSales = sales;
  const paginatedSales = filteredSales;

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completada":
      case "completed":
      case "procesada":
      case "processed":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            Completada
          </Badge>
        );
      case "pendiente":
      case "pending":
        return <Badge variant="outline">Pendiente</Badge>;
      case "cancelada":
      case "cancelled":
      case "canceled":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-SV', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  };

  // Función para ver detalles de una venta - ahora usa el dialog
  const handleViewSale = (saleId: string) => {
    // La funcionalidad ahora está manejada por el SaleDetailsDialog component
    // No necesitamos hacer nada aquí ya que el dialog maneja la carga de datos
  };

  // Función para navegar a la página DTE
  const handleDTE = (sale: ApiSale) => {
    // Navegar a la página DTE usando el ID de la venta
    window.open(`/dte/${sale.id}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Ventas</h1>
          <p className="text-muted-foreground">Gestión de ventas realizadas</p>
        </div>
        <Button
          onClick={onStartSale}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva venta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ventas realizadas</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando ventas...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de venta</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No se encontraron ventas
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                          {sale.numero}
                        </TableCell>
                        <TableCell>{sale.cliente}</TableCell>
                        <TableCell className="font-semibold">
                          ${sale.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{formatDate(sale.fecha)}</TableCell>
                        <TableCell>
                          {getStatusBadge(
                            sale.status || sale.estado || "pendiente"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <SaleDetailsDialog saleId={sale.id}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </SaleDetailsDialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDTE(sale)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              DTE
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, totalSales)} de{" "}
                    {totalSales} ventas
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || loading}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages || loading}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
