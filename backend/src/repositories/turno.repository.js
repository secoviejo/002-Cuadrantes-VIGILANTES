import { getPrismaClient } from '../db/prisma.js'
import { buildPaginationParams } from './base.repository.js'

const INCLUDE_RELACIONES = {
  servicio: { include: { edificio: { include: { campus: true } } } },
  _count: { select: { asignaciones: true } },
}

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = {}

  if (filters.id) where.id = filters.id
  if (filters.servicioId) where.servicioId = filters.servicioId
  if (filters.estado) where.estado = filters.estado

  if (filters.fechaDesde || filters.fechaHasta) {
    where.fecha = {}
    if (filters.fechaDesde) where.fecha.gte = new Date(filters.fechaDesde)
    if (filters.fechaHasta) where.fecha.lte = new Date(filters.fechaHasta)
  }

  const pagination = buildPaginationParams(filters)

  const [items, total] = await Promise.all([
    prisma.turno.findMany({ where, ...pagination, include: INCLUDE_RELACIONES }),
    prisma.turno.count({ where }),
  ])

  return { items, total }
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.turno.findUnique({
    where: { id },
    include: {
      servicio: { include: { edificio: { include: { campus: true } } } },
      asignaciones: { include: { trabajador: true } },
      incidencias: true,
      verificaciones: { include: { usuario: true } },
    },
  })
}

export async function findByCodigo(codigo) {
  const prisma = getPrismaClient()
  return prisma.turno.findUnique({ where: { codigo } })
}

export async function findPorFecha(servicioId, fecha) {
  const prisma = getPrismaClient()
  const fechaInicio = new Date(fecha)
  fechaInicio.setHours(0, 0, 0, 0)
  const fechaFin = new Date(fecha)
  fechaFin.setHours(23, 59, 59, 999)

  return prisma.turno.findMany({
    where: {
      servicioId,
      fecha: { gte: fechaInicio, lte: fechaFin },
    },
    include: { asignaciones: { include: { trabajador: true } } },
    orderBy: { horaInicio: 'asc' },
  })
}

export async function findPorRangoFechas(servicioId, fechaDesde, fechaHasta) {
  const prisma = getPrismaClient()
  return prisma.turno.findMany({
    where: {
      servicioId,
      fecha: { gte: new Date(fechaDesde), lte: new Date(fechaHasta) },
    },
    include: {
      asignaciones: { include: { trabajador: true } },
    },
    orderBy: { fecha: 'asc' },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.turno.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.turno.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.turno.delete({ where: { id } })
}

export async function updateEstado(id, estado) {
  const prisma = getPrismaClient()
  return prisma.turno.update({ where: { id }, data: { estado } })
}