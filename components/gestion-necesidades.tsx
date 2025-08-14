"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos TypeScript basados en los modelos C#
interface Brigada {
  id_brigada: number
  nombre_brigada: string
  bomberos_activos: number
  contacto_comandante: string
  encargado_logistica: string
  contacto_logistica: string
  numero_emergencia?: string
}

interface Categoria {
  id_categoria: number
  nombre_categoria: string
}

interface Item {
  id_item: number
  nombre_item: string
  id_categoria: number
  requiere_talla: boolean
  tipo_valor: "cantidad" | "monto"
}

interface Talla {
  id_talla: number
  tipo_talla: "ropa" | "botas" | "guantes"
  valor_talla: string
}

interface Necesidad {
  id_brigada: number
  id_item: number
  id_talla?: number
  valor: number
  observaciones?: string
  // Datos adicionales para mostrar
  nombre_brigada?: string
  nombre_item?: string
  nombre_categoria?: string
  valor_talla?: string
  tipo_valor?: "cantidad" | "monto"
}

export function GestionNecesidades() {
  const { toast } = useToast()

  // Estados principales
  const [brigadas, setBrigadas] = useState<Brigada[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [tallas, setTallas] = useState<Talla[]>([])
  const [necesidades, setNecesidades] = useState<Necesidad[]>([])

  // Estados del formulario
  const [selectedBrigada, setSelectedBrigada] = useState<number | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedTalla, setSelectedTalla] = useState<number | null>(null)
  const [valor, setValor] = useState<string>("")
  const [observaciones, setObservaciones] = useState<string>("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Estados de carga
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Simular carga de datos desde API
      // En producción, estas serían llamadas reales a tu API ASP.NET Core

      // Datos de ejemplo basados en tu esquema SQL
      setBrigadas([
        {
          id_brigada: 1,
          nombre_brigada: "Brigada Central",
          bomberos_activos: 25,
          contacto_comandante: "+34 600 123 456",
          encargado_logistica: "María García",
          contacto_logistica: "+34 600 789 012",
          numero_emergencia: "112",
        },
        {
          id_brigada: 2,
          nombre_brigada: "Brigada Norte",
          bomberos_activos: 18,
          contacto_comandante: "+34 600 234 567",
          encargado_logistica: "Carlos López",
          contacto_logistica: "+34 600 890 123",
        },
      ])

      setCategorias([
        { id_categoria: 1, nombre_categoria: "EPP Ropa" },
        { id_categoria: 2, nombre_categoria: "EPP Equipamiento" },
        { id_categoria: 3, nombre_categoria: "Herramientas" },
        { id_categoria: 4, nombre_categoria: "Logística Vehículos" },
        { id_categoria: 5, nombre_categoria: "Alimentación" },
        { id_categoria: 6, nombre_categoria: "Medicamentos" },
      ])

      setItems([
        { id_item: 1, nombre_item: "Botas Forestales", id_categoria: 1, requiere_talla: true, tipo_valor: "cantidad" },
        { id_item: 2, nombre_item: "Casco Protector", id_categoria: 2, requiere_talla: false, tipo_valor: "cantidad" },
        {
          id_item: 3,
          nombre_item: "Guantes Resistentes",
          id_categoria: 1,
          requiere_talla: true,
          tipo_valor: "cantidad",
        },
        { id_item: 4, nombre_item: "Gasolina", id_categoria: 4, requiere_talla: false, tipo_valor: "monto" },
        { id_item: 5, nombre_item: "Botiquín Básico", id_categoria: 6, requiere_talla: false, tipo_valor: "cantidad" },
      ])

      setTallas([
        { id_talla: 1, tipo_talla: "ropa", valor_talla: "S" },
        { id_talla: 2, tipo_talla: "ropa", valor_talla: "M" },
        { id_talla: 3, tipo_talla: "ropa", valor_talla: "L" },
        { id_talla: 4, tipo_talla: "ropa", valor_talla: "XL" },
        { id_talla: 5, tipo_talla: "botas", valor_talla: "40" },
        { id_talla: 6, tipo_talla: "botas", valor_talla: "41" },
        { id_talla: 7, tipo_talla: "botas", valor_talla: "42" },
        { id_talla: 8, tipo_talla: "botas", valor_talla: "43" },
        { id_talla: 9, tipo_talla: "guantes", valor_talla: "M" },
        { id_talla: 10, tipo_talla: "guantes", valor_talla: "L" },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos iniciales",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Obtener datos relacionados
  const getBrigadaSeleccionada = () => brigadas.find((b) => b.id_brigada === selectedBrigada)
  const getItemSeleccionado = () => items.find((i) => i.id_item === selectedItem)
  const getItemsPorCategoria = () => items.filter((i) => i.id_categoria === selectedCategoria)
  const getTallasPorTipo = (tipoTalla: string) => tallas.filter((t) => t.tipo_talla === tipoTalla)

  // Determinar tipo de talla según el item
  const getTipoTallaParaItem = (itemId: number): string | null => {
    const item = items.find((i) => i.id_item === itemId)
    if (!item?.requiere_talla) return null

    // Lógica para determinar tipo de talla basada en el nombre del item
    const nombre = item.nombre_item.toLowerCase()
    if (nombre.includes("bota")) return "botas"
    if (nombre.includes("guante")) return "guantes"
    return "ropa"
  }

  // Validar formulario
  const validarFormulario = (): boolean => {
    if (!selectedBrigada || !selectedItem || !valor) {
      toast({
        title: "Campos requeridos",
        description: "Debe seleccionar brigada, item y especificar un valor",
        variant: "destructive",
      })
      return false
    }

    const item = getItemSeleccionado()
    if (item?.requiere_talla && !selectedTalla) {
      toast({
        title: "Talla requerida",
        description: "Este item requiere seleccionar una talla",
        variant: "destructive",
      })
      return false
    }

    const valorNumerico = Number.parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Valor inválido",
        description: "El valor debe ser un número mayor a 0",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Agregar necesidad
  const agregarNecesidad = () => {
    if (!validarFormulario()) return

    const brigada = getBrigadaSeleccionada()!
    const item = getItemSeleccionado()!
    const categoria = categorias.find((c) => c.id_categoria === item.id_categoria)!
    const talla = selectedTalla ? tallas.find((t) => t.id_talla === selectedTalla) : undefined

    const nuevaNecesidad: Necesidad = {
      id_brigada: selectedBrigada!,
      id_item: selectedItem!,
      id_talla: selectedTalla || undefined,
      valor: Number.parseFloat(valor),
      observaciones: observaciones || undefined,
      // Datos adicionales para mostrar
      nombre_brigada: brigada.nombre_brigada,
      nombre_item: item.nombre_item,
      nombre_categoria: categoria.nombre_categoria,
      valor_talla: talla?.valor_talla,
      tipo_valor: item.tipo_valor,
    }

    if (editingIndex !== null) {
      const nuevasNecesidades = [...necesidades]
      nuevasNecesidades[editingIndex] = nuevaNecesidad
      setNecesidades(nuevasNecesidades)
      setEditingIndex(null)
      toast({
        title: "Necesidad actualizada",
        description: "La necesidad ha sido actualizada correctamente",
      })
    } else {
      setNecesidades([...necesidades, nuevaNecesidad])
      toast({
        title: "Necesidad agregada",
        description: "La necesidad ha sido agregada a la lista",
      })
    }

    limpiarFormulario()
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    setSelectedCategoria(null)
    setSelectedItem(null)
    setSelectedTalla(null)
    setValor("")
    setObservaciones("")
    setEditingIndex(null)
  }

  // Editar necesidad
  const editarNecesidad = (index: number) => {
    const necesidad = necesidades[index]
    const item = items.find((i) => i.id_item === necesidad.id_item)

    setSelectedBrigada(necesidad.id_brigada)
    setSelectedCategoria(item?.id_categoria || null)
    setSelectedItem(necesidad.id_item)
    setSelectedTalla(necesidad.id_talla || null)
    setValor(necesidad.valor.toString())
    setObservaciones(necesidad.observaciones || "")
    setEditingIndex(index)
  }

  // Eliminar necesidad
  const eliminarNecesidad = (index: number) => {
    const nuevasNecesidades = necesidades.filter((_, i) => i !== index)
    setNecesidades(nuevasNecesidades)
    toast({
      title: "Necesidad eliminada",
      description: "La necesidad ha sido eliminada de la lista",
    })
  }

  // Enviar necesidades
  const enviarNecesidades = async () => {
    if (necesidades.length === 0) {
      toast({
        title: "Lista vacía",
        description: "Debe agregar al menos una necesidad",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Preparar datos para envío
      const datosEnvio = necesidades.map((n) => ({
        id_brigada: n.id_brigada,
        id_item: n.id_item,
        id_talla: n.id_talla,
        valor: n.valor,
        observaciones: n.observaciones,
      }))

      // Simular envío a API
      console.log("Enviando necesidades:", datosEnvio)

      // En producción sería:
      // const response = await fetch('/api/necesidades', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(datosEnvio)
      // })

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay

      toast({
        title: "Necesidades enviadas",
        description: `Se han registrado ${necesidades.length} necesidades correctamente`,
      })

      setNecesidades([])
      limpiarFormulario()
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudieron registrar las necesidades",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel de Selección */}
      <div className="lg:col-span-2 space-y-6">
        {/* Selección de Brigada */}
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800 flex items-center gap-2">🚒 Selección de Brigada</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="brigada">Brigada</Label>
                <Select
                  value={selectedBrigada?.toString() || ""}
                  onValueChange={(value) => setSelectedBrigada(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar brigada..." />
                  </SelectTrigger>
                  <SelectContent>
                    {brigadas.map((brigada) => (
                      <SelectItem key={brigada.id_brigada} value={brigada.id_brigada.toString()}>
                        {brigada.nombre_brigada} ({brigada.bomberos_activos} bomberos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Información de la brigada seleccionada */}
              {selectedBrigada && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Información de la Brigada</h4>
                  {(() => {
                    const brigada = getBrigadaSeleccionada()!
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <strong>Bomberos activos:</strong> {brigada.bomberos_activos}
                        </div>
                        <div>
                          <strong>Comandante:</strong> {brigada.contacto_comandante}
                        </div>
                        <div>
                          <strong>Logística:</strong> {brigada.encargado_logistica}
                        </div>
                        <div>
                          <strong>Contacto logística:</strong> {brigada.contacto_logistica}
                        </div>
                        {brigada.numero_emergencia && (
                          <div>
                            <strong>Emergencia:</strong> {brigada.numero_emergencia}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selección de Item */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800 flex items-center gap-2">📦 Selección de Necesidad</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={selectedCategoria?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedCategoria(Number.parseInt(value))
                      setSelectedItem(null)
                      setSelectedTalla(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id_categoria} value={categoria.id_categoria.toString()}>
                          {categoria.nombre_categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="item">Item</Label>
                  <Select
                    value={selectedItem?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedItem(Number.parseInt(value))
                      setSelectedTalla(null)
                    }}
                    disabled={!selectedCategoria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getItemsPorCategoria().map((item) => (
                        <SelectItem key={item.id_item} value={item.id_item.toString()}>
                          {item.nombre_item}
                          {item.requiere_talla && (
                            <Badge variant="secondary" className="ml-2">
                              Requiere talla
                            </Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selección de talla si es requerida */}
              {selectedItem && getItemSeleccionado()?.requiere_talla && (
                <div>
                  <Label htmlFor="talla">Talla</Label>
                  <Select
                    value={selectedTalla?.toString() || ""}
                    onValueChange={(value) => setSelectedTalla(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar talla..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getTallasPorTipo(getTipoTallaParaItem(selectedItem) || "").map((talla) => (
                        <SelectItem key={talla.id_talla} value={talla.id_talla.toString()}>
                          {talla.valor_talla}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Campo de valor */}
              <div>
                <Label htmlFor="valor">
                  {getItemSeleccionado()?.tipo_valor === "monto" ? "Monto (€)" : "Cantidad"}
                </Label>
                <Input
                  id="valor"
                  type="number"
                  min="0"
                  step={getItemSeleccionado()?.tipo_valor === "monto" ? "0.01" : "1"}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder={getItemSeleccionado()?.tipo_valor === "monto" ? "0.00" : "0"}
                />
              </div>

              {/* Observaciones */}
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <Button
                  onClick={agregarNecesidad}
                  disabled={!selectedBrigada || !selectedItem || !valor}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {editingIndex !== null ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Actualizar
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </>
                  )}
                </Button>

                {editingIndex !== null && (
                  <Button variant="outline" onClick={limpiarFormulario}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Resumen */}
      <div className="space-y-6">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center gap-2">
              📋 Resumen de Necesidades
              <Badge variant="secondary">{necesidades.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {necesidades.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay necesidades agregadas</p>
            ) : (
              <div className="space-y-3">
                {necesidades.map((necesidad, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{necesidad.nombre_item}</h4>
                        <p className="text-xs text-gray-600">{necesidad.nombre_brigada}</p>
                        <p className="text-xs text-gray-500">{necesidad.nombre_categoria}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => editarNecesidad(index)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => eliminarNecesidad(index)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div>
                        {necesidad.valor_talla && (
                          <Badge variant="outline" className="mr-2">
                            Talla {necesidad.valor_talla}
                          </Badge>
                        )}
                        <span className="font-medium">
                          {necesidad.tipo_valor === "monto"
                            ? `€${necesidad.valor.toFixed(2)}`
                            : `${necesidad.valor} unidades`}
                        </span>
                      </div>
                    </div>

                    {necesidad.observaciones && (
                      <p className="text-xs text-gray-600 mt-2 italic">{necesidad.observaciones}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {necesidades.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={enviarNecesidades}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enviar Necesidades ({necesidades.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        {necesidades.length > 0 && (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 text-sm">📊 Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total items:</span>
                  <span className="font-semibold">{necesidades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brigadas:</span>
                  <span className="font-semibold">{new Set(necesidades.map((n) => n.id_brigada)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categorías:</span>
                  <span className="font-semibold">{new Set(necesidades.map((n) => n.nombre_categoria)).size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
