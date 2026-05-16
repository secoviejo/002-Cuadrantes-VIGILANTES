import {
  obtenerCuadranteMensual,
  obtenerResumenOperativo,
} from '../services/operativo.service.js'
import { asyncHandler } from '../utils/httpUtils.js'

export const resumenOperativo = asyncHandler(async (req, res) => {
  const data = await obtenerResumenOperativo({
    fecha: req.query.fecha,
    turno: req.query.turno,
  })

  res.json({ data })
})

export const cuadranteMensual = asyncHandler(async (req, res) => {
  const data = await obtenerCuadranteMensual({
    anio: req.query.anio ? Number.parseInt(req.query.anio, 10) : 2026,
    mes: req.query.mes ? Number.parseInt(req.query.mes, 10) : 5,
  })

  res.json({ data })
})
