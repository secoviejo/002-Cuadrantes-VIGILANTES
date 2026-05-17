import * as trabajadorRepository from '../repositories/trabajador.repository.js'
import {
  assertAllowedValue,
  assertRequiredFields,
  asyncHandler,
  parseBodyBoolean,
  parseBodyInteger,
  parseCommonListFilters,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

const CAMPOS_TRABAJADOR = [
  'codigo',
  'nombre',
  'tipo',
  'identificadorProfesional',
  'fotoUrl',
  'activo',
  'empresaId',
]
const TIPOS_TRABAJADOR_VALIDOS = ['VIGILANTE', 'AUXILIAR', 'JEFE_EQUIPO', 'OTRO']

function prepararDatosTrabajador(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['codigo', 'nombre', 'tipo', 'empresaId'])
  }

  const data = pickDefinedFields(body, CAMPOS_TRABAJADOR)

  if (data.empresaId !== undefined) {
    data.empresaId = parseBodyInteger(data.empresaId, 'empresaId')
  }

  if (data.activo !== undefined) {
    data.activo = parseBodyBoolean(data.activo, 'activo')
  }

  assertAllowedValue(data.tipo, TIPOS_TRABAJADOR_VALIDOS, 'tipo')

  return data
}

export const listarTrabajadores = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await trabajadorRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerTrabajador = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const trabajador = await trabajadorRepository.findById(id)
  sendDetailResponse(res, trabajador, 'Trabajador')
})

export const crearTrabajador = asyncHandler(async (req, res) => {
  const trabajador = await trabajadorRepository.create(prepararDatosTrabajador(req.body))
  sendCreatedResponse(res, trabajador)
})

export const actualizarTrabajador = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const trabajador = await trabajadorRepository.update(id, prepararDatosTrabajador(req.body, { partial: true }))
  sendDetailResponse(res, trabajador, 'Trabajador')
})
