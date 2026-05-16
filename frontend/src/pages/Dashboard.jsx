import { useEffect, useMemo, useState } from 'react';
import {
  createVerificacionesLote,
  getInformeOperativo,
  getResumenOperativo,
} from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, Check, FileText, Loader2, Printer, X } from 'lucide-react';

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

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-ES');
}

function todayForDemo() {
  return '2026-05-16';
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
  const [turno, setTurno] = useState('N');
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [states, setStates] = useState({});
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [reportPickerOpen, setReportPickerOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadResumen() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getResumenOperativo({ fecha: todayForDemo(), turno });
        const data = payload.data || payload;
        setResumen(data);
        setStates(Object.fromEntries(data.serviciosVerificacion.map((item) => [
          item.puestoId,
          ESTADOS[item.estado] || 'pending',
        ])));
        setNotes(Object.fromEntries(data.serviciosVerificacion.map((item) => [item.puestoId, item.nota || ''])));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadResumen();
  }, [turno]);

  const dynamicAlerts = useMemo(() => {
    if (!resumen) return [];
    return resumen.serviciosVerificacion.flatMap((servicio) => {
      const state = states[servicio.puestoId];
      const note = notes[servicio.puestoId];
      if (state === 'danger') {
        return [{
          tipo: 'danger',
          titulo: `Servicio descubierto - ${servicio.nombre}${servicio.etiqueta ? ` (${servicio.etiqueta})` : ''}`,
          meta: `${resumen.turno.nombre} en curso - Marcado por la contrata - Sin cobertura${note ? ` - ${note}` : ''}`,
        }];
      }
      if (state === 'warn') {
        return [{
          tipo: 'warn',
          titulo: `Incidencia en ${servicio.nombre}${servicio.etiqueta ? ` (${servicio.etiqueta})` : ''}`,
          meta: `${resumen.turno.nombre} en curso - Requiere revision${note ? ` - ${note}` : ''}`,
        }];
      }
      return [];
    });
  }, [notes, resumen, states]);

  const doneCount = resumen
    ? resumen.serviciosVerificacion.filter((item) => states[item.puestoId] !== 'pending').length
    : 0;

  const setServiceStatus = (puestoId, status) => {
    setStates((prev) => ({
      ...prev,
      [puestoId]: prev[puestoId] === status ? 'pending' : status,
    }));
  };

  const markAllOk = () => {
    if (!resumen) return;
    setStates(Object.fromEntries(resumen.serviciosVerificacion.map((item) => [item.puestoId, 'ok'])));
    setNotes({});
  };

  const confirmVerification = async () => {
    if (!resumen) return;
    const pendientes = resumen.serviciosVerificacion.filter((item) => states[item.puestoId] === 'pending');
    if (pendientes.length > 0) {
      setFeedback({ type: 'error', message: `Quedan ${pendientes.length} servicios sin marcar.` });
      return;
    }

    setSaving(true);
    try {
      await createVerificacionesLote({
        fecha: resumen.fecha,
        turno: resumen.turno.codigo,
        verificaciones: resumen.serviciosVerificacion.map((item) => ({
          puestoId: item.puestoId,
          estado: states[item.puestoId],
          nota: notes[item.puestoId] || null,
        })),
      });
      setFeedback({ type: 'success', message: 'Turno verificado correctamente.' });
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
      const payload = await getInformeOperativo({ tipo, fecha: todayForDemo(), anio: 2026, mes: 5 });
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
                  {resumen.turno.codigo}
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Verificacion de cobertura</div>
                  <h2 className="font-serif text-2xl font-semibold text-stone-900">
                    {resumen.turno.nombre} - {resumen.turno.rango}
                  </h2>
                  <p className="text-sm text-stone-500">Hoy, sabado 16 de mayo de 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="font-serif text-4xl font-semibold text-stone-900">{doneCount}<span className="text-xl text-stone-500">/{resumen.serviciosVerificacion.length}</span></div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Verificados</div>
                </div>
                <div className="flex gap-2">
                  {TURNOS.map((item) => (
                    <button
                      key={item.codigo}
                      type="button"
                      onClick={() => setTurno(item.codigo)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${turno === item.codigo ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-700'}`}
                    >
                      <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: item.color }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {resumen.serviciosVerificacion.map((servicio) => {
                const state = states[servicio.puestoId] || 'pending';
                const needsNote = state === 'warn' || state === 'danger';
                return (
                  <div key={servicio.puestoId} className={`rounded-md border p-4 transition-colors ${statusClass(state)}`}>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-stone-800">
                          {servicio.nombre}
                          {servicio.etiqueta && <span className="ml-2 rounded bg-stone-200 px-2 py-0.5 text-[10px] uppercase text-stone-600">{servicio.etiqueta}</span>}
                        </div>
                        <div className="text-xs text-stone-500">{servicio.meta}</div>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-xs font-bold text-white">
                        {servicio.iniciales}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setServiceStatus(servicio.puestoId, 'ok')} className={`h-10 w-10 rounded border ${state === 'ok' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}><Check className="mx-auto h-4 w-4" /></button>
                        <button onClick={() => setServiceStatus(servicio.puestoId, 'warn')} className={`h-10 w-10 rounded border font-bold ${state === 'warn' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}>!</button>
                        <button onClick={() => setServiceStatus(servicio.puestoId, 'danger')} className={`h-10 w-10 rounded border ${state === 'danger' ? 'border-red-600 bg-red-600 text-white' : 'border-stone-200 bg-white text-stone-500'}`}><X className="mx-auto h-4 w-4" /></button>
                      </div>
                    </div>
                    {needsNote && (
                      <textarea
                        value={notes[servicio.puestoId] || ''}
                        onChange={(event) => setNotes((prev) => ({ ...prev, [servicio.puestoId]: event.target.value }))}
                        className="mt-3 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        rows="2"
                        placeholder={state === 'danger' ? 'Descripcion del descubierto' : 'Descripcion de la incidencia'}
                      />
                    )}
                  </div>
                );
              })}
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
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-[11px] uppercase tracking-wider text-stone-500">
        <tr>{keys.map((key) => <th key={key} className="pb-2 pr-4">{key}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {rows.map((row, index) => (
          <tr key={index}>
            {keys.map((key) => <td key={key} className="py-2 pr-4 align-top">{String(row[key] ?? '')}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
