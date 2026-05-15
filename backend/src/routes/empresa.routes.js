import { Router } from 'express'
import { actualizarEmpresa, crearEmpresa } from '../controllers/empresa.controller.js'

export const empresaRouter = Router()

empresaRouter.post('/', crearEmpresa)
empresaRouter.put('/:id', actualizarEmpresa)
