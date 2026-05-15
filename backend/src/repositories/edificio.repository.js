import { getPrismaClient } from '../db/prisma.js'

export async function create(datos) {
  const prisma = getPrismaClient()
  return prisma.edificio.create({ data: datos })
}

export async function update(id, datos) {
  const prisma = getPrismaClient()
  return prisma.edificio.update({ where: { id }, data: datos })
}
