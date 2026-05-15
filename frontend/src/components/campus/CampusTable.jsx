import { Edit2 } from 'lucide-react';

export default function CampusTable({ campusList, onEdit }) {
  if (!campusList || campusList.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded-lg bg-white">
        No hay campus registrados.
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Código</th>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Ciudad</th>
              <th className="px-6 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {campusList.map((campus) => (
              <tr key={campus.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-stone-500">{campus.id}</td>
                <td className="px-6 py-4 font-mono text-xs text-stone-900">{campus.codigo}</td>
                <td className="px-6 py-4 font-medium text-stone-900">{campus.nombre}</td>
                <td className="px-6 py-4 text-stone-600">{campus.ciudad || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(campus)}
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
