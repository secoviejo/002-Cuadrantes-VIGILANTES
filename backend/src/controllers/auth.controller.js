import crypto from 'crypto'
import { getPrismaClient } from '../db/prisma.js'
import { generateToken } from '../middleware/auth.js'
import { asyncHandler, sendDetailResponse } from '../utils/httpUtils.js'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' })
  }

  const prisma = getPrismaClient()
  const passwordHash = hashPassword(password)

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { rol: true, empresa: true }
  })

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales invalidas' })
  }

  if (usuario.passwordHash !== passwordHash) {
    return res.status(401).json({ error: 'Credenciales invalidas' })
  }

  if (!usuario.activo) {
    return res.status(401).json({ error: 'Usuario desactivado' })
  }

  const token = generateToken({
    userId: usuario.id,
    email: usuario.email,
    rolId: usuario.rolId
  })

  await prisma.auditoria.create({
    data: {
      usuarioId: usuario.id,
      accion: 'LOGIN',
      entidad: 'Usuario',
      entidadId: String(usuario.id),
      detalle: { email: usuario.email }
    }
  })

  sendDetailResponse(res, {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      empresa: usuario.empresa
    }
  }, 'Sesion iniciada')
})

export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  sendDetailResponse(res, {
    id: req.user.id,
    email: req.user.email,
    nombre: req.user.nombre,
    rol: req.user.rol,
    empresa: req.user.empresa
  }, 'Perfil de usuario')
})

export const getRoles = asyncHandler(async (req, res) => {
  const prisma = getPrismaClient()
  const roles = await prisma.rol.findMany({
    orderBy: { nombre: 'asc' }
  })
  res.json(roles)
})

export const getUsuarios = asyncHandler(async (req, res) => {
  const prisma = getPrismaClient()
  const usuarios = await prisma.usuario.findMany({
    include: { rol: true, empresa: true },
    orderBy: { nombre: 'asc' }
  })
  
  const usuariosSinPassword = usuarios.map(u => ({
    id: u.id,
    email: u.email,
    nombre: u.nombre,
    activo: u.activo,
    rol: u.rol,
    empresa: u.empresa,
    createdAt: u.creadoEn,
    updatedAt: u.actualizadoEn
  }))
  
  res.json(usuariosSinPassword)
})

export const createUsuario = asyncHandler(async (req, res) => {
  const { email, nombre, password, rolId, empresaId } = req.body

  if (!email || !nombre || !password || !rolId) {
    return res.status(400).json({ error: 'Email, nombre, password y rolId son requeridos' })
  }

  const prisma = getPrismaClient()
  
  const existente = await prisma.usuario.findUnique({ where: { email } })
  if (existente) {
    return res.status(409).json({ error: 'El email ya esta registrado' })
  }

  const passwordHash = hashPassword(password)

  const usuario = await prisma.usuario.create({
    data: {
      email,
      nombre,
      passwordHash,
      rolId: parseInt(rolId),
      empresaId: empresaId ? parseInt(empresaId) : null
    },
    include: { rol: true, empresa: true }
  })

  await prisma.auditoria.create({
    data: {
      usuarioId: req.user?.id,
      accion: 'CREATE',
      entidad: 'Usuario',
      entidadId: String(usuario.id),
      detalle: { email: usuario.email }
    }
  })

  res.status(201).json({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
    empresa: usuario.empresa
  })
})

export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { email, nombre, password, rolId, empresaId, activo } = req.body

  const prisma = getPrismaClient()
  
  const updateData = {}
  if (email) updateData.email = email
  if (nombre) updateData.nombre = nombre
  if (password) updateData.passwordHash = hashPassword(password)
  if (rolId) updateData.rolId = parseInt(rolId)
  if (empresaId !== undefined) updateData.empresaId = empresaId ? parseInt(empresaId) : null
  if (activo !== undefined) updateData.activo = activo

  const usuario = await prisma.usuario.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: { rol: true, empresa: true }
  })

  await prisma.auditoria.create({
    data: {
      usuarioId: req.user?.id,
      accion: 'UPDATE',
      entidad: 'Usuario',
      entidadId: String(usuario.id),
      detalle: { email: usuario.email }
    }
  })

  sendDetailResponse(res, {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    activo: usuario.activo,
    rol: usuario.rol,
    empresa: usuario.empresa
  }, 'Usuario actualizado')
})

export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params

  const prisma = getPrismaClient()
  
  const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } })
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  await prisma.usuario.delete({ where: { id: parseInt(id) } })

  await prisma.auditoria.create({
    data: {
      usuarioId: req.user?.id,
      accion: 'DELETE',
      entidad: 'Usuario',
      entidadId: id,
      detalle: { email: usuario.email }
    }
  })

  res.status(204).send()
})