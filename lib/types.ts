export interface Campaign {
  id: string
  name: string
  prompt?: string
  objective: string
  createdAt: string
}

export interface Persona {
  id: string
  name: string
  bio: string
  tone: number
  witty: number
  aspiration: number
  cta: string
  safetyNotes: string
  createdAt: string
}

export interface Brand {
  id: number
  name: string
  image: string
}