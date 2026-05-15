import { useState, useEffect } from 'react';
import { getTurnos, getServicios } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import TurnosTable from '../components/turnos/TurnosTable';
import TurnoForm from '../components/turnos/TurnoForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TurnosPage({ currentRoute, onNavigate }) {
  const [turnos, setTurnos] = useState([]);
  const [servicioList, setServicioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [turnoToEdit, setTurnoToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

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
          <div className="flex justify-end">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo turno
            </button>
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
            <TurnosTable turnos={turnos} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}