import { useState, useEffect } from 'react';
import { createEdificio, updateEdificio } from '../../api/catalogos';
import { Save, X, Loader2 } from 'lucide-react';

export default function EdificioForm({ edificio, onSaved, onCancel }) {
  const isEditing = !!edificio;

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    campusId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (edificio) {
      setFormData({
        codigo: edificio.codigo || '',
        nombre: edificio.nombre || '',
        campusId: edificio.campusId || ''
      });
    }
  }, [edificio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        ...formData,
        campusId: parseInt(formData.campusId) || null
      };

      if (isEditing) {
        await updateEdificio(edificio.id, data);
      } else {
        await createEdificio(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el edificio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Edificio' : 'Nuevo Edificio'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing
            ? 'Modifica los datos del edificio seleccionado.'
            : 'Introduce los datos para registrar un nuevo edificio en el sistema.'}
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
              placeholder="Ej. ED-001"
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
              placeholder="Ej. Biblioteca General"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="campusId" className="block text-sm font-medium text-stone-700">
            Campus <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="campusId"
            name="campusId"
            required
            value={formData.campusId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="ID del campus"
          />
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
            {isEditing ? 'Guardar Cambios' : 'Crear Edificio'}
          </button>
        </div>
      </form>
    </div>
  );
}