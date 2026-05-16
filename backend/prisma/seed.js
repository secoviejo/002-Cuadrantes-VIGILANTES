import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function at(date, time) {
  return new Date(`${date}T${time}:00.000Z`)
}

function dateOnly(date) {
  return new Date(`${date}T00:00:00.000Z`)
}

const DEMO_PASSWORD_HASH = '7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3'

const TURNOS = {
  M: { inicio: '06:00', fin: '14:00', horas: 8 },
  T: { inicio: '14:00', fin: '22:00', horas: 8 },
  N: { inicio: '22:00', fin: '06:00', horas: 8 },
  D: { inicio: '08:00', fin: '16:00', horas: 8 },
}

function turnoFechas(date, codigoTurno) {
  const config = TURNOS[codigoTurno]
  const inicio = at(date, config.inicio)
  const finDate = codigoTurno === 'N' ? addDays(date, 1) : date
  const fin = at(finDate, config.fin)
  return { inicio, fin }
}

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

function ymd(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isWeekend(year, month, day) {
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return dow === 0 || dow === 6
}

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
    { codigo: 'PARAISO', nombre: 'Paraiso', ciudad: 'Zaragoza' },
    { codigo: 'RIO_EBRO', nombre: 'Rio Ebro', ciudad: 'Zaragoza' },
    { codigo: 'VETERINARIA', nombre: 'Veterinaria', ciudad: 'Zaragoza' },
    { codigo: 'CECO', nombre: 'CECO', ciudad: 'Zaragoza' },
    { codigo: 'HUESCA', nombre: 'Huesca', ciudad: 'Huesca' },
    { codigo: 'TERUEL', nombre: 'Teruel', ciudad: 'Teruel' },
    { codigo: 'JACA', nombre: 'Jaca', ciudad: 'Jaca' },
    { codigo: 'MULTICAMPUS', nombre: 'Multi-campus', ciudad: null },
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
    { codigo: 'PAR_CAMPUS', nombre: 'Campus Paraiso', campusId: campus.PARAISO.id },
    { codigo: 'RE_BETANCOURT', nombre: 'Edificio Betancourt', campusId: campus.RIO_EBRO.id },
    { codigo: 'VET_PRINCIPAL', nombre: 'Facultad de Veterinaria', campusId: campus.VETERINARIA.id },
    { codigo: 'CECO_CONTROL', nombre: 'Centro de Control CECO', campusId: campus.CECO.id },
    { codigo: 'HUE_CAMPUS', nombre: 'Campus de Huesca', campusId: campus.HUESCA.id },
    { codigo: 'TER_CAMPUS', nombre: 'Campus de Teruel', campusId: campus.TERUEL.id },
    { codigo: 'JACA_RESIDENCIA', nombre: 'Residencia Jaca', campusId: campus.JACA.id },
    { codigo: 'MULTI_SALAS', nombre: 'Salas de estudio varias', campusId: campus.MULTICAMPUS.id },
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
    { codigo: 'SERV_SF_24H', nombre: 'San Francisco', descripcion: '2 vigilantes 24/7', tipoOperativo: 'Vigilancia', modalidad: '24/7', horario: '24/7 todo el ano', vehiculo: '2 x SUV electrico', orden: 1, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 2, edificioId: edificios.SF_INTERFAC.id },
    { codigo: 'SERV_PAR_24H', nombre: 'Paraiso', descripcion: '24/7', tipoOperativo: 'Vigilancia', modalidad: '24/7', horario: '24/7 todo el ano', vehiculo: null, orden: 2, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.PAR_CAMPUS.id },
    { codigo: 'SERV_VET_24H', nombre: 'Veterinaria', descripcion: '24/7', tipoOperativo: 'Vigilancia', modalidad: '24/7', horario: '24/7 todo el ano', vehiculo: null, orden: 3, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.VET_PRINCIPAL.id },
    { codigo: 'SERV_RE_24H', nombre: 'Rio Ebro', descripcion: '24/7', tipoOperativo: 'Vigilancia', modalidad: '24/7', horario: '24/7 todo el ano', vehiculo: '1 x SUV electrico', orden: 4, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.RE_BETANCOURT.id },
    { codigo: 'SERV_CECO_24H', nombre: 'CECO', descripcion: '24/7 Centro de Control', tipoOperativo: 'Vigilancia', modalidad: '24/7', horario: '24/7 todo el ano', vehiculo: null, orden: 5, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.CECO_CONTROL.id },
    { codigo: 'SERV_CECO_JEFE', nombre: 'CECO Jefe equipo', descripcion: 'L-V diurno', tipoOperativo: 'Coordinacion', modalidad: 'LABORAL_DIURNO', horario: 'L-V diurno (8h)', vehiculo: null, orden: 6, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.CECO_CONTROL.id },
    { codigo: 'SERV_TER_NOCTURNO', nombre: 'Teruel', descripcion: '22:00-08:00 sin agosto', tipoOperativo: 'Vigilancia', modalidad: 'NOCTURNO', horario: '22:00-08:00 (sin agosto)', vehiculo: null, orden: 7, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.TER_CAMPUS.id },
    { codigo: 'SERV_HUE_VARIABLE', nombre: 'Huesca', descripcion: 'Variable lectivo/no lectivo', tipoOperativo: 'Vigilancia', modalidad: 'VARIABLE', horario: 'Variable (lectivo/no lectivo/festivos)', vehiculo: '1 x SUV hibrido', orden: 8, visibleCuadrante: true, perfilRequerido: 'VIGILANTE', dotacionMinima: 1, edificioId: edificios.HUE_CAMPUS.id },
    { codigo: 'SERV_OCA_SF', nombre: 'OCA San Francisco', descripcion: 'Auxiliar lectivo/no lectivo', tipoOperativo: 'Auxiliar', modalidad: 'LECTIVO', horario: 'L-V dias lectivos / no lectivos', vehiculo: null, orden: 9, visibleCuadrante: false, perfilRequerido: 'AUXILIAR', dotacionMinima: 1, edificioId: edificios.SF_INTERFAC.id },
    { codigo: 'SERV_CMU_CERBUNA', nombre: 'C.M.U. Pedro Cerbuna', descripcion: 'Auxiliar nocturno y fin de semana', tipoOperativo: 'Auxiliar', modalidad: 'NOCTURNO_FDS', horario: 'Nocturno L-V + 24h fin de semana', vehiculo: null, orden: 10, visibleCuadrante: false, perfilRequerido: 'AUXILIAR', dotacionMinima: 1, edificioId: edificios.PAR_CAMPUS.id },
    { codigo: 'SERV_CMU_RAMON_ACIN', nombre: 'C.M.U. Ramon Acin', descripcion: 'Auxiliar nocturno y fin de semana', tipoOperativo: 'Auxiliar', modalidad: 'NOCTURNO_FDS', horario: 'Nocturno L-V + 24h fin de semana', vehiculo: null, orden: 11, visibleCuadrante: false, perfilRequerido: 'AUXILIAR', dotacionMinima: 1, edificioId: edificios.HUE_CAMPUS.id },
    { codigo: 'SERV_RES_JACA', nombre: 'Residencia Jaca', descripcion: 'A demanda nocturno', tipoOperativo: 'A demanda', modalidad: 'A_DEMANDA', horario: '22:00-08:00 segun solicitud (~1.900h/ano)', vehiculo: null, orden: 12, visibleCuadrante: false, perfilRequerido: 'AUXILIAR', dotacionMinima: 1, edificioId: edificios.JACA_RESIDENCIA.id },
    { codigo: 'SERV_SALAS_ESTUDIO', nombre: 'Salas estudio (varias)', descripcion: 'Segun calendario academico', tipoOperativo: 'A demanda', modalidad: 'A_DEMANDA', horario: 'Segun calendario academico', vehiculo: null, orden: 13, visibleCuadrante: false, perfilRequerido: 'AUXILIAR', dotacionMinima: 1, edificioId: edificios.MULTI_SALAS.id },
  ]

  const servicios = {}
  for (const item of serviciosData) {
    servicios[item.codigo] = await prisma.servicio.upsert({
      where: { codigo: item.codigo },
      update: item,
      create: item,
    })
  }

  const horasMayo = [
    { codigo: 'SERV_SF_24H', plan: 1488, ejecutadas: 1468 },
    { codigo: 'SERV_PAR_24H', plan: 744, ejecutadas: 736 },
    { codigo: 'SERV_VET_24H', plan: 744, ejecutadas: 736 },
    { codigo: 'SERV_RE_24H', plan: 744, ejecutadas: 736 },
    { codigo: 'SERV_CECO_24H', plan: 912, ejecutadas: 880 },
    { codigo: 'SERV_TER_NOCTURNO', plan: 310, ejecutadas: 310 },
    { codigo: 'SERV_HUE_VARIABLE', plan: 412, ejecutadas: 442 },
    { codigo: 'SERV_SALAS_ESTUDIO', plan: 40, ejecutadas: 0 },
  ]

  for (const item of horasMayo) {
    await prisma.horasContratoServicio.upsert({
      where: {
        servicioId_anio_mes: {
          servicioId: servicios[item.codigo].id,
          anio: 2026,
          mes: 5,
        },
      },
      update: {
        horasPlanificadas: item.plan,
        horasEjecutadas: item.ejecutadas,
      },
      create: {
        servicioId: servicios[item.codigo].id,
        anio: 2026,
        mes: 5,
        horasPlanificadas: item.plan,
        horasEjecutadas: item.ejecutadas,
      },
    })
  }

  const puestos = [
    { codigo: 'PUESTO_SF1_M', nombre: 'San Francisco', etiqueta: 'Vig 1', meta: '24/7 - Edificio Interfacultades', iniciales: 'SF1', turnoCodigo: 'M', orden: 1, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_SF2_M', nombre: 'San Francisco', etiqueta: 'Vig 2', meta: '24/7 - Rondas vehiculo', iniciales: 'SF2', turnoCodigo: 'M', orden: 2, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_PAR_M', nombre: 'Paraiso', etiqueta: null, meta: '24/7', iniciales: 'PAR', turnoCodigo: 'M', orden: 3, servicioId: servicios.SERV_PAR_24H.id },
    { codigo: 'PUESTO_VET_M', nombre: 'Veterinaria', etiqueta: null, meta: '24/7', iniciales: 'VET', turnoCodigo: 'M', orden: 4, servicioId: servicios.SERV_VET_24H.id },
    { codigo: 'PUESTO_RIO_M', nombre: 'Rio Ebro', etiqueta: null, meta: '24/7 - Rondas vehiculo', iniciales: 'RE', turnoCodigo: 'M', orden: 5, servicioId: servicios.SERV_RE_24H.id },
    { codigo: 'PUESTO_CECO_M', nombre: 'CECO', etiqueta: null, meta: '24/7 - Centro de Control', iniciales: 'CE', turnoCodigo: 'M', orden: 6, servicioId: servicios.SERV_CECO_24H.id },
    { codigo: 'PUESTO_HUE_M', nombre: 'Huesca', etiqueta: null, meta: 'Variable lectivo - Rondas vehiculo', iniciales: 'HU', turnoCodigo: 'M', orden: 7, servicioId: servicios.SERV_HUE_VARIABLE.id },
    { codigo: 'PUESTO_CECO_JEFE_M', nombre: 'CECO - Jefe de equipo', etiqueta: null, meta: 'L-V diurno', iniciales: 'JE', turnoCodigo: 'M', orden: 8, servicioId: servicios.SERV_CECO_JEFE.id },
    { codigo: 'PUESTO_SF1_T', nombre: 'San Francisco', etiqueta: 'Vig 1', meta: '24/7 - Edificio Interfacultades', iniciales: 'SF1', turnoCodigo: 'T', orden: 1, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_SF2_T', nombre: 'San Francisco', etiqueta: 'Vig 2', meta: '24/7 - Rondas vehiculo', iniciales: 'SF2', turnoCodigo: 'T', orden: 2, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_PAR_T', nombre: 'Paraiso', etiqueta: null, meta: '24/7', iniciales: 'PAR', turnoCodigo: 'T', orden: 3, servicioId: servicios.SERV_PAR_24H.id },
    { codigo: 'PUESTO_VET_T', nombre: 'Veterinaria', etiqueta: null, meta: '24/7', iniciales: 'VET', turnoCodigo: 'T', orden: 4, servicioId: servicios.SERV_VET_24H.id },
    { codigo: 'PUESTO_RIO_T', nombre: 'Rio Ebro', etiqueta: null, meta: '24/7 - Rondas vehiculo', iniciales: 'RE', turnoCodigo: 'T', orden: 5, servicioId: servicios.SERV_RE_24H.id },
    { codigo: 'PUESTO_CECO_T', nombre: 'CECO', etiqueta: null, meta: '24/7 - Centro de Control', iniciales: 'CE', turnoCodigo: 'T', orden: 6, servicioId: servicios.SERV_CECO_24H.id },
    { codigo: 'PUESTO_HUE_T', nombre: 'Huesca', etiqueta: null, meta: 'Variable lectivo - Rondas vehiculo', iniciales: 'HU', turnoCodigo: 'T', orden: 7, servicioId: servicios.SERV_HUE_VARIABLE.id },
    { codigo: 'PUESTO_SF1_N', nombre: 'San Francisco', etiqueta: 'Vig 1', meta: '24/7 - Edificio Interfacultades', iniciales: 'SF1', turnoCodigo: 'N', orden: 1, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_SF2_N', nombre: 'San Francisco', etiqueta: 'Vig 2', meta: '24/7 - Rondas vehiculo', iniciales: 'SF2', turnoCodigo: 'N', orden: 2, servicioId: servicios.SERV_SF_24H.id },
    { codigo: 'PUESTO_PAR_N', nombre: 'Paraiso', etiqueta: null, meta: '24/7', iniciales: 'PAR', turnoCodigo: 'N', orden: 3, servicioId: servicios.SERV_PAR_24H.id },
    { codigo: 'PUESTO_VET_N', nombre: 'Veterinaria', etiqueta: null, meta: '24/7', iniciales: 'VET', turnoCodigo: 'N', orden: 4, servicioId: servicios.SERV_VET_24H.id },
    { codigo: 'PUESTO_RIO_N', nombre: 'Rio Ebro', etiqueta: null, meta: '24/7 - Rondas vehiculo', iniciales: 'RE', turnoCodigo: 'N', orden: 5, servicioId: servicios.SERV_RE_24H.id },
    { codigo: 'PUESTO_CECO_N', nombre: 'CECO', etiqueta: null, meta: '24/7 - Centro de Control', iniciales: 'CE', turnoCodigo: 'N', orden: 6, servicioId: servicios.SERV_CECO_24H.id },
    { codigo: 'PUESTO_HUE_N', nombre: 'Huesca', etiqueta: null, meta: 'Variable lectivo - Rondas vehiculo', iniciales: 'HU', turnoCodigo: 'N', orden: 7, servicioId: servicios.SERV_HUE_VARIABLE.id },
    { codigo: 'PUESTO_TER_N', nombre: 'Teruel', etiqueta: null, meta: '22:00-08:00', iniciales: 'TER', turnoCodigo: 'N', orden: 8, servicioId: servicios.SERV_TER_NOCTURNO.id },
  ]

  for (const puesto of puestos) {
    await prisma.puestoCobertura.upsert({
      where: { codigo: puesto.codigo },
      update: puesto,
      create: puesto,
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

  const turnosMensuales = []
  const addTurnos = (codigoServicio, day, codigosTurno, descubiertos = []) => {
    const date = ymd(2026, 5, day)
    for (const codigoTurno of codigosTurno) {
      const fechas = turnoFechas(date, codigoTurno)
      turnosMensuales.push({
        codigo: `TURNO_${codigoServicio}_${date.replaceAll('-', '')}_${codigoTurno}`,
        servicioId: servicios[codigoServicio].id,
        fecha: dateOnly(date),
        horaInicio: fechas.inicio,
        horaFin: fechas.fin,
        estado: descubiertos.includes(codigoTurno) ? 'SIN_CUBRIR' : 'CUBIERTO',
        dotacionMinima: servicios[codigoServicio].dotacionMinima,
      })
    }
  }

  for (let day = 1; day <= 31; day += 1) {
    addTurnos('SERV_SF_24H', day, ['M', 'T', 'N'])
    addTurnos('SERV_PAR_24H', day, ['M', 'T', 'N'])
    addTurnos('SERV_VET_24H', day, ['M', 'T', 'N'])
    addTurnos('SERV_RE_24H', day, ['M', 'T', 'N'])
    addTurnos('SERV_CECO_24H', day, ['M', 'T', 'N'])
    if (!isWeekend(2026, 5, day)) {
      addTurnos('SERV_CECO_JEFE', day, ['D'], [6, 14].includes(day) ? ['D'] : [])
    }
    addTurnos('SERV_TER_NOCTURNO', day, ['N'])
    addTurnos('SERV_HUE_VARIABLE', day, isWeekend(2026, 5, day) ? ['M', 'T', 'N'] : ['N'], day === 10 ? ['T'] : [])
  }

  let turno = null
  for (const item of turnosMensuales) {
    const created = await prisma.turno.upsert({
      where: { codigo: item.codigo },
      update: {
        estado: item.estado,
        dotacionMinima: item.dotacionMinima,
      },
      create: item,
    })
    if (item.codigo === 'TURNO_SERV_SF_24H_20260515_M') {
      turno = created
    }
  }

  turno ??= await prisma.turno.findFirst({
    where: { codigo: 'TURNO_SERV_SF_24H_20260515_M' },
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
