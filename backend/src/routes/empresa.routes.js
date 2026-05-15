import { Router } from 'express'
import { actualizarEmpresa, crearEmpresa, listarEmpresas, obtenerEmpresa } from '../controllers/empresa.controller.js'

export const empresaRouter = Router()

empresaRouter.get('/', listarEmpresas)
empresaRouter.get('/:id', obtenerEmpresa)
empresaRouter.post('/', crearEmpresa)
empresaRouter.put('/:id', actualizarEmpresa)
