"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Package, Users, LogOut, User, Building2 } from "lucide-react"
import { SalesWizard } from "./sales-wizard"
import { ProductManagement } from "./screens/product-management"
import { CustomerManagement } from "./screens/customer-management"
import { SalesMain } from "./screens/sales-main"
import { redirect } from "next/navigation"

type Screen = "ventas" | "productos" | "clientes" | "wizard" | "logout"

export function AdventureWorksApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("ventas")
  const [isInSaleProcess, setIsInSaleProcess] = useState(false)

  // Mock user and branch data
  const user = { nombre: "Juan Pérez" }
  const sucursal = { nombre: "Sucursal Centro" }

  const sidebarOptions = [
    { label: "Ventas", value: "ventas" as Screen, icon: ShoppingCart },
    { label: "Productos", value: "productos" as Screen, icon: Package },
    { label: "Clientes", value: "clientes" as Screen, icon: Users },
    { label: "Cerrar sesión", value: "logout" as Screen, icon: LogOut },
  ]

  const handleSidebarClick = (value: Screen) => {
    if (isInSaleProcess && (value === "productos" || value === "clientes" || value === "logout")) {
      return // Disabled during sale process
    }

    if(value === 'logout') {
      redirect('/auth/logout')
    }

    setCurrentScreen(value)
    setIsInSaleProcess(false)
  }

  const startSaleProcess = () => {
    setCurrentScreen("wizard")
    setIsInSaleProcess(true)
  }

  const completeSaleProcess = () => {
    setCurrentScreen("ventas")
    setIsInSaleProcess(false)
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "ventas":
        return <SalesMain onStartSale={startSaleProcess} />
      case "productos":
        return <ProductManagement />
      case "clientes":
        return <CustomerManagement />
      case "wizard":
        return <SalesWizard onComplete={completeSaleProcess} />
      default:
        return <SalesMain onStartSale={startSaleProcess} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Adventure Works</h1>
          <p className="text-sm text-muted-foreground">Sistema de Ventas</p>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarOptions.map((option) => {
            const isDisabled =
              isInSaleProcess &&
              (option.value === "productos" || option.value === "clientes" || option.value === "logout")
            const isActive = currentScreen === option.value || (isInSaleProcess && option.value === "ventas")

            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : isActive ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleSidebarClick(option.value)}
                disabled={isDisabled}
              >
                <option.icon className="h-4 w-4 mr-2" />
                {option.label}
              </Button>
            )
          })}
        </nav>

        {isInSaleProcess && (
          <div className="px-4 mt-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm font-medium">Venta en proceso</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">Algunas opciones están deshabilitadas</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Cajero:</span>{" "}
                  <span className="font-medium">{user.nombre}</span>
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Sucursal:</span>{" "}
                  <span className="font-medium">{sucursal.nombre}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Sistema Activo
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">{renderCurrentScreen()}</main>
      </div>
    </div>
  )
}
