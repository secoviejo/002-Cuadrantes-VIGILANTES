import { Edit2 } from 'lucide-react';

export default function ServiciosTable({ servicios, onEdit }) {
  if (!servicios || servicios.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded-lg bg-white">
        No hay servicios registrados.
      </div>
    );
  }

  const getPerfilBadge = (perfil) => {
    const colors = {
      VIGILANTE: 'bg-blue-100 text-blue-800',
      AUXILIAR: 'bg-green-100 text-green-800',
      CUALQUIERA: 'bg-stone-100 text-stone-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[perfil] || 'bg-stone-100'}`}>
        {perfil}
      </span>
    );
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Codigo</th>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Perfil</th>
              <th className="px-6 py-3 font-semibold">Dotacion</th>
              <th className="px-6 py-3 font-semibold">Edificio</th>
              <th className="px-6 py-3 font-semibold">Activo</th>
              <th className="px-6 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-stone-500">{servicio.id}</td>
                <td className="px-6 py-4 font-mono text-xs text-stone-900">{servicio.codigo}</td>
                <td className="px-6 py-4 font-medium text-stone-900">{servicio.nombre}</td>
                <td className="px-6 py-4">{getPerfilBadge(servicio.perfilRequerido)}</td>
                <td className="px-6 py-4 text-stone-600">{servicio.dotacionMinima}</td>
                <td className="px-6 py-4 text-stone-600">
                  {servicio.edificio 
                    ? `${servicio.edificio.nombre} (${servicio.edificio.campus?.nombre || 'N/A'})`
                    : servicio.edificioId || '-'
                  }
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    servicio.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {servicio.activo ? 'Si' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(servicio)}
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