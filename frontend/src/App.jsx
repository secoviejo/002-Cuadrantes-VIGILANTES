import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import EmpresasPage from './pages/EmpresasPage'

function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard')

  if (currentRoute === 'empresas') {
    return <EmpresasPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  return <Dashboard currentRoute={currentRoute} onNavigate={setCurrentRoute} />
}

export default App
