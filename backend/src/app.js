import cors from 'cors'
import express from 'express'
import { healthRouter } from './routes/health.routes.js'
import { apiRouter } from './routes/index.js'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/api', (_req, res) => {
    res.json({
      name: '002-Cuadrantes-VIGILANTES API',
      status: 'ok',
      version: '0.1.0',
    })
  })

  app.use('/api/health', healthRouter)
  app.use('/api', apiRouter)

  app.use((_req, res) => {
    res.status(404).json({
      error: 'not_found',
      message: 'Ruta no encontrada',
    })
  })

  app.use((err, _req, res, _next) => {
    const prismaStatusByCode = {
      P2002: 409,
      P2003: 400,
      P2025: 404,
    }
    const status = err.status || prismaStatusByCode[err.code] || 500

    res.status(status).json({
      error: err.code || 'internal_error',
      message: status === 500 ? 'Error interno del servidor' : err.message,
    })
  })

  return app
}
