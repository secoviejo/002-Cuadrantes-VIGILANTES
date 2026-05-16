import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock,
  FileCheck2,
  Layers,
  LayoutGrid,
  LogOut,
  Map,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { getVisibleRouteGroups, isContrata } from '../../utils/roles';

const MENU = {
  dashboard: { name: 'Resumen operativo', icon: <ShieldCheck className="w-5 h-5" /> },
  cuadrante: { name: 'Cuadrante mensual', icon: <LayoutGrid className="w-5 h-5" /> },
  sustituciones: { name: 'Sustituciones', icon: <ArrowRightLeft className="w-5 h-5" /> },
  turnos: { name: 'Turnos', icon: <Clock className="w-5 h-5" /> },
  asignaciones: { name: 'Asignaciones', icon: <UserCheck className="w-5 h-5" /> },
  incidencias: { name: 'Incidencias', icon: <AlertTriangle className="w-5 h-5" /> },
  horas: { name: 'Horas anuales', icon: <CalendarCheck className="w-5 h-5" /> },
  cierre: { name: 'Cierre mensual', icon: <FileCheck2 className="w-5 h-5" /> },
  empresas: { name: 'Empresas', icon: <Building2 className="w-5 h-5" /> },
  campus: { name: 'Campus', icon: <Map className="w-5 h-5" /> },
  edificios: { name: 'Edificios', icon: <Layers className="w-5 h-5" /> },
  servicios: { name: 'Servicios', icon: <CalendarDays className="w-5 h-5" /> },
  trabajadores: { name: 'Trabajadores', icon: <Users className="w-5 h-5" /> },
};

export default function Sidebar({ currentRoute = 'dashboard', onNavigate, onLogout, user }) {
  const routeGroups = getVisibleRouteGroups(user);

  const handleNav = (e, id) => {
    e.preventDefault();
    if (onNavigate) onNavigate(id);
  };

  const userInitial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';
  const userName = user?.nombre || 'Usuario';
  const userRol = user?.rol?.nombre || 'Sin rol';
  const contrata = isContrata(user);

  return (
    <aside className="w-64 bg-stone-950 text-stone-200 min-h-screen flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xl tracking-tight">
          <div className="w-2.5 h-6 bg-amber-500"></div>
          Cuadrantes UZ
        </div>
        <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 ml-4">
          {contrata ? 'Contrata de vigilancia' : 'Unidad de Seguridad'}
        </p>
      </div>

      <nav className="flex-1 py-5 overflow-y-auto">
        {routeGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
              {group.title}
            </div>
            <ul className="mt-1 flex flex-col">
              {group.items.map((id) => {
                const item = MENU[id];
                const isActive = currentRoute === id;
                return (
                  <li key={id}>
                    <a
                      href="#"
                      onClick={(e) => handleNav(e, id)}
                      className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors border-l-4 ${
                        isActive
                          ? 'border-amber-500 bg-stone-800 text-amber-200 font-medium'
                          : 'border-transparent text-stone-300 hover:bg-stone-800 hover:text-amber-100'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs ${contrata ? 'bg-sky-700' : 'bg-amber-700'}`}>
            {userInitial}
          </div>
          <div className="flex-1 text-xs">
            <strong className="block text-amber-100 font-medium">{userName}</strong>
            <span className="text-stone-500">{userRol}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
