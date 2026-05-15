import { getPrismaClient } from '../db/prisma.js'

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.trabajadorId) where.trabajadorId = filters.trabajadorId
  if (filters.tipo) where.tipo = filters.tipo

  if (filters.fechaDesde || filters.fechaHasta) {
    where.OR = [
      {
        fechaInicio: { lte: filters.fechaHasta ? new Date(filters.fechaHasta) : undefined },
        fechaFin: { gte: filters.fechaDesde ? new Date(filters.fechaDesde) : undefined },
      },
    ]
  }

  return prisma.ausencia.findMany({
    where,
    include: { trabajador: true },
    orderBy: { fechaInicio: 'desc' },
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.ausencia.findUnique({
    where: { id },
    include: { trabajador: true },
  })
}

export async function findPorTrabajador(trabajadorId) {
  const prisma = getPrismaClient()
  return prisma.ausencia.findMany({
    where: { trabajadorId },
    orderBy: { fechaInicio: 'desc' },
  })
}

export async function findPorRango(trabajadorId, fechaDesde, fechaHasta) {
  const prisma = getPrismaClient()
  return prisma.ausencia.findMany({
    where: {
      trabajadorId,
      OR: [
        {
          fechaInicio: { lte: new Date(fechaHasta) },
          fechaFin: { gte: new Date(fechaDesde) },
        },
      ],
    },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.ausencia.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.ausencia.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.ausencia.delete({ where: { id } })
}