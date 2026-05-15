const nextSteps = [
  'Migrar layout y navegacion desde el prototipo HTML',
  'Separar datos demo de componentes visuales',
  'Conectar servicios de API cuando exista backend',
]

function App() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              Universidad de Zaragoza
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Cuadrantes UZ</h1>
          </div>
          <span className="rounded border border-stone-300 bg-white px-3 py-1 text-sm text-stone-600">
            Frontend base
          </span>
        </header>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-medium text-amber-800">Paso 4</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">
              Base React preparada para migrar el prototipo sin reescribirlo de golpe.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
              Esta pantalla solo verifica que React, Vite y Tailwind estan inicializados.
              La referencia visual historica sigue en legacy/html-original.
            </p>
          </div>

          <aside className="border border-stone-300 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold">Siguientes migraciones</h3>
            <ul className="mt-4 space-y-3">
              {nextSteps.map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-stone-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-700" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
