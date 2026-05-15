import { useState, useEffect } from 'react';
import { getEmpresas, getCampus, getEdificios, getServicios, getTrabajadores } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/ui/StatCard';
import { Users, CalendarDays, Loader2, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    empresas: [],
    campus: [],
    edificios: [],
    servicios: [],
    trabajadores: []
  });
  
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    connected: null
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [empresas, campus, edificios, servicios, trabajadores] = await Promise.all([
          getEmpresas(),
          getCampus(),
          getEdificios(),
          getServicios(),
          getTrabajadores()
        ]);
        
        setData({ empresas, campus, edificios, servicios, trabajadores });
        setStatus({ loading: false, error: null, connected: true });
      } catch (err) {
        setStatus({ loading: false, error: err.message, connected: false });
      }
    }
    
    loadData();
  }, []);

  return (
    <AppLayout isConnected={status.connected}>
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard label="Empresas" value={data.empresas.length} loading={status.loading} />
        <StatCard label="Campus" value={data.campus.length} loading={status.loading} />
        <StatCard label="Edificios" value={data.edificios.length} loading={status.loading} />
        <StatCard label="Trabajadores" value={data.trabajadores.length} loading={status.loading} />
        <StatCard label="Servicios" value={data.servicios.length} loading={status.loading} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Trabajadores */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
              <Users className="text-amber-700 w-5 h-5" />
              Trabajadores
            </h2>
          </div>
          
          {status.loading ? (
            <div className="flex items-center justify-center p-8 text-stone-400">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Cargando datos...
            </div>
          ) : status.error ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Error: {status.error}
            </div>
          ) : data.trabajadores.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded">
              No hay trabajadores registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-300 text-[11px] uppercase tracking-wider text-stone-500">
                    <th className="pb-3 font-semibold">Nombre Completo</th>
                    <th className="pb-3 font-semibold">DNI</th>
                    <th className="pb-3 font-semibold">Empresa ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {data.trabajadores.slice(0, 5).map(t => (
                    <tr key={t.id} className="hover:bg-stone-100 transition-colors">
                      <td className="py-3">{t.nombre} {t.apellidos}</td>
                      <td className="py-3 font-mono text-xs text-stone-600">{t.dni}</td>
                      <td className="py-3">{t.empresaId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.trabajadores.length > 5 && (
                <div className="mt-3 text-xs text-stone-500 text-center">
                  Mostrando 5 de {data.trabajadores.length}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Servicios */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-2">
              <CalendarDays className="text-amber-700 w-5 h-5" />
              Servicios Activos
            </h2>
          </div>

          {status.loading ? (
            <div className="flex items-center justify-center p-8 text-stone-400">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Cargando datos...
            </div>
          ) : status.error ? (
             <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Error: {status.error}
            </div>
          ) : data.servicios.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm border border-dashed border-stone-300 rounded">
              No hay servicios registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-300 text-[11px] uppercase tracking-wider text-stone-500">
                    <th className="pb-3 font-semibold">Código</th>
                    <th className="pb-3 font-semibold">Tipo</th>
                    <th className="pb-3 font-semibold">Campus ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {data.servicios.slice(0, 5).map(s => (
                    <tr key={s.id} className="hover:bg-stone-100 transition-colors">
                      <td className="py-3 font-medium text-amber-800">{s.codigo}</td>
                      <td className="py-3">
                        <span className="bg-stone-200 text-stone-700 px-2 py-0.5 rounded text-xs">
                          {s.tipo}
                        </span>
                      </td>
                      <td className="py-3">{s.campusId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.servicios.length > 5 && (
                <div className="mt-3 text-xs text-stone-500 text-center">
                  Mostrando 5 de {data.servicios.length}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
