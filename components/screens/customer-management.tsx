"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"

// Mock customer data
const mockCustomers = [
  {
    id: "C001",
    nombre: "María González",
    dui: "12345678-9",
    nit: "1234-567890-123-4",
    correo: "maria.gonzalez@email.com",
    telefono: "2234-5678",
    direccion: "Col. Escalón, San Salvador",
    tipo: "Crédito Fiscal",
  },
  {
    id: "C002",
    nombre: "Carlos Rodríguez",
    dui: "98765432-1",
    nit: "9876-543210-987-6",
    correo: "carlos.rodriguez@empresa.com",
    telefono: "2345-6789",
    direccion: "Col. San Benito, San Salvador",
    tipo: "Crédito Fiscal",
  },
  {
    id: "C003",
    nombre: "Ana Martínez",
    dui: "11223344-5",
    nit: "",
    correo: "ana.martinez@gmail.com",
    telefono: "7890-1234",
    direccion: "Col. Miramonte, San Salvador",
    tipo: "Factura",
  },
  {
    id: "C004",
    nombre: "Luis Hernández",
    dui: "55667788-9",
    nit: "",
    correo: "luis.hernandez@hotmail.com",
    telefono: "6789-0123",
    direccion: "Col. Centroamérica, San Salvador",
    tipo: "Factura",
  },
]

export function CustomerManagement() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    dui: "",
    nit: "",
    correo: "",
    telefono: "",
    direccion: "",
  })

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.dui.includes(searchTerm) ||
      customer.nit.includes(searchTerm),
  )

  const handleCreate = () => {
    setEditingCustomer(null)
    setFormData({
      nombre: "",
      dui: "",
      nit: "",
      correo: "",
      telefono: "",
      direccion: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer)
    setFormData({
      nombre: customer.nombre,
      dui: customer.dui,
      nit: customer.nit,
      correo: customer.correo,
      telefono: customer.telefono,
      direccion: customer.direccion,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const tipo = formData.nit ? "Crédito Fiscal" : "Factura"

    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...c, ...formData, tipo } : c)))
    } else {
      // Create new customer
      const newCustomer = {
        id: `C${Date.now()}`,
        ...formData,
        tipo,
      }
      setCustomers([...customers, newCustomer])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter((c) => c.id !== customerId))
  }

  const getCustomerTypeBadge = (tipo: string) => {
    return tipo === "Crédito Fiscal" ? (
      <Badge className="bg-secondary text-secondary-foreground">Crédito Fiscal</Badge>
    ) : (
      <Badge variant="outline">Factura</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mantenimiento de clientes</h1>
          <p className="text-muted-foreground">Gestión de la base de datos de clientes</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Base de datos de clientes
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>DUI</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.nombre}</TableCell>
                  <TableCell className="font-mono text-sm">{customer.dui}</TableCell>
                  <TableCell className="font-mono text-sm">{customer.nit || "N/A"}</TableCell>
                  <TableCell>{customer.correo}</TableCell>
                  <TableCell>{customer.telefono}</TableCell>
                  <TableCell className="max-w-xs truncate">{customer.direccion}</TableCell>
                  <TableCell>{getCustomerTypeBadge(customer.tipo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
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

      {/* Customer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dui">DUI</Label>
                <Input
                  id="dui"
                  value={formData.dui}
                  onChange={(e) => setFormData({ ...formData, dui: e.target.value })}
                  placeholder="12345678-9"
                />
              </div>
              <div>
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                  placeholder="1234-567890-123-4"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="correo">Correo *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="cliente@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="2234-5678"
              />
            </div>
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Dirección completa"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
                disabled={!formData.nombre || !formData.correo}
              >
                {editingCustomer ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
