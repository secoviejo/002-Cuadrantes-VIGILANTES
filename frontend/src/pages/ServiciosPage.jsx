import { useState, useEffect } from 'react';
import { getServicios, getEdificios } from '../api/catalogos';
import { normalizeList } from '../api/client';
import AppLayout from '../components/layout/AppLayout';
import ServiciosTable from '../components/servicios/ServiciosTable';
import ServicioForm from '../components/servicios/ServicioForm';
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ServiciosPage({ currentRoute, onNavigate, onLogout, user }) {
  const [servicios, setServicios] = useState([]);
  const [edificioList, setEdificioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [servicioToEdit, setServicioToEdit] = useState(null);
  
  const [feedback, setFeedback] = useState(null);
  const [campusFilter, setCampusFilter] = useState('all');

  const loadServicios = async () => {
    setLoading(true);
    try {
      const data = await getServicios();
      setServicios(normalizeList(data));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEdificios = async () => {
    try {
      const data = await getEdificios();
      setEdificioList(normalizeList(data));
    } catch (err) {
      console.error('Error cargando edificios:', err);
    }
  };

  useEffect(() => {
    loadServicios();
    loadEdificios();
  }, []);

  const handleCreateNew = () => {
    setServicioToEdit(null);
    setShowForm(true);
  };

  const handleEdit = (servicio) => {
    setServicioToEdit(servicio);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setServicioToEdit(null);
  };

  const handleSaved = () => {
    setShowForm(false);
    setServicioToEdit(null);
    setFeedback({
      type: 'success',
      message: servicioToEdit ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente'
    });
    
    setTimeout(() => setFeedback(null), 3000);
    
    loadServicios();
  };

  const campusOptions = servicios.reduce((options, servicio) => {
    const campus = servicio.edificio?.campus;
    if (!campus) return options;
    if (!options.some((item) => item.id === campus.id)) {
      options.push({ id: campus.id, nombre: campus.nombre });
    }
    return options;
  }, []);

  const serviciosFiltrados = campusFilter === 'all'
    ? servicios
    : servicios.filter((servicio) => String(servicio.edificio?.campus?.id) === String(campusFilter));

  return (
    <AppLayout 
      isConnected={!error} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      onLogout={onLogout}
      user={user}
      title="Servicios"
      subtitle="Gestion de servicios de vigilancia y auxiliares"
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
        <div>
          <ServicioForm 
            servicio={servicioToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            edificioList={edificioList}
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
              Nuevo servicio
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip active={campusFilter === 'all'} onClick={() => setCampusFilter('all')} label="Todos" count={servicios.length} />
            {campusOptions.map((campus) => (
              <FilterChip
                key={campus.id}
                active={String(campusFilter) === String(campus.id)}
                onClick={() => setCampusFilter(campus.id)}
                label={campus.nombre}
                count={servicios.filter((servicio) => servicio.edificio?.campus?.id === campus.id).length}
              />
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p>Cargando servicios...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Error al cargar los servicios</h3>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={loadServicios}
                  className="mt-3 text-sm underline hover:text-red-800"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <ServiciosTable servicios={serviciosFiltrados} onEdit={handleEdit} />
          )}
        </div>
      )}
    </AppLayout>
  );
}

function FilterChip({ active, onClick, label, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-amber-500'
      }`}
    >
      {label} <span className="ml-1 opacity-70">{count}</span>
    </button>
  );
}
