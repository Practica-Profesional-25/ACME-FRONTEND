"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, QrCode, Printer, RefreshCw, AlertCircle } from "lucide-react"
import type { SaleData } from "../sales-wizard"

interface SaleStatusProps {
  saleData: SaleData
  setSaleData: (data: SaleData) => void
}

export function SaleStatus({ saleData, setSaleData }: SaleStatusProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [dteNumber, setDteNumber] = useState("")

  useEffect(() => {
    // Simulate sale processing when component mounts
    if (saleData.status === "pending") {
      setIsProcessing(true)

      // Simulate processing time
      setTimeout(() => {
        // Randomly determine if sale is successful (90% success rate)
        const isSuccessful = Math.random() > 0.1

        if (isSuccessful) {
          const dteNum = `DTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          const qrData = `https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGeneracion=${dteNum}&fechaEmi=${new Date().toISOString().split("T")[0]}`

          setDteNumber(dteNum)
          setQrCode(qrData)
          setSaleData({
            ...saleData,
            status: "efectuada",
          })
        } else {
          setSaleData({
            ...saleData,
            status: "rechazada",
            rejectionReason: "Error en la conexión con el Ministerio de Hacienda",
          })
        }

        setIsProcessing(false)
      }, 3000)
    }
  }, [])

  const handleRetry = () => {
    setIsProcessing(true)
    setSaleData({
      ...saleData,
      status: "pending",
      rejectionReason: undefined,
    })

    setTimeout(() => {
      const isSuccessful = Math.random() > 0.1

      if (isSuccessful) {
        const dteNum = `DTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        const qrData = `https://admin.factura.gob.sv/consultaPublica?ambiente=00&codGeneracion=${dteNum}&fechaEmi=${new Date().toISOString().split("T")[0]}`

        setDteNumber(dteNum)
        setQrCode(qrData)
        setSaleData({
          ...saleData,
          status: "efectuada",
        })
      } else {
        setSaleData({
          ...saleData,
          status: "rechazada",
          rejectionReason: "Error en la validación de datos tributarios",
        })
      }

      setIsProcessing(false)
    }, 2000)
  }

  const handlePrint = () => {
    // Simulate printing
    window.print()
  }

  const handleNewSale = () => {
    // Reset the entire sale data for a new transaction
    setSaleData({
      products: [],
      customer: null,
      paymentMethod: null,
      paymentDetails: null,
      status: "pending",
    })

    // This would typically navigate back to step 1
    window.location.reload()
  }

  const totalAmount = saleData.products.reduce((sum, product) => sum + product.total, 0)

  return (
    <div className="space-y-6">
      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">Procesando venta...</h3>
                <p className="text-muted-foreground">Enviando información al Ministerio de Hacienda</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sale Result */}
      {!isProcessing && (
        <Card className={saleData.status === "efectuada" ? "border-secondary" : "border-destructive"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {saleData.status === "efectuada" ? (
                <>
                  <CheckCircle className="h-6 w-6 text-secondary" />
                  Resultado de la venta
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  Resultado de la venta
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Estado:</Label>
                <Badge
                  variant={saleData.status === "efectuada" ? "default" : "destructive"}
                  className={saleData.status === "efectuada" ? "bg-secondary" : ""}
                >
                  {saleData.status === "efectuada" ? "Efectuada" : "Rechazada"}
                </Badge>
              </div>

              {saleData.status === "rechazada" && (
                <div className="space-y-2">
                  <Label>Razón del rechazo:</Label>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <p className="text-sm">{saleData.rejectionReason}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="mt-4 bg-transparent"
                    disabled={isProcessing}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar venta
                  </Button>
                </div>
              )}

              {saleData.status === "efectuada" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Número DTE:</Label>
                      <p className="font-mono text-sm bg-muted p-2 rounded">{dteNumber}</p>
                    </div>
                    <div>
                      <Label>Monto total:</Label>
                      <p className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Cliente:</Label>
                    <p className="text-sm">{saleData.customer?.name}</p>
                  </div>

                  <div>
                    <Label>Método de pago:</Label>
                    <Badge variant="outline">{saleData.paymentMethod === "efectivo" ? "Efectivo" : "Tarjeta"}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code for DTE */}
      {saleData.status === "efectuada" && qrCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              DTE emitido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                    alt="QR Code DTE"
                    className="w-48 h-48"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Escanea el QR para acceder al documento en el Ministerio de Hacienda
              </p>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono break-all">{qrCode}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {saleData.status === "efectuada" && (
        <Card>
          <CardHeader>
            <CardTitle>Opciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir comprobante
              </Button>
              <Button onClick={handleNewSale} variant="outline">
                Nueva venta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sale Summary for Successful Transactions */}
      {saleData.status === "efectuada" && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de la transacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Productos vendidos:</Label>
                <p className="font-semibold">{saleData.products.length} artículos</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cantidad total:</Label>
                <p className="font-semibold">{saleData.products.reduce((sum, p) => sum + p.quantity, 0)} unidades</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Impuestos cobrados:</Label>
                <p className="font-semibold">${saleData.products.reduce((sum, p) => sum + p.tax, 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
