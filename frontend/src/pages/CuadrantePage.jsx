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

const DIA_CLASS = {
  NORMAL: 'bg-white text-stone-500 border-t-2 border-transparent',
  FESTIVO: 'bg-amber-100 text-amber-900 border-t-2 border-amber-500',
  NO_LECTIVO: 'bg-sky-100 text-sky-900 border-t-2 border-sky-500',
};

const DIA_LEGEND = [
  { id: 'normal', label: 'Normal', className: 'border border-stone-200 bg-white' },
  { id: 'festivo', label: 'Festivo', className: 'border border-amber-300 bg-amber-100' },
  { id: 'no-lectivo', label: 'No lectivo', className: 'border border-sky-300 bg-sky-100' },
];

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'vigilancia', label: 'Vigilancia' },
  { id: 'auxiliares', label: 'Auxiliares' },
  { id: 'descubierto', label: 'Solo descubierto' },
];

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const YEAR = 2026;

function hasDescubierto(servicio) {
  return servicio.celdas.some((celda) => celda.turnos.some((turno) => turno.estado === 'DESCUBIERTO' || turno.verificacionEstado === 'DESCUBIERTO'));
}

function getDiaClass(dia) {
  return DIA_CLASS[dia.tipoDia] || DIA_CLASS.NORMAL;
}

function getTurnoClass(turno) {
  if (turno.verificacionEstado === 'DESCUBIERTO') return 'cuadrante-alerta-danger bg-red-600 text-white ring-2 ring-red-300';
  if (turno.verificacionEstado === 'INCIDENCIA') return 'cuadrante-alerta-warn bg-amber-500 text-white ring-2 ring-amber-300';
  if (turno.estado === 'DESCUBIERTO') return 'bg-red-600 text-white';
  return TURNO_CLASS[turno.codigo] || 'bg-stone-300 text-stone-800';
}

function getTurnoLabel(turno) {
  if (turno.estado === 'DESCUBIERTO' || turno.verificacionEstado === 'DESCUBIERTO') return 'x';
  if (turno.verificacionEstado === 'INCIDENCIA') return '!';
  return turno.codigo;
}

function getTurnoTitle(turno) {
  if (turno.verificacionEstado) {
    return `${turno.verificacionEstado}${turno.verificacionResumen ? ` - ${turno.verificacionResumen}` : ''}`;
  }
  return turno.estado === 'DESCUBIERTO' ? 'Sin cubrir' : turno.estado;
}

export default function CuadrantePage({ currentRoute, onNavigate, onLogout, user }) {
  const [cuadrante, setCuadrante] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedLabel = `${MONTHS[selectedMonth - 1]} ${YEAR}`;

  useEffect(() => {
    async function loadCuadrante() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getCuadranteMensual({ anio: YEAR, mes: selectedMonth });
        setCuadrante(payload.data || payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCuadrante();
  }, [selectedMonth]);

  function goToPreviousMonth() {
    setSelectedMonth((month) => Math.max(1, month - 1));
  }

  function goToNextMonth() {
    setSelectedMonth((month) => Math.min(12, month + 1));
  }

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
      subtitle={`Visualizacion por servicio - ${selectedLabel}`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center rounded-full border border-stone-200 bg-white">
          <button
            type="button"
            onClick={goToPreviousMonth}
            disabled={selectedMonth === 1}
            className="p-2 text-stone-500 disabled:cursor-not-allowed disabled:text-stone-300"
            title="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <label className="sr-only" htmlFor="month-select">Seleccionar mes</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(Number(event.target.value))}
            className="h-9 min-w-32 border-x border-stone-100 bg-white px-3 text-sm font-semibold text-stone-800 outline-none"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>{month} {YEAR}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={selectedMonth === 12}
            className="p-2 text-stone-500 disabled:cursor-not-allowed disabled:text-stone-300"
            title="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
        <span><b className="cuadrante-alerta-danger mr-1 inline-block h-3 w-3 bg-red-600 align-middle" />Descubierto verificado</span>
        <span><b className="cuadrante-alerta-warn mr-1 inline-block h-3 w-3 bg-amber-500 align-middle" />Incidencia verificada</span>
        <span className="h-4 w-px bg-stone-200" />
        {DIA_LEGEND.map((item) => (
          <span key={item.id}><b className={`mr-1 inline-block h-3 w-3 align-middle ${item.className}`} />{item.label}</span>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-stone-500">Cargando cuadrante mensual...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : cuadrante && (
        <div>
          {cuadrante.origen === 'patron' && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Mes sin turnos persistidos: se muestra la planificacion base calculada por modalidad del servicio.
            </div>
          )}
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="min-w-[1480px]">
            <div className="grid border-b border-stone-200 bg-stone-50" style={{ gridTemplateColumns: `190px repeat(${cuadrante.dias.length}, minmax(38px, 1fr))` }}>
              <div className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-500">Servicio</div>
              {cuadrante.dias.map((dia) => (
                <div
                  key={dia.dia}
                  className={`px-1 py-3 text-center text-xs font-bold ${getDiaClass(dia)}`}
                  title={`${dia.fecha} - ${dia.tipoDiaLabel || 'Normal'}`}
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
                          className={`h-5 rounded-sm text-center text-[10px] font-bold leading-5 ${getTurnoClass(turno)}`}
                          title={getTurnoTitle(turno)}
                        >
                          {getTurnoLabel(turno)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
