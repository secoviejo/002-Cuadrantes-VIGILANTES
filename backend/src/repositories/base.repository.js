export function buildWhereClause(filters) {
  const where = {}

  if (filters.id) where.id = filters.id
  if (filters.activo !== undefined) where.activo = filters.activo
  if (filters.empresaId) where.empresaId = filters.empresaId
  if (filters.tipo) where.tipo = filters.tipo

  if (filters.busqueda) {
    where.OR = [
      { nombre: { contains: filters.busqueda } },
      { codigo: { contains: filters.busqueda } },
    ]
  }

  return where
}

export function buildPaginationParams(filters = {}) {
  const skip = ((filters.pagina || 1) - 1) * (filters.elementosPorPagina || 20)
  return {
    skip,
    take: filters.elementosPorPagina || 20,
    orderBy: filters.orden || { id: 'asc' },
  }
}