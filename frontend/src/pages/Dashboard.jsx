import { useEffect, useMemo, useState } from 'react';
import {
  createVerificacionesLote,
  getInformeOperativo,
  getResumenOperativo,
} from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, CalendarDays, Check, ChevronLeft, ChevronRight, FileText, Loader2, Printer, X } from 'lucide-react';

const TURNOS = [
  { codigo: 'M', label: 'Mañana', color: '#5b8a9c' },
  { codigo: 'T', label: 'Tarde', color: '#c97a3f' },
  { codigo: 'N', label: 'Noche', color: '#4a4742' },
];

const ESTADOS = {
  PENDIENTE: 'pending',
  CUBIERTO: 'ok',
  INCIDENCIA: 'warn',
  DESCUBIERTO: 'danger',
};

const SERVICE_DATE_MIN = '2026-05-01';
const SERVICE_DATE_MAX = '2026-05-31';

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-ES');
}

function todayForDemo() {
  return '2026-05-16';
}

function clampServiceDate(value) {
  if (!value) return todayForDemo();
  if (value < SERVICE_DATE_MIN) return SERVICE_DATE_MIN;
  if (value > SERVICE_DATE_MAX) return SERVICE_DATE_MAX;
  return value;
}

function addDays(value, amount) {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return clampServiceDate(date.toISOString().slice(0, 10));
}

function formatServiceDate(value) {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function KpiCard({ label, value, unit, sub, tone = 'neutral', progress }) {
  const toneClass = {
    neutral: 'text-stone-900',
    good: 'text-emerald-700',
    warn: 'text-amber-700',
    danger: 'text-red-700',
  }[tone];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</div>
      <div className={`mt-5 font-serif text-4xl font-semibold ${toneClass}`}>
        {value}<span className="ml-1 font-sans text-sm font-semibold">{unit}</span>
      </div>
      <div className="mt-2 text-xs text-stone-500">{sub}</div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-amber-600" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function statusClass(status) {
  if (status === 'ok') return 'border-emerald-300 bg-emerald-50';
  if (status === 'warn') return 'border-amber-300 bg-amber-50';
  if (status === 'danger') return 'border-red-300 bg-red-50';
  return 'border-stone-200 bg-white';
}

function AlertItem({ alerta }) {
  const classes = {
    danger: 'border-red-200 bg-red-50 text-red-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  }[alerta.tipo] || 'border-stone-200 bg-stone-50 text-stone-700';

  return (
    <div className={`rounded-md border p-4 ${classes}`}>
      <div className="font-semibold">{alerta.titulo}</div>
      <div className="mt-1 text-xs opacity-80">{alerta.meta}</div>
    </div>
  );
}

export default function Dashboard({ currentRoute, onNavigate, onLogout, user }) {
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [states, setStates] = useState({});
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayForDemo());

  useEffect(() => {
    async function loadResumen() {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          TURNOS.map(async (item) => {
            const payload = await getResumenOperativo({ fecha: selectedDate, turno: item.codigo });
            return [item.codigo, payload.data || payload];
          }),
        );
        const summariesByTurno = Object.fromEntries(responses);
        setSummaries(summariesByTurno);
        setStates(Object.fromEntries(responses.map(([codigo, data]) => [
          codigo,
          Object.fromEntries(data.serviciosVerificacion.map((item) => [
            item.puestoId,
            ESTADOS[item.estado] || 'pending',
          ])),
        ])));
        setNotes(Object.fromEntries(responses.map(([codigo, data]) => [
          codigo,
          Object.fromEntries(data.serviciosVerificacion.map((item) => [item.puestoId, item.nota || ''])),
        ])));
        setFeedback(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadResumen();
  }, [selectedDate]);

  const turnosResumen = useMemo(() => (
    TURNOS
      .map((item) => summaries[item.codigo])
      .filter(Boolean)
  ), [summaries]);
  const resumen = turnosResumen[0];
  const selectedDateLabel = formatServiceDate(selectedDate);

  const dynamicAlerts = useMemo(() => {
    return turnosResumen.flatMap((turnoResumen) => (
      turnoResumen.serviciosVerificacion.flatMap((servicio) => {
        const turnoStates = states[turnoResumen.turno.codigo] || {};
        const turnoNotes = notes[turnoResumen.turno.codigo] || {};
        const state = turnoStates[servicio.puestoId];
        const note = turnoNotes[servicio.puestoId];
        if (state === 'danger') {
          return [{
            tipo: 'danger',
            titulo: `Servicio descubierto - ${servicio.nombre}${servicio.etiqueta ? ` (${servicio.etiqueta})` : ''}`,
            meta: `${turnoResumen.turno.nombre} - Marcado por la contrata - Sin cobertura${note ? ` - ${note}` : ''}`,
          }];
        }
        if (state === 'warn') {
          return [{
            tipo: 'warn',
            titulo: `Incidencia en ${servicio.nombre}${servicio.etiqueta ? ` (${servicio.etiqueta})` : ''}`,
            meta: `${turnoResumen.turno.nombre} - Requiere revision${note ? ` - ${note}` : ''}`,
          }];
        }
        return [];
      })
    ));
  }, [notes, states, turnosResumen]);

  const getDoneCount = (turnoResumen) => {
    const turnoStates = states[turnoResumen.turno.codigo] || {};
    return turnoResumen.serviciosVerificacion.filter((item) => turnoStates[item.puestoId] !== 'pending').length;
  };

  const setServiceStatus = (turnoCodigo, puestoId, status) => {
    setStates((prev) => ({
      ...prev,
      [turnoCodigo]: {
        ...(prev[turnoCodigo] || {}),
        [puestoId]: prev[turnoCodigo]?.[puestoId] === status ? 'pending' : status,
      },
    }));
  };

  const markAllOk = () => {
    if (!resumen) return;
    setStates(Object.fromEntries(turnosResumen.map((turnoResumen) => [
      turnoResumen.turno.codigo,
      Object.fromEntries(turnoResumen.serviciosVerificacion.map((item) => [item.puestoId, 'ok'])),
    ])));
    setNotes({});
  };

  const confirmVerification = async () => {
    if (!resumen) return;
    const pendientes = turnosResumen.flatMap((turnoResumen) => {
      const turnoStates = states[turnoResumen.turno.codigo] || {};
      return turnoResumen.serviciosVerificacion.filter((item) => turnoStates[item.puestoId] === 'pending');
    });
    if (pendientes.length > 0) {
      setFeedback({ type: 'error', message: `Quedan ${pendientes.length} servicios sin marcar.` });
      return;
    }

    setSaving(true);
    try {
      await Promise.all(turnosResumen.map((turnoResumen) => (
        createVerificacionesLote({
          fecha: turnoResumen.fecha,
          turno: turnoResumen.turno.codigo,
          verificaciones: turnoResumen.serviciosVerificacion.map((item) => ({
            puestoId: item.puestoId,
            estado: states[turnoResumen.turno.codigo]?.[item.puestoId],
            nota: notes[turnoResumen.turno.codigo]?.[item.puestoId] || null,
          })),
        })
      )));
      setFeedback({ type: 'success', message: 'Turnos verificados correctamente.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const openReport = async (tipo) => {
    setReportPickerOpen(false);
    setReportLoading(true);
    try {
      const payload = await getInformeOperativo({ tipo, fecha: selectedDate, anio: 2026, mes: 5 });
      setReport(payload.data || payload);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <AppLayout
      isConnected={!error}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Resumen operativo"
      subtitle="Mayo 2026 - Vista actual del servicio de vigilancia"
      actions={
        <button
          type="button"
          onClick={() => setReportPickerOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          <FileText className="h-4 w-4" />
          Generar informe
        </button>
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Dia de servicio</div>
            <div className="font-serif text-xl font-semibold text-stone-900">{selectedDateLabel}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate((current) => addDays(current, -1))}
            disabled={selectedDate <= SERVICE_DATE_MIN}
            title="Dia anterior"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="date"
            min={SERVICE_DATE_MIN}
            max={SERVICE_DATE_MAX}
            value={selectedDate}
            onChange={(event) => setSelectedDate(clampServiceDate(event.target.value))}
            className="h-10 rounded-md border border-stone-300 px-3 text-sm font-medium text-stone-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => setSelectedDate((current) => addDays(current, 1))}
            disabled={selectedDate >= SERVICE_DATE_MAX}
            title="Dia siguiente"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Cargando resumen operativo...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <AlertCircle className="mr-2 inline h-5 w-5" />
          {error}
        </div>
      ) : resumen && (
        <div className="space-y-8">
          <section className="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-700 font-serif text-2xl text-white">
                  3
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Verificacion de cobertura</div>
                  <h2 className="font-serif text-2xl font-semibold text-stone-900">
                    Turnos del cuadrante diario
                  </h2>
                  <p className="text-sm text-stone-500">{selectedDateLabel}</p>
                </div>
              </div>
              <div className="grid gap-3 text-right sm:grid-cols-3">
                {turnosResumen.map((turnoResumen) => (
                  <div key={turnoResumen.turno.codigo}>
                    <div className="font-serif text-3xl font-semibold text-stone-900">
                      {getDoneCount(turnoResumen)}<span className="text-base text-stone-500">/{turnoResumen.serviciosVerificacion.length}</span>
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">{turnoResumen.turno.nombre}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {turnosResumen.map((turnoResumen) => (
                <div key={turnoResumen.turno.codigo} className="overflow-hidden rounded-lg border border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ background: TURNOS.find((item) => item.codigo === turnoResumen.turno.codigo)?.color }}
                        >
                          {turnoResumen.turno.codigo}
                        </span>
                        <h3 className="font-serif text-lg font-semibold text-stone-900">{turnoResumen.turno.nombre}</h3>
                      </div>
                      <div className="mt-1 text-xs text-stone-500">{turnoResumen.turno.rango}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl font-semibold text-stone-900">
                        {getDoneCount(turnoResumen)}<span className="text-sm text-stone-500">/{turnoResumen.serviciosVerificacion.length}</span>
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">Verificados</div>
                    </div>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {turnoResumen.serviciosVerificacion.map((servicio) => {
                      const turnoCodigo = turnoResumen.turno.codigo;
                      const state = states[turnoCodigo]?.[servicio.puestoId] || 'pending';
                      const needsNote = state === 'warn' || state === 'danger';
                      return (
                        <div key={servicio.puestoId} className={`p-3 transition-colors ${statusClass(state)}`}>
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold text-stone-800">
                                {servicio.nombre}
                                {servicio.etiqueta && <span className="ml-2 rounded bg-stone-200 px-2 py-0.5 text-[10px] uppercase text-stone-600">{servicio.etiqueta}</span>}
                                {servicio.perfilRequerido === 'AUXILIAR' && <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] uppercase text-emerald-700">Auxiliar</span>}
                              </div>
                              <div className="truncate text-xs text-stone-500">{servicio.meta}</div>
                            </div>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
                              {servicio.iniciales}
                            </div>
                          </div>
                          <div className="mt-3 flex gap-1">
                            <button title="Cubierto" onClick={() => setServiceStatus(turnoCodigo, servicio.puestoId, 'ok')} className={`h-9 flex-1 rounded border ${state === 'ok' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}><Check className="mx-auto h-4 w-4" /></button>
                            <button title="Incidencia" onClick={() => setServiceStatus(turnoCodigo, servicio.puestoId, 'warn')} className={`h-9 flex-1 rounded border font-bold ${state === 'warn' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}>!</button>
                            <button title="Descubierto" onClick={() => setServiceStatus(turnoCodigo, servicio.puestoId, 'danger')} className={`h-9 flex-1 rounded border ${state === 'danger' ? 'border-red-600 bg-red-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}><X className="mx-auto h-4 w-4" /></button>
                          </div>
                          {needsNote && (
                            <textarea
                              value={notes[turnoCodigo]?.[servicio.puestoId] || ''}
                              onChange={(event) => setNotes((prev) => ({
                                ...prev,
                                [turnoCodigo]: {
                                  ...(prev[turnoCodigo] || {}),
                                  [servicio.puestoId]: event.target.value,
                                },
                              }))}
                              className="mt-3 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              rows="2"
                              placeholder={state === 'danger' ? 'Descripcion del descubierto' : 'Descripcion de la incidencia'}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
              <div className="text-sm text-stone-500">Solo lectura UZ - la verificacion la realiza el operador CECO de la contrata</div>
              <div className="flex gap-2">
                <button onClick={markAllOk} className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">Marcar todos cubiertos</button>
                <button onClick={confirmVerification} disabled={saving} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
                  {saving ? 'Guardando...' : 'Confirmar verificacion'}
                </button>
              </div>
            </div>
          </section>

          {feedback && (
            <div className={`rounded-md border p-4 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {feedback.message}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-4">
            <KpiCard label="Cobertura del mes" value={String(resumen.kpis.coberturaMes).replace('.', ',')} unit="%" sub="1,2% vs abril" tone="good" progress={resumen.kpis.coberturaMes} />
            <KpiCard label="Horas planificadas" value={formatNumber(resumen.kpis.horasPlanificadas)} unit="h" sub="Mayo 2026" />
            <KpiCard label="Horas ejecutadas" value={formatNumber(resumen.kpis.horasEjecutadas)} unit="h" sub={`${Math.abs(resumen.kpis.desviacionHoras)}h sobre planificado`} tone="warn" />
            <KpiCard label="Acumulado anual" value={formatNumber(resumen.kpis.acumuladoAnual)} unit={`/ ${formatNumber(resumen.kpis.contratoAnual)}h`} sub={`${String(resumen.kpis.avanceContrato).replace('.', ',')}% del contrato`} progress={resumen.kpis.avanceContrato} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-stone-900">Cobertura por campus</h2>
                  <p className="text-sm text-stone-500">Servicios fijos 24/7 - Mayo 2026</p>
                </div>
                <button onClick={() => onNavigate?.('cuadrante')} className="text-sm font-semibold text-amber-700">Ver cuadrante</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-stone-500">
                    <tr><th className="pb-3">Servicio</th><th className="pb-3">Dotacion</th><th className="pb-3">Horas mes</th><th className="pb-3">Estado</th></tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {resumen.coberturaCampus.map((item) => (
                      <tr key={item.servicioId}>
                        <td className="py-3"><strong>{item.servicio}</strong><div className="text-xs text-stone-500">{item.detalle}</div></td>
                        <td className="py-3 font-mono text-xs">{item.dotacion}</td>
                        <td className="py-3 font-mono text-xs">{formatNumber(item.horasMes)} h</td>
                        <td className="py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.severidad === 'success' ? 'bg-emerald-100 text-emerald-800' : item.severidad === 'warn' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{item.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-stone-900">Alertas activas</h2>
              <p className="mb-4 text-sm text-stone-500">Pendientes de revision</p>
              <div className="space-y-3">
                {[...dynamicAlerts, ...resumen.alertas].map((alerta, index) => (
                  <AlertItem key={`${alerta.titulo}-${index}`} alerta={alerta} />
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-700" />
              <h2 className="font-serif text-xl font-semibold text-stone-900">Ultimas sustituciones</h2>
            </div>
            {resumen.sustituciones.length === 0 ? (
              <div className="rounded-md border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">No hay sustituciones reales recientes registradas.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-stone-500">
                    <tr><th>Fecha turno</th><th>Servicio</th><th>Original</th><th>Sustituto</th><th>Motivo</th><th>Aviso</th></tr>
                  </thead>
                  <tbody>{resumen.sustituciones.map((item) => <tr key={item.id}><td>{item.fecha}</td><td>{item.servicio}</td><td>{item.original}</td><td>{item.sustituto}</td><td>{item.motivo}</td><td>{item.cumplePreaviso ? 'En plazo' : 'Revisar'}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </section>

          {reportLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="rounded-lg bg-white px-6 py-4 text-stone-700 shadow-xl">
                <Loader2 className="mr-2 inline h-5 w-5 animate-spin" /> Preparando informe...
              </div>
            </div>
          )}

          {reportPickerOpen && <ReportPicker onClose={() => setReportPickerOpen(false)} onSelect={openReport} />}
          {report && <ReportPreview report={report} onClose={() => setReport(null)} />}
        </div>
      )}
    </AppLayout>
  );
}

function ReportPicker({ onClose, onSelect }) {
  const options = [
    { id: 'diario', title: 'Dia actual', text: 'Informe basico de cobertura, verificaciones y alertas del dia.' },
    { id: 'mensual', title: 'Informe mensual', text: 'Resumen de mayo 2026 con horas, incidencias y validacion.' },
    { id: 'anual', title: 'Informe anual', text: 'Seguimiento acumulado 2026 frente al contrato anual.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Seleccionar tipo de informe</h2>
            <p className="mt-1 text-sm text-stone-500">Elige el alcance antes de generar la vista previa imprimible.</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-stone-500 hover:bg-stone-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="rounded-lg border border-stone-200 p-5 text-left transition hover:border-amber-500 hover:bg-amber-50"
            >
              <div className="font-serif text-xl font-semibold text-stone-900">{option.title}</div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{option.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportPreview({ report, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 p-6 print:static print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl rounded-lg bg-white shadow-2xl print:shadow-none">
        <div className="flex items-center justify-between border-b border-stone-200 px-8 py-5 print:hidden">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Vista previa del informe</div>
            <div className="font-serif text-xl font-semibold">{report.periodo}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white"><Printer className="h-4 w-4" /> Imprimir / PDF</button>
            <button onClick={onClose} className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium">Cerrar</button>
          </div>
        </div>
        <article className="p-8">
          <div className="border-b border-stone-200 pb-6">
            <div className="text-xs uppercase tracking-[0.22em] text-amber-700">Unidad de Seguridad - Universidad de Zaragoza</div>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-950">{report.titulo}</h1>
            <div className="mt-2 text-sm text-stone-500">{report.periodo} - Ref. {report.referencia}</div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {report.kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-md border border-stone-200 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">{kpi.label}</div>
                <div className="mt-3 font-serif text-2xl font-semibold">{formatNumber(kpi.value)}{kpi.unit && <span className="ml-1 text-sm">{kpi.unit}</span>}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-8">
            {report.sections.map((section, index) => (
              <section key={section.title}>
                <h2 className="font-serif text-xl font-semibold text-stone-900">{index + 1}. {section.title}</h2>
                <div className="mt-3 overflow-x-auto">
                  <GenericRows rows={section.rows} />
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 grid gap-6 border-t border-stone-200 pt-8 md:grid-cols-2">
            <div className="border-t border-stone-400 pt-3 text-sm text-stone-600">Responsable Unidad de Seguridad</div>
            <div className="border-t border-stone-400 pt-3 text-sm text-stone-600">Responsable empresa adjudicataria</div>
          </div>
        </article>
      </div>
    </div>
  );
}

function GenericRows({ rows }) {
  if (!rows?.length) return <div className="rounded-md border border-dashed border-stone-300 p-4 text-sm text-stone-500">Sin registros.</div>;
  const keys = Object.keys(rows[0]);

  const getRowTone = (row) => {
    const state = String(row.estado || row.tipo || '').toLowerCase();
    if (['cubierto', 'ok', 'success'].includes(state)) {
      return 'border-l-4 border-emerald-500 bg-emerald-50 text-emerald-950';
    }
    if (['danger', 'descubierto'].includes(state)) {
      return 'border-l-4 border-red-500 bg-red-50 text-red-950';
    }
    if (['warn', 'incidencia', 'pendiente'].includes(state)) {
      return 'border-l-4 border-amber-500 bg-amber-50 text-amber-950';
    }
    return '';
  };

  const getCellTone = (key, value) => {
    const normalized = String(value || '').toLowerCase();
    if (['estado', 'tipo'].includes(key) && ['cubierto', 'ok', 'success'].includes(normalized)) {
      return 'font-bold uppercase text-emerald-700';
    }
    if (['estado', 'tipo'].includes(key) && ['danger', 'descubierto'].includes(normalized)) {
      return 'font-bold uppercase text-red-700';
    }
    if (['estado', 'tipo'].includes(key) && ['warn', 'incidencia', 'pendiente'].includes(normalized)) {
      return 'font-bold uppercase text-amber-700';
    }
    return '';
  };

  return (
    <table className="w-full text-left text-sm">
      <thead className="text-[11px] uppercase tracking-wider text-stone-500">
        <tr>{keys.map((key) => <th key={key} className="pb-2 pr-4">{key}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {rows.map((row, index) => (
          <tr key={index} className={getRowTone(row)}>
            {keys.map((key) => (
              <td key={key} className={`py-2 pr-4 align-top ${key === keys[0] && getRowTone(row) ? 'pl-3' : ''} ${getCellTone(key, row[key])}`}>
                {String(row[key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
