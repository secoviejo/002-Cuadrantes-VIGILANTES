import * as empresaRepository from '../repositories/empresa.repository.js'
import {
  assertRequiredFields,
  asyncHandler,
  parseBodyBoolean,
  parseIdParam,
  pickDefinedFields,
  sendCreatedResponse,
  sendDetailResponse,
} from '../utils/httpUtils.js'

const CAMPOS_EMPRESA = ['nombre', 'cif', 'activa']

function prepararDatosEmpresa(body, { partial = false } = {}) {
  if (!partial) {
    assertRequiredFields(body, ['nombre'])
  }

  const data = pickDefinedFields(body, CAMPOS_EMPRESA)

  if (data.activa !== undefined) {
    data.activa = parseBodyBoolean(data.activa, 'activa')
  }

  return data
}

export const listarEmpresas = asyncHandler(async (req, res) => {
  const empresas = await empresaRepository.findAll()
  res.json(empresas || [])
})

export const obtenerEmpresa = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const empresa = await empresaRepository.findById(id)
  sendDetailResponse(res, empresa, 'Empresa')
})

export const crearEmpresa = asyncHandler(async (req, res) => {
  const empresa = await empresaRepository.create(prepararDatosEmpresa(req.body))
  sendCreatedResponse(res, empresa)
})

export const actualizarEmpresa = asyncHandler(async (req, res) => {
  const id = parseIdParam(req.params.id)
  const empresa = await empresaRepository.update(id, prepararDatosEmpresa(req.body, { partial: true }))
  sendDetailResponse(res, empresa, 'Empresa')
})
