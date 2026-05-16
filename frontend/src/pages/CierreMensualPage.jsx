import { useEffect, useState } from 'react';
import { getCierreMensual } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-ES');
}

export default function CierreMensualPage({ currentRoute, onNavigate, onLogout, user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getCierreMensual({ anio: 2026, mes: 5 });
        setData(payload.data || payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppLayout
      isConnected={!error}
      currentRoute={currentRoute}
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Cierre mensual"
      subtitle="Conciliacion de mayo 2026 para validacion de factura"
    >
      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Cargando cierre...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <AlertCircle className="mr-2 inline h-5 w-5" />
          {error}
        </div>
      ) : data && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <Metric label="Planificado" value={`${formatNumber(data.totales.planificadas)} h`} sub={data.periodo} />
            <Metric label="Ejecutado" value={`${formatNumber(data.totales.ejecutadas)} h`} sub="Segun cierre actual" />
            <Metric label="Desviacion" value={`${formatNumber(data.totales.desviacion)} h`} sub="Pendiente de conciliacion" tone="warn" />
            <Metric label="Estado" value={data.estado} sub="Validacion Unidad de Seguridad" small />
          </div>

          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900">Conciliacion por tipo de hora</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-stone-500">
                  <tr><th className="pb-3">Categoria</th><th>Planificado</th><th>Ejecutado</th><th>Delta</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.categorias.map((item) => (
                    <tr key={item.categoria}>
                      <td className="py-3 font-medium">{item.categoria}</td>
                      <td className="font-mono text-xs">{formatNumber(item.planificadas)} h</td>
                      <td className="font-mono text-xs">{formatNumber(item.ejecutadas)} h</td>
                      <td className={item.desviacion < 0 ? 'text-red-700' : 'text-emerald-700'}>{formatNumber(item.desviacion)} h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-stone-900">Servicios con desviacion</h2>
              <div className="mt-4 space-y-2">
                {data.servicios.filter((item) => item.desviacion !== 0).map((item) => (
                  <div key={item.servicioId} className="flex items-center justify-between rounded-md border border-stone-200 p-3">
                    <div>
                      <div className="font-medium">{item.servicio}</div>
                      <div className="text-xs text-stone-500">{item.campus}</div>
                    </div>
                    <div className={item.desviacion < 0 ? 'font-mono text-sm text-red-700' : 'font-mono text-sm text-emerald-700'}>
                      {formatNumber(item.desviacion)} h
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-stone-900">Checklist de validacion</h2>
              <div className="mt-4 space-y-3">
                {data.validacion.map((item) => (
                  <div key={item} className="flex gap-3 rounded-md bg-stone-50 p-3 text-sm text-stone-700">
                    <CheckCircle2 className="h-5 w-5 text-amber-700 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Metric({ label, value, sub, tone, small }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</div>
      <div className={`mt-5 font-serif font-semibold ${small ? 'text-2xl' : 'text-3xl'} ${tone === 'warn' ? 'text-amber-700' : 'text-stone-900'}`}>{value}</div>
      <div className="mt-2 text-xs text-stone-500">{sub}</div>
    </div>
  );
}
