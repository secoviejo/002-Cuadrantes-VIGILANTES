import * as turnoRepository from '../repositories/turno.repository.js'
import {
  assertAllowedValue,
  assertRequiredFields,
  asyncHandler,
  parseBodyInteger,
  parseCommonListFilters,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

const CAMPOS_TURNO = [
  'codigo',
  'servicioId',
  'fecha',
  'horaInicio',
  'horaFin',
  'estado',
  'dotacionMinima',
]
const ESTADOS_VALIDOS = ['SIN_CUBRIR', 'PARCIAL', 'CUBIERTO', 'INCIDENCIA', 'CANCELADO']

function prepararDatosTurno(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['codigo', 'servicioId', 'fecha', 'horaInicio', 'horaFin'])
  }

  const data = pickDefinedFields(body, CAMPOS_TURNO)

  if (data.servicioId !== undefined) {
    data.servicioId = parseBodyInteger(data.servicioId, 'servicioId')
  }

  if (data.dotacionMinima !== undefined) {
    data.dotacionMinima = parseBodyInteger(data.dotacionMinima, 'dotacionMinima')
  }

  if (data.estado !== undefined) {
    assertAllowedValue(data.estado, ESTADOS_VALIDOS, 'estado')
  }

  return data
}

export const listarTurnos = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await turnoRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const turno = await turnoRepository.findById(id)
  sendDetailResponse(res, turno, 'Turno')
})

export const crearTurno = asyncHandler(async (req, res) => {
  const turno = await turnoRepository.create(prepararDatosTurno(req.body))
  sendCreatedResponse(res, turno)
})

export const actualizarTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const turno = await turnoRepository.update(id, prepararDatosTurno(req.body, { partial: true }))
  sendDetailResponse(res, turno, 'Turno')
})
