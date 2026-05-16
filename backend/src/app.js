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

  app.get('/', (_req, res) => {
    res.type('html').send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Cuadrantes UZ API</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 48px; color: #292524; background: #fafaf9; }
      code, a { color: #b45309; }
      .card { max-width: 720px; border: 1px solid #e7e5e4; border-radius: 12px; background: white; padding: 28px; box-shadow: 0 12px 28px rgb(0 0 0 / .06); }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Cuadrantes UZ API</h1>
      <p>Este puerto es el <strong>backend</strong>. La aplicacion web se abre en <a href="http://127.0.0.1:4173">http://127.0.0.1:4173</a>.</p>
      <p>Estado API: <a href="/api">/api</a> · Salud: <a href="/api/health">/api/health</a></p>
      <p>Usuarios demo: <code>admin.demo@example.com</code>, <code>supervision.demo@unizar.example</code>, <code>contrata.demo@example.com</code></p>
      <p>Contrasena comun: <code>Demo1234!</code></p>
    </main>
  </body>
</html>`)
  })

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
