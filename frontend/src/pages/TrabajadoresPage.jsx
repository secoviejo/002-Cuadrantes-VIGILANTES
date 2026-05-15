import { useState, useEffect } from 'react';
import { getTrabajadores, getEmpresas } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import TrabajadoresTable from '../components/trabajadores/TrabajadoresTable';
import TrabajadorForm from '../components/trabajadores/TrabajadorForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TrabajadoresPage({ currentRoute, onNavigate }) {
  const [trabajadores, setTrabajadores] = useState([]);
  const [empresaList, setEmpresaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [trabajadorToEdit, setTrabajadorToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);

  const loadTrabajadores = async () => {
    setLoading(true);
    try {
      const data = await getTrabajadores();
      const items = Array.isArray(data) ? data : (data.items || []);
      setTrabajadores(items);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEmpresas = async () => {
    try {
      const data = await getEmpresas();
      setEmpresaList(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      console.error('Error cargando empresas:', err);
    }
  };

  useEffect(() => {
    loadTrabajadores();
    loadEmpresas();
  }, []);

  const handleCreateNew = () => {
    setTrabajadorToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (trabajador) => {
    setTrabajadorToEdit(trabajador);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setTrabajadorToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setTrabajadorToEdit(null);
    setFeedback({
      type: 'success',
      message: trabajadorToEdit ? 'Trabajador actualizado correctamente' : 'Trabajador creado correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadTrabajadores();
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Trabajadores"
      subtitle="Gestion de vigilantes, auxiliares y personal de seguridad"
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
          <TrabajadorForm 
            trabajador={trabajadorToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            empresaList={empresaList}
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
              Nuevo trabajador
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando trabajadores...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar los trabajadores</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadTrabajadores}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <TrabajadoresTable trabajadores={trabajadores} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}