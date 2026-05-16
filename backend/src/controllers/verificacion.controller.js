import * as verificacionRepository from '../repositories/verificacion.repository.js'
import { registrarVerificacionesLote } from '../services/operativo.service.js'
import {
  asyncHandler,
  parseBodyInteger,
  parseCommonListFilters,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

const CAMPOS_VERIFICACION = ['turnoId', 'usuarioId', 'estado', 'nota']

export const listarVerificaciones = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await verificacionRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerVerificacion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const verificacion = await verificacionRepository.findById(id)
  sendDetailResponse(res, verificacion, 'Verificacion de cobertura')
})

export const crearVerificacion = asyncHandler(async (req, res) => {
  const data = pickDefinedFields(req.body, CAMPOS_VERIFICACION)
  data.usuarioId = req.user.id

  if (data.turnoId !== undefined) {
    data.turnoId = parseBodyInteger(data.turnoId, 'turnoId')
  }

  if (!data.turnoId || !data.estado) {
    return res.status(400).json({ error: 'Los campos turnoId y estado son requeridos' })
  }

  const verificacion = await verificacionRepository.create(data)
  sendCreatedResponse(res, verificacion)
})

export const crearVerificacionesLote = asyncHandler(async (req, res) => {
  const { fecha, turno, verificaciones = [] } = req.body

  if (!Array.isArray(verificaciones) || verificaciones.length === 0) {
    return res.status(400).json({ error: 'El campo verificaciones debe contener al menos un elemento' })
  }

  const creadas = await registrarVerificacionesLote({
    fecha,
    turno,
    verificaciones,
    usuarioId: req.user.id,
  })

  res.status(201).json({ data: creadas })
})

export const actualizarVerificacion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const data = pickDefinedFields(req.body, CAMPOS_VERIFICACION)

  if (data.turnoId !== undefined) {
    data.turnoId = parseBodyInteger(data.turnoId, 'turnoId')
  }
  if (data.usuarioId !== undefined) {
    data.usuarioId = data.usuarioId ? parseBodyInteger(data.usuarioId, 'usuarioId') : null
  }

  const verificacion = await verificacionRepository.update(id, data)
  sendDetailResponse(res, verificacion, 'Verificacion de cobertura')
})

export const eliminarVerificacion = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  await verificacionRepository.remove(id)
  res.status(204).send()
})
