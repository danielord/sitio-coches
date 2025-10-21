// Sistema de favoritos del lado del cliente

export interface Favorite {
  id: string
  fechaAgregado: Date
}

export const favoritesManager = {
  getCurrentUser(): string | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData).email : null
  },

  getFavorites(): string[] {
    if (typeof window === 'undefined') return []
    
    const userEmail = this.getCurrentUser()
    if (!userEmail) return []
    
    const favorites = localStorage.getItem(`car_favorites_${userEmail}`)
    return favorites ? JSON.parse(favorites) : []
  },

  addFavorite(cocheId: string): void {
    if (typeof window === 'undefined') return
    
    const userEmail = this.getCurrentUser()
    if (!userEmail) return
    
    const favorites = this.getFavorites()
    if (!favorites.includes(cocheId)) {
      favorites.push(cocheId)
      localStorage.setItem(`car_favorites_${userEmail}`, JSON.stringify(favorites))
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { action: 'add', cocheId } 
      }))
    }
  },

  removeFavorite(cocheId: string): void {
    if (typeof window === 'undefined') return
    
    const userEmail = this.getCurrentUser()
    if (!userEmail) return
    
    const favorites = this.getFavorites()
    const newFavorites = favorites.filter(id => id !== cocheId)
    localStorage.setItem(`car_favorites_${userEmail}`, JSON.stringify(newFavorites))
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('favoritesChanged', { 
      detail: { action: 'remove', cocheId } 
    }))
  },

  isFavorite(cocheId: string): boolean {
    return this.getFavorites().includes(cocheId)
  },

  toggleFavorite(cocheId: string): boolean {
    const userEmail = this.getCurrentUser()
    if (!userEmail) {
      alert('Debes iniciar sesión para agregar favoritos')
      return false
    }
    
    const isFav = this.isFavorite(cocheId)
    if (isFav) {
      this.removeFavorite(cocheId)
    } else {
      this.addFavorite(cocheId)
    }
    return !isFav
  },

  getFavoriteCount(): number {
    return this.getFavorites().length
  }
}