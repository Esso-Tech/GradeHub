import 'express'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'FAMILLE' | 'ADMIN' }
    }
  }
}
export {}
