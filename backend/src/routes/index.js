import { Router } from 'express'
import { asignacionTurnoRouter } from './asignacionTurno.routes.js'
import { ausenciaRouter } from './ausencia.routes.js'
import { campusRouter } from './campus.routes.js'
import { edificioRouter } from './edificio.routes.js'
import { empresaRouter } from './empresa.routes.js'
import { servicioRouter } from './servicio.routes.js'
import { trabajadorRouter } from './trabajador.routes.js'
import { turnoRouter } from './turno.routes.js'
import { validacionesRouter } from './validaciones.routes.js'

export const apiRouter = Router()

apiRouter.use('/empresas', empresaRouter)
apiRouter.use('/campus', campusRouter)
apiRouter.use('/edificios', edificioRouter)
apiRouter.use('/trabajadores', trabajadorRouter)
apiRouter.use('/servicios', servicioRouter)
apiRouter.use('/turnos', turnoRouter)
apiRouter.use('/asignaciones-turno', asignacionTurnoRouter)
apiRouter.use('/ausencias', ausenciaRouter)
apiRouter.use('/validaciones', validacionesRouter)
