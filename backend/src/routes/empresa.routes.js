import { Router } from 'express'
import { actualizarEmpresa, crearEmpresa, listarEmpresas, obtenerEmpresa } from '../controllers/empresa.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const empresaRouter = Router()

empresaRouter.use(authenticateToken)
empresaRouter.use(requireRole('ADMIN', 'UNIDAD_SEGURIDAD_UZ'))

empresaRouter.get('/', listarEmpresas)
empresaRouter.get('/:id', obtenerEmpresa)
empresaRouter.post('/', crearEmpresa)
empresaRouter.put('/:id', actualizarEmpresa)
