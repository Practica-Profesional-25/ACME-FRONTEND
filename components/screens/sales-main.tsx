"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye, FileText, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSales, getSaleById } from "@/lib/api"
import type { ApiSale, SaleFilters } from "@/lib/types"

interface SalesMainProps {
  onStartSale: () => void
}

export function SalesMain({ onStartSale }: SalesMainProps) {
  const [sales, setSales] = useState<ApiSale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSales, setTotalSales] = useState(0)
  const itemsPerPage = 10

  // Función para cargar las ventas desde la API
  const loadSales = async (filters: SaleFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getSales({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      })
      
      setSales(response.data)
      setTotalPages(response.totalPages)
      setTotalSales(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las ventas')
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  // Cargar ventas al montar el componente y cuando cambie la página
  useEffect(() => {
    loadSales()
  }, [currentPage])

  // Manejar búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        loadSales({
          numero: searchTerm,
          cliente: searchTerm,
        })
      } else {
        loadSales()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const filteredSales = sales
  const paginatedSales = filteredSales

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Completada":
        return <Badge className="bg-secondary text-secondary-foreground">Completada</Badge>
      case "Pendiente":
        return <Badge variant="outline">Pendiente</Badge>
      case "Cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  // Función para ver detalles de una venta
  const handleViewSale = async (saleId: string) => {
    try {
      const response = await getSaleById(saleId)
      if (response.success) {
        // Mostrar detalles de la venta en un alert o modal
        alert(`Detalles de la venta:\n\nNúmero: ${response.data.numero}\nCliente: ${response.data.cliente}\nTotal: $${response.data.total.toFixed(2)}\nFecha: ${response.data.fecha}\nEstado: ${response.data.estado}`)
      }
    } catch (error) {
      console.error('Error al obtener detalles de la venta:', error)
      alert('Error al cargar los detalles de la venta')
    }
  }

  // Función para generar/descargar DTE
  const handleDTE = (sale: ApiSale) => {
    // Generar URL del QR para el DTE
    const qrData = `https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGeneracion=DTE-${sale.id}&fechaEmi=${sale.fecha}`
    
    // Abrir en nueva ventana o descargar
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>DTE - ${sale.numero}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .header { margin-bottom: 30px; }
              .qr-container { margin: 20px 0; }
              .details { text-align: left; max-width: 400px; margin: 0 auto; }
              .details div { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Documento Tributario Electrónico</h1>
              <h2>Venta ${sale.numero}</h2>
            </div>
            <div class="details">
              <div><strong>Cliente:</strong> ${sale.cliente}</div>
              <div><strong>Total:</strong> $${sale.total.toFixed(2)}</div>
              <div><strong>Fecha:</strong> ${sale.fecha}</div>
              <div><strong>Estado:</strong> ${sale.estado}</div>
            </div>
            <div class="qr-container">
              <p>Código QR para verificación:</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}" alt="QR Code DTE" />
              <p style="font-size: 12px; color: #666; word-break: break-all;">${qrData}</p>
            </div>
            <button onclick="window.print()" style="padding: 10px 20px; margin: 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Imprimir</button>
          </body>
        </html>
      `)
      newWindow.document.close()
    } else {
      alert('No se pudo abrir la ventana del DTE. Por favor, permite las ventanas emergentes.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Ventas</h1>
          <p className="text-muted-foreground">Gestión de ventas realizadas</p>
        </div>
        <Button onClick={onStartSale} className="bg-primary hover:bg-primary/90">
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
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron ventas
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.numero}</TableCell>
                        <TableCell>{sale.cliente}</TableCell>
                        <TableCell className="font-semibold">${sale.total.toFixed(2)}</TableCell>
                        <TableCell>{sale.fecha}</TableCell>
                        <TableCell>{getStatusBadge(sale.estado)}</TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleViewSale(sale.id)}>
                               <Eye className="h-4 w-4 mr-1" />
                               Ver
                             </Button>
                             <Button variant="outline" size="sm" onClick={() => handleDTE(sale)}>
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
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalSales)} de{" "}
                    {totalSales} ventas
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
  )
}
