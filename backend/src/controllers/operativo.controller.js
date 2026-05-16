import {
  obtenerCierreMensual,
  obtenerCuadranteMensual,
  obtenerHorasAnuales,
  obtenerInformeOperativo,
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

export const horasAnuales = asyncHandler(async (req, res) => {
  const data = await obtenerHorasAnuales({
    anio: req.query.anio ? Number.parseInt(req.query.anio, 10) : 2026,
  })

  res.json({ data })
})

export const cierreMensual = asyncHandler(async (req, res) => {
  const data = await obtenerCierreMensual({
    anio: req.query.anio ? Number.parseInt(req.query.anio, 10) : 2026,
    mes: req.query.mes ? Number.parseInt(req.query.mes, 10) : 5,
  })

  res.json({ data })
})

export const informeOperativo = asyncHandler(async (req, res) => {
  const data = await obtenerInformeOperativo({
    tipo: req.query.tipo,
    fecha: req.query.fecha,
    anio: req.query.anio ? Number.parseInt(req.query.anio, 10) : 2026,
    mes: req.query.mes ? Number.parseInt(req.query.mes, 10) : 5,
  })

  res.json({ data })
})
