import { useState } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { postJson } from '../../api/client';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin.demo@example.com' },
  { label: 'Unidad Seguridad', email: 'supervision.demo@unizar.example' },
  { label: 'Contrata', email: 'contrata.demo@example.com' },
];

const DEMO_PASSWORD = 'Demo1234!';

export default function LoginForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fillDemoUser = (email) => {
    setFormData({
      email,
      password: DEMO_PASSWORD,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await postJson('/auth/login', formData);

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.usuario));

      if (onSuccess) onSuccess(data.data);
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-stone-950 px-6 py-8 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-2xl tracking-tight mb-2">
              <div className="w-3 h-8 bg-amber-500"></div>
              Cuadrantes UZ
            </div>
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Unidad de Seguridad
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-stone-800 text-center">
              Iniciar Sesion
            </h2>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Acceso demo
              </p>
              <p className="mt-1 text-xs text-amber-900">
                Contrasena comun: <strong>{DEMO_PASSWORD}</strong>
              </p>
              <div className="mt-3 grid gap-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => fillDemoUser(user.email)}
                    className="flex items-center justify-between rounded border border-amber-200 bg-white px-3 py-2 text-left text-xs text-stone-700 hover:border-amber-500 hover:bg-amber-100"
                  >
                    <span className="font-semibold">{user.label}</span>
                    <span className="font-mono">{user.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                  Contrasena
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contrasena"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Iniciar Sesion
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-500 mt-4">
          Sistema de gestion de cuadrantes de vigilantes
        </p>
      </div>
    </div>
  );
}
