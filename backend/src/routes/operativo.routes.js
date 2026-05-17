import { Router } from 'express'
import {
  contratoAnual,
  cierreMensual,
  cuadranteMensual,
  horasAnuales,
  informeOperativo,
  resumenOperativo,
} from '../controllers/operativo.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const operativoRouter = Router()

operativoRouter.get('/resumen-operativo', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), resumenOperativo)
operativoRouter.get('/cuadrante-mensual', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), cuadranteMensual)
operativoRouter.get('/informes-operativos', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ', 'CONTRATA'), informeOperativo)
operativoRouter.get('/horas-anuales', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), horasAnuales)
operativoRouter.put('/contrato-anual/:anio', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), contratoAnual)
operativoRouter.get('/cierre-mensual', authenticateToken, requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'), cierreMensual)
