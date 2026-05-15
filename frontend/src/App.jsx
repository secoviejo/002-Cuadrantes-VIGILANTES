import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import EmpresasPage from './pages/EmpresasPage'
import CampusPage from './pages/CampusPage'
import EdificioPage from './pages/EdificioPage'
import ServiciosPage from './pages/ServiciosPage'
import TrabajadoresPage from './pages/TrabajadoresPage'
import TurnosPage from './pages/TurnosPage'

function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard')

  if (currentRoute === 'empresas') {
    return <EmpresasPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  if (currentRoute === 'campus') {
    return <CampusPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  if (currentRoute === 'edificios') {
    return <EdificioPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  if (currentRoute === 'servicios') {
    return <ServiciosPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  if (currentRoute === 'trabajadores') {
    return <TrabajadoresPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  if (currentRoute === 'turnos') {
    return <TurnosPage currentRoute={currentRoute} onNavigate={setCurrentRoute} />
  }

  return <Dashboard currentRoute={currentRoute} onNavigate={setCurrentRoute} />
}

export default App
