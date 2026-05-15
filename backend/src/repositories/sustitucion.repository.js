import { getPrismaClient } from '../db/prisma.js'

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.turnoId) where.turnoId = filters.turnoId
  if (filters.trabajadorOriginalId) where.trabajadorOriginalId = filters.trabajadorOriginalId
  if (filters.trabajadorSustitutoId) where.trabajadorSustitutoId = filters.trabajadorSustitutoId

  return prisma.sustitucion.findMany({
    where,
    include: {
      turno: { include: { servicio: true } },
      trabajadorOriginal: true,
      trabajadorSustituto: true,
    },
    orderBy: { creadoEn: 'desc' },
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.sustitucion.findUnique({
    where: { id },
    include: {
      turno: { include: { servicio: true } },
      trabajadorOriginal: true,
      trabajadorSustituto: true,
    },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.sustitucion.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.sustitucion.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.sustitucion.delete({ where: { id } })
}