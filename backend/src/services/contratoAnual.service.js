import { getPrismaClient } from '../db/prisma.js'

export const CONTRATO_CATEGORIAS_BASE = [
  { codigo: 'LABORAL_DIURNO', nombre: 'Laboral diurno', contratoHoras: 27656, orden: 1 },
  { codigo: 'LABORAL_NOCTURNO', nombre: 'Laboral nocturno', contratoHoras: 15944, orden: 2 },
  { codigo: 'FESTIVO_DIURNO', nombre: 'Festivo diurno', contratoHoras: 12740, orden: 3 },
  { codigo: 'FESTIVO_NOCTURNO', nombre: 'Festivo nocturno', contratoHoras: 7168, orden: 4 },
]

export const BOLSA_VARIABLE_BASE_HORAS = 2000

const CODIGOS_CATEGORIA = CONTRATO_CATEGORIAS_BASE.map((item) => item.codigo)
const CATEGORIAS_POR_CODIGO = new Map(CONTRATO_CATEGORIAS_BASE.map((item) => [item.codigo, item]))

function validationError(message, details = {}) {
  const error = new Error(message)
  error.status = 400
  error.code = 'invalid_contract_payload'
  error.details = details
  return error
}

function parseNonNegativeInteger(value, fieldName) {
  if (typeof value === 'string' && value.trim() === '') {
    throw validationError(`${fieldName} debe ser un numero entero no negativo`, { field: fieldName })
  }
  const parsed = Number(value)
  if (value === undefined || value === null || value === '' || !Number.isInteger(parsed) || parsed < 0) {
    throw validationError(`${fieldName} debe ser un numero entero no negativo`, { field: fieldName })
  }
  return parsed
}

function validateYear(anio) {
  const parsed = Number(anio)
  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 2100) {
    throw validationError('anio debe estar entre 2000 y 2100', { field: 'anio' })
  }
  return parsed
}

function normalizeContratoRecord(record, anio) {
  const categorias = record?.categorias?.length
    ? [...record.categorias].sort((a, b) => a.orden - b.orden).map((item) => ({
      codigo: item.codigo,
      nombre: item.nombre,
      contratoHoras: item.contratoHoras,
      orden: item.orden,
    }))
    : CONTRATO_CATEGORIAS_BASE

  const contratoAnual = categorias.reduce((total, item) => total + item.contratoHoras, 0)

  return {
    id: record?.id || null,
    anio,
    bolsaVariableHoras: record?.bolsaVariableHoras ?? BOLSA_VARIABLE_BASE_HORAS,
    observaciones: record?.observaciones || '',
    contratoAnual,
    categorias,
  }
}

export function prepararContratoPayload(anio, payload = {}) {
  const parsedAnio = validateYear(anio)
  const bolsaVariableHoras = parseNonNegativeInteger(payload.bolsaVariableHoras, 'bolsaVariableHoras')
  const categorias = Array.isArray(payload.categorias) ? payload.categorias : []

  if (categorias.length !== CODIGOS_CATEGORIA.length) {
    throw validationError('categorias debe incluir exactamente las categorias del contrato', {
      expected: CODIGOS_CATEGORIA,
    })
  }

  const recibidos = new Set(categorias.map((item) => item.codigo))
  const faltantes = CODIGOS_CATEGORIA.filter((codigo) => !recibidos.has(codigo))
  const sobrantes = [...recibidos].filter((codigo) => !CATEGORIAS_POR_CODIGO.has(codigo))

  if (faltantes.length > 0 || sobrantes.length > 0 || recibidos.size !== categorias.length) {
    throw validationError('categorias contiene codigos invalidos, repetidos o incompletos', {
      expected: CODIGOS_CATEGORIA,
      missing: faltantes,
      unexpected: sobrantes,
    })
  }

  const observaciones = payload.observaciones === undefined || payload.observaciones === null
    ? null
    : String(payload.observaciones).trim().slice(0, 1000) || null

  return {
    anio: parsedAnio,
    bolsaVariableHoras,
    observaciones,
    categorias: CONTRATO_CATEGORIAS_BASE.map((base) => {
      const item = categorias.find((entry) => entry.codigo === base.codigo)
      return {
        codigo: base.codigo,
        nombre: base.nombre,
        orden: base.orden,
        contratoHoras: parseNonNegativeInteger(item.contratoHoras, `categorias.${base.codigo}.contratoHoras`),
      }
    }),
  }
}

export async function obtenerContratoAnual({ anio = 2026 } = {}) {
  const parsedAnio = validateYear(anio)
  const prisma = getPrismaClient()
  const contrato = await prisma.contratoAnual.findUnique({
    where: { anio: parsedAnio },
    include: { categorias: { orderBy: { orden: 'asc' } } },
  })
  return normalizeContratoRecord(contrato, parsedAnio)
}

export async function actualizarContratoAnual({ anio, payload, usuarioId }) {
  const data = prepararContratoPayload(anio, payload)
  const prisma = getPrismaClient()

  const anteriorRecord = await prisma.contratoAnual.findUnique({
    where: { anio: data.anio },
    include: { categorias: { orderBy: { orden: 'asc' } } },
  })
  const anterior = normalizeContratoRecord(anteriorRecord, data.anio)

  return prisma.$transaction(async (tx) => {
    const contrato = await tx.contratoAnual.upsert({
      where: { anio: data.anio },
      update: {
        bolsaVariableHoras: data.bolsaVariableHoras,
        observaciones: data.observaciones,
      },
      create: {
        anio: data.anio,
        bolsaVariableHoras: data.bolsaVariableHoras,
        observaciones: data.observaciones,
      },
    })

    for (const categoria of data.categorias) {
      await tx.contratoCategoriaHora.upsert({
        where: {
          contratoId_codigo: {
            contratoId: contrato.id,
            codigo: categoria.codigo,
          },
        },
        update: categoria,
        create: {
          ...categoria,
          contratoId: contrato.id,
        },
      })
    }

    const actualizadoRecord = await tx.contratoAnual.findUnique({
      where: { anio: data.anio },
      include: { categorias: { orderBy: { orden: 'asc' } } },
    })
    const actualizado = normalizeContratoRecord(actualizadoRecord, data.anio)

    await tx.auditoria.create({
      data: {
        usuarioId: usuarioId || null,
        accion: 'UPDATE',
        entidad: 'ContratoAnual',
        entidadId: String(data.anio),
        detalle: { anterior, actualizado },
      },
    })

    return actualizado
  })
}
