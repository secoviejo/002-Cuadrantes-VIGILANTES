import { getJson } from './client';

export function getEmpresas() {
  return getJson('/empresas').catch(() => []);
}

export function getCampus() {
  return getJson('/campus').catch(() => []);
}

export function getEdificios() {
  return getJson('/edificios').catch(() => []);
}

export function getServicios() {
  return getJson('/servicios');
}

export function getTrabajadores() {
  return getJson('/trabajadores');
}
