import { useState, useEffect } from 'react';
import { getAsignaciones, getTurnos, getTrabajadores, deleteAsignacion } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import AsignacionesTable from '../components/asignaciones/AsignacionesTable';
import AsignacionForm from '../components/asignaciones/AsignacionForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AsignacionesPage({ currentRoute, onNavigate }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [turnoList, setTurnoList] = useState([]);
  const [trabajadorList, setTrabajadorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [asignacionToEdit, setAsignacionToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  const loadAsignaciones = async () => {
    setLoading(true);
    try {
      const data = await getAsignaciones();
      setAsignaciones(Array.isArray(data) ? data : []);
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
    loadAsignaciones();
    loadTurnos();
    loadTrabajadores();
  }, []);

  const handleCreateNew = () => {
    setAsignacionToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (asignacion) => {
    setAsignacionToEdit(asignacion);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setAsignacionToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setAsignacionToEdit(null);
    setFeedback({
      type: 'success',
      message: asignacionToEdit ? 'Asignacion actualizada correctamente' : 'Asignacion creada correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadAsignaciones();
  };

  const handleDelete = async (asignacion) => {
    if (!confirm('¿Eliminar esta asignacion?')) return;
    
    try {
      await deleteAsignacion(asignacion.id);
      setFeedback({
        type: 'success',
        message: 'Asignacion eliminada correctamente'
      });
      setTimeout(() => setFeedback(null), 3000);
      loadAsignaciones();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al eliminar la asignacion'
      });
    }
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Asignaciones"
      subtitle="Gestion de asignaciones de trabajadores a turnos"
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
          <AsignacionForm 
            asignacion={asignacionToEdit} 
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
              Nueva asignacion
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando asignaciones...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar las asignaciones</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadAsignaciones}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <AsignacionesTable asignaciones={asignaciones} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      )}
    </AppLayout>
  );
}