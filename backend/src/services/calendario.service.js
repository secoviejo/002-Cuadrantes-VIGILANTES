import { getPrismaClient } from '../db/prisma.js'

export const PERIODOS_ACADEMICOS_2026 = [
  { periodo: '07/01 - 31/01', tipo: 'Lectivo', estado: 'LECTIVO' },
  { periodo: '01/02 - 14/02', tipo: 'No lectivo', estado: 'NO_LECTIVO' },
  { periodo: '15/02 - 27/03', tipo: 'Lectivo', estado: 'LECTIVO' },
  { periodo: '28/03 - 06/04', tipo: 'No lectivo', estado: 'NO_LECTIVO' },
  { periodo: '07/04 - 30/06', tipo: 'Lectivo', estado: 'LECTIVO' },
  { periodo: '01/07 - 31/08', tipo: 'Cierre universitario', estado: 'CIERRE' },
  { periodo: '01/09 - 22/12', tipo: 'Lectivo', estado: 'LECTIVO' },
  { periodo: '23/12 - 06/01', tipo: 'Cierre universitario', estado: 'CIERRE' },
]

export async function obtenerCalendarioLaboral({ anio = 2026 } = {}) {
  const prisma = getPrismaClient()
  const desde = new Date(`${anio}-01-01T00:00:00.000Z`)
  const hasta = new Date(`${anio}-12-31T00:00:00.000Z`)

  const festivos = await prisma.calendarioLaboral.findMany({
    where: {
      fecha: { gte: desde, lte: hasta },
      tipo: 'FESTIVO',
    },
    include: { campus: true },
    orderBy: { fecha: 'asc' },
  })

  return {
    anio,
    festivos: festivos.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      fecha: item.fecha.toISOString().slice(0, 10),
      fechaCorta: item.fecha.toISOString().slice(5, 10).split('-').reverse().join('/'),
      festividad: item.descripcion,
      ambito: item.campus?.nombre || inferAmbito(item.descripcion),
      tipo: item.tipo,
      campusId: item.campusId,
    })),
    periodosAcademicos: PERIODOS_ACADEMICOS_2026,
  }
}

export async function crearFestivo({ fecha, descripcion, campusId }) {
  const prisma = getPrismaClient()
  const date = new Date(`${fecha}T00:00:00.000Z`)
  const year = date.getUTCFullYear()
  const codigo = `CAL_${year}_${fecha.replaceAll('-', '')}_${slug(descripcion)}`

  return prisma.calendarioLaboral.upsert({
    where: { codigo },
    update: {
      fecha: date,
      tipo: 'FESTIVO',
      descripcion,
      campusId: campusId || null,
    },
    create: {
      codigo,
      fecha: date,
      tipo: 'FESTIVO',
      descripcion,
      campusId: campusId || null,
    },
  })
}

function inferAmbito(descripcion) {
  const value = descripcion.toLowerCase()
  if (value.includes('huesca')) return 'Huesca'
  if (value.includes('zaragoza') || value.includes('pilar') || value.includes('cincomarzada')) return 'Zaragoza'
  if (value.includes('aragon') || value.includes('aragón') || value.includes('san jorge')) return 'Aragon'
  return 'Nacional'
}

function slug(value) {
  return String(value || 'FESTIVO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase()
    .slice(0, 40) || 'FESTIVO'
}
