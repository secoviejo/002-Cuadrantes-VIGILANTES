import * as asignacionTurnoRepository from '../repositories/asignacionTurno.repository.js'
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

const CAMPOS_ASIGNACION = ['turnoId', 'trabajadorId', 'estado']
const ESTADOS_VALIDOS = ['ASIGNADO', 'CONFIRMADO', 'SUSTITUIDO', 'CANCELADO']

function prepararDatosAsignacion(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['turnoId', 'trabajadorId'])
  }

  const data = pickDefinedFields(body, CAMPOS_ASIGNACION)

  if (data.turnoId !== undefined) {
    data.turnoId = parseBodyInteger(data.turnoId, 'turnoId')
  }

  if (data.trabajadorId !== undefined) {
    data.trabajadorId = parseBodyInteger(data.trabajadorId, 'trabajadorId')
  }

  if (data.estado !== undefined) {
    assertAllowedValue(data.estado, ESTADOS_VALIDOS, 'estado')
  }

  return data
}

export const listarAsignacionesTurno = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await asignacionTurnoRepository.findAll(filters)
  res.json(result || [])
})

export const obtenerAsignacionTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const asignacion = await asignacionTurnoRepository.findById(id)
  sendDetailResponse(res, asignacion, 'Asignacion de turno')
})

export const crearAsignacionTurno = asyncHandler(async (req, res) => {
  const { turnoId, trabajadorId } = req.body
  
  const existente = await asignacionTurnoRepository.findByTurnoYTrabajador(turnoId, trabajadorId)
  if (existente) {
    return res.status(409).json({
      error: 'duplicate',
      message: 'Este trabajador ya esta asignado a este turno'
    })
  }

  const datos = prepararDatosAsignacion(req.body)
  const asignacion = await asignacionTurnoRepository.create(datos)
  sendCreatedResponse(res, asignacion)
})

export const actualizarAsignacionTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const datos = prepararDatosAsignacion(req.body, { partial: true })
  const asignacion = await asignacionTurnoRepository.update(id, datos)
  sendDetailResponse(res, asignacion, 'Asignacion de turno')
})

export const eliminarAsignacionTurno = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  await asignacionTurnoRepository.remove(id)
  res.status(204).send()
})
