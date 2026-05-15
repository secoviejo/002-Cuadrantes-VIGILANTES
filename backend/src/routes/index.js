import { Router } from 'express'
import { asignacionTurnoRouter } from './asignacionTurno.routes.js'
import { audienciaRouter } from './auditoria.routes.js'
import { ausenciaRouter } from './ausencia.routes.js'
import { campusRouter } from './campus.routes.js'
import { edificioRouter } from './edificio.routes.js'
import { empresaRouter } from './empresa.routes.js'
import { incidenciaRouter } from './incidencia.routes.js'
import { servicioRouter } from './servicio.routes.js'
import { sustitucionRouter } from './sustitucion.routes.js'
import { turnoRouter } from './turno.routes.js'
import { validacionesRouter } from './validaciones.routes.js'
import { verificacionRouter } from './verificacion.routes.js'
import { authRouter } from './auth.routes.js'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/empresas', empresaRouter)
apiRouter.use('/campus', campusRouter)
apiRouter.use('/edificios', edificioRouter)
apiRouter.use('/incidencias', incidenciaRouter)
apiRouter.use('/trabajadores', trabajadorRouter)
apiRouter.use('/servicios', servicioRouter)
apiRouter.use('/sustituciones', sustitucionRouter)
apiRouter.use('/turnos', turnoRouter)
apiRouter.use('/asignaciones-turno', asignacionTurnoRouter)
apiRouter.use('/auditoria', audienciaRouter)
apiRouter.use('/ausencias', ausenciaRouter)
apiRouter.use('/validaciones', validacionesRouter)
apiRouter.use('/verificaciones', verificacionRouter)
