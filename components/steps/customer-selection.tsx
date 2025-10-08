"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Search, User, UserPlus, Users } from "lucide-react"
import type { SaleData, Customer } from "../sales-wizard"

interface CustomerSelectionProps {
  saleData: SaleData
  setSaleData: (data: SaleData) => void
}

// Mock customer data
const mockCustomers = [
  {
    id: "C001",
    name: "María González",
    email: "maria.gonzalez@email.com",
    dui: "12345678-9",
    nit: "1234-567890-123-4",
    type: "existing" as const,
  },
  {
    id: "C002",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    dui: "98765432-1",
    nit: "9876-543210-987-6",
    type: "existing" as const,
  },
  {
    id: "C003",
    name: "Ana Martínez",
    email: "ana.martinez@gmail.com",
    dui: "11223344-5",
    nit: "1122-334455-667-8",
    type: "existing" as const,
  },
]

const departamentos = ["San Salvador", "La Libertad", "Santa Ana", "Sonsonate", "Ahuachapán"]
const municipios = {
  "San Salvador": ["San Salvador", "Mejicanos", "Soyapango", "Delgado"],
  "La Libertad": ["Santa Tecla", "Antiguo Cuscatlán", "Nuevo Cuscatlán", "La Libertad"],
  "Santa Ana": ["Santa Ana", "Metapán", "Chalchuapa", "Coatepeque"],
  Sonsonate: ["Sonsonate", "Acajutla", "Izalco", "Nahuizalco"],
  Ahuachapán: ["Ahuachapán", "Atiquizaya", "Tacuba", "Guaymango"],
}

const giros = [
  "Comercio al por menor",
  "Servicios profesionales",
  "Manufactura",
  "Construcción",
  "Transporte",
  "Agricultura",
  "Tecnología",
  "Educación",
]

export function CustomerSelection({ saleData, setSaleData }: CustomerSelectionProps) {
  const [customerType, setCustomerType] = useState<"search" | "factura" | "credito-fiscal" | "default">("search")
  const [searchForm, setSearchForm] = useState({
    nombre: "",
    dui: "",
    nit: "",
    email: "",
  })
  const [searchResults, setSearchResults] = useState(mockCustomers)
  const [newCustomerForm, setNewCustomerForm] = useState({
    nombre: "",
    email: "",
    registroFiscal: "",
    nit: "",
    giro: "",
    telefono: "",
    departamento: "",
    municipio: "",
    distrito: "",
    direccion: "",
  })

  const handleSearch = () => {
    let filtered = mockCustomers

    if (searchForm.nombre) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(searchForm.nombre.toLowerCase()))
    }
    if (searchForm.dui) {
      filtered = filtered.filter((c) => c.dui?.includes(searchForm.dui))
    }
    if (searchForm.nit) {
      filtered = filtered.filter((c) => c.nit?.includes(searchForm.nit))
    }
    if (searchForm.email) {
      filtered = filtered.filter((c) => c.email?.toLowerCase().includes(searchForm.email.toLowerCase()))
    }

    setSearchResults(filtered)
  }

  const selectExistingCustomer = (customer: any) => {
    setSaleData({
      ...saleData,
      customer: { ...customer, type: "existing" },
    })
  }

  const createNewCustomer = () => {
    if (customerType === "factura") {
      if (!newCustomerForm.nombre || !newCustomerForm.email) return

      const customer: Customer = {
        name: newCustomerForm.nombre,
        email: newCustomerForm.email,
        type: "factura",
      }
      setSaleData({ ...saleData, customer })
    } else if (customerType === "credito-fiscal") {
      if (
        !newCustomerForm.nombre ||
        !newCustomerForm.registroFiscal ||
        !newCustomerForm.nit ||
        !newCustomerForm.giro ||
        !newCustomerForm.telefono ||
        !newCustomerForm.departamento ||
        !newCustomerForm.municipio ||
        !newCustomerForm.distrito ||
        !newCustomerForm.direccion
      ) {
        return
      }

      const customer: Customer = {
        name: newCustomerForm.nombre,
        registroFiscal: newCustomerForm.registroFiscal,
        nit: newCustomerForm.nit,
        giro: newCustomerForm.giro,
        telefono: newCustomerForm.telefono,
        departamento: newCustomerForm.departamento,
        municipio: newCustomerForm.municipio,
        distrito: newCustomerForm.distrito,
        direccion: newCustomerForm.direccion,
        type: "credito-fiscal",
      }
      setSaleData({ ...saleData, customer })
    }
  }

  const selectDefaultCustomer = () => {
    const customer: Customer = {
      name: "Consumidor final",
      type: "default",
    }
    setSaleData({ ...saleData, customer })
  }

  const clearCustomer = () => {
    setSaleData({ ...saleData, customer: null })
    setNewCustomerForm({
      nombre: "",
      email: "",
      registroFiscal: "",
      nit: "",
      giro: "",
      telefono: "",
      departamento: "",
      municipio: "",
      distrito: "",
      direccion: "",
    })
  }

  return (
    <div className="space-y-6">
      {saleData.customer && (
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente seleccionado
              </span>
              <Button variant="outline" size="sm" onClick={clearCustomer}>
                Cambiar cliente
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{saleData.customer.type}</Badge>
                <span className="font-semibold">{saleData.customer.name}</span>
              </div>
              {saleData.customer.email && <p className="text-sm text-muted-foreground">{saleData.customer.email}</p>}
              {saleData.customer.nit && <p className="text-sm text-muted-foreground">NIT: {saleData.customer.nit}</p>}
              {saleData.customer.dui && <p className="text-sm text-muted-foreground">DUI: {saleData.customer.dui}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {!saleData.customer && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar tipo de cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={customerType} onValueChange={(value: any) => setCustomerType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="search" id="search" />
                  <Label htmlFor="search">Buscar cliente existente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="factura" id="factura" />
                  <Label htmlFor="factura">Nuevo cliente - Factura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credito-fiscal" id="credito-fiscal" />
                  <Label htmlFor="credito-fiscal">Nuevo cliente - Crédito Fiscal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default">Consumidor final</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {customerType === "search" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="search-nombre">Nombre</Label>
                    <Input
                      id="search-nombre"
                      value={searchForm.nombre}
                      onChange={(e) => setSearchForm({ ...searchForm, nombre: e.target.value })}
                      placeholder="Buscar por nombre..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="search-dui">DUI</Label>
                    <Input
                      id="search-dui"
                      value={searchForm.dui}
                      onChange={(e) => setSearchForm({ ...searchForm, dui: e.target.value })}
                      placeholder="12345678-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="search-nit">NIT</Label>
                    <Input
                      id="search-nit"
                      value={searchForm.nit}
                      onChange={(e) => setSearchForm({ ...searchForm, nit: e.target.value })}
                      placeholder="1234-567890-123-4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="search-email">Correo electrónico</Label>
                    <Input
                      id="search-email"
                      type="email"
                      value={searchForm.email}
                      onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 mb-4">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Resultados de búsqueda</h3>
                    {searchResults.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{customer.name}</h4>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                          <div className="flex gap-2 mt-1">
                            {customer.dui && <Badge variant="outline">DUI: {customer.dui}</Badge>}
                            {customer.nit && <Badge variant="outline">NIT: {customer.nit}</Badge>}
                          </div>
                        </div>
                        <Button
                          onClick={() => selectExistingCustomer(customer)}
                          className="bg-secondary hover:bg-secondary/90"
                        >
                          Seleccionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {customerType === "factura" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Nuevo cliente - Factura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="factura-nombre">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="factura-nombre"
                      value={newCustomerForm.nombre}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, nombre: e.target.value })}
                      placeholder="Nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="factura-email">
                      Correo electrónico <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="factura-email"
                      type="email"
                      value={newCustomerForm.email}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                      placeholder="cliente@email.com"
                      required
                    />
                  </div>
                </div>
                <Button
                  onClick={createNewCustomer}
                  disabled={!newCustomerForm.nombre || !newCustomerForm.email}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear cliente
                </Button>
              </CardContent>
            </Card>
          )}

          {customerType === "credito-fiscal" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Nuevo cliente - Crédito Fiscal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="cf-nombre">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cf-nombre"
                      value={newCustomerForm.nombre}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, nombre: e.target.value })}
                      placeholder="Nombre o razón social"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cf-registro">
                      Registro Fiscal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cf-registro"
                      value={newCustomerForm.registroFiscal}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, registroFiscal: e.target.value })}
                      placeholder="Número de registro fiscal"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cf-nit">
                      NIT <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cf-nit"
                      value={newCustomerForm.nit}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, nit: e.target.value })}
                      placeholder="1234-567890-123-4"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cf-giro">
                      Giro / Actividad Económica <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={newCustomerForm.giro}
                      onValueChange={(value) => setNewCustomerForm({ ...newCustomerForm, giro: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar giro" />
                      </SelectTrigger>
                      <SelectContent>
                        {giros.map((giro) => (
                          <SelectItem key={giro} value={giro}>
                            {giro}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cf-telefono">
                      Teléfono <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cf-telefono"
                      value={newCustomerForm.telefono}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, telefono: e.target.value })}
                      placeholder="2234-5678"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cf-departamento">
                      Departamento <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={newCustomerForm.departamento}
                      onValueChange={(value) => {
                        setNewCustomerForm({ ...newCustomerForm, departamento: value, municipio: "" })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cf-municipio">
                      Municipio <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={newCustomerForm.municipio}
                      onValueChange={(value) => setNewCustomerForm({ ...newCustomerForm, municipio: value })}
                      disabled={!newCustomerForm.departamento}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {newCustomerForm.departamento &&
                          municipios[newCustomerForm.departamento as keyof typeof municipios]?.map((mun) => (
                            <SelectItem key={mun} value={mun}>
                              {mun}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cf-distrito">
                      Distrito <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cf-distrito"
                      value={newCustomerForm.distrito}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, distrito: e.target.value })}
                      placeholder="Nombre del distrito"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="cf-direccion">
                    Dirección <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="cf-direccion"
                    value={newCustomerForm.direccion}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, direccion: e.target.value })}
                    placeholder="Dirección completa"
                    required
                  />
                </div>
                <Button
                  onClick={createNewCustomer}
                  disabled={
                    !newCustomerForm.nombre ||
                    !newCustomerForm.registroFiscal ||
                    !newCustomerForm.nit ||
                    !newCustomerForm.giro ||
                    !newCustomerForm.telefono ||
                    !newCustomerForm.departamento ||
                    !newCustomerForm.municipio ||
                    !newCustomerForm.distrito ||
                    !newCustomerForm.direccion
                  }
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear cliente
                </Button>
              </CardContent>
            </Card>
          )}

          {customerType === "default" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cliente por defecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Consumidor final</h4>
                    <p className="text-sm text-muted-foreground">Cliente genérico para ventas sin datos específicos</p>
                  </div>
                  <Button onClick={selectDefaultCustomer} className="bg-secondary hover:bg-secondary/90">
                    Seleccionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
