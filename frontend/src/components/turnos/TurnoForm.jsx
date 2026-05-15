import { useState, useEffect } from 'react';
import { createTurno, updateTurno } from '../../api/catalogos';
import { Save, X, Loader2 } from 'lucide-react';

const ESTADOS = [
  { value: 'SIN_CUBRIR', label: 'Sin cubrir' },
  { value: 'PARCIAL', label: 'Parcial' },
  { value: 'CUBIERTO', label: 'Cubierto' },
  { value: 'INCIDENCIA', label: 'Incidencia' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export default function TurnoForm({ turno, onSaved, onCancel, servicioList }) {
  const isEditing = !!turno;

  const [formData, setFormData] = useState({
    codigo: '',
    servicioId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    dotacionMinima: 1,
    estado: 'SIN_CUBRIR',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (turno) {
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
      };
      const formatTimeForInput = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      };
      setFormData({
        codigo: turno.codigo || '',
        servicioId: turno.servicioId || turno.servicio?.id || '',
        fecha: formatDateForInput(turno.fecha),
        horaInicio: formatTimeForInput(turno.horaInicio),
        horaFin: formatTimeForInput(turno.horaFin),
        dotacionMinima: turno.dotacionMinima || 1,
        estado: turno.estado || 'SIN_CUBRIR',
      });
    }
  }, [turno]);

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
        codigo: formData.codigo,
        servicioId: parseInt(formData.servicioId),
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        dotacionMinima: parseInt(formData.dotacionMinima) || 1,
        estado: formData.estado,
      };

      if (isEditing) {
        await updateTurno(turno.id, data);
      } else {
        await createTurno(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Turno' : 'Nuevo Turno'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing
            ? 'Modifica los datos del turno seleccionado.'
            : 'Introduce los datos para registrar un nuevo turno en el sistema.'}
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
              placeholder="Ej. TURNO-2026-05-16-M"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="servicioId" className="block text-sm font-medium text-stone-700">
              Servicio <span className="text-red-500">*</span>
            </label>
            <select
              id="servicioId"
              name="servicioId"
              required
              value={formData.servicioId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Seleccionar servicio</option>
              {servicioList && servicioList.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.nombre} {svc.edificio?.nombre ? `(${svc.edificio.nombre})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="fecha" className="block text-sm font-medium text-stone-700">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              required
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="horaInicio" className="block text-sm font-medium text-stone-700">
              Hora Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="horaInicio"
              name="horaInicio"
              required
              value={formData.horaInicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="horaFin" className="block text-sm font-medium text-stone-700">
              Hora Fin <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="horaFin"
              name="horaFin"
              required
              value={formData.horaFin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="estado" className="block text-sm font-medium text-stone-700">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              id="estado"
              name="estado"
              required
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Turno'}
          </button>
        </div>
      </form>
    </div>
  );
}