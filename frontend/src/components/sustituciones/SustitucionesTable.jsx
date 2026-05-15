import { Pencil, Trash2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES');
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function SustitucionesTable({ sustituciones, onEdit, onDelete }) {
  if (!sustituciones || sustituciones.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        No hay sustituciones registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-100 text-stone-700">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Turno</th>
            <th className="px-4 py-3 text-left font-medium">Original</th>
            <th className="px-4 py-3 text-left font-medium">Sustituto</th>
            <th className="px-4 py-3 text-left font-medium">Motivo</th>
            <th className="px-4 py-3 text-left font-medium">Preaviso</th>
            <th className="px-4 py-3 text-left font-medium">Fecha</th>
            <th className="px-4 py-3 text-center font-medium w-24">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {sustituciones.map((sust) => (
            <tr key={sust.id} className="hover:bg-stone-50">
              <td className="px-4 py-3">
                <div className="font-medium">{sust.turno?.codigo || sust.turnoId}</div>
                <div className="text-stone-500 text-xs">
                  {sust.turno ? (
                    <>
                      {formatDate(sust.turno.fecha)} {formatTime(sust.turno.horaInicio)}-{formatTime(sust.turno.horaFin)}
                    </>
                  ) : sust.turnoId}
                </div>
              </td>
              <td className="px-4 py-3">
                {sust.trabajadorOriginal ? (
                  <div>
                    <div className="font-medium">{sust.trabajadorOriginal.nombre}</div>
                    <div className="text-stone-500 text-xs">{sust.trabajadorOriginal.tipo}</div>
                  </div>
                ) : sust.trabajadorOriginalId}
              </td>
              <td className="px-4 py-3">
                {sust.trabajadorSustituto ? (
                  <div>
                    <div className="font-medium text-blue-700">{sust.trabajadorSustituto.nombre}</div>
                    <div className="text-stone-500 text-xs">{sust.trabajadorSustituto.tipo}</div>
                  </div>
                ) : (
                  <span className="text-stone-400 italic">Sin asignar</span>
                )}
              </td>
              <td className="px-4 py-3 text-stone-600 max-w-xs truncate">{sust.motivo}</td>
              <td className="px-4 py-3">
                {sust.cumplePreaviso === null ? (
                  <span className="text-stone-400 text-xs">-</span>
                ) : sust.cumplePreaviso ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Si
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    No
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-stone-500 text-xs">
                {formatDate(sust.creadoEn)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(sust)}
                    className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(sust)}
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