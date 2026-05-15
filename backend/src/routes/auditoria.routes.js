import { Router } from 'express'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import { getPrismaClient } from '../db/prisma.js'
import { asyncHandler } from '../utils/httpUtils.js'

export const auditoriaRouter = Router()

auditoriaRouter.get('/', authenticateToken, requireRole('ADMIN', 'GESTOR'), asyncHandler(async (req, res) => {
  const prisma = getPrismaClient()
  const { limit = 100, offset = 0, entidad, accion, usuarioId } = req.query

  const where = {}
  if (entidad) where.entidad = entidad
  if (accion) where.accion = accion
  if (usuarioId) where.usuarioId = parseInt(usuarioId)

  const auditorias = await prisma.auditoria.findMany({
    where,
    include: { usuario: true },
    orderBy: { creadaEn: 'desc' },
    take: parseInt(limit),
    skip: parseInt(offset)
  })

  res.json(auditorias)
}))