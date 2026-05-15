import * as campusRepository from '../repositories/campus.repository.js'
import {
  assertRequiredFields,
  asyncHandler,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
} from '../utils/httpUtils.js'

const CAMPOS_CAMPUS = ['codigo', 'nombre', 'ciudad']

function prepararDatosCampus(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['codigo', 'nombre'])
  }

  return pickDefinedFields(body, CAMPOS_CAMPUS)
}

export const listarCampus = asyncHandler(async (req, res) => {
  const campus = await campusRepository.findAll()
  res.json(campus || [])
})

export const obtenerCampus = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const campus = await campusRepository.findById(id)
  sendDetailResponse(res, campus, 'Campus')
})

export const crearCampus = asyncHandler(async (req, res) => {
  const campus = await campusRepository.create(prepararDatosCampus(req.body))
  sendCreatedResponse(res, campus)
})

export const actualizarCampus = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const campus = await campusRepository.update(id, prepararDatosCampus(req.body, { partial: true }))
  sendDetailResponse(res, campus, 'Campus')
})
