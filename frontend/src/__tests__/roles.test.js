import { describe, expect, it } from 'vitest';
import { canAccessRoute, getVisibleRouteGroups } from '../utils/roles.js';

const admin = { rol: { nombre: 'ADMIN' } };
const uz = { rol: { nombre: 'UNIDAD_SEGURIDAD_UZ' } };
const contrata = { rol: { nombre: 'CONTRATA' } };

describe('roles frontend', () => {
  it('permite acceso completo a ADMIN y Unidad de Seguridad', () => {
    expect(canAccessRoute(admin, 'servicios')).toBe(true);
    expect(canAccessRoute(uz, 'cierre')).toBe(true);
    expect(canAccessRoute(uz, 'calendario')).toBe(true);
    expect(getVisibleRouteGroups(uz)).toHaveLength(3);
  });

  it('limita Contrata a Operacion', () => {
    expect(canAccessRoute(contrata, 'dashboard')).toBe(true);
    expect(canAccessRoute(contrata, 'cuadrante')).toBe(true);
    expect(canAccessRoute(contrata, 'sustituciones')).toBe(true);
    expect(canAccessRoute(contrata, 'servicios')).toBe(false);
    expect(canAccessRoute(contrata, 'calendario')).toBe(false);
    expect(getVisibleRouteGroups(contrata).map((group) => group.title)).toEqual(['Operacion']);
  });
});
