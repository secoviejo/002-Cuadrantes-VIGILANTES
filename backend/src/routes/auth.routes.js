import { Router } from 'express'
import { login, getProfile, getRoles, getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../controllers/auth.controller.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.get('/profile', authenticateToken, getProfile)
authRouter.get('/roles', authenticateToken, getRoles)
authRouter.get('/usuarios', authenticateToken, requireRole('ADMIN', 'GESTOR'), getUsuarios)
authRouter.post('/usuarios', authenticateToken, requireRole('ADMIN'), createUsuario)
authRouter.put('/usuarios/:id', authenticateToken, requireRole('ADMIN'), updateUsuario)
authRouter.delete('/usuarios/:id', authenticateToken, requireRole('ADMIN'), deleteUsuario)