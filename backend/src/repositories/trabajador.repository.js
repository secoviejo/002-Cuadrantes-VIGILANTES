import { getPrismaClient } from '../db/prisma.js'
import { buildWhereClause, buildPaginationParams } from './base.repository.js'

const INCLUDE_RELACIONES = {
  empresa: true,
  _count: {
    select: {
      asignaciones: true,
      ausencias: true,
    },
  },
}

export async function findAll(filters = {}) {
  const prisma = getPrismaClient()
  const where = buildWhereClause(filters)
  const pagination = buildPaginationParams(filters)

  const [items, total] = await Promise.all([
    prisma.trabajador.findMany({ where, ...pagination, include: INCLUDE_RELACIONES }),
    prisma.trabajador.count({ where }),
  ])

  return { items, total }
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.trabajador.findUnique({
    where: { id },
    include: {
      empresa: true,
      asignaciones: { include: { turno: { include: { servicio: true } } } },
      ausencias: true,
    },
  })
}

export async function findByCodigo(codigo) {
  const prisma = getPrismaClient()
  return prisma.trabajador.findUnique({ where: { codigo } })
}

export async function findActivosPorEmpresa(empresaId) {
  const prisma = getPrismaClient()
  return prisma.trabajador.findMany({
    where: { empresaId, activo: true },
    orderBy: { nombre: 'asc' },
  })
}

export async function findPorTipoYTipoServicio(tipo, perfilRequerido) {
  const prisma = getPrismaClient()
  return prisma.trabajador.findMany({
    where: {
      tipo,
      activo: true,
    },
  })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.trabajador.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.trabajador.update({ where: { id }, data: datos })
}

export async function remove(id) {
  const prisma = getPrismaClient()
  return prisma.trabajador.delete({ where: { id } })
}