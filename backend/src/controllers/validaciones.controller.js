import * as validacionesService from '../services/validaciones.service.js'
import { asyncHandler, parseBodyInteger, sendDetailResponse } from '../utils/httpUtils.js'

export const validarAsignacion = asyncHandler(async (req, res) => {
  const turnoId = parseBodyInteger(req.query.turnoId, 'turnoId')
  const trabajadorId = parseBodyInteger(req.query.trabajadorId, 'trabajadorId')

  const resultado = await validacionesService.validarAsignacion(turnoId, trabajadorId)
  sendDetailResponse(res, resultado, 'Validacion de asignacion')
})

export const validarAsignacionesMasivas = asyncHandler(async (req, res) => {
  const { asignaciones } = req.body
  
  if (!Array.isArray(asignaciones)) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Se requiere un array de asignaciones'
    })
  }

  const resultado = await validacionesService.validarAsignacionesMasivas(asignaciones)
  sendDetailResponse(res, resultado, 'Validacion masiva de asignaciones')
})