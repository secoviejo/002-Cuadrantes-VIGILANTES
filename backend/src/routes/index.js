import { Router } from 'express'
import { asignacionTurnoRouter } from './asignacionTurno.routes.js'
import { ausenciaRouter } from './ausencia.routes.js'
import { servicioRouter } from './servicio.routes.js'
import { trabajadorRouter } from './trabajador.routes.js'
import { turnoRouter } from './turno.routes.js'

export const apiRouter = Router()

apiRouter.use('/trabajadores', trabajadorRouter)
apiRouter.use('/servicios', servicioRouter)
apiRouter.use('/turnos', turnoRouter)
apiRouter.use('/asignaciones-turno', asignacionTurnoRouter)
apiRouter.use('/ausencias', ausenciaRouter)
