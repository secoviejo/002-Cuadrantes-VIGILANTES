import { useState, useEffect } from 'react';
import { getTurnos, getServicios, createVerificacion } from '../api/catalogos';
import { normalizeList } from '../api/client';
import { exportTurnos } from '../utils/exportUtils';
import AppLayout from '../components/layout/AppLayout';
import TurnosTable from '../components/turnos/TurnosTable';
import TurnoForm from '../components/turnos/TurnoForm';
import { Plus, Loader2, AlertCircle, CheckCircle2, Filter, X, Download, Calendar as CalendarIcon, Clock, ShieldAlert, CheckCircle, AlertTriangle, ShieldBan } from 'lucide-react';

const ESTADOS = [
  { value: '', label: 'Todos', icon: null, color: 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200' },
  { value: 'CUBIERTO', label: 'Cubierto', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200' },
  { value: 'SIN_CUBRIR', label: 'Sin cubrir', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' },
  { value: 'PARCIAL', label: 'Parcial', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200' },
  { value: 'INCIDENCIA', label: 'Incidencia', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200' },
  { value: 'CANCELADO', label: 'Cancelado', icon: <ShieldBan className="w-4 h-4" />, color: 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200' },
];

const ESTADOS_VERIFICACION = [
  { value: 'CUBIERTO', label: 'Cubierto' },
  { value: 'INCIDENCIA', label: 'Incidencia' },
  { value: 'DESCUBIERTO', label: 'Descubierto' },
];

export default function TurnosPage({ currentRoute, onNavigate, onLogout, user }) {
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

  const [showVerificacion, setShowVerificacion] = useState(false);
  const [turnoParaVerificar, setTurnoParaVerificar] = useState(null);
  const [verificacionEstado, setVerificacionEstado] = useState('CUBIERTO');
  const [verificacionNota, setVerificacionNota] = useState('');
  const [verificando, setVerificando] = useState(false);

  const loadTurnos = async () => {
    setLoading(true);
    try {
      const data = await getTurnos();
      setTurnos(normalizeList(data));
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
      setServicioList(normalizeList(data));
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

  const handleVerificar = (turno) => {
    setTurnoParaVerificar(turno);
    setVerificacionEstado('CUBIERTO');
    setVerificacionNota('');
    setShowVerificacion(true);
  };

  const handleConfirmarVerificacion = async () => {
    if (!turnoParaVerificar) return;
    
    setVerificando(true);
    try {
      await createVerificacion({
        turnoId: turnoParaVerificar.id,
        estado: verificacionEstado,
        nota: verificacionNota || null,
      });
      
      setFeedback({
        type: 'success',
        message: 'Verificación registrada correctamente'
      });
      setTimeout(() => setFeedback(null), 3000);
      
      setShowVerificacion(false);
      setTurnoParaVerificar(null);
      loadTurnos();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Error al registrar verificación: ' + err.message
      });
    } finally {
      setVerificando(false);
    }
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
      onLogout={onLogout}
      user={user}
      title="Turnos"
      subtitle="Gestión de turnos de vigilancia y cobertura"
    >
      
      {feedback && (
        <div className={`mb-6 p-4 flex items-center gap-2 border-l-4 rounded-r-md shadow-sm ${
          feedback.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {showForm ? (
        <div className="max-w-2xl bg-white shadow-sm rounded-xl p-6 border border-stone-200">
          <TurnoForm 
            turno={turnoToEdit} 
            onSaved={handleSaved} 
            onCancel={handleCancelForm} 
            servicioList={servicioList}
          />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Cabecera de controles y filtros rápidos */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            
            {/* Filtros rápidos visuales */}
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map(estado => {
                const isSelected = filtroEstado === estado.value;
                return (
                  <button
                    key={estado.value}
                    onClick={() => setFiltroEstado(estado.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isSelected 
                        ? 'ring-2 ring-amber-500 ring-offset-1 ' + estado.color.replace('hover:', '')
                        : estado.color + ' opacity-80 hover:opacity-100'
                    }`}
                  >
                    {estado.icon}
                    {estado.label}
                    {isSelected && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/50 text-[10px] leading-none">
                        {turnosFiltrados.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Controles de acción */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="pl-10 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm w-full lg:w-auto bg-stone-50"
                />
                {filtroFecha && (
                  <button 
                    onClick={() => setFiltroFecha('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              <div className="w-px h-6 bg-stone-300 mx-1 hidden lg:block"></div>

              <button
                onClick={() => exportTurnos(turnosFiltrados)}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-stone-200 shadow-sm"
                title="Exportar listado a CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-amber-600/20 hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Nuevo turno
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-semibold text-stone-800">
              Listado de turnos
            </h3>
            <span className="text-sm font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
              Mostrando {turnosFiltrados.length} de {turnos.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-stone-200 shadow-sm text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-600" />
              <p className="font-medium">Cargando datos de turnos...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm text-red-700 flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">No se pudieron cargar los turnos</h3>
                <p className="text-sm mb-3">{error}</p>
                <button 
                  onClick={loadTurnos}
                  className="text-sm font-medium bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Reintentar conexión
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <TurnosTable turnos={turnosFiltrados} onEdit={handleEdit} onVerificar={handleVerificar} />
            </div>
          )}

          {/* Modal de Verificación */}
          {showVerificacion && turnoParaVerificar && (
            <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/80 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-800">Verificar Cobertura</h3>
                    <p className="text-sm text-stone-500 mt-1 font-mono bg-white inline-block px-2 py-0.5 rounded border border-stone-200">
                      ID: {turnoParaVerificar.id}
                    </p>
                  </div>
                  <button onClick={() => setShowVerificacion(false)} className="text-stone-400 hover:text-stone-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-stone-700">Estado reportado</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {ESTADOS_VERIFICACION.map(e => {
                        const isSelected = verificacionEstado === e.value;
                        return (
                          <label 
                            key={e.value} 
                            className={`flex flex-col items-center justify-center gap-2 cursor-pointer p-3 rounded-xl border-2 transition-all ${
                              isSelected 
                                ? 'border-amber-500 bg-amber-50 text-amber-800' 
                                : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="verificacionEstado"
                              value={e.value}
                              checked={isSelected}
                              onChange={() => setVerificacionEstado(e.value)}
                              className="sr-only"
                            />
                            {e.value === 'CUBIERTO' && <CheckCircle2 className="w-5 h-5" />}
                            {e.value === 'INCIDENCIA' && <AlertTriangle className="w-5 h-5" />}
                            {e.value === 'DESCUBIERTO' && <ShieldAlert className="w-5 h-5" />}
                            <span className="text-xs font-medium uppercase tracking-wide">{e.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="verificacionNota" className="block text-sm font-semibold text-stone-700">
                      Observaciones de verificación
                    </label>
                    <textarea
                      id="verificacionNota"
                      rows="3"
                      value={verificacionNota}
                      onChange={(e) => setVerificacionNota(e.target.value)}
                      placeholder="Indique cualquier anomalía detectada durante la verificación..."
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm bg-stone-50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/80 flex justify-end gap-3">
                  <button
                    onClick={() => setShowVerificacion(false)}
                    className="px-4 py-2.5 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmarVerificacion}
                    disabled={verificando}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verificando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Guardar Verificación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
