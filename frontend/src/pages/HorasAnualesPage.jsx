import { useEffect, useState } from 'react';
import { getHorasAnuales, updateContratoAnual } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, Loader2, Pencil, Save, X } from 'lucide-react';

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-ES');
}

export default function HorasAnualesPage({ currentRoute, onNavigate, onLogout, user }) {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadHoras({ showLoading = true } = {}) {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const payload = await getHorasAnuales({ anio: 2026 });
      setData(payload.data || payload);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadHoras();
  }, []);

  function openEditor() {
    if (!data) return;
    setFeedback(null);
    setFormData({
      bolsaVariableHoras: data.variablesAnuales,
      observaciones: data.contrato?.observaciones || '',
      categorias: data.categorias.map((item) => ({
        codigo: item.codigo,
        nombre: item.categoria,
        contratoHoras: item.contrato,
      })),
    });
    setEditing(true);
  }

  function updateCategoria(codigo, value) {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.map((item) => (
        item.codigo === codigo ? { ...item, contratoHoras: value } : item
      )),
    }));
  }

  async function handleSaveContrato(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateContratoAnual(data.anio, {
        bolsaVariableHoras: Number(formData.bolsaVariableHoras),
        observaciones: formData.observaciones,
        categorias: formData.categorias.map((item) => ({
          codigo: item.codigo,
          contratoHoras: Number(item.contratoHoras),
        })),
      });
      await loadHoras({ showLoading: false });
      setEditing(false);
      setFeedback({ type: 'success', message: 'Contrato actualizado correctamente.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al guardar el contrato.' });
    } finally {
      setSaving(false);
    }
  }

  const totalFijoEditado = formData?.categorias.reduce((total, item) => total + Number(item.contratoHoras || 0), 0) || 0;

  return (
    <AppLayout
      isConnected={!error}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Horas anuales"
      subtitle="Seguimiento acumulado del contrato 2026"
    >
      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Cargando horas...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <AlertCircle className="mr-2 inline h-5 w-5" />
          {error}
        </div>
      ) : data && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {feedback && (
              <div className={`rounded-md border px-4 py-2 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {feedback.message}
              </div>
            )}
            <button
              type="button"
              onClick={openEditor}
              className="ml-auto inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50"
            >
              <Pencil className="h-4 w-4" />
              Editar contrato
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <Metric label="Acumulado anual" value={`${formatNumber(data.acumuladoAnual)} h`} sub={`${data.avanceContrato}% del contrato`} />
            <Metric label="Contrato anual" value={`${formatNumber(data.contratoAnual)} h`} sub="Prestaciones fijas" />
            <Metric label="Variables acumuladas" value={`${formatNumber(data.variablesAcumuladas)} h`} sub={`Bolsa ${formatNumber(data.variablesAnuales)} h`} />
            <Metric label="Pendiente fijo" value={`${formatNumber(data.contratoAnual - data.acumuladoAnual)} h`} sub="Hasta cierre anual" />
          </div>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900">Categorias del pliego</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-stone-500">
                  <tr><th className="pb-3">Categoria</th><th>Ejecutadas</th><th>Contrato</th><th>Avance</th><th>Desvio ritmo</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.categorias.map((item) => (
                    <tr key={item.categoria}>
                      <td className="py-3 font-medium">{item.categoria}</td>
                      <td className="font-mono text-xs">{formatNumber(item.ejecutadas)} h</td>
                      <td className="font-mono text-xs">{formatNumber(item.contrato)} h</td>
                      <td>{item.avance}%</td>
                      <td className={item.desviacionRitmo < 0 ? 'text-red-700' : 'text-emerald-700'}>{formatNumber(item.desviacionRitmo)} h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900">Prestaciones variables informativas</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {data.variables.map((item) => (
                <div key={item.concepto} className="rounded-md border border-stone-200 p-4">
                  <div className="text-sm font-semibold text-stone-800">{item.concepto}</div>
                  <div className="mt-3 font-serif text-3xl font-semibold">{formatNumber(item.horas)} h</div>
                  <div className="mt-1 text-xs text-stone-500">{item.peso}% de la bolsa anual - {item.observaciones}</div>
                </div>
              ))}
            </div>
          </section>

          {editing && formData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4">
              <form onSubmit={handleSaveContrato} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-stone-900">Editar contrato {data.anio}</h2>
                    <p className="mt-1 text-sm text-stone-500">Prestaciones fijas y bolsa variable</p>
                  </div>
                  <button type="button" onClick={() => setEditing(false)} className="rounded-md p-2 text-stone-500 hover:bg-stone-100" aria-label="Cerrar">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Bolsa variable anual</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.bolsaVariableHoras}
                      onChange={(event) => setFormData((prev) => ({ ...prev, bolsaVariableHoras: event.target.value }))}
                      className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
                    />
                  </label>
                  <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Prestaciones fijas</div>
                    <div className="mt-3 font-serif text-3xl font-semibold text-stone-900">{formatNumber(totalFijoEditado)} h</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {formData.categorias.map((item) => (
                    <label key={item.codigo} className="block rounded-md border border-stone-200 p-4">
                      <span className="text-sm font-semibold text-stone-800">{item.nombre}</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.contratoHoras}
                        onChange={(event) => updateCategoria(item.codigo, event.target.value)}
                        className="mt-3 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Observaciones</span>
                  <textarea
                    value={formData.observaciones}
                    onChange={(event) => setFormData((prev) => ({ ...prev, observaciones: event.target.value }))}
                    rows={3}
                    className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
                  />
                </label>

                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-400">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</div>
      <div className="mt-5 font-serif text-3xl font-semibold text-stone-900">{value}</div>
      <div className="mt-2 text-xs text-stone-500">{sub}</div>
    </div>
  );
}
