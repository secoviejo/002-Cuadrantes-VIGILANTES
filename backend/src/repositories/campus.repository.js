import { getPrismaClient } from '../db/prisma.js'

export async function findAll() {
  const prisma = getPrismaClient()
  return prisma.campus.findMany({
    orderBy: { nombre: 'asc' }
  })
}

export async function findById(id) {
  const prisma = getPrismaClient()
  return prisma.campus.findUnique({ where: { id } })
}

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.campus.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.campus.update({ where: { id }, data: datos })
}
