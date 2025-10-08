"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProductSelection } from "./steps/product-selection"
import { CustomerSelection } from "./steps/customer-selection"
import { PurchaseSummary } from "./steps/purchase-summary"
import { SaleStatus } from "./steps/sale-status"

export interface Product {
  id: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  tax: number
  total: number
}

export interface Customer {
  id?: string
  name: string
  email?: string
  dui?: string
  nit?: string
  registroFiscal?: string
  giro?: string
  telefono?: string
  departamento?: string
  municipio?: string
  distrito?: string
  direccion?: string
  type: "existing" | "factura" | "credito-fiscal" | "default"
}

export interface SaleData {
  products: Product[]
  customer: Customer | null
  paymentMethod: "efectivo" | "tarjeta" | null
  paymentDetails: any
  status: "pending" | "efectuada" | "rechazada"
  rejectionReason?: string
}

export interface SalesWizardProps {
  onComplete?: () => void
}

export function SalesWizard({ onComplete }: SalesWizardProps) {
  const steps = [
    { id: 1, name: "Selección de Productos", component: ProductSelection },
    { id: 2, name: "Selección de Cliente", component: CustomerSelection },
    { id: 3, name: "Resumen de Compra", component: PurchaseSummary },
    { id: 4, name: "Estado de la Venta", component: SaleStatus },
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [saleData, setSaleData] = useState<SaleData>({
    products: [],
    customer: null,
    paymentMethod: null,
    paymentDetails: null,
    status: "pending",
  })

  const progress = (currentStep / steps.length) * 100
  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === steps.length && onComplete) {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return saleData.products.length > 0
      case 2:
        return saleData.customer !== null
      case 3:
        return saleData.paymentMethod !== null
      default:
        return true
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Adventure Works - Proceso de Venta</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Paso {currentStep} de {steps.length}
              </span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm font-medium">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`${
                    step.id === currentStep
                      ? "text-primary"
                      : step.id < currentStep
                        ? "text-secondary"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          {CurrentStepComponent && <CurrentStepComponent saleData={saleData} setSaleData={setSaleData} />}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length || !canProceed()}
          className="bg-primary hover:bg-primary/90"
        >
          {currentStep === steps.length ? "Finalizar" : "Siguiente"}
        </Button>
      </div>
    </div>
  )
}
