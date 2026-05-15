export default function Header({ title = "Dashboard", subtitle = "Visión general del estado actual" }) {
  return (
    <header className="mb-8 flex justify-between items-start gap-6">
      <div>
        <h1 className="text-3xl font-serif font-medium text-stone-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {subtitle}
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="bg-stone-900 text-amber-300 px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md">
          Entorno de desarrollo
        </div>
      </div>
    </header>
  );
}
