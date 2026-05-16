import { getPrismaClient } from '../db/prisma.js'

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.turnoId) where.turnoId = filters.turnoId
  if (filters.trabajadorId) where.trabajadorId = filters.trabajadorId
  if (filters.estado) where.estado = filters.estado

  return prisma.incidencia.findMany({
    where,
    include: {
      turno: { include: { servicio: true } },
      trabajador: true,
    },
    orderBy: { creadaEn: 'desc' },
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.incidencia.findUnique({
    where: { id },
    include: {
      turno: { include: { servicio: true } },
      trabajador: true,
    },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.incidencia.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.incidencia.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.incidencia.delete({ where: { id } })
}
