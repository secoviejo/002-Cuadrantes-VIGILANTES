export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

export function parseInteger(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    const error = new Error(`${fieldName} debe ser un numero entero positivo`)
    error.status = 400
    error.code = 'invalid_query_param'
    throw error
  }

  return parsed
}

export function parseBoolean(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (value === 'true') return true
  if (value === 'false') return false

  const error = new Error(`${fieldName} debe ser true o false`)
  error.status = 400
  error.code = 'invalid_query_param'
  throw error
}

export function parseIdParam(value) {
  return parseInteger(value, 'id')
}

export function buildListMeta(result, filters = {}) {
  const items = Array.isArray(result) ? result : result.items
  const total = Array.isArray(result) ? items.length : result.total

  return {
    total,
    pagina: filters.pagina || 1,
    elementosPorPagina: filters.elementosPorPagina || items.length,
  }
}

export function sendListResponse(res, result, filters = {}) {
  const items = Array.isArray(result) ? result : result.items

  res.json({
    data: items,
    meta: buildListMeta(result, filters),
  })
}

export function sendDetailResponse(res, item, resourceName) {
  if (!item) {
    const error = new Error(`${resourceName} no encontrado`)
    error.status = 404
    error.code = 'not_found'
    throw error
  }

  res.json({ data: item })
}

export function parseCommonListFilters(query) {
  return {
    id: parseInteger(query.id, 'id'),
    busqueda: query.busqueda,
    activo: parseBoolean(query.activo, 'activo'),
    tipo: query.tipo,
    empresaId: parseInteger(query.empresaId, 'empresaId'),
    campusId: parseInteger(query.campusId, 'campusId'),
    servicioId: parseInteger(query.servicioId, 'servicioId'),
    turnoId: parseInteger(query.turnoId, 'turnoId'),
    trabajadorId: parseInteger(query.trabajadorId, 'trabajadorId'),
    estado: query.estado,
    fechaDesde: query.fechaDesde,
    fechaHasta: query.fechaHasta,
    pagina: parseInteger(query.pagina, 'pagina'),
    elementosPorPagina: parseInteger(query.elementosPorPagina, 'elementosPorPagina'),
  }
}
