"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, User, CreditCard, Banknote, CheckCircle } from "lucide-react"
import type { SaleData } from "../sales-wizard"

interface PurchaseSummaryProps {
  saleData: SaleData
  setSaleData: (data: SaleData) => void
}

export function PurchaseSummary({ saleData, setSaleData }: PurchaseSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | null>(null)
  const [cashAmount, setCashAmount] = useState("")
  const [posStatus, setPosStatus] = useState<"ready" | "processed">("ready")

  const totalAmount = saleData.products.reduce((sum, product) => sum + product.total, 0)
  const subtotalAmount = saleData.products.reduce((sum, product) => sum + product.subtotal, 0)
  const taxAmount = saleData.products.reduce((sum, product) => sum + product.tax, 0)
  const change = cashAmount ? Math.max(0, Number.parseFloat(cashAmount) - totalAmount) : 0

  useEffect(() => {
    if (paymentMethod === "efectivo") {
      setSaleData({
        ...saleData,
        paymentMethod,
        paymentDetails: {
          cashAmount: Number.parseFloat(cashAmount) || 0,
          change,
        },
      })
    } else if (paymentMethod === "tarjeta") {
      setSaleData({
        ...saleData,
        paymentMethod,
        paymentDetails: {
          posStatus,
        },
      })
    }
  }, [paymentMethod, cashAmount, change, posStatus])

  const getDocumentType = () => {
    if (!saleData.customer) return "N/A"
    switch (saleData.customer.type) {
      case "credito-fiscal":
        return "Crédito Fiscal"
      case "factura":
        return "Factura"
      case "default":
        return "Ticket de Venta"
      case "existing":
        return saleData.customer.nit ? "Crédito Fiscal" : "Factura"
      default:
        return "Factura"
    }
  }

  const simulateCardPayment = () => {
    setPosStatus("processed")
    setTimeout(() => {
      setPosStatus("ready")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Detalle de productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio unitario</TableHead>
                <TableHead>Impuesto</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saleData.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>${product.tax.toFixed(2)}</TableCell>
                  <TableCell>${product.subtotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (13% IVA):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer and Document Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Cliente y documento tributario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Cliente seleccionado</Label>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{saleData.customer?.type || "N/A"}</Badge>
                  <span className="font-medium">{saleData.customer?.name || "No seleccionado"}</span>
                </div>
                {saleData.customer?.email && (
                  <p className="text-sm text-muted-foreground mt-1">{saleData.customer.email}</p>
                )}
                {saleData.customer?.nit && (
                  <p className="text-sm text-muted-foreground">NIT: {saleData.customer.nit}</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tipo de documento tributario</Label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">
                  {getDocumentType()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod || ""}
            onValueChange={(value: "efectivo" | "tarjeta") => setPaymentMethod(value)}
          >
            <div className="space-y-4">
              {/* Cash Payment */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="efectivo" id="efectivo" />
                <Label htmlFor="efectivo" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Efectivo
                </Label>
              </div>

              {paymentMethod === "efectivo" && (
                <Card className="ml-6">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cash-amount">
                          Monto entregado <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="cash-amount"
                          type="number"
                          step="0.01"
                          min={totalAmount}
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder={`Mínimo $${totalAmount.toFixed(2)}`}
                        />
                      </div>
                      <div>
                        <Label>Vuelto</Label>
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <span className="text-lg font-semibold text-secondary">${change.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {Number.parseFloat(cashAmount) < totalAmount && cashAmount && (
                      <p className="text-sm text-destructive mt-2">
                        El monto entregado debe ser mayor o igual al total de la venta
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Card Payment */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tarjeta" id="tarjeta" />
                <Label htmlFor="tarjeta" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Tarjeta
                </Label>
              </div>

              {paymentMethod === "tarjeta" && (
                <Card className="ml-6">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Estado de POS</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Badge
                            variant={posStatus === "ready" ? "secondary" : "default"}
                            className="flex items-center gap-2"
                          >
                            {posStatus === "ready" ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Listo para procesar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Venta procesada
                              </>
                            )}
                          </Badge>
                          {posStatus === "ready" && (
                            <Button
                              onClick={simulateCardPayment}
                              size="sm"
                              className="bg-secondary hover:bg-secondary/90"
                            >
                              Procesar pago
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>Monto a cobrar:</span>
                          <span className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </RadioGroup>

          {!paymentMethod && (
            <p className="text-sm text-muted-foreground mt-4">
              Seleccione un método de pago para continuar con la venta.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment Validation */}
      {paymentMethod === "efectivo" && Number.parseFloat(cashAmount) >= totalAmount && (
        <Card className="border-secondary">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Pago en efectivo validado correctamente</span>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "tarjeta" && posStatus === "processed" && (
        <Card className="border-secondary">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Pago con tarjeta procesado exitosamente</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
