import { Edit2, CheckCircle, Clock, Calendar as CalendarIcon, AlertTriangle, ShieldAlert, CheckCircle2, ShieldBan } from 'lucide-react';

const ESTADOS_COLORS = {
  SIN_CUBRIR: 'bg-red-50 text-red-700 border-red-200',
  PARCIAL: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CUBIERTO: 'bg-green-50 text-green-700 border-green-200',
  INCIDENCIA: 'bg-orange-50 text-orange-700 border-orange-200',
  CANCELADO: 'bg-stone-50 text-stone-700 border-stone-200',
};

const ESTADOS_LABELS = {
  SIN_CUBRIR: 'Sin cubrir',
  PARCIAL: 'Parcial',
  CUBIERTO: 'Cubierto',
  INCIDENCIA: 'Incidencia',
  CANCELADO: 'Cancelado',
};

const getEstadoIcon = (estado) => {
  switch(estado) {
    case 'SIN_CUBRIR': return <ShieldAlert className="w-3.5 h-3.5 mr-1" />;
    case 'PARCIAL': return <Clock className="w-3.5 h-3.5 mr-1" />;
    case 'CUBIERTO': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    case 'INCIDENCIA': return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
    case 'CANCELADO': return <ShieldBan className="w-3.5 h-3.5 mr-1" />;
    default: return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function CoberturaBadge({ count, min }) {
  if (!min || min === 0) return <span className="text-stone-400">-</span>;
  
  const ratio = count / min;
  let colorClass = 'bg-red-50 text-red-700 border-red-200';
  let label = `${count}/${min}`;
  
  if (ratio >= 1) {
    colorClass = 'bg-green-50 text-green-700 border-green-200';
  } else if (ratio > 0) {
    colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
  
  return (
    <span className={`px-2 py-1 border rounded-md text-xs font-semibold tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
}

export default function TurnosTable({ turnos, onEdit, onVerificar }) {
  if (!turnos || turnos.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center">
        <div className="bg-stone-50 p-4 rounded-full mb-4">
          <CalendarIcon className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-stone-900 font-medium mb-1">No hay turnos</h3>
        <p className="text-stone-500 text-sm">No se han encontrado turnos con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            <th className="px-5 py-3.5">ID</th>
            <th className="px-5 py-3.5">Fecha</th>
            <th className="px-5 py-3.5">Horario</th>
            <th className="px-5 py-3.5">Servicio</th>
            <th className="px-5 py-3.5">Dotación</th>
            <th className="px-5 py-3.5">Cobertura</th>
            <th className="px-5 py-3.5">Estado</th>
            <th className="px-5 py-3.5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {turnos.map((turno) => (
            <tr key={turno.id} className="hover:bg-stone-50/50 transition-colors group">
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-stone-400 group-hover:text-amber-600 transition-colors">
                  #{turno.id}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-stone-400" />
                  <span className="text-stone-700 font-medium">{formatDate(turno.fecha)}</span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="font-mono text-stone-600 text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                    {formatTime(turno.horaInicio)} - {formatTime(turno.horaFin)}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                {turno.servicio ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-stone-800 font-medium">{turno.servicio.nombre}</span>
                  </div>
                ) : (
                  <span className="text-stone-400 text-xs border border-stone-200 px-2 py-0.5 rounded">
                    ID: {turno.servicioId}
                  </span>
                )}
              </td>
              <td className="px-5 py-4">
                <span className="text-stone-600 font-medium px-2 py-1 bg-stone-100 rounded-md">
                  {turno.dotacionMinima} pax
                </span>
              </td>
              <td className="px-5 py-4">
                <CoberturaBadge count={turno._count?.asignaciones || 0} min={turno.dotacionMinima} />
              </td>
              <td className="px-5 py-4">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide ${ESTADOS_COLORS[turno.estado] || 'bg-stone-50 text-stone-700 border-stone-200'}`}>
                  {getEstadoIcon(turno.estado)}
                  {ESTADOS_LABELS[turno.estado] || turno.estado}
                </div>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(turno)}
                    className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    title="Editar turno"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onVerificar && onVerificar(turno)}
                    className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Verificar cobertura"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}