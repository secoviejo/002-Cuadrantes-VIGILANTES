import { useState, useEffect } from 'react';
import { createAsignacion, updateAsignacion, validarAsignacion } from '../../api/catalogos';
import { Save, X, Loader2, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const ESTADOS = [
  { value: 'ASIGNADO', label: 'Asignado' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'SUSTITUIDO', label: 'Sustituido' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES');
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function AsignacionForm({ asignacion, onSaved, onCancel, turnoList, trabajadorList }) {
  const isEditing = !!asignacion;

  const [formData, setFormData] = useState({
    turnoId: '',
    trabajadorId: '',
    estado: 'ASIGNADO',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validacion, setValidacion] = useState(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (asignacion) {
      setFormData({
        turnoId: asignacion.turnoId || asignacion.turno?.id || '',
        trabajadorId: asignacion.trabajadorId || asignacion.trabajador?.id || '',
        estado: asignacion.estado || 'ASIGNADO',
      });
    }
  }, [asignacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidacion(null);
  };

  const handleValidar = async () => {
    if (!formData.turnoId || !formData.trabajadorId) {
      setError('Selecciona un turno y un trabajador para validar');
      return;
    }

    setValidating(true);
    setError(null);

    try {
      const result = await validarAsignacion(parseInt(formData.turnoId), parseInt(formData.trabajadorId));
      setValidacion(result.data || result);
    } catch (err) {
      setError('Error al validar: ' + err.message);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        turnoId: parseInt(formData.turnoId),
        trabajadorId: parseInt(formData.trabajadorId),
        estado: formData.estado,
      };

      if (isEditing) {
        await updateAsignacion(asignacion.id, data);
      } else {
        await createAsignacion(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar la asignacion');
    } finally {
      setLoading(false);
    }
  };

  const getTurnoDisplay = (turno) => {
    if (!turno) return '';
    const fecha = formatDate(turno.fecha);
    const ini = formatTime(turno.horaInicio);
    const fin = formatTime(turno.horaFin);
    const servicio = turno.servicio?.nombre || '';
    return `${fecha} · ${ini}-${fin} · ${servicio}`;
  };

  const getTrabajadorDisplay = (trabajador) => {
    if (!trabajador) return '';
    const tipo = trabajador.tipo || '';
    const tipoLabel = tipo === 'VIGILANTE' ? 'Vigilante' : tipo === 'AUXILIAR' ? 'Auxiliar' : tipo === 'JEFE_EQUIPO' ? 'Jefe de Equipo' : 'Otro';
    return `${trabajador.nombre} · ${tipoLabel}`;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
        <h3 className="text-lg font-medium text-stone-800">
          {isEditing ? 'Editar Asignacion' : 'Nueva Asignacion'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing
            ? 'Modifica los datos de la asignacion seleccionada.'
            : 'Selecciona un turno y un trabajador para crear una nueva asignacion.'}
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

        <div className="space-y-1.5">
          <label htmlFor="trabajadorId" className="block text-sm font-medium text-stone-700">
            Trabajador <span className="text-red-500">*</span>
          </label>
          <select
            id="trabajadorId"
            name="trabajadorId"
            required
            value={formData.trabajadorId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          >
            <option value="">Seleccionar trabajador</option>
            {trabajadorList && trabajadorList.map((trab) => (
              <option key={trab.id} value={trab.id}>
                {getTrabajadorDisplay(trab)}
              </option>
            ))}
          </select>
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

        {validacion && (
          <div className={`p-4 rounded-lg border ${
            !validacion.valido 
              ? 'bg-red-50 border-red-200' 
              : validacion.advertencias?.length > 0 
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {!validacion.valido ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">No se puede realizar la asignacion</span>
                </>
              ) : validacion.advertencias?.length > 0 ? (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Asignacion valida con advertencias</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Asignacion valida</span>
                </>
              )}
            </div>

            {validacion.errores?.length > 0 && (
              <ul className="text-sm text-red-700 space-y-1 mt-2">
                {validacion.errores.map((err, i) => (
                  <li key={i}>
                    {typeof err === 'string' ? err : err.mensaje}
                  </li>
                ))}
              </ul>
            )}

            {validacion.advertencias?.length > 0 && (
              <ul className="text-sm text-yellow-700 space-y-1 mt-2">
                {validacion.advertencias.map((adv, i) => (
                  <li key={i}>
                    {typeof adv === 'string' ? adv : adv.mensaje}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100 mt-6">
          {!isEditing && formData.turnoId && formData.trabajadorId && (
            <button
              type="button"
              onClick={handleValidar}
              disabled={validating}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
            >
              {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
              Validar asignacion
            </button>
          )}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Asignacion'}
          </button>
        </div>
      </form>
    </div>
  );
}