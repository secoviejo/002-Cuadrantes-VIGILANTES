import { Database, AlertCircle, Loader2 } from 'lucide-react';

export default function StatusBadge({ isConnected }) {
  if (isConnected === null) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-200 text-stone-600 text-xs font-medium border border-stone-300">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Conectando a MariaDB (Puerto 3308)...
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
        <Database className="w-3.5 h-3.5" />
        Backend conectado (localhost:4000)
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium border border-red-200">
      <AlertCircle className="w-3.5 h-3.5" />
      Error conectando con el backend
    </div>
  );
}
