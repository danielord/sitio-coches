const API_URL = process.env.API_URL || 'http://localhost:8787'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Coches
  getCoches: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/api/cars${query}`)
  },
  
  getCoche: (id: string) => apiRequest(`/api/cars/${id}`),
  
  createCoche: (data: any) => apiRequest('/api/cars', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Vendedores
  getVendedores: (email?: string) => {
    const query = email ? `?email=${email}` : ''
    return apiRequest(`/api/vendedores${query}`)
  },

  // Auth
  login: (credentials: { email: string; password: string }) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: any) => apiRequest('/api/auth/registro', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // AI
  generateDescription: (data: any) => apiRequest('/api/ai/descripcion', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
  },
}