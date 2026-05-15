import { getPrismaClient } from '../db/prisma.js'
import { buildWhereClause, buildPaginationParams } from './base.repository.js'

const INCLUDE_RELACIONES = {
  edificio: { include: { campus: true } },
  _count: { select: { turnos: true } },
}

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = buildWhereClause(filters)

  if (filters.campusId) {
    where.edificio = { campusId: filters.campusId }
  }

  const pagination = buildPaginationParams(filters)

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({ where, ...pagination, include: INCLUDE_RELACIONES }),
    prisma.servicio.count({ where }),
  ])

  return { items, total }
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.servicio.findUnique({
    where: { id },
    include: {
      edificio: { include: { campus: true } },
      turnos: { take: 10, orderBy: { fecha: 'desc' } },
    },
  })
}

export async function findByCodigo(codigo) {
  const prisma = getPrismaClient()
  return prisma.servicio.findUnique({ where: { codigo } })
}

export async function findActivosPorCampus(campusId) {
  const prisma = getPrismaClient()
  return prisma.servicio.findMany({
    where: {
      activo: true,
      edificio: { campusId },
    },
    include: { edificio: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.servicio.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.servicio.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.servicio.delete({ where: { id } })
}