import { useState, useEffect } from 'react';
import { createEmpresa, updateEmpresa } from '../../api/catalogos';
import { Save, X, Loader2 } from 'lucide-react';

export default function EmpresaForm({ empresa, onSaved, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    cif: '',
    activa: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre || '',
        cif: empresa.cif || '',
        activa: empresa.activa ?? true
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.nombre.trim()) {
      setError("El nombre de la empresa es obligatorio");
      return;
    }

    setLoading(true);
    try {
      if (empresa && empresa.id) {
        await updateEmpresa(empresa.id, formData);
      } else {
        await createEmpresa(formData);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-serif font-medium text-stone-900 mb-4">
        {empresa ? 'Editar Empresa' : 'Nueva Empresa'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-stone-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Ej: Seguridad Integral S.A."
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="cif" className="block text-sm font-medium text-stone-700 mb-1">
            CIF / NIF
          </label>
          <input
            type="text"
            id="cif"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Ej: B12345678"
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="activa"
            name="activa"
            checked={formData.activa}
            onChange={handleChange}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
            disabled={loading}
          />
          <label htmlFor="activa" className="ml-2 block text-sm text-stone-700">
            Empresa activa
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {empresa ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
