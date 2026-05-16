export const ROUTE_GROUPS = [
  {
    title: 'Operacion',
    items: ['dashboard', 'cuadrante', 'sustituciones'],
  },
  {
    title: 'Control',
    items: ['turnos', 'asignaciones', 'incidencias', 'horas', 'cierre'],
  },
  {
    title: 'Configuracion',
    items: ['empresas', 'campus', 'edificios', 'servicios', 'trabajadores'],
  },
];

export const ALL_ROUTES = ROUTE_GROUPS.flatMap((group) => group.items);
export const CONTRATA_ROUTES = ['dashboard', 'cuadrante', 'sustituciones'];

export function getRoleName(user) {
  return user?.rol?.nombre || '';
}

export function isContrata(user) {
  return getRoleName(user) === 'CONTRATA';
}

export function hasFullAccess(user) {
  return ['ADMIN', 'UNIDAD_SEGURIDAD_UZ'].includes(getRoleName(user));
}

export function canAccessRoute(user, route) {
  if (hasFullAccess(user)) return ALL_ROUTES.includes(route);
  if (isContrata(user)) return CONTRATA_ROUTES.includes(route);
  return route === 'dashboard';
}

export function getVisibleRouteGroups(user) {
  const allowed = hasFullAccess(user) ? ALL_ROUTES : CONTRATA_ROUTES;
  return ROUTE_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => allowed.includes(item)),
    }))
    .filter((group) => group.items.length > 0);
}
