export class SafeStorage {
  static get(key: string, defaultValue: any = null) {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  static set(key: string, value: any) {
    if (typeof window === 'undefined') return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }
}

export class CarStorage {
  static getAllCars() {
    return SafeStorage.get('cars', [])
  }

  static saveCar(car: any) {
    const cars = this.getAllCars()
    cars.push(car)
    return SafeStorage.set('cars', cars)
  }

  static addCar(car: any) {
    return this.saveCar(car)
  }
}