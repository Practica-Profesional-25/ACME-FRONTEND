"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Calendar, User, DollarSign, FileText, Loader2, CreditCard, Package } from "lucide-react"
import { getSaleById } from "@/lib/api"
import type { ApiSale, CustomerData, PaymentDetails } from "@/lib/types"

interface SaleDetailsDialogProps {
  saleId: string
  children?: React.ReactNode
}

export function SaleDetailsDialog({ saleId, children }: SaleDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [saleDetails, setSaleDetails] = useState<ApiSale | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenDialog = async () => {
    if (!open) {
      setLoading(true)
      setError(null)
      try {
        const response = await getSaleById(saleId)
        if (response.success) {
          setSaleDetails(response.data)
        } else {
          setError("Error al cargar los detalles de la venta")
        }
      } catch (error) {
        console.error('Error al obtener detalles de la venta:', error)
        setError("Error al cargar los detalles de la venta")
      } finally {
        setLoading(false)
      }
    }
    setOpen(!open)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'efectuada':
      case 'completada':
      case 'completed':
        return 'default'
      case 'pendiente':
      case 'pending':
        return 'secondary'
      case 'rechazada':
      case 'cancelada':
      case 'rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

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
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const parseCustomerData = (customerDataString: string): CustomerData | null => {
    try {
      return JSON.parse(customerDataString)
    } catch {
      return null
    }
  }

  const parsePaymentDetails = (paymentDetailsString: string): PaymentDetails | null => {
    try {
      return JSON.parse(paymentDetailsString)
    } catch {
      return null
    }
  }

  const parseProductSnapshot = (productSnapshotString: string) => {
    try {
      return JSON.parse(productSnapshotString)
    } catch {
      return null
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'efectivo':
        return 'Efectivo'
      case 'tarjeta':
        return 'Tarjeta'
      case 'transferencia':
        return 'Transferencia'
      default:
        return method
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpenDialog}>
        {children || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles de la Venta
          </DialogTitle>
          <DialogDescription>
            Información completa de la venta seleccionada
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando detalles...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {saleDetails && !loading && (
          <div className="space-y-6">
            {/* Información principal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Información General</span>
                  <Badge variant={getStatusBadgeVariant(saleDetails.status || saleDetails.estado || 'pending')}>
                    {saleDetails.status || saleDetails.estado || 'Pendiente'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Número de Venta:</span>
                    </div>
                    <p className="text-lg font-mono bg-muted px-3 py-2 rounded">
                      {saleDetails.numero}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Fecha:</span>
                    </div>
                    <p className="text-lg">
                      {formatDate(saleDetails.fecha)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cliente:</span>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    {(() => {
                      const customerData = parseCustomerData(saleDetails.customerData)
                      if (customerData) {
                        return (
                          <div className="space-y-1">
                            <p className="font-medium">{customerData.name}</p>
                            {customerData.email && (
                              <p className="text-sm text-muted-foreground">{customerData.email}</p>
                            )}
                            <p className="text-xs text-muted-foreground">Tipo: {customerData.type}</p>
                          </div>
                        )
                      }
                      return <p>{saleDetails.cliente || 'Consumidor Final'}</p>
                    })()}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Subtotal:</span>
                    <p className="text-lg font-semibold">
                      {formatCurrency(saleDetails.subtotal)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Impuestos:</span>
                    <p className="text-lg font-semibold">
                      {formatCurrency(saleDetails.impuestos)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total:</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(saleDetails.total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Método:</span>
                    <Badge variant="outline">
                      {getPaymentMethodLabel(saleDetails.paymentMethod)}
                    </Badge>
                  </div>
                  {(() => {
                     const paymentDetails = parsePaymentDetails(saleDetails.paymentDetails)
                     if (paymentDetails) {
                       return (
                         <div className="bg-muted p-3 rounded space-y-2">
                           {paymentDetails.cashAmount !== undefined && (
                             <div className="flex justify-between">
                               <span className="text-sm">Cantidad recibida:</span>
                               <span className="text-sm font-medium">{formatCurrency(paymentDetails.cashAmount)}</span>
                             </div>
                           )}
                           {paymentDetails.change !== undefined && (
                             <div className="flex justify-between">
                               <span className="text-sm">Vuelto:</span>
                               <span className="text-sm font-medium">{formatCurrency(paymentDetails.change)}</span>
                             </div>
                           )}
                           {paymentDetails.posStatus && (
                             <div className="flex justify-between">
                               <span className="text-sm">Estado POS:</span>
                               <Badge variant={paymentDetails.posStatus === 'processed' ? 'default' : 'secondary'} className="text-xs">
                                 {paymentDetails.posStatus === 'ready' ? 'Listo' : 
                                  paymentDetails.posStatus === 'processing' ? 'Procesando' : 'Procesado'}
                               </Badge>
                             </div>
                           )}
                           {paymentDetails.cardType && (
                             <div className="flex justify-between">
                               <span className="text-sm">Tipo de tarjeta:</span>
                               <span className="text-sm font-medium">{paymentDetails.cardType}</span>
                             </div>
                           )}
                           {paymentDetails.transactionId && (
                             <div className="flex justify-between">
                               <span className="text-sm">ID de transacción:</span>
                               <span className="text-sm font-mono">{paymentDetails.transactionId}</span>
                             </div>
                           )}
                         </div>
                       )
                     }
                     return null
                   })()}
                </div>
              </CardContent>
            </Card>

            {/* Productos */}
            {saleDetails.products && saleDetails.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos ({saleDetails.products.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Impuesto</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saleDetails.products.map((product) => {
                        const productData = parseProductSnapshot(product.productSnapshot)
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {productData?.nombre || `Producto ${product.productId}`}
                                </p>
                                {productData?.identificador && (
                                  <p className="text-xs text-muted-foreground">
                                    ID: {productData.identificador}
                                  </p>
                                )}
                                {productData?.categoria && (
                                  <p className="text-xs text-muted-foreground">
                                    {productData.categoria} - {productData.subcategoria}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{product.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.subtotal)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.tax)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(product.total)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Información técnica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">ID de Venta:</span>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {saleDetails.id}
                    </p>
                  </div>
                  
                  {saleDetails.customerId && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">ID de Cliente:</span>
                      <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {saleDetails.customerId}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Fecha de Creación:</span>
                    <p className="text-sm">
                      {formatDate(saleDetails.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Última Actualización:</span>
                    <p className="text-sm">
                      {formatDate(saleDetails.updatedAt)}
                    </p>
                  </div>
                </div>

                {saleDetails.dteNumber && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Número DTE:</span>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {saleDetails.dteNumber}
                    </p>
                  </div>
                )}

                {saleDetails.rejectionReason && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-destructive">Razón de Rechazo:</span>
                    <p className="text-sm bg-destructive/10 px-3 py-2 rounded border border-destructive/20">
                      {saleDetails.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones adicionales */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
              <Button 
                onClick={() => {
                  // Generar URL del QR para el DTE
                  const qrData = saleDetails.qrCode || `https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGeneracion=DTE-${saleDetails.id}&fechaEmi=${saleDetails.fecha}`
                  const customerData = parseCustomerData(saleDetails.customerData)
                  
                  // Abrir en nueva ventana
                  const newWindow = window.open('', '_blank')
                  if (newWindow) {
                    newWindow.document.write(`
                      <html>
                        <head>
                          <title>DTE - ${saleDetails.numero}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                            .header { margin-bottom: 30px; }
                            .qr-container { margin: 20px 0; }
                            .details { text-align: left; max-width: 500px; margin: 0 auto; }
                            .details div { margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
                            .products { margin: 20px 0; }
                            .products table { width: 100%; border-collapse: collapse; }
                            .products th, .products td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            .products th { background-color: #f2f2f2; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>Documento Tributario Electrónico</h1>
                            <h2>Venta ${saleDetails.numero}</h2>
                          </div>
                          <div class="details">
                            <div><strong>Cliente:</strong> ${customerData?.name || saleDetails.cliente || 'Consumidor Final'}</div>
                            ${customerData?.email ? `<div><strong>Email:</strong> ${customerData.email}</div>` : ''}
                            <div><strong>Método de Pago:</strong> ${getPaymentMethodLabel(saleDetails.paymentMethod)}</div>
                            ${(() => {
                              const paymentDetails = parsePaymentDetails(saleDetails.paymentDetails)
                              if (paymentDetails) {
                                let paymentInfo = ''
                                if (paymentDetails.cashAmount !== undefined) {
                                  paymentInfo += `<div><strong>Cantidad Recibida:</strong> ${formatCurrency(paymentDetails.cashAmount)}</div>`
                                }
                                if (paymentDetails.change !== undefined) {
                                  paymentInfo += `<div><strong>Vuelto:</strong> ${formatCurrency(paymentDetails.change)}</div>`
                                }
                                if (paymentDetails.posStatus) {
                                  const statusLabel = paymentDetails.posStatus === 'ready' ? 'Listo' : 
                                                     paymentDetails.posStatus === 'processing' ? 'Procesando' : 'Procesado'
                                  paymentInfo += `<div><strong>Estado POS:</strong> ${statusLabel}</div>`
                                }
                                return paymentInfo
                              }
                              return ''
                            })()}
                            <div><strong>Subtotal:</strong> ${formatCurrency(saleDetails.subtotal)}</div>
                            <div><strong>Impuestos:</strong> ${formatCurrency(saleDetails.impuestos)}</div>
                            <div><strong>Total:</strong> ${formatCurrency(saleDetails.total)}</div>
                            <div><strong>Fecha:</strong> ${formatDate(saleDetails.fecha)}</div>
                            <div><strong>Estado:</strong> ${saleDetails.status || saleDetails.estado || 'Pendiente'}</div>
                            ${saleDetails.dteNumber ? `<div><strong>Número DTE:</strong> ${saleDetails.dteNumber}</div>` : ''}
                          </div>
                          ${saleDetails.products && saleDetails.products.length > 0 ? `
                            <div class="products">
                              <h3>Productos</h3>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${saleDetails.products.map(product => {
                                    const productData = parseProductSnapshot(product.productSnapshot)
                                    return `
                                      <tr>
                                        <td>${productData?.nombre || `Producto ${product.productId}`}</td>
                                        <td>${product.quantity}</td>
                                        <td>${formatCurrency(product.unitPrice)}</td>
                                        <td>${formatCurrency(product.total)}</td>
                                      </tr>
                                    `
                                  }).join('')}
                                </tbody>
                              </table>
                            </div>
                          ` : ''}
                          <div class="qr-container">
                            <p>Código QR para verificación:</p>
                            <div style="margin: 20px 0; padding: 20px; border: 2px dashed #ccc;">
                              <p style="font-size: 12px; color: #666;">
                                QR Code: ${qrData}
                              </p>
                            </div>
                          </div>
                          <button onclick="window.print()" style="padding: 10px 20px; margin: 10px;">Imprimir</button>
                          <button onclick="window.close()" style="padding: 10px 20px; margin: 10px;">Cerrar</button>
                        </body>
                      </html>
                    `)
                    newWindow.document.close()
                  }
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar DTE
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}