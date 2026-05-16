import { useEffect, useMemo, useState } from 'react';
import { getCuadranteMensual } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const TURNO_CLASS = {
  M: 'bg-[#5b8a9c] text-white',
  T: 'bg-[#c97a3f] text-white',
  N: 'bg-[#4a4742] text-white',
  D: 'bg-[#6b7e5b] text-white',
};

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'vigilancia', label: 'Vigilancia' },
  { id: 'auxiliares', label: 'Auxiliares' },
  { id: 'descubierto', label: 'Solo descubierto' },
];

function hasDescubierto(servicio) {
  return servicio.celdas.some((celda) => celda.turnos.some((turno) => turno.estado === 'DESCUBIERTO'));
}

export default function CuadrantePage({ currentRoute, onNavigate, onLogout, user }) {
  const [cuadrante, setCuadrante] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCuadrante() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getCuadranteMensual({ anio: 2026, mes: 5 });
        setCuadrante(payload.data || payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCuadrante();
  }, []);

  const serviciosFiltrados = useMemo(() => {
    if (!cuadrante) return [];
    return cuadrante.servicios.filter((servicio) => {
      if (filtro === 'vigilancia') return ['Vigilancia', 'Coordinacion'].includes(servicio.tipo);
      if (filtro === 'auxiliares') return servicio.tipo === 'Auxiliar';
      if (filtro === 'descubierto') return hasDescubierto(servicio);
      return true;
    });
  }, [cuadrante, filtro]);

  return (
    <AppLayout
      isConnected={!error}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Cuadrante mensual"
      subtitle="Visualizacion por servicio - Mayo 2026"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center rounded-full border border-stone-200 bg-white">
          <button className="p-2 text-stone-400" title="Disponible en siguientes fases"><ChevronLeft className="h-4 w-4" /></button>
          <span className="px-4 text-sm font-semibold text-stone-800">Mayo 2026</span>
          <button className="p-2 text-stone-400" title="Disponible en siguientes fases"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFiltro(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${filtro === item.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-700'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-600">
          <Download className="h-4 w-4" />
          Exportar Excel
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-stone-500">
        <span><b className="mr-1 inline-block h-3 w-3 bg-[#5b8a9c] align-middle" />Mañana</span>
        <span><b className="mr-1 inline-block h-3 w-3 bg-[#c97a3f] align-middle" />Tarde</span>
        <span><b className="mr-1 inline-block h-3 w-3 bg-[#4a4742] align-middle" />Noche</span>
        <span><b className="mr-1 inline-block h-3 w-3 bg-[#6b7e5b] align-middle" />Diurno</span>
        <span><b className="mr-1 inline-block h-3 w-3 bg-red-600 align-middle" />Sin cubrir</span>
      </div>

      {loading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-stone-500">Cargando cuadrante mensual...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : cuadrante && (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="min-w-[1480px]">
            <div className="grid border-b border-stone-200 bg-stone-50" style={{ gridTemplateColumns: `190px repeat(${cuadrante.dias.length}, minmax(38px, 1fr))` }}>
              <div className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-500">Servicio</div>
              {cuadrante.dias.map((dia) => (
                <div
                  key={dia.dia}
                  className={`px-1 py-3 text-center text-xs font-bold ${dia.festivo ? 'bg-amber-100 text-amber-800' : dia.finSemana ? 'bg-stone-100 text-amber-700' : 'text-stone-500'}`}
                >
                  {dia.dia}
                </div>
              ))}
            </div>
            {serviciosFiltrados.map((servicio) => (
              <div key={servicio.id} className="grid border-b border-stone-100 last:border-b-0 hover:bg-stone-50" style={{ gridTemplateColumns: `190px repeat(${cuadrante.dias.length}, minmax(38px, 1fr))` }}>
                <div className="px-4 py-3">
                  <div className="text-sm font-semibold text-stone-800">{servicio.nombre}</div>
                  <div className="text-xs text-stone-500">{servicio.subtitulo}</div>
                </div>
                {servicio.celdas.map((celda) => (
                  <div key={`${servicio.id}-${celda.dia}`} className="min-h-[46px] border-l border-stone-100 p-1">
                    <div className="flex flex-col gap-1">
                      {celda.turnos.map((turno) => (
                        <div
                          key={turno.id}
                          className={`h-5 rounded-sm text-center text-[10px] font-bold leading-5 ${turno.estado === 'DESCUBIERTO' ? 'bg-red-600 text-white' : TURNO_CLASS[turno.codigo] || 'bg-stone-300 text-stone-800'}`}
                          title={turno.estado === 'DESCUBIERTO' ? 'Sin cubrir' : turno.estado}
                        >
                          {turno.estado === 'DESCUBIERTO' ? 'x' : turno.codigo}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
