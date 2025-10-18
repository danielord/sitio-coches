// Sistema de favoritos del lado del cliente

export interface Favorite {
  id: string
  fechaAgregado: Date
}

export const favoritesManager = {
  getFavorites(): string[] {
    if (typeof window === 'undefined') return []
    
    const favorites = localStorage.getItem('car_favorites')
    return favorites ? JSON.parse(favorites) : []
  },

  addFavorite(cocheId: string): void {
    if (typeof window === 'undefined') return
    
    const favorites = this.getFavorites()
    if (!favorites.includes(cocheId)) {
      favorites.push(cocheId)
      localStorage.setItem('car_favorites', JSON.stringify(favorites))
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { action: 'add', cocheId } 
      }))
    }
  },

  removeFavorite(cocheId: string): void {
    if (typeof window === 'undefined') return
    
    const favorites = this.getFavorites()
    const newFavorites = favorites.filter(id => id !== cocheId)
    localStorage.setItem('car_favorites', JSON.stringify(newFavorites))
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('favoritesChanged', { 
      detail: { action: 'remove', cocheId } 
    }))
  },

  isFavorite(cocheId: string): boolean {
    return this.getFavorites().includes(cocheId)
  },

  toggleFavorite(cocheId: string): boolean {
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