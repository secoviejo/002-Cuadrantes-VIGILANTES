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

export function createEdificio(data) {
  return postJson('/edificios', data);
}

export function updateEdificio(id, data) {
  return putJson(`/edificios/${id}`, data);
}

export function getServicios() {
  return getJson('/servicios');
}

export function createServicio(data) {
  return postJson('/servicios', data);
}

export function updateServicio(id, data) {
  return putJson(`/servicios/${id}`, data);
}

export function getTrabajadores() {
  return getJson('/trabajadores');
}

export function createTrabajador(data) {
  return postJson('/trabajadores', data);
}

export function updateTrabajador(id, data) {
  return putJson(`/trabajadores/${id}`, data);
}

export function getTurnos() {
  return getJson('/turnos');
}

export function createTurno(data) {
  return postJson('/turnos', data);
}

export function updateTurno(id, data) {
  return putJson(`/turnos/${id}`, data);
}

export function getAsignaciones() {
  return getJson('/asignaciones-turno');
}

export function createAsignacion(data) {
  return postJson('/asignaciones-turno', data);
}

export function updateAsignacion(id, data) {
  return putJson(`/asignaciones-turno/${id}`, data);
}

export function deleteAsignacion(id) {
  return fetch(`http://localhost:4000/api/asignaciones-turno/${id}`, {
    method: 'DELETE',
  }).then(res => {
    if (!res.ok) throw new Error('Error al eliminar')
    return res
  });
}

export function validarAsignacion(turnoId, trabajadorId) {
  return getJson(`/validaciones/validar-asignacion?turnoId=${turnoId}&trabajadorId=${trabajadorId}`);
}

export function validarAsignacionesMasivas(asignaciones) {
  return postJson('/validaciones/validar-asignaciones-masivas', { asignaciones });
}
