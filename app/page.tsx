import { GestionNecesidades } from "@/components/gestion-necesidades"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-800 mb-2">🚒 Sistema de Gestión de Bomberos</h1>
          <p className="text-gray-600 text-lg">Gestión inteligente de necesidades para brigadas de bomberos</p>
        </div>
        <GestionNecesidades />
      </div>
    </div>
  )
}
