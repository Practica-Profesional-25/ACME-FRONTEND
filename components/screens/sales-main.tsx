"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye, FileText } from "lucide-react"

interface SalesMainProps {
  onStartSale: () => void
}

// Mock sales data
const mockSales = [
  {
    id: "V001",
    numero: "2024-001",
    cliente: "María González",
    total: 1299.98,
    fecha: "2024-01-15",
    estado: "Completada",
  },
  {
    id: "V002",
    numero: "2024-002",
    cliente: "Carlos Rodríguez",
    total: 549.99,
    fecha: "2024-01-15",
    estado: "Completada",
  },
  {
    id: "V003",
    numero: "2024-003",
    cliente: "Ana Martínez",
    total: 899.5,
    fecha: "2024-01-14",
    estado: "Completada",
  },
  {
    id: "V004",
    numero: "2024-004",
    cliente: "Consumidor final",
    total: 199.99,
    fecha: "2024-01-14",
    estado: "Completada",
  },
  {
    id: "V005",
    numero: "2024-005",
    cliente: "Luis Hernández",
    total: 1599.0,
    fecha: "2024-01-13",
    estado: "Completada",
  },
]

export function SalesMain({ onStartSale }: SalesMainProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage)

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
              {paginatedSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.numero}</TableCell>
                  <TableCell>{sale.cliente}</TableCell>
                  <TableCell className="font-semibold">${sale.total.toFixed(2)}</TableCell>
                  <TableCell>{sale.fecha}</TableCell>
                  <TableCell>{getStatusBadge(sale.estado)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        DTE
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredSales.length)} de{" "}
                {filteredSales.length} ventas
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
