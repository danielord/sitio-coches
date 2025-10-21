export function cleanupLocalStorage() {
  try {
    // Limpiar coches antiguos (mantener solo los últimos 30)
    const cars = JSON.parse(localStorage.getItem('cars') || '[]')
    if (cars.length > 30) {
      const recentCars = cars.slice(-30)
      localStorage.setItem('cars', JSON.stringify(recentCars))
    }

    // Limpiar usuarios inactivos (mantener solo los últimos 50)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.length > 50) {
      const recentUsers = users.slice(-50)
      localStorage.setItem('users', JSON.stringify(recentUsers))
    }

    // Limpiar slideshow antiguo (mantener solo los últimos 10)
    const slideshow = JSON.parse(localStorage.getItem('slideshow') || '[]')
    if (slideshow.length > 10) {
      const recentSlideshow = slideshow.slice(-10)
      localStorage.setItem('slideshow', JSON.stringify(recentSlideshow))
    }

    console.log('LocalStorage cleanup completed')
  } catch (error) {
    console.error('Error during localStorage cleanup:', error)
  }
}

export function getStorageUsage() {
  let total = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return {
    used: total,
    usedMB: (total / (1024 * 1024)).toFixed(2),
    // Límite típico de localStorage es ~5-10MB
    percentage: ((total / (5 * 1024 * 1024)) * 100).toFixed(1)
  }
}