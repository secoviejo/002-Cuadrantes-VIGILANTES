import Sidebar from './Sidebar';
import Header from './Header';
import StatusBadge from '../ui/StatusBadge';

export default function AppLayout({ children, isConnected, currentRoute, onNavigate, onLogout, user, title, subtitle, actions }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex font-sans text-sm">
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} onLogout={onLogout} user={user} />
      <main className="flex-1 px-12 py-8 max-w-[calc(100vw-256px)] overflow-x-hidden">
        <div className="flex justify-end mb-4">
          <StatusBadge isConnected={isConnected} />
        </div>
        <Header title={title} subtitle={subtitle} actions={actions} />
        {children}
      </main>
    </div>
  );
}
