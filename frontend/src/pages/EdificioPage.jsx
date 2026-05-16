import { useState, useEffect } from 'react';
import { getEdificios, getCampus } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import EdificioTable from '../components/edificios/EdificioTable';
import EdificioForm from '../components/edificios/EdificioForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EdificioPage({ currentRoute, onNavigate }) {
  const [edificioList, setEdificioList] = useState([]);
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [edificioToEdit, setEdificioToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  const loadEdificios = async () => {
    setLoading(true);
    try {
      const data = await getEdificios();
      setEdificioList(normalizeList(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCampus = async () => {
    try {
      const data = await getCampus();
      setCampusList(normalizeList(data));
    } catch (err) {
      console.error('Error cargando campus:', err);
    }
  };

  useEffect(() => {
    loadEdificios();
    loadCampus();
  }, []);

  const handleCreateNew = () => {
    setEdificioToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (edificio) => {
    setEdificioToEdit(edificio);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEdificioToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEdificioToEdit(null);
    setFeedback({
      type: 'success',
      message: edificioToEdit ? 'Edificio actualizado correctamente' : 'Edificio creado correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadEdificios();
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Edificios"
      subtitle="Gestion de edificios y campuses de la universidad"
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
          <EdificioForm 
            edificio={edificioToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            campusList={campusList}
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
              Nuevo edificio
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando edificios...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar los edificios</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadEdificios}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <EdificioTable edificioList={edificioList} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}
