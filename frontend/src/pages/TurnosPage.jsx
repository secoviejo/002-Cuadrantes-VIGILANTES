import { useState, useEffect } from 'react';
import { getTurnos, getServicios, createVerificacion } from '../api/catalogos';
import { exportTurnos } from '../utils/exportUtils';
import AppLayout from '../components/layout/AppLayout';
import TurnosTable from '../components/turnos/TurnosTable';
import TurnoForm from '../components/turnos/TurnoForm';
import { Plus, Loader2, AlertCircle, CheckCircle2, Filter, X, Download } from 'lucide-react';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'SIN_CUBRIR', label: 'Sin cubrir' },
  { value: 'PARCIAL', label: 'Parcial' },
  { value: 'CUBIERTO', label: 'Cubierto' },
  { value: 'INCIDENCIA', label: 'Incidencia' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const ESTADOS_VERIFICACION = [
  { value: 'CUBIERTO', label: 'Cubierto' },
  { value: 'INCIDENCIA', label: 'Incidencia' },
  { value: 'DESCUBIERTO', label: 'Descubierto' },
];

export default function TurnosPage({ currentRoute, onNavigate }) {
  const [turnos, setTurnos] = useState([]);
  const [servicioList, setServicioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [turnoToEdit, setTurnoToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);
  
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [showVerificacion, setShowVerificacion] = useState(false);
  const [turnoParaVerificar, setTurnoParaVerificar] = useState(null);
  const [verificacionEstado, setVerificacionEstado] = useState('CUBIERTO');
  const [verificacionNota, setVerificacionNota] = useState('');
  const [verificando, setVerificando] = useState(false);

  const loadTurnos = async () => {
    setLoading(true);
    try {
      const data = await getTurnos();
      const items = Array.isArray(data) ? data : (data.items || []);
      setTurnos(items);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadServicios = async () => {
    try {
      const data = await getServicios();
      const items = Array.isArray(data) ? data : (data.items || []);
      setServicioList(items);
    } catch (err) {
      console.error('Error cargando servicios:', err);
    }
  };

  useEffect(() => {
    loadTurnos();
    loadServicios();
  }, []);

  const handleCreateNew = () => {
    setTurnoToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (turno) => {
    setTurnoToEdit(turno);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setTurnoToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setTurnoToEdit(null);
    setFeedback({
      type: 'success',
      message: turnoToEdit ? 'Turno actualizado correctamente' : 'Turno creado correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadTurnos();
  };

  const handleVerificar = (turno) => {
    setTurnoParaVerificar(turno);
    setVerificacionEstado('CUBIERTO');
    setVerificacionNota('');
    setShowVerificacion(true);
  };

  const handleConfirmarVerificacion = async () => {
    if (!turnoParaVerificar) return;
    
    setVerificando(true);
    try {
      await createVerificacion({
        turnoId: turnoParaVerificar.id,
        estado: verificacionEstado,
        nota: verificacionNota || null,
      });
      
      setFeedback({
        type: 'success',
        message: 'Verificacion registrada correctamente'
      });
      setTimeout(() => setFeedback(null), 3000);
      
      setShowVerificacion(false);
      setTurnoParaVerificar(null);
      loadTurnos();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Error al registrar verificacion: ' + err.message
      });
    } finally {
      setVerificando(false);
    }
  };

  const turnosFiltrados = turnos.filter(turno => {
    if (filtroEstado && turno.estado !== filtroEstado) return false;
    if (filtroFecha) {
      const fechaTurno = new Date(turno.fecha).toISOString().split('T')[0];
      if (fechaTurno !== filtroFecha) return false;
    }
    return true;
  });

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Turnos"
      subtitle="Gestion de turnos de vigilancia y cobertura"
    >
      
      {feedback && (
        <div className={`mb-6 p-4 flex items-center gap-2 border-l-4 rounded-r-md ${
          feedback.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {showForm ? (
        <div className="max-w-2xl">
          <TurnoForm 
            turno={turnoToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            servicioList={servicioList}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => exportTurnos(turnosFiltrados)}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors px-3 py-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors px-3 py-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo turno
              </button>
            </div>

          {showFilters && (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <label htmlFor="filtroEstado" className="text-xs font-medium text-stone-600">Estado</label>
                  <select
                    id="filtroEstado"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-3 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {ESTADOS.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="filtroFecha" className="text-xs font-medium text-stone-600">Fecha</label>
                  <input
                    type="date"
                    id="filtroFecha"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="px-3 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {(filtroEstado || filtroFecha) && (
                  <div className="flex items-end">
                    <button
                      onClick={() => { setFiltroEstado(''); setFiltroFecha(''); }}
                      className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800"
                    >
                      Limpiar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-sm text-stone-500">
            Mostrando {turnosFiltrados.length} de {turnos.length} turnos
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando turnos...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar los turnos</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadTurnos}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <TurnosTable turnos={turnosFiltrados} onEdit={handleEdit} onVerificar={handleVerificar} />
          )}

          {showVerificacion && turnoParaVerificar && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                  <h3 className="text-lg font-medium text-stone-800">Verificar Cobertura</h3>
                  <p className="text-sm text-stone-500 mt-1">
                    Turno: {turnoParaVerificar.codigo}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-stone-700">Estado de cobertura</label>
                    <div className="flex gap-3">
                      {ESTADOS_VERIFICACION.map(e => (
                        <label key={e.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="verificacionEstado"
                            value={e.value}
                            checked={verificacionEstado === e.value}
                            onChange={() => setVerificacionEstado(e.value)}
                            className="w-4 h-4 text-amber-600"
                          />
                          <span className="text-sm text-stone-700">{e.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="verificacionNota" className="block text-sm font-medium text-stone-700">
                      Nota (opcional)
                    </label>
                    <textarea
                      id="verificacionNota"
                      rows="3"
                      value={verificacionNota}
                      onChange={(e) => setVerificacionNota(e.target.value)}
                      placeholder="Observaciones sobre la cobertura..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
                  <button
                    onClick={() => setShowVerificacion(false)}
                    className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md shadow-sm hover:bg-stone-50 transition-colors inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarVerificacion}
                    disabled={verificando}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {verificando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Confirmar Verificacion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}