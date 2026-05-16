import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import EmpresasPage from './pages/EmpresasPage'
import CampusPage from './pages/CampusPage'
import EdificioPage from './pages/EdificioPage'
import ServiciosPage from './pages/ServiciosPage'
import TrabajadoresPage from './pages/TrabajadoresPage'
import TurnosPage from './pages/TurnosPage'
import AsignacionesPage from './pages/AsignacionesPage'
import SustitucionesPage from './pages/SustitucionesPage'
import IncidenciasPage from './pages/IncidenciasPage'
import CuadrantePage from './pages/CuadrantePage'
import HorasAnualesPage from './pages/HorasAnualesPage'
import CierreMensualPage from './pages/CierreMensualPage'
import LoginForm from './components/auth/LoginForm'
import { canAccessRoute } from './utils/roles'

function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true)
    setUser(data.usuario)
    setCurrentRoute('dashboard')
  }

  const navigateGuarded = (route) => {
    setCurrentRoute(canAccessRoute(user, route) ? route : 'dashboard')
  }

  useEffect(() => {
    if (isAuthenticated && !canAccessRoute(user, currentRoute)) {
      setCurrentRoute('dashboard')
    }
  }, [currentRoute, isAuthenticated, user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />
  }

  if (!canAccessRoute(user, currentRoute)) return null

  if (currentRoute === 'empresas') {
    return <EmpresasPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'campus') {
    return <CampusPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'edificios') {
    return <EdificioPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'servicios') {
    return <ServiciosPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'trabajadores') {
    return <TrabajadoresPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'turnos') {
    return <TurnosPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'asignaciones') {
    return <AsignacionesPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'sustituciones') {
    return <SustitucionesPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'incidencias') {
    return <IncidenciasPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'cuadrante') {
    return <CuadrantePage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'horas') {
    return <HorasAnualesPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  if (currentRoute === 'cierre') {
    return <CierreMensualPage currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
  }

  return <Dashboard currentRoute={currentRoute} onNavigate={navigateGuarded} onLogout={handleLogout} user={user} />
}

export default App
