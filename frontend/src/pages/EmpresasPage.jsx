import { useState, useEffect } from 'react';
import { getEmpresas } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import EmpresasTable from '../components/empresas/EmpresasTable';
import EmpresaForm from '../components/empresas/EmpresaForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EmpresasPage({ currentRoute, onNavigate }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for the form
  const [showForm, setShowForm] = useState(false);
  const [empresaToEdit, setEmpresaToEdit] = useState(null);
  
  // States for feedback
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const data = await getEmpresas();
      setEmpresas(normalizeList(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  const handleCreateNew = () => {
    setEmpresaToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (empresa) => {
    setEmpresaToEdit(empresa);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEmpresaToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEmpresaToEdit(null);
    setFeedback({
      type: 'success',
      message: empresaToEdit ? 'Empresa actualizada correctamente' : 'Empresa creada correctamente'
    });
    
    // Auto-hide feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
    
    loadEmpresas();
  };

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Empresas"
      subtitle="Gestión de empresas contratistas y de seguridad"
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
          <EmpresaForm 
            empresa={empresaToEdit} 
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
              Nueva empresa
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando empresas...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar las empresas</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadEmpresas}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <EmpresasTable empresas={empresas} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}
