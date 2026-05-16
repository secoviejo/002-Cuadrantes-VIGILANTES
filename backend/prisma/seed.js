import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function at(date, time) {
  return new Date(`${date}T${time}:00.000Z`)
}

const DEMO_PASSWORD_HASH = '7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3'

async function main() {
  const [rolAdmin, rolUz, rolContrata] = await Promise.all([
    prisma.rol.upsert({
      where: { nombre: 'ADMIN' },
      update: {},
      create: { nombre: 'ADMIN', descripcion: 'Administracion tecnica de la aplicacion' },
    }),
    prisma.rol.upsert({
      where: { nombre: 'UNIDAD_SEGURIDAD_UZ' },
      update: {},
      create: { nombre: 'UNIDAD_SEGURIDAD_UZ', descripcion: 'Supervision y validacion del servicio' },
    }),
    prisma.rol.upsert({
      where: { nombre: 'CONTRATA' },
      update: {},
      create: { nombre: 'CONTRATA', descripcion: 'Operacion diaria de la empresa adjudicataria' },
    }),
  ])

  const empresa = await prisma.empresa.upsert({
    where: { cif: 'DEMO000000' },
    update: {},
    create: {
      nombre: 'Empresa Demo Seguridad',
      cif: 'DEMO000000',
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'supervision.demo@unizar.example' },
    update: {
      passwordHash: DEMO_PASSWORD_HASH,
    },
    create: {
      email: 'supervision.demo@unizar.example',
      nombre: 'Supervision Demo UZ',
      passwordHash: DEMO_PASSWORD_HASH,
      rolId: rolUz.id,
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'contrata.demo@example.com' },
    update: {
      passwordHash: DEMO_PASSWORD_HASH,
    },
    create: {
      email: 'contrata.demo@example.com',
      nombre: 'Operador Demo Contrata',
      passwordHash: DEMO_PASSWORD_HASH,
      rolId: rolContrata.id,
      empresaId: empresa.id,
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'admin.demo@example.com' },
    update: {
      passwordHash: DEMO_PASSWORD_HASH,
    },
    create: {
      email: 'admin.demo@example.com',
      nombre: 'Admin Demo',
      passwordHash: DEMO_PASSWORD_HASH,
      rolId: rolAdmin.id,
    },
  })

  const campusData = [
    { codigo: 'SAN_FRANCISCO', nombre: 'San Francisco', ciudad: 'Zaragoza' },
    { codigo: 'RIO_EBRO', nombre: 'Rio Ebro', ciudad: 'Zaragoza' },
    { codigo: 'VETERINARIA', nombre: 'Veterinaria', ciudad: 'Zaragoza' },
    { codigo: 'HUESCA', nombre: 'Huesca', ciudad: 'Huesca' },
    { codigo: 'TERUEL', nombre: 'Teruel', ciudad: 'Teruel' },
  ]

  const campus = {}
  for (const item of campusData) {
    campus[item.codigo] = await prisma.campus.upsert({
      where: { codigo: item.codigo },
      update: {},
      create: item,
    })
  }

  const edificiosData = [
    { codigo: 'SF_INTERFAC', nombre: 'Edificio Interfacultades', campusId: campus.SAN_FRANCISCO.id },
    { codigo: 'RE_BETANCOURT', nombre: 'Edificio Betancourt', campusId: campus.RIO_EBRO.id },
    { codigo: 'VET_PRINCIPAL', nombre: 'Facultad de Veterinaria', campusId: campus.VETERINARIA.id },
    { codigo: 'HUE_CAMPUS', nombre: 'Campus de Huesca', campusId: campus.HUESCA.id },
    { codigo: 'TER_CAMPUS', nombre: 'Campus de Teruel', campusId: campus.TERUEL.id },
  ]

  const edificios = {}
  for (const item of edificiosData) {
    edificios[item.codigo] = await prisma.edificio.upsert({
      where: { codigo: item.codigo },
      update: {},
      create: item,
    })
  }

  const serviciosData = [
    {
      codigo: 'SERV_SF_24H',
      nombre: 'Vigilancia San Francisco 24h',
      perfilRequerido: 'VIGILANTE',
      dotacionMinima: 2,
      edificioId: edificios.SF_INTERFAC.id,
    },
    {
      codigo: 'SERV_RE_24H',
      nombre: 'Vigilancia Rio Ebro 24h',
      perfilRequerido: 'VIGILANTE',
      dotacionMinima: 1,
      edificioId: edificios.RE_BETANCOURT.id,
    },
    {
      codigo: 'SERV_VET_24H',
      nombre: 'Vigilancia Veterinaria 24h',
      perfilRequerido: 'VIGILANTE',
      dotacionMinima: 1,
      edificioId: edificios.VET_PRINCIPAL.id,
    },
    {
      codigo: 'SERV_HUE_VARIABLE',
      nombre: 'Vigilancia Huesca variable',
      perfilRequerido: 'VIGILANTE',
      dotacionMinima: 1,
      edificioId: edificios.HUE_CAMPUS.id,
    },
    {
      codigo: 'SERV_TER_NOCTURNO',
      nombre: 'Vigilancia Teruel nocturna',
      perfilRequerido: 'VIGILANTE',
      dotacionMinima: 1,
      edificioId: edificios.TER_CAMPUS.id,
    },
  ]

  const servicios = {}
  for (const item of serviciosData) {
    servicios[item.codigo] = await prisma.servicio.upsert({
      where: { codigo: item.codigo },
      update: {},
      create: item,
    })
  }

  const trabajadoresData = [
    { codigo: 'TRAB_DEMO_001', nombre: 'Vigilante Demo 001', tipo: 'VIGILANTE', empresaId: empresa.id },
    { codigo: 'TRAB_DEMO_002', nombre: 'Vigilante Demo 002', tipo: 'VIGILANTE', empresaId: empresa.id },
    { codigo: 'TRAB_DEMO_003', nombre: 'Auxiliar Demo 001', tipo: 'AUXILIAR', empresaId: empresa.id },
    { codigo: 'TRAB_DEMO_004', nombre: 'Jefe Equipo Demo 001', tipo: 'JEFE_EQUIPO', empresaId: empresa.id },
  ]

  const trabajadores = {}
  for (const item of trabajadoresData) {
    trabajadores[item.codigo] = await prisma.trabajador.upsert({
      where: { codigo: item.codigo },
      update: {},
      create: item,
    })
  }

  const turno = await prisma.turno.upsert({
    where: { codigo: 'TURNO_DEMO_SF_2026_05_15_M' },
    update: {},
    create: {
      codigo: 'TURNO_DEMO_SF_2026_05_15_M',
      servicioId: servicios.SERV_SF_24H.id,
      fecha: new Date('2026-05-15T00:00:00.000Z'),
      horaInicio: at('2026-05-15', '06:00'),
      horaFin: at('2026-05-15', '14:00'),
      estado: 'PARCIAL',
      dotacionMinima: 2,
    },
  })

  await prisma.asignacionTurno.upsert({
    where: {
      turnoId_trabajadorId: {
        turnoId: turno.id,
        trabajadorId: trabajadores.TRAB_DEMO_001.id,
      },
    },
    update: {},
    create: {
      turnoId: turno.id,
      trabajadorId: trabajadores.TRAB_DEMO_001.id,
      estado: 'CONFIRMADO',
    },
  })

  await prisma.calendarioLaboral.upsert({
    where: { codigo: 'CAL_DEMO_2026_05_01_FESTIVO' },
    update: {},
    create: {
      codigo: 'CAL_DEMO_2026_05_01_FESTIVO',
      fecha: new Date('2026-05-01T00:00:00.000Z'),
      tipo: 'FESTIVO',
      descripcion: 'Festivo demo 1 de mayo',
    },
  })

  await prisma.calendarioLaboral.upsert({
    where: { codigo: 'CAL_DEMO_2026_05_15_LECTIVO' },
    update: {},
    create: {
      codigo: 'CAL_DEMO_2026_05_15_LECTIVO',
      fecha: new Date('2026-05-15T00:00:00.000Z'),
      tipo: 'LECTIVO',
      descripcion: 'Dia lectivo demo',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
