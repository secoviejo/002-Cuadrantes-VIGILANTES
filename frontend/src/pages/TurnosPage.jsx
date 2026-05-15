import { useState, useEffect } from 'react';
import { getTurnos, getServicios } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import TurnosTable from '../components/turnos/TurnosTable';
import TurnoForm from '../components/turnos/TurnoForm';
import { Plus, Loader2, AlertCircle, CheckCircle2, Filter } from 'lucide-react';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'SIN_CUBRIR', label: 'Sin cubrir' },
  { value: 'PARCIAL', label: 'Parcial' },
  { value: 'CUBIERTO', label: 'Cubierto' },
  { value: 'INCIDENCIA', label: 'Incidencia' },
  { value: 'CANCELADO', label: 'Cancelado' },
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
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
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
            <TurnosTable turnos={turnosFiltrados} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}