import { crearFestivo, obtenerCalendarioLaboral } from '../services/calendario.service.js'
import {
  assertRequiredFields,
  asyncHandler,
  parseBodyInteger,
  sendCreatedResponse,
} from '../utils/httpUtils.js'

export const calendarioLaboral = asyncHandler(async (req, res) => {
  const data = await obtenerCalendarioLaboral({
    anio: req.query.anio ? Number.parseInt(req.query.anio, 10) : 2026,
  })

  res.json({ data })
})

export const altaFestivo = asyncHandler(async (req, res) => {
  assertRequiredFields(req.body, ['fecha', 'descripcion'])

  const festivo = await crearFestivo({
    fecha: req.body.fecha,
    descripcion: req.body.descripcion,
    campusId: req.body.campusId ? parseBodyInteger(req.body.campusId, 'campusId') : null,
  })

  sendCreatedResponse(res, festivo)
})
