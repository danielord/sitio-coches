'use client'

// Cliente D1 para el frontend
export class D1Client {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api/d1'
  }

  async getCars() {
    const response = await fetch(`${this.baseUrl}/cars`)
    return response.json()
  }

  async createCar(carData: any) {
    const response = await fetch(`${this.baseUrl}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    })
    return response.json()
  }

  async getUsers() {
    const response = await fetch(`${this.baseUrl}/users`)
    return response.json()
  }

  async createUser(userData: any) {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  }
}