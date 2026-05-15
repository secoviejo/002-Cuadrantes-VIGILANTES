import { useState, useEffect } from 'react';
import { getTurnos, getAsignaciones } from '../api/catalogos';
import AppLayout from '../components/layout/AppLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getWeekDates(weekOffset = 0) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function getDayName(date) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

function TurnoCelda({ turno, asignaciones }) {
  if (!turno) return <div className="p-2 min-h-[80px] border-t border-stone-100"></div>;
  
  const count = asignaciones.filter(a => a.turnoId === turno.id).length;
  const colorClass = count >= turno.dotacionMinima 
    ? 'bg-green-50 border-green-300' 
    : count > 0 
      ? 'bg-yellow-50 border-yellow-300' 
      : 'bg-red-50 border-red-300';
  
  return (
    <div className={`p-2 min-h-[80px] border-t border-stone-200 ${colorClass}`}>
      <div className="font-mono text-xs text-stone-600 mb-1">
        {formatTime(turno.horaInicio)} - {formatTime(turno.horaFin)}
      </div>
      <div className="text-sm font-medium text-stone-800 mb-1">
        {turno.servicio?.nombre || 'Sin servicio'}
      </div>
      <div className="text-xs text-stone-500">
        {count}/{turno.dotacionMinima} asignados
      </div>
    </div>
  );
}

export default function CuadrantePage({ currentRoute, onNavigate }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [turnos, setTurnos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const weekDates = getWeekDates(weekOffset);

  useEffect(() => {
    loadData();
  }, [weekOffset]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [turnosData, asignData] = await Promise.all([
        getTurnos(),
        getAsignaciones()
      ]);
      setTurnos(Array.isArray(turnosData) ? turnosData : (turnosData.items || []));
      setAsignaciones(Array.isArray(asignData) ? asignData : []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTurnosForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return turnos.filter(t => {
      const turnoDate = new Date(t.fecha).toISOString().split('T')[0];
      return turnoDate === dateStr;
    });
  };

  const weekLabel = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const startStr = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <AppLayout 
      isConnected={true} 
      currentRoute={currentRoute} 
      onNavigate={onNavigate}
      title="Cuadrante Semanal"
      subtitle="Vista general de turnos por dia"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-stone-800">{weekLabel()}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-2 hover:bg-stone-100 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-600" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-2 hover:bg-stone-100 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="text-stone-500">Cargando cuadrante...</div>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7">
            {weekDates.map((date, idx) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={idx} className={`border-r border-stone-200 last:border-r-0 ${isToday ? 'bg-amber-50' : ''}`}>
                  <div className={`p-2 text-center border-b border-stone-200 ${isToday ? 'bg-amber-100' : 'bg-stone-50'}`}>
                    <div className="text-xs text-stone-500 uppercase">{getDayName(date)}</div>
                    <div className={`text-lg font-bold ${isToday ? 'text-amber-700' : 'text-stone-700'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  {getTurnosForDate(date).length > 0 ? (
                    getTurnosForDate(date).map(turno => (
                      <TurnoCelda key={turno.id} turno={turno} asignaciones={asignaciones} />
                    ))
                  ) : (
                    <div className="p-2 min-h-[80px] text-center text-stone-400 text-sm border-t border-stone-100">
                      Sin turnos
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
          <span className="text-stone-600">Cubierto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span className="text-stone-600">Parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
          <span className="text-stone-600">Sin cubrir</span>
        </div>
      </div>
    </AppLayout>
  );
}