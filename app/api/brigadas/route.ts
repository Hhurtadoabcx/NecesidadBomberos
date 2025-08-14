import { NextResponse } from "next/server"

// Simulación de datos - en producción conectarías con tu API ASP.NET Core
export async function GET() {
  try {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500))

    const brigadas = [
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
      {
        id_brigada: 3,
        nombre_brigada: "Brigada Sur",
        bomberos_activos: 22,
        contacto_comandante: "+34 600 345 678",
        encargado_logistica: "Ana Martínez",
        contacto_logistica: "+34 600 901 234",
      },
    ]

    return NextResponse.json(brigadas)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener brigadas" }, { status: 500 })
  }
}
