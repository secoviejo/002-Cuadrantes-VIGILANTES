import { Edit2 } from 'lucide-react';

const DEFAULT_FOTO_TRABAJADOR = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f5f5f4'/%3E%3Ccircle cx='80' cy='58' r='30' fill='%23d97706'/%3E%3Cpath d='M30 140c6-34 29-54 50-54s44 20 50 54' fill='%23292524'/%3E%3Cpath d='M50 43h60l-7-16H57z' fill='%2344413c'/%3E%3Cpath d='M48 43h64v13H48z' fill='%235b8a9c'/%3E%3Ccircle cx='68' cy='57' r='4' fill='%23fff7ed'/%3E%3Ccircle cx='92' cy='57' r='4' fill='%23fff7ed'/%3E%3Cpath d='M68 74c7 5 17 5 24 0' stroke='%23fff7ed' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

const TIPOS_LABELS = {
  VIGILANTE: 'Vigilante',
  AUXILIAR: 'Auxiliar',
  JEFE_EQUIPO: 'Jefe de Equipo',
  OTRO: 'Otro',
};

export default function TrabajadoresTable({ trabajadores, onEdit }) {
  if (!trabajadores || trabajadores.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded-lg bg-white">
        No hay trabajadores registrados.
      </div>
    );
  }

  const getTipoBadge = (tipo) => {
    const colors = {
      VIGILANTE: 'bg-blue-100 text-blue-800',
      AUXILIAR: 'bg-green-100 text-green-800',
      JEFE_EQUIPO: 'bg-purple-100 text-purple-800',
      OTRO: 'bg-stone-100 text-stone-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[tipo] || 'bg-stone-100'}`}>
        {TIPOS_LABELS[tipo] || tipo}
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
              <th className="px-6 py-3 font-semibold">Foto</th>
              <th className="px-6 py-3 font-semibold">Codigo</th>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Tipo</th>
              <th className="px-6 py-3 font-semibold">Empresa</th>
              <th className="px-6 py-3 font-semibold">ID.Prof.</th>
              <th className="px-6 py-3 font-semibold">Activo</th>
              <th className="px-6 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {trabajadores.map((trabajador) => (
              <tr key={trabajador.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-stone-500">{trabajador.id}</td>
                <td className="px-6 py-4">
                  <img
                    src={trabajador.fotoUrl || DEFAULT_FOTO_TRABAJADOR}
                    alt={trabajador.nombre}
                    className="h-10 w-10 rounded-full border border-stone-200 object-cover"
                    onError={(event) => {
                      event.currentTarget.src = DEFAULT_FOTO_TRABAJADOR;
                    }}
                  />
                </td>
                <td className="px-6 py-4 font-mono text-xs text-stone-900">{trabajador.codigo}</td>
                <td className="px-6 py-4 font-medium text-stone-900">{trabajador.nombre}</td>
                <td className="px-6 py-4">{getTipoBadge(trabajador.tipo)}</td>
                <td className="px-6 py-4 text-stone-600">
                  {trabajador.empresa ? trabajador.empresa.nombre : (trabajador.empresaId || '-')}
                </td>
                <td className="px-6 py-4 text-stone-600 font-mono text-xs">
                  {trabajador.identificadorProfesional || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    trabajador.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trabajador.activo ? 'Si' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(trabajador)}
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
