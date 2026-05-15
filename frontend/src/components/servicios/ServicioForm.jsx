import { useState, useEffect } from 'react';
import { createServicio, updateServicio } from '../../api/catalogos';
import { Save, X, Loader2 } from 'lucide-react';

const PERFILES = ['VIGILANTE', 'AUXILIAR', 'CUALQUIERA'];

export default function ServicioForm({ servicio, onSaved, onCancel, edificioList }) {
  const isEditing = !!servicio;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    perfilRequerido: 'VIGILANTE',
    dotacionMinima: 1,
    activo: true,
    edificioId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (servicio) {
      setFormData({
        codigo: servicio.codigo || '',
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        perfilRequerido: servicio.perfilRequerido || 'VIGILANTE',
        dotacionMinima: servicio.dotacionMinima || 1,
        activo: servicio.activo ?? true,
        edificioId: servicio.edificioId || servicio.edificio?.id || ''
      });
    }
  }, [servicio]);

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
        descripcion: formData.descripcion || null,
        perfilRequerido: formData.perfilRequerido,
        dotacionMinima: parseInt(formData.dotacionMinima) || 1,
        activo: formData.activo,
        edificioId: parseInt(formData.edificioId)
      };

      if (isEditing) {
        await updateServicio(servicio.id, data);
      } else {
        await createServicio(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing
            ? 'Modifica los datos del servicio seleccionado.'
            : 'Introduce los datos para registrar un nuevo servicio en el sistema.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

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
              placeholder="Ej. SVC-001"
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
              placeholder="Ej. Vigilancia Biblioteca"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="descripcion" className="block text-sm font-medium text-stone-700">
            Descripcion
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={2}
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="Descripcion opcional del servicio"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="perfilRequerido" className="block text-sm font-medium text-stone-700">
              Perfil Requerido <span className="text-red-500">*</span>
            </label>
            <select
              id="perfilRequerido"
              name="perfilRequerido"
              required
              value={formData.perfilRequerido}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              {PERFILES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="dotacionMinima" className="block text-sm font-medium text-stone-700">
              Dotacion Minima
            </label>
            <input
              type="number"
              id="dotacionMinima"
              name="dotacionMinima"
              min="1"
              value={formData.dotacionMinima}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edificioId" className="block text-sm font-medium text-stone-700">
              Edificio <span className="text-red-500">*</span>
            </label>
            <select
              id="edificioId"
              name="edificioId"
              required
              value={formData.edificioId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Seleccionar edificio</option>
              {edificioList && edificioList.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.nombre} ({ed.campus?.nombre || ed.campusId})
                </option>
              ))}
            </select>
          </div>
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
            Servicio activo
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
            {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
          </button>
        </div>
      </form>
    </div>
  );
}