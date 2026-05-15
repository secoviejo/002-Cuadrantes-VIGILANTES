import jwt from 'jsonwebtoken'
import { getPrismaClient } from '../db/prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'cuadrantes-vigilantes-secret-key-2024'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h'

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Token invalido o expirado' })
  }

  const prisma = getPrismaClient()
  const usuario = await prisma.usuario.findUnique({
    where: { id: decoded.userId },
    include: { rol: true, empresa: true }
  })

  if (!usuario || !usuario.activo) {
    return res.status(401).json({ error: 'Usuario no encontrado o inactivo' })
  }

  req.user = {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rolId: usuario.rolId,
    rol: usuario.rol,
    empresaId: usuario.empresaId,
    empresa: usuario.empresa
  }

  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!roles.includes(req.user.rol.nombre)) {
      return res.status(403).json({ error: 'No tienes permiso para realizar esta accion' })
    }

    next()
  }
}