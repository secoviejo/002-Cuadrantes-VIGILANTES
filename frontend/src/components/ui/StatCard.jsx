export default function StatCard({ label, value, unit = '', loading = false }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 relative overflow-hidden">
      <div className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold mb-3">
        {label}
      </div>
      
      {loading ? (
        <div className="h-10 bg-stone-200 animate-pulse rounded w-16"></div>
      ) : (
        <div className="font-serif text-3xl font-medium text-stone-900 tracking-tight">
          {value} <span className="text-sm text-stone-500 font-sans ml-1">{unit}</span>
        </div>
      )}
      
      <div className="mt-3 h-1.5 bg-stone-200 rounded-sm overflow-hidden">
        <div className="h-full bg-amber-700 rounded-sm w-1/3"></div>
      </div>
    </div>
  );
}
