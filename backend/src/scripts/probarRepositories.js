import { closePrismaClient } from '../db/prisma.js'
import {
  TrabajadorRepo,
  ServicioRepo,
  TurnoRepo,
  AsignacionTurnoRepo,
  AusenciaRepo,
} from '../repositories/index.js'

async function probarRepositorios() {
  console.log('\n=== Probando Repositorios ===\n')

  console.log('1. Probando TrabajadorRepo.findAll...')
  try {
    const { items: trabajadores, total } = await TrabajadorRepo.findAll({ activo: true })
    console.log(`   OK: ${trabajadores.length} trabajadores activos (total: ${total})`)
  } catch (error) {
    console.log(`   ERROR (esperado sin BD real): ${error.message}`)
  }

  console.log('\n2. Probando ServicioRepo.findAll...')
  try {
    const { items: servicios, total } = await ServicioRepo.findAll({ activo: true })
    console.log(`   OK: ${servicios.length} servicios activos (total: ${total})`)
  } catch (error) {
    console.log(`   ERROR (esperado sin BD real): ${error.message}`)
  }

  console.log('\n3. Probando TurnoRepo.findAll...')
  try {
    const { items: turnos, total } = await TurnoRepo.findAll({})
    console.log(`   OK: ${turnos.length} turnos (total: ${total})`)
  } catch (error) {
    console.log(`   ERROR (esperado sin BD real): ${error.message}`)
  }

  console.log('\n4. Probando AsignacionTurnoRepo.findAll...')
  try {
    const asignaciones = await AsignacionTurnoRepo.findAll({})
    console.log(`   OK: ${asignaciones.length} asignaciones`)
  } catch (error) {
    console.log(`   ERROR (esperado sin BD real): ${error.message}`)
  }

  console.log('\n5. Probando AusenciaRepo.findAll...')
  try {
    const ausencias = await AusenciaRepo.findAll({})
    console.log(`   OK: ${ausencias.length} ausencias`)
  } catch (error) {
    console.log(`   ERROR (esperado sin BD real): ${error.message}`)
  }

  console.log('\n6. Verificando exports de repositorios...')
  console.log('   TrabajadorRepo:', typeof TrabajadorRepo.findAll === 'function' ? 'OK' : 'ERROR')
  console.log('   ServicioRepo:', typeof ServicioRepo.findAll === 'function' ? 'OK' : 'ERROR')
  console.log('   TurnoRepo:', typeof TurnoRepo.findAll === 'function' ? 'OK' : 'ERROR')
  console.log('   AsignacionTurnoRepo:', typeof AsignacionTurnoRepo.findAll === 'function' ? 'OK' : 'ERROR')
  console.log('   AusenciaRepo:', typeof AusenciaRepo.findAll === 'function' ? 'OK' : 'ERROR')

  await closePrismaClient()
  console.log('\n=== Prueba completada ===\n')
}

probarRepositorios()