import { useEffect, useState } from 'react';
import { createFestivo, getCalendarioLaboral, getCampus } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, CalendarPlus, Loader2, Plus, X } from 'lucide-react';

const BADGE = {
  Nacional: 'bg-stone-200 text-stone-700',
  Aragon: 'bg-amber-100 text-amber-800',
  Zaragoza: 'bg-amber-100 text-amber-800',
  Huesca: 'bg-yellow-100 text-yellow-800',
  Teruel: 'bg-orange-100 text-orange-800',
  LECTIVO: 'bg-emerald-100 text-emerald-800',
  NO_LECTIVO: 'bg-stone-200 text-stone-700',
  CIERRE: 'bg-amber-100 text-amber-800',
};

export default function CalendarioLaboralPage({ currentRoute, onNavigate, onLogout, user }) {
  const [data, setData] = useState(null);
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fecha: '', descripcion: '', campusId: '' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [calendarioPayload, campusPayload] = await Promise.all([
        getCalendarioLaboral({ anio: 2026 }),
        getCampus(),
      ]);
      setData(calendarioPayload.data || calendarioPayload);
      setCampusList(normalizeList(campusPayload));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createFestivo({
        fecha: formData.fecha,
        descripcion: formData.descripcion,
        campusId: formData.campusId || null,
      });
      setFormData({ fecha: '', descripcion: '', campusId: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      isConnected={!error}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Calendario laboral 2026"
      subtitle="Festivos y periodos lectivos (carga manual anual)"
      actions={
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          <Plus className="h-4 w-4" />
          Anadir festivo
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Cargando calendario...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <AlertCircle className="mr-2 inline h-5 w-5" />
          {error}
        </div>
      ) : data && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.6fr]">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Festivos por ambito</h2>
            <p className="mt-1 text-sm text-stone-500">Nacionales, autonomicos y locales (Zaragoza, Huesca, Teruel)</p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500">
                  <tr><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Festividad</th><th className="px-4 py-3">Ambito</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.festivos.map((item) => (
                    <tr key={item.codigo}>
                      <td className="px-4 py-4 font-mono text-xs text-stone-700">{item.fechaCorta}</td>
                      <td className="px-4 py-4 font-medium text-stone-800">{item.festividad}</td>
                      <td className="px-4 py-4"><Badge value={item.ambito} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Periodos academicos</h2>
            <p className="mt-1 text-sm text-stone-500">Lectivo vs. no lectivo (afecta Huesca y auxiliares)</p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500">
                  <tr><th className="px-4 py-3">Periodo</th><th className="px-4 py-3">Tipo</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.periodosAcademicos.map((item) => (
                    <tr key={`${item.periodo}-${item.tipo}`}>
                      <td className="px-4 py-4 font-mono text-xs text-stone-700">{item.periodo}</td>
                      <td className="px-4 py-4"><Badge value={item.estado} label={item.tipo} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <form onSubmit={submit} className="w-full max-w-lg rounded-lg bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
                  <div>
                    <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-stone-900">
                      <CalendarPlus className="h-5 w-5 text-amber-700" />
                      Anadir festivo
                    </h2>
                    <p className="mt-1 text-sm text-stone-500">Alta manual para el calendario laboral 2026.</p>
                  </div>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-md p-2 text-stone-500 hover:bg-stone-100"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4 p-6">
                  <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                    <span>Fecha</span>
                    <input required type="date" value={formData.fecha} onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))} className="input" />
                  </label>
                  <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                    <span>Festividad</span>
                    <input required value={formData.descripcion} onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))} className="input" placeholder="Nombre del festivo" />
                  </label>
                  <label className="block space-y-1.5 text-sm font-medium text-stone-700">
                    <span>Campus/ambito local (opcional)</span>
                    <select value={formData.campusId} onChange={(e) => setFormData((prev) => ({ ...prev, campusId: e.target.value }))} className="input">
                      <option value="">Nacional / autonomico</option>
                      {campusList.map((campus) => <option key={campus.id} value={campus.id}>{campus.nombre}</option>)}
                    </select>
                  </label>
                </div>
                <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700">Cancelar</button>
                  <button disabled={saving} className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? 'Guardando...' : 'Guardar festivo'}
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

function Badge({ value, label }) {
  const className = BADGE[value] || 'bg-stone-100 text-stone-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label || value}</span>;
}
