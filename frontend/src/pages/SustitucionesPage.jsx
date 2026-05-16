import { useState, useEffect } from 'react';
import { getSustituciones, getTurnos, getTrabajadores, deleteSustitucion } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import SustitucionesTable from '../components/sustituciones/SustitucionesTable';
import SustitucionForm from '../components/sustituciones/SustitucionForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SustitucionesPage({ currentRoute, onNavigate }) {
  const [sustituciones, setSustituciones] = useState([]);
  const [turnoList, setTurnoList] = useState([]);
  const [trabajadorList, setTrabajadorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [sustitucionToEdit, setSustitucionToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  const loadSustituciones = async () => {
    setLoading(true);
    try {
      const data = await getSustituciones();
      setSustituciones(normalizeList(data));
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
      setTurnoList(normalizeList(data));
    } catch (err) {
      console.error('Error cargando turnos:', err);
    }
  };

  const loadTrabajadores = async () => {
    try {
      const data = await getTrabajadores();
      setTrabajadorList(normalizeList(data));
    } catch (err) {
      console.error('Error cargando trabajadores:', err);
    }
  };

  useEffect(() => {
    loadSustituciones();
    loadTurnos();
    loadTrabajadores();
  }, []);

  const handleCreateNew = () => {
    setSustitucionToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (sustitucion) => {
    setSustitucionToEdit(sustitucion);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSustitucionToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setSustitucionToEdit(null);
    setFeedback({
      type: 'success',
      message: sustitucionToEdit ? 'Sustitucion actualizada correctamente' : 'Sustitucion creada correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadSustituciones();
  };

  const handleDelete = async (sustitucion) => {
    if (!confirm('¿Eliminar esta sustitucion?')) return;
    
    try {
      await deleteSustitucion(sustitucion.id);
      setFeedback({
        type: 'success',
        message: 'Sustitucion eliminada correctamente'
      });
      setTimeout(() => setFeedback(null), 3000);
      loadSustituciones();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al eliminar la sustitucion'
      });
    }
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Sustituciones"
      subtitle="Gestion de sustituciones de trabajadores en turnos"
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
          <SustitucionForm 
            sustitucion={sustitucionToEdit} 
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
              Nueva sustitucion
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando sustituciones...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar las sustituciones</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadSustituciones}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
              <SustitucionesTable sustituciones={sustituciones} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
