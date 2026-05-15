import { Pencil, Trash2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES');
}

const ESTADOS = {
  ABIERTA: 'bg-red-100 text-red-800',
  EN_CURSO: 'bg-yellow-100 text-yellow-800',
  CERRADA: 'bg-green-100 text-green-800',
};

const ESTADOS_LABELS = {
  ABIERTA: 'Abierta',
  EN_CURSO: 'En curso',
  CERRADA: 'Cerrada',
};

export default function IncidenciasTable({ incidencias, onEdit, onDelete }) {
  if (!incidencias || incidencias.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        No hay incidencias registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-100 text-stone-700">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Titulo</th>
            <th className="px-4 py-3 text-left font-medium">Turno</th>
            <th className="px-4 py-3 text-left font-medium">Trabajador</th>
            <th className="px-4 py-3 text-left font-medium">Estado</th>
            <th className="px-4 py-3 text-left font-medium">Fecha</th>
            <th className="px-4 py-3 text-center font-medium w-24">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {incidencias.map((inc) => (
            <tr key={inc.id} className="hover:bg-stone-50">
              <td className="px-4 py-3">
                <div className="font-medium">{inc.titulo}</div>
                {inc.descripcion && (
                  <div className="text-stone-500 text-xs max-w-xs truncate">{inc.descripcion}</div>
                )}
              </td>
              <td className="px-4 py-3">
                {inc.turno ? (
                  <div>
                    <div className="font-medium">{inc.turno.codigo}</div>
                    <div className="text-stone-500 text-xs">{inc.turno.servicio?.nombre}</div>
                  </div>
                ) : (
                  <span className="text-stone-400">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                {inc.trabajador ? (
                  <div>
                    <div className="font-medium">{inc.trabajador.nombre}</div>
                    <div className="text-stone-500 text-xs">{inc.trabajador.tipo}</div>
                  </div>
                ) : (
                  <span className="text-stone-400">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADOS[inc.estado] || 'bg-stone-100 text-stone-800'}`}>
                  {ESTADOS_LABELS[inc.estado] || inc.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-500 text-xs">
                {formatDate(inc.creadaEn)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(inc)}
                    className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(inc)}
                    className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
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