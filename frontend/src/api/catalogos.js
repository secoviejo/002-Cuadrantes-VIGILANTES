import { getJson, postJson, putJson } from './client';

export function getEmpresas() {
  return getJson('/empresas');
}

export function createEmpresa(data) {
  return postJson('/empresas', data);
}

export function updateEmpresa(id, data) {
  return putJson(`/empresas/${id}`, data);
}

export function getCampus() {
  return getJson('/campus');
}

export function createCampus(data) {
  return postJson('/campus', data);
}

export function updateCampus(id, data) {
  return putJson(`/campus/${id}`, data);
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
