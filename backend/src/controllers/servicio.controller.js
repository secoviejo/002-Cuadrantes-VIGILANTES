import * as servicioRepository from '../repositories/servicio.repository.js'
import {
  assertAllowedValue,
  assertRequiredFields,
  asyncHandler,
  parseBodyBoolean,
  parseBodyInteger,
  parseCommonListFilters,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
  sendListResponse,
} from '../utils/httpUtils.js'

const CAMPOS_SERVICIO = [
  'codigo',
  'nombre',
  'descripcion',
  'tipoOperativo',
  'modalidad',
  'horario',
  'vehiculo',
  'orden',
  'visibleCuadrante',
  'perfilRequerido',
  'dotacionMinima',
  'activo',
  'edificioId',
]
const PERFILES_REQUERIDOS_VALIDOS = ['VIGILANTE', 'AUXILIAR', 'CUALQUIERA']

function prepararDatosServicio(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['codigo', 'nombre', 'perfilRequerido', 'edificioId'])
  }

  const data = pickDefinedFields(body, CAMPOS_SERVICIO)

  if (data.dotacionMinima !== undefined) {
    data.dotacionMinima = parseBodyInteger(data.dotacionMinima, 'dotacionMinima')
  }

  if (data.orden !== undefined) {
    data.orden = parseBodyInteger(data.orden, 'orden')
  }

  if (data.visibleCuadrante !== undefined) {
    data.visibleCuadrante = parseBodyBoolean(data.visibleCuadrante, 'visibleCuadrante')
  }

  if (data.edificioId !== undefined) {
    data.edificioId = parseBodyInteger(data.edificioId, 'edificioId')
  }

  if (data.activo !== undefined) {
    data.activo = parseBodyBoolean(data.activo, 'activo')
  }

  assertAllowedValue(data.perfilRequerido, PERFILES_REQUERIDOS_VALIDOS, 'perfilRequerido')

  return data
}

export const listarServicios = asyncHandler(async (req, res) => {
  const filters = parseCommonListFilters(req.query)
  const result = await servicioRepository.findAll(filters)
  sendListResponse(res, result, filters)
})

export const obtenerServicio = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const servicio = await servicioRepository.findById(id)
  sendDetailResponse(res, servicio, 'Servicio')
})

export const crearServicio = asyncHandler(async (req, res) => {
  const servicio = await servicioRepository.create(prepararDatosServicio(req.body))
  sendCreatedResponse(res, servicio)
})

export const actualizarServicio = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const servicio = await servicioRepository.update(id, prepararDatosServicio(req.body, { partial: true }))
  sendDetailResponse(res, servicio, 'Servicio')
})
