import { useState, useEffect } from 'react';
import { getCampus } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import CampusTable from '../components/campus/CampusTable';
import CampusForm from '../components/campus/CampusForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CampusPage({ currentRoute, onNavigate }) {
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for the form
  const [showForm, setShowForm] = useState(false);
  const [campusToEdit, setCampusToEdit] = useState(null);
  
  // States for feedback
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  const loadCampus = async () => {
    setLoading(true);
    try {
      const data = await getCampus();
      setCampusList(normalizeList(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampus();
  }, []);

  const handleCreateNew = () => {
    setCampusToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (campus) => {
    setCampusToEdit(campus);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCampusToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setCampusToEdit(null);
    setFeedback({
      type: 'success',
      message: campusToEdit ? 'Campus actualizado correctamente' : 'Campus creado correctamente'
    });
    
    // Auto-hide feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
    
    loadCampus();
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Campus"
      subtitle="Gestión de los campus de la universidad"
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
          <CampusForm 
            campus={campusToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
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
              Nuevo campus
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando campus...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar los campus</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadCampus}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <CampusTable campusList={campusList} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}
