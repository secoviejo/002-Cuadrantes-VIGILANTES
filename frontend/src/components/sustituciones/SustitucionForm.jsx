import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';

export default function SustitucionForm({ sustitucion, onSaved, onCancel, turnoList, trabajadorList }) {
  const isEditing = !!sustitucion;

  const [formData, setFormData] = useState({
    turnoId: '',
    trabajadorOriginalId: '',
    trabajadorSustitutoId: '',
    motivo: '',
    comunicadaEn: '',
    cumplePreaviso: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sustitucion) {
      setFormData({
        turnoId: sustitucion.turnoId || '',
        trabajadorOriginalId: sustitucion.trabajadorOriginalId || '',
        trabajadorSustitutoId: sustitucion.trabajadorSustitutoId || '',
        motivo: sustitucion.motivo || '',
        comunicadaEn: sustitucion.comunicadaEn ? new Date(sustitucion.comunicadaEn).toISOString().slice(0, 16) : '',
        cumplePreaviso: sustitucion.cumplePreaviso === null ? '' : sustitucion.cumplePreaviso ? 'true' : 'false',
      });
    }
  }, [sustitucion]);

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
        turnoId: parseInt(formData.turnoId),
        trabajadorOriginalId: parseInt(formData.trabajadorOriginalId),
        trabajadorSustitutoId: formData.trabajadorSustitutoId ? parseInt(formData.trabajadorSustitutoId) : null,
        motivo: formData.motivo,
        comunicadaEn: formData.comunicadaEn ? new Date(formData.comunicadaEn).toISOString() : null,
        cumplePreaviso: formData.cumplePreaviso === '' ? null : formData.cumplePreaviso === 'true',
      };

      const { createSustitucion, updateSustitucion } = await import('../../api/catalogos');
      
      if (isEditing) {
        await updateSustitucion(sustitucion.id, data);
      } else {
        await createSustitucion(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const getTurnoDisplay = (turno) => {
    if (!turno) return '';
    const fecha = new Date(turno.fecha).toLocaleDateString('es-ES');
    const ini = new Date(turno.horaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    const fin = new Date(turno.horaFin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    const servicio = turno.servicio?.nombre || '';
    return `${fecha} · ${ini}-${fin} · ${servicio}`;
  };

  const getTrabajadorDisplay = (trab) => {
    if (!trab) return '';
    const tipo = trab.tipo || '';
    const tipoLabel = tipo === 'VIGILANTE' ? 'Vigilante' : tipo === 'AUXILIAR' ? 'Auxiliar' : tipo === 'JEFE_EQUIPO' ? 'Jefe de Equipo' : 'Otro';
    return `${trab.nombre} · ${tipoLabel}`;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Sustitucion' : 'Nueva Sustitucion'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing ? 'Modifica los datos de la sustitucion.' : 'Registra una sustitucion de trabajador en un turno.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="turnoId" className="block text-sm font-medium text-stone-700">
            Turno <span className="text-red-500">*</span>
          </label>
          <select
            id="turnoId"
            name="turnoId"
            required
            value={formData.turnoId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          >
            <option value="">Seleccionar turno</option>
            {turnoList && turnoList.map((turno) => (
              <option key={turno.id} value={turno.id}>
                {getTurnoDisplay(turno)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="trabajadorOriginalId" className="block text-sm font-medium text-stone-700">
              Trabajador Original <span className="text-red-500">*</span>
            </label>
            <select
              id="trabajadorOriginalId"
              name="trabajadorOriginalId"
              required
              value={formData.trabajadorOriginalId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Trabajador a sustituir</option>
              {trabajadorList && trabajadorList.map((trab) => (
                <option key={trab.id} value={trab.id}>
                  {getTrabajadorDisplay(trab)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="trabajadorSustitutoId" className="block text-sm font-medium text-stone-700">
              Trabajador Sustituto
            </label>
            <select
              id="trabajadorSustitutoId"
              name="trabajadorSustitutoId"
              value={formData.trabajadorSustitutoId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Sin asignar (pendiente)</option>
              {trabajadorList && trabajadorList.filter(t => t.id !== parseInt(formData.trabajadorOriginalId)).map((trab) => (
                <option key={trab.id} value={trab.id}>
                  {getTrabajadorDisplay(trab)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="motivo" className="block text-sm font-medium text-stone-700">
            Motivo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="motivo"
            name="motivo"
            required
            value={formData.motivo}
            onChange={handleChange}
            placeholder="Ej: Enfermedad, emergencia familiar, etc."
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="comunicadaEn" className="block text-sm font-medium text-stone-700">
              Comunicada En
            </label>
            <input
              type="datetime-local"
              id="comunicadaEn"
              name="comunicadaEn"
              value={formData.comunicadaEn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cumplePreaviso" className="block text-sm font-medium text-stone-700">
              Cumple Preaviso
            </label>
            <select
              id="cumplePreaviso"
              name="cumplePreaviso"
              value={formData.cumplePreaviso}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">No especificado</option>
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          </div>
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
            {isEditing ? 'Guardar Cambios' : 'Crear Sustitucion'}
          </button>
        </div>
      </form>
    </div>
  );
}