import { useState, useEffect } from 'react';
import { getIncidencias, getTurnos, getTrabajadores, deleteIncidencia } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import IncidenciasTable from '../components/incidencias/IncidenciasTable';
import IncidenciaForm from '../components/incidencias/IncidenciaForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function IncidenciasPage({ currentRoute, onNavigate }) {
  const [incidencias, setIncidencias] = useState([]);
  const [turnoList, setTurnoList] = useState([]);
  const [trabajadorList, setTrabajadorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [incidenciaToEdit, setIncidenciaToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  const loadIncidencias = async () => {
    setLoading(true);
    try {
      const data = await getIncidencias();
      setIncidencias(Array.isArray(data) ? data : (data.items || []));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTurnos = async () => {
    try {
      const data = await getTurnos();
      setTurnoList(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      console.error('Error cargando turnos:', err);
    }
  };

  const loadTrabajadores = async () => {
    try {
      const data = await getTrabajadores();
      setTrabajadorList(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    }
  };

  useEffect(() => {
    loadIncidencias();
    loadTurnos();
    loadTrabajadores();
  }, []);

  const handleCreateNew = () => {
    setIncidenciaToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (incidencia) => {
    setIncidenciaToEdit(incidencia);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIncidenciaToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setIncidenciaToEdit(null);
    setFeedback({
      type: 'success',
      message: incidenciaToEdit ? 'Incidencia actualizada correctamente' : 'Incidencia creada correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadIncidencias();
  };

  const handleDelete = async (incidencia) => {
    if (!confirm('¿Eliminar esta incidencia?')) return;
    
    try {
      await deleteIncidencia(incidencia.id);
      setFeedback({
        type: 'success',
        message: 'Incidencia eliminada correctamente'
      });
      setTimeout(() => setFeedback(null), 3000);
      loadIncidencias();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al eliminar la incidencia'
      });
    }
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Incidencias"
      subtitle="Gestion de incidencias operativas"
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
          <IncidenciaForm 
            incidencia={incidenciaToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            turnoList={turnoList}
            trabajadorList={trabajadorList}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva incidencia
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando incidencias...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar las incidencias</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadIncidencias}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
              <IncidenciasTable incidencias={incidencias} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}