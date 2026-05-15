export function toCSV(data, columns) {
  if (!data || data.length === 0) return '';
  
  const headers = columns.map(c => c.label || c.key);
  const keys = columns.map(c => c.key);
  
  const headerRow = headers.join(';');
  const dataRows = data.map(item => {
    return keys.map(key => {
      const value = item[key];
      if (value === null || value === undefined) return '';
      
      let str = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (str.includes(';') || str.includes('\n') || str.includes('"')) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(';');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(csvContent, filename) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTurnos(turnos) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'horaInicio', label: 'Hora Inicio' },
    { key: 'horaFin', label: 'Hora Fin' },
    { key: 'estado', label: 'Estado' },
    { key: 'dotacionMinima', label: 'Dotacion Minima' },
    { key: 'servicioId', label: 'Servicio ID' },
  ];
  
  const dataFormateada = turnos.map(t => ({
    ...t,
    fecha: t.fecha ? new Date(t.fecha).toISOString().split('T')[0] : '',
    horaInicio: t.horaInicio ? new Date(t.horaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
    horaFin: t.horaFin ? new Date(t.horaFin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
  }));
  
  const csv = toCSV(dataFormateada, columns);
  const fecha = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `turnos_${fecha}.csv`);
}

export function exportAsignaciones(asignaciones) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'turnoId', label: 'Turno ID' },
    { key: 'trabajadorId', label: 'Trabajador ID' },
    { key: 'estado', label: 'Estado' },
    { key: 'creadoEn', label: 'Fecha Creacion' },
  ];
  
  const dataFormateada = asignaciones.map(a => ({
    ...a,
    creadoEn: a.creadoEn ? new Date(a.creadoEn).toLocaleString('es-ES') : '',
  }));
  
  const csv = toCSV(dataFormateada, columns);
  const fecha = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `asignaciones_${fecha}.csv`);
}

export function exportTrabajadores(trabajadores) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo', label: 'Codigo' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'activo', label: 'Activo' },
    { key: 'empresaId', label: 'Empresa ID' },
  ];
  
  const csv = toCSV(trabajadores, columns);
  const fecha = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `trabajadores_${fecha}.csv`);
}