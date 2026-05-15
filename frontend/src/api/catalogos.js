import { getJson } from './client';

export function getEmpresas() {
  return getJson('/empresas');
}

export function getCampus() {
  return getJson('/campus');
}

export function getEdificios() {
  return getJson('/edificios');
}

export function getServicios() {
  return getJson('/servicios');
}

export function getTrabajadores() {
  return getJson('/trabajadores');
}
