import { getPrismaClient } from '../db/prisma.js'

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.campus.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.campus.update({ where: { id }, data: datos })
}
