"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/api";
import type {
  ApiCustomer,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/lib/types";

export function CustomerManagement() {
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ApiCustomer | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dui: "",
    nit: "",
    email: "",
    telefono: "",
    direccion: "",
    registroFiscal: "",
    giro: "",
  });

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al cargar los clientes. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email &&
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.dui && customer.dui.includes(searchTerm)) ||
      (customer.nit && customer.nit.includes(searchTerm))
  );

  const handleCreate = () => {
    setEditingCustomer(null);
    setFormData({
      nombre: "",
      dui: "",
      nit: "",
      email: "",
      telefono: "",
      direccion: "",
      registroFiscal: "",
      giro: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (customer: ApiCustomer) => {
    setEditingCustomer(customer);
    setFormData({
      nombre: customer.nombre,
      dui: customer.dui || "",
      nit: customer.nit || "",
      email: customer.email || "",
      telefono: customer.telefono || "",
      direccion: customer.direccion || "",
      registroFiscal: customer.registroFiscal || "",
      giro: customer.giro || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.email) {
      setError("Nombre y correo electrónico son campos obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingCustomer) {
        // Actualizar cliente existente
        const updateData: UpdateCustomerRequest = {
          nombre: formData.nombre,
          email: formData.email,
          dui: formData.dui || undefined,
          nit: formData.nit || undefined,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          registroFiscal: formData.registroFiscal || undefined,
          giro: formData.giro || undefined,
          tipo: "Natural",
        };

        const response = await updateCustomer(editingCustomer.id, updateData);
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id ? response.data : c
          )
        );
      } else {
        // Crear nuevo cliente
        const createData: CreateCustomerRequest = {
          nombre: formData.nombre,
          email: formData.email,
          dui: formData.dui || undefined,
          nit: formData.nit || undefined,
          telefono: formData.telefono || undefined,
          direccion: formData.direccion || undefined,
          registroFiscal: formData.registroFiscal || undefined,
          giro: formData.giro || undefined,
          tipo: "Natural",
        };

        await createCustomer(createData);
        await loadCustomers();
      }

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      setError("Error al guardar el cliente. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este cliente?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteCustomer(customerId);
      setCustomers(customers.filter((c) => c.id !== customerId));
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setError("Error al eliminar el cliente. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTypeBadge = (tipo: string) => {
    return (
      <Badge className="bg-secondary text-secondary-foreground">{tipo}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Mantenimiento de clientes
          </h1>
          <p className="text-muted-foreground">
            Gestión de la base de datos de clientes
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo cliente
        </Button>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                disabled={loading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && customers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando clientes...</span>
            </div>
          ) : (
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
                    <TableCell className="font-medium">
                      {customer.nombre}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.dui || "N/A"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.nit || "N/A"}
                    </TableCell>
                    <TableCell>{customer.email || "N/A"}</TableCell>
                    <TableCell>{customer.telefono || "N/A"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {customer.direccion || "N/A"}
                    </TableCell>
                    <TableCell>{getCustomerTypeBadge(customer.tipo)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Customer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Editar cliente" : "Nuevo cliente"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="cliente@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dui">DUI</Label>
                <Input
                  id="dui"
                  value={formData.dui}
                  onChange={(e) =>
                    setFormData({ ...formData, dui: e.target.value })
                  }
                  placeholder="12345678-9"
                />
              </div>
              <div>
                <Label htmlFor="nit">NIT</Label>
                <Input
                  id="nit"
                  value={formData.nit}
                  onChange={(e) =>
                    setFormData({ ...formData, nit: e.target.value })
                  }
                  placeholder="1234-567890-123-4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="2234-5678"
                />
              </div>
              <div>
                <Label htmlFor="registroFiscal">Registro Fiscal</Label>
                <Input
                  id="registroFiscal"
                  value={formData.registroFiscal}
                  onChange={(e) =>
                    setFormData({ ...formData, registroFiscal: e.target.value })
                  }
                  placeholder="Número de registro fiscal"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="giro">Giro</Label>
              <Input
                id="giro"
                value={formData.giro}
                onChange={(e) =>
                  setFormData({ ...formData, giro: e.target.value })
                }
                placeholder="Actividad comercial"
              />
            </div>

            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                placeholder="Dirección completa"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
                disabled={!formData.nombre || !formData.email || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {loading
                  ? "Guardando..."
                  : editingCustomer
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
