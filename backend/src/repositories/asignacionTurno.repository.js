import { getPrismaClient } from '../db/prisma.js'

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.turnoId) where.turnoId = filters.turnoId
  if (filters.trabajadorId) where.trabajadorId = filters.trabajadorId
  if (filters.estado) where.estado = filters.estado

  return prisma.asignacionTurno.findMany({
    where,
    include: {
      turno: { include: { servicio: true } },
      trabajador: true,
    },
    orderBy: { creadoEn: 'desc' },
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.findUnique({
    where: { id },
    include: {
      turno: true,
      trabajador: true,
    },
  })
}

export async function findByTurnoYTrabajador(turnoId, trabajadorId) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.findUnique({
    where: {
      turnoId_trabajadorId: { turnoId, trabajadorId },
    },
  })
}

export async function findActivasPorTrabajador(trabajadorId) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.findMany({
    where: {
      trabajadorId,
      estado: { in: ['ASIGNADO', 'CONFIRMADO'] },
    },
    include: {
      turno: { include: { servicio: true } },
    },
    orderBy: { turno: { fecha: 'asc' } },
  })
}

export async function findPorTurno(turnoId) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.findMany({
    where: { turnoId },
    include: { trabajador: true },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.update({ where: { id }, data: datos })
}

export async function updateEstado(id, estado) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.update({ where: { id }, data: { estado } })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.asignacionTurno.delete({ where: { id } })
}