const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api"

export interface Brigada {
  id_brigada: number
  nombre_brigada: string
  bomberos_activos: number
  contacto_comandante: string
  encargado_logistica: string
  contacto_logistica: string
  numero_emergencia?: string
}

export interface Categoria {
  id_categoria: number
  nombre_categoria: string
}

export interface Item {
  id_item: number
  nombre_item: string
  id_categoria: number
  requiere_talla: boolean
  tipo_valor: string
  Categoria?: Categoria
}

export interface Talla {
  id_talla: number
  tipo_talla: string
  valor_talla: string
}

export interface CreateNecesidadDto {
  id_brigada: number
  id_item: number
  id_talla?: number
  valor: number
  observaciones?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  // Brigadas
  async getBrigadas(): Promise<Brigada[]> {
    return this.request<Brigada[]>("/brigadas")
  }

  async createBrigada(brigada: Omit<Brigada, "id_brigada">): Promise<Brigada> {
    return this.request<Brigada>("/brigadas", {
      method: "POST",
      body: JSON.stringify(brigada),
    })
  }

  // Categorías
  async getCategorias(): Promise<Categoria[]> {
    return this.request<Categoria[]>("/categorias")
  }

  async createCategoria(categoria: Omit<Categoria, "id_categoria">): Promise<Categoria> {
    return this.request<Categoria>("/categorias", {
      method: "POST",
      body: JSON.stringify(categoria),
    })
  }

  // Items
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>("/items")
  }

  async getItemsByCategoria(categoriaId: number): Promise<Item[]> {
    return this.request<Item[]>(`/items/categoria/${categoriaId}`)
  }

  async createItem(item: Omit<Item, "id_item">): Promise<Item> {
    return this.request<Item>("/items", {
      method: "POST",
      body: JSON.stringify(item),
    })
  }

  // Tallas
  async getTallas(): Promise<Talla[]> {
    return this.request<Talla[]>("/tallas")
  }

  async getTallasByTipo(tipo: string): Promise<Talla[]> {
    return this.request<Talla[]>(`/tallas/tipo/${tipo}`)
  }

  async createTalla(talla: Omit<Talla, "id_talla">): Promise<Talla> {
    return this.request<Talla>("/tallas", {
      method: "POST",
      body: JSON.stringify(talla),
    })
  }

  // Necesidades
  async getNecesidades(): Promise<any[]> {
    return this.request<any[]>("/necesidades")
  }

  async getNecesidadesByBrigada(brigadaId: number): Promise<any[]> {
    return this.request<any[]>(`/necesidades/brigada/${brigadaId}`)
  }

  async createNecesidad(necesidad: CreateNecesidadDto): Promise<any> {
    return this.request<any>("/necesidades", {
      method: "POST",
      body: JSON.stringify(necesidad),
    })
  }

  async deleteNecesidad(id: number): Promise<void> {
    await this.request<void>(`/necesidades/${id}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiClient()
