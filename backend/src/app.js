import cors from 'cors'
import express from 'express'
import { healthRouter } from './routes/health.routes.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173',
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

  app.use((_req, res) => {
    res.status(404).json({
      error: 'not_found',
      message: 'Ruta no encontrada',
    })
  })

  app.use((err, _req, res, _next) => {
    const status = err.status || 500

    res.status(status).json({
      error: err.code || 'internal_error',
      message: status === 500 ? 'Error interno del servidor' : err.message,
    })
  })

  return app
}
