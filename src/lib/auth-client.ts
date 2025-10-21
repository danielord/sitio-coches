// Autenticación del lado del cliente para exportación estática

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

export const authClient = {
  getAuth(): AuthState {
    if (typeof window === 'undefined') return { user: null, token: null }
    
    // Intentar obtener del nuevo formato
    let token = localStorage.getItem('auth_token')
    let user = localStorage.getItem('auth_user')
    
    // Si no existe, intentar migrar del formato antiguo
    if (!user) {
      const oldUser = localStorage.getItem('user')
      if (oldUser) {
        const userData = JSON.parse(oldUser)
        // Migrar al nuevo formato
        this.setAuth('fake-token', userData)
        // Limpiar formato antiguo
        localStorage.removeItem('user')
        token = 'fake-token'
        user = oldUser
      }
    }
    
    return {
      token,
      user: user ? JSON.parse(user) : null
    }
  },

  setAuth(token: string, user: User) {
    if (typeof window === 'undefined') return
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
  },

  clearAuth() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  },

  isAuthenticated(): boolean {
    const { token } = this.getAuth()
    return !!token
  }
}