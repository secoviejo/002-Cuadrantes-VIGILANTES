import { useState, useEffect } from 'react';
import { Save, X, Loader2 } from 'lucide-react';

const ESTADOS = [
  { value: 'ABIERTA', label: 'Abierta' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'CERRADA', label: 'Cerrada' },
];

export default function IncidenciaForm({ incidencia, onSaved, onCancel, turnoList, trabajadorList }) {
  const isEditing = !!incidencia;

  const [formData, setFormData] = useState({
    turnoId: '',
    trabajadorId: '',
    titulo: '',
    descripcion: '',
    estado: 'ABIERTA',
    cerradaEn: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (incidencia) {
      setFormData({
        turnoId: incidencia.turnoId || '',
        trabajadorId: incidencia.trabajadorId || '',
        titulo: incidencia.titulo || '',
        descripcion: incidencia.descripcion || '',
        estado: incidencia.estado || 'ABIERTA',
        cerradaEn: incidencia.cerradaEn ? new Date(incidencia.cerradaEn).toISOString().slice(0, 16) : '',
      });
    }
  }, [incidencia]);

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
        turnoId: formData.turnoId ? parseInt(formData.turnoId) : null,
        trabajadorId: formData.trabajadorId ? parseInt(formData.trabajadorId) : null,
        titulo: formData.titulo,
        descripcion: formData.descripcion || null,
        estado: formData.estado,
        cerradaEn: formData.cerradaEn ? new Date(formData.cerradaEn).toISOString() : null,
      };

      const { createIncidencia, updateIncidencia } = await import('../../api/catalogos');
      
      if (isEditing) {
        await updateIncidencia(incidencia.id, data);
      } else {
        await createIncidencia(data);
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
          {isEditing ? 'Editar Incidencia' : 'Nueva Incidencia'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {isEditing ? 'Modifica los datos de la incidencia.' : 'Registra una nueva incidencia.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="titulo" className="block text-sm font-medium text-stone-700">
            Titulo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Breve descripcion de la incidencia"
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="descripcion" className="block text-sm font-medium text-stone-700">
            Descripcion
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe con detalle la incidencia..."
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="turnoId" className="block text-sm font-medium text-stone-700">
              Turno (opcional)
            </label>
            <select
              id="turnoId"
              name="turnoId"
              value={formData.turnoId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Sin turno asociado</option>
              {turnoList && turnoList.map((turno) => (
                <option key={turno.id} value={turno.id}>
                  {getTurnoDisplay(turno)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="trabajadorId" className="block text-sm font-medium text-stone-700">
              Trabajador (opcional)
            </label>
            <select
              id="trabajadorId"
              name="trabajadorId"
              value={formData.trabajadorId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            >
              <option value="">Sin trabajador asociado</option>
              {trabajadorList && trabajadorList.map((trab) => (
                <option key={trab.id} value={trab.id}>
                  {getTrabajadorDisplay(trab)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-1.5">
            <label htmlFor="cerradaEn" className="block text-sm font-medium text-stone-700">
              Cerrada En
            </label>
            <input
              type="datetime-local"
              id="cerradaEn"
              name="cerradaEn"
              value={formData.cerradaEn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
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
            {isEditing ? 'Guardar Cambios' : 'Crear Incidencia'}
          </button>
        </div>
      </form>
    </div>
  );
}