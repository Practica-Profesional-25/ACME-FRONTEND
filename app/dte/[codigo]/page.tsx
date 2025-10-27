"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Search,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://acme.infoking.win/api";

interface DTEData {
  estadoDocumento: string;
  descripcionEstado: string;
  tipoDte: string;
  fechaHoraGeneracion: string;
  fechaHoraProcesamiento: string;
  codigoGeneracion: string;
  selloRecepcion: string;
  numeroControl: string;
  dteNumber: string;
  qrCode: string;
  montoTotal: number;
  ivaOperaciones: number;
  ivaPercibido: number;
  ivaRetenido: number;
  retencionRenta: number;
  totalValoresNoAfectos: number;
  totalAPagar: number;
  otrosTributos: number;
  documentoAjustado: boolean;
  status: string;
  saleNumber: string;
  fecha: string;
}

// Helper functions
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-SV", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

export default function DTEConsultaPage() {
  const params = useParams();
  const codigo = params.codigo as string;

  const [fechaGeneracion, setFechaGeneracion] = useState("");
  const [codigoGeneracion, setCodigoGeneracion] = useState("");
  const [ambiente, setAmbiente] = useState("01");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dteData, setDteData] = useState<DTEData | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Cargar DTE automáticamente si hay código en la URL
  useEffect(() => {
    if (codigo) {
      fetchDTEData(codigo);
    }
  }, [codigo]);

  const fetchDTEData = async (saleId: string) => {
    setIsLoading(true);
    setError("");
    setDteData(null);
    setShowResults(false);

    try {
      // Obtener los datos DTE directamente usando el ID de la venta
      const dteResponse = await fetch(`${API_BASE_URL}/sales/${saleId}/dte`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!dteResponse.ok) {
        throw new Error(
          `Error ${dteResponse.status}: ${dteResponse.statusText}`
        );
      }

      const dteResult = await dteResponse.json();

      setDteData(dteResult);
      setShowResults(true);
    } catch (err) {
      console.error("Error al consultar DTE:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al consultar el DTE. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDteData(null);
    setShowResults(false);

    if (!fechaGeneracion || !codigoGeneracion) {
      setError("Todos los campos son requeridos");
      return;
    }

    setIsLoading(true);

    try {
      // Buscar por código de generación en las ventas
      const response = await fetch(
        `${API_BASE_URL}/sales?codigoGeneracion=${codigoGeneracion}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const salesData = await response.json();

      if (
        !salesData.success ||
        !salesData.data ||
        salesData.data.length === 0
      ) {
        throw new Error("DTE no encontrado");
      }

      // Obtener el ID de la primera venta encontrada
      const saleId = salesData.data[0].id;

      // Usar la función fetchDTEData para obtener los datos
      await fetchDTEData(saleId);
    } catch (err) {
      console.error("Error al consultar DTE:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al consultar el DTE. Intente nuevamente."
      );
      setIsLoading(false);
    }
  };

  const handleNewConsulta = () => {
    setShowResults(false);
    setDteData(null);
    setError("");
    setFechaGeneracion("");
    setCodigoGeneracion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Consulta DTE
          </h1>
          <p className="text-gray-600">
            Sistema de Facturación DTES - Ministerio de Hacienda
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Consultando DTE...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar nuevamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {showResults && dteData && !isLoading && (
          <div className="space-y-6">
            {/* Success Header */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-green-700">
                    Resultado de consulta
                  </h2>
                </div>
              </CardContent>
            </Card>

            {/* DTE Details */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Estado del documento */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Estado del documento:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {dteData.estadoDocumento}
                    </p>
                  </div>

                  {/* Descripción del Estado */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Descripción del Estado:
                    </Label>
                    <p className="text-blue-600 font-medium">
                      {dteData.descripcionEstado}
                    </p>
                  </div>

                  {/* Tipo de DTE */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Tipo de DTE:
                    </Label>
                    <Badge className="bg-blue-600 text-white">
                      {dteData.tipoDte}
                    </Badge>
                  </div>

                  {/* Fecha y Hora de Generación */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Fecha y Hora de Generación:
                    </Label>
                    <p className="font-mono text-gray-900">
                      {formatDateTime(dteData.fechaHoraGeneracion)}
                    </p>
                  </div>

                  {/* Fecha y Hora de Procesamiento */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Fecha y Hora de Procesamiento:
                    </Label>
                    <p className="font-mono text-gray-900">
                      {formatDateTime(dteData.fechaHoraProcesamiento)}
                    </p>
                  </div>

                  {/* Código de Generación */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Código de Generación:
                    </Label>
                    <p className="font-mono text-gray-900">
                      {dteData.codigoGeneracion}
                    </p>
                  </div>

                  {/* Sello de Recepción */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Sello de Recepción:
                    </Label>
                    <p className="font-mono text-blue-600">
                      {dteData.selloRecepcion}
                    </p>
                  </div>

                  {/* Número de Control */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Número de Control:
                    </Label>
                    <p className="font-mono text-blue-600">
                      {dteData.numeroControl}
                    </p>
                  </div>

                  {/* Monto Total */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Monto Total:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.montoTotal)}
                    </p>
                  </div>

                  {/* IVA de las operaciones */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      IVA de las operaciones:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.ivaOperaciones)}
                    </p>
                  </div>

                  {/* IVA percibido */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      IVA percibido:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.ivaPercibido)}
                    </p>
                  </div>

                  {/* IVA retenido */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      IVA retenido:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.ivaRetenido)}
                    </p>
                  </div>

                  {/* Retención renta */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Retención renta:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.retencionRenta)}
                    </p>
                  </div>

                  {/* Total valores no afectos */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Total valores no afectos:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.totalValoresNoAfectos)}
                    </p>
                  </div>

                  {/* Total a pagar/Total de operación */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Total a pagar/Total de operación:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.totalAPagar)}
                    </p>
                  </div>

                  {/* Otros tributos */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Otros tributos:
                    </Label>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(dteData.otrosTributos)}
                    </p>
                  </div>

                  {/* Documento ajustado */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Documento ajustado:
                    </Label>
                    <p className="text-amber-600 font-medium">
                      {dteData.documentoAjustado
                        ? "Sí"
                        : "El documento no ha sido ajustado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Form - Solo mostrar si NO hay código en la URL */}
        {!codigo && !showResults && !isLoading && !error && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Consulta Pública de DTE
              </CardTitle>
              <CardDescription className="text-blue-100">
                Ingrese los datos solicitados para consultar el Documento
                Tributario Electrónico
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Alert */}
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    <strong>* Todos los campos son requeridos.</strong>
                  </AlertDescription>
                </Alert>

                {/* Ambiente */}
                <div className="space-y-2">
                  <Label
                    htmlFor="ambiente"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ambiente
                  </Label>
                  <select
                    id="ambiente"
                    value={ambiente}
                    onChange={(e) => setAmbiente(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="01">Producción (01)</option>
                    <option value="00">Pruebas (00)</option>
                  </select>
                </div>

                {/* Fecha de Generación */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fechaGeneracion"
                    className="text-sm font-medium text-gray-700"
                  >
                    Fecha de Generación *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="fechaGeneracion"
                      type="date"
                      value={fechaGeneracion}
                      onChange={(e) => setFechaGeneracion(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Código de Generación */}
                <div className="space-y-2">
                  <Label
                    htmlFor="codigoGeneracion"
                    className="text-sm font-medium text-gray-700"
                  >
                    Código de Generación *
                  </Label>
                  <Input
                    id="codigoGeneracion"
                    type="text"
                    value={codigoGeneracion}
                    onChange={(e) =>
                      setCodigoGeneracion(e.target.value.toUpperCase())
                    }
                    placeholder="Ej: D5B9B6D1-67C1-4FCE-BF64-20EFC4F46703"
                    className="font-mono"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Consultar DTE
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Ministerio de Hacienda - República de El Salvador</p>
          <p className="mt-1">Sistema de Facturación Electrónica</p>
        </div>
      </div>
    </div>
  );
}
