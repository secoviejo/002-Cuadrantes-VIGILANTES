import { getPrismaClient } from '../db/prisma.js'

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.turnoId) where.turnoId = filters.turnoId
  if (filters.usuarioId) where.usuarioId = filters.usuarioId
  if (filters.estado) where.estado = filters.estado

  return prisma.verificacionCobertura.findMany({
    where,
    include: {
      turno: { include: { servicio: true } },
      usuario: true,
    },
    orderBy: { verificadaEn: 'desc' },
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.verificacionCobertura.findUnique({
    where: { id },
    include: {
      turno: { include: { servicio: true } },
      usuario: true,
    },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.verificacionCobertura.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.verificacionCobertura.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.verificacionCobertura.delete({ where: { id } })
}