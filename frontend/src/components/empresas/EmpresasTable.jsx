import { Edit2 } from 'lucide-react';

export default function EmpresasTable({ empresas, onEdit }) {
  if (!empresas || empresas.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded-lg bg-white">
        No hay empresas registradas.
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
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">CIF</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
              <th className="px-6 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {empresas.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-stone-500">{empresa.id}</td>
                <td className="px-6 py-4 font-medium text-stone-900">{empresa.nombre}</td>
                <td className="px-6 py-4 text-stone-600">{empresa.cif || '-'}</td>
                <td className="px-6 py-4">
                  {empresa.activa ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-800">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(empresa)}
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
