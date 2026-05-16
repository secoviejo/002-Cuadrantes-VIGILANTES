import { Router } from 'express'
import { cuadranteMensual, resumenOperativo } from '../controllers/operativo.controller.js'

export const operativoRouter = Router()

operativoRouter.get('/resumen-operativo', resumenOperativo)
operativoRouter.get('/cuadrante-mensual', cuadranteMensual)
