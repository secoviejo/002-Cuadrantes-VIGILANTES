import { useEffect, useState } from 'react';
import { getHorasAnuales } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle, Loader2 } from 'lucide-react';

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-ES');
}

export default function HorasAnualesPage({ currentRoute, onNavigate, onLogout, user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const payload = await getHorasAnuales({ anio: 2026 });
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
