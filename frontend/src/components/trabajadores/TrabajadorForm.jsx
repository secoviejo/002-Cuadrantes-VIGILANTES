import { useState, useEffect } from 'react';
import { createTrabajador, updateTrabajador } from '../../api/catalogos';
import { Image, RotateCcw, Save, X, Loader2 } from 'lucide-react';

const TIPOS_TRABAJADOR = [
  { value: 'VIGILANTE', label: 'Vigilante' },
  { value: 'AUXILIAR', label: 'Auxiliar' },
  { value: 'JEFE_EQUIPO', label: 'Jefe de Equipo' },
  { value: 'OTRO', label: 'Otro' },
];

const DEFAULT_FOTO_TRABAJADOR = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f5f5f4'/%3E%3Ccircle cx='80' cy='58' r='30' fill='%23d97706'/%3E%3Cpath d='M30 140c6-34 29-54 50-54s44 20 50 54' fill='%23292524'/%3E%3Cpath d='M50 43h60l-7-16H57z' fill='%2344413c'/%3E%3Cpath d='M48 43h64v13H48z' fill='%235b8a9c'/%3E%3Ccircle cx='68' cy='57' r='4' fill='%23fff7ed'/%3E%3Ccircle cx='92' cy='57' r='4' fill='%23fff7ed'/%3E%3Cpath d='M68 74c7 5 17 5 24 0' stroke='%23fff7ed' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export default function TrabajadorForm({ trabajador, onSaved, onCancel, empresaList }) {
  const isEditing = !!trabajador;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipo: 'VIGILANTE',
    identificadorProfesional: '',
    fotoUrl: DEFAULT_FOTO_TRABAJADOR,
    activo: true,
    empresaId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trabajador) {
      setFormData({
        codigo: trabajador.codigo || '',
        nombre: trabajador.nombre || '',
        tipo: trabajador.tipo || 'VIGILANTE',
        identificadorProfesional: trabajador.identificadorProfesional || '',
        fotoUrl: trabajador.fotoUrl || DEFAULT_FOTO_TRABAJADOR,
        activo: trabajador.activo ?? true,
        empresaId: trabajador.empresaId || trabajador.empresa?.id || ''
      });
    }
  }, [trabajador]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        tipo: formData.tipo,
        identificadorProfesional: formData.identificadorProfesional || null,
        fotoUrl: formData.fotoUrl || DEFAULT_FOTO_TRABAJADOR,
        activo: formData.activo,
        empresaId: parseInt(formData.empresaId)
      };

      if (isEditing) {
        await updateTrabajador(trabajador.id, data);
      } else {
        await createTrabajador(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el trabajador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing
            ? 'Modifica los datos del trabajador seleccionado.'
            : 'Introduce los datos para registrar un nuevo trabajador en el sistema.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_1fr]">
          <div className="space-y-2">
            <span className="block text-sm font-medium text-stone-700">Foto</span>
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-md border border-stone-300 bg-stone-100">
              <img
                src={formData.fotoUrl || DEFAULT_FOTO_TRABAJADOR}
                alt="Vista previa del trabajador"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_FOTO_TRABAJADOR;
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="fotoUrl" className="block text-sm font-medium text-stone-700">
              URL de foto
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Image className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  id="fotoUrl"
                  name="fotoUrl"
                  value={formData.fotoUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-stone-300 py-2 pl-9 pr-3 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://..."
                />
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, fotoUrl: DEFAULT_FOTO_TRABAJADOR }))}
                className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
              >
                <RotateCcw className="h-4 w-4" />
                Demo
              </button>
            </div>
            <p className="text-xs text-stone-500">
              De momento se carga una foto demo inventada. Mas adelante se puede sustituir por subida real de archivo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="codigo" className="block text-sm font-medium text-stone-700">
              Codigo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              required
              value={formData.codigo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ej. TRB-001"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="nombre" className="block text-sm font-medium text-stone-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Ej. Juan Garcia Lopez"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="tipo" className="block text-sm font-medium text-stone-700">
              Tipo/Perfil <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              required
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              {TIPOS_TRABAJADOR.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="identificadorProfesional" className="block text-sm font-medium text-stone-700">
              ID. Profesional
            </label>
            <input
              type="text"
              id="identificadorProfesional"
              name="identificadorProfesional"
              value={formData.identificadorProfesional}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Numero de tarjeta profesional"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="empresaId" className="block text-sm font-medium text-stone-700">
            Empresa <span className="text-red-500">*</span>
          </label>
          <select
            id="empresaId"
            name="empresaId"
            required
            value={formData.empresaId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          >
            <option value="">Seleccionar empresa</option>
            {empresaList && empresaList.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="activo"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="activo" className="text-sm font-medium text-stone-700">
            Trabajador activo
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Trabajador'}
          </button>
        </div>
      </form>
    </div>
  );
}
