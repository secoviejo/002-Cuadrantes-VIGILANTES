import * as edificioRepository from '../repositories/edificio.repository.js'
import {
  assertRequiredFields,
  asyncHandler,
  parseBodyInteger,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
} from '../utils/httpUtils.js'

const CAMPOS_EDIFICIO = ['codigo', 'nombre', 'campusId']

function prepararDatosEdificio(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['codigo', 'nombre', 'campusId'])
  }

  const data = pickDefinedFields(body, CAMPOS_EDIFICIO)

  if (data.campusId !== undefined) {
    data.campusId = parseBodyInteger(data.campusId, 'campusId')
  }

  return data
}

export const listarEdificios = asyncHandler(async (req, res) => {
  const edificios = await edificioRepository.findAll()
  res.json(edificios || [])
})

export const obtenerEdificio = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const edificio = await edificioRepository.findById(id)
  sendDetailResponse(res, edificio, 'Edificio')
})

export const crearEdificio = asyncHandler(async (req, res) => {
  const edificio = await edificioRepository.create(prepararDatosEdificio(req.body))
  sendCreatedResponse(res, edificio)
})

export const actualizarEdificio = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const edificio = await edificioRepository.update(id, prepararDatosEdificio(req.body, { partial: true }))
  sendDetailResponse(res, edificio, 'Edificio')
})
