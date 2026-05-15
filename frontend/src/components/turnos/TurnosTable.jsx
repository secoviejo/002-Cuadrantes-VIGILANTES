import { Edit2 } from 'lucide-react';

const ESTADOS_COLORS = {
  SIN_CUBRIR: 'bg-red-100 text-red-800',
  PARCIAL: 'bg-yellow-100 text-yellow-800',
  CUBIERTO: 'bg-green-100 text-green-800',
  INCIDENCIA: 'bg-orange-100 text-orange-800',
  CANCELADO: 'bg-stone-100 text-stone-800',
};

const ESTADOS_LABELS = {
  SIN_CUBRIR: 'Sin cubrir',
  PARCIAL: 'Parcial',
  CUBIERTO: 'Cubierto',
  INCIDENCIA: 'Incidencia',
  CANCELADO: 'Cancelado',
};

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

export default function TurnosTable({ turnos, onEdit }) {
  if (!turnos || turnos.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded-lg bg-white">
        No hay turnos registrados.
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Hora Ini.</th>
              <th className="px-4 py-3 font-semibold">Hora Fin</th>
              <th className="px-4 py-3 font-semibold">Servicio</th>
              <th className="px-4 py-3 font-semibold">Dotacion</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {turnos.map((turno) => (
              <tr key={turno.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-stone-500">{turno.id}</td>
                <td className="px-4 py-3 text-stone-900">{formatDate(turno.fecha)}</td>
                <td className="px-4 py-3 font-mono text-stone-700">{formatTime(turno.horaInicio)}</td>
                <td className="px-4 py-3 font-mono text-stone-700">{formatTime(turno.horaFin)}</td>
                <td className="px-4 py-3 text-stone-600">
                  {turno.servicio ? (
                    <span>{turno.servicio.nombre}</span>
                  ) : (
                    <span className="text-stone-400">ID: {turno.servicioId}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">{turno.dotacionMinima}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADOS_COLORS[turno.estado] || 'bg-stone-100'}`}>
                    {ESTADOS_LABELS[turno.estado] || turno.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(turno)}
                    className="text-amber-600 hover:text-amber-800 transition-colors inline-flex items-center gap-1 text-xs font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}