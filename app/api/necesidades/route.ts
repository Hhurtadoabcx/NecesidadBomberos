import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const necesidades = await request.json()

    // Validar datos
    if (!Array.isArray(necesidades) || necesidades.length === 0) {
      return NextResponse.json({ error: "Debe proporcionar al menos una necesidad" }, { status: 400 })
    }

    // Validar cada necesidad
    for (const necesidad of necesidades) {
      if (!necesidad.id_brigada || !necesidad.id_item || !necesidad.valor) {
        return NextResponse.json({ error: "Datos incompletos en una o más necesidades" }, { status: 400 })
      }
    }

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En producción, aquí harías la llamada a tu API ASP.NET Core:
    // const response = await fetch('https://tu-api.com/api/necesidades', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(necesidades)
    // })

    console.log("Necesidades recibidas:", necesidades)

    return NextResponse.json({
      success: true,
      message: `Se registraron ${necesidades.length} necesidades correctamente`,
      data: necesidades,
    })
  } catch (error) {
    console.error("Error al procesar necesidades:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
