# Modelo de datos inicial

Prisma ya esta configurado en `backend/prisma/schema.prisma` con proveedor `mysql` para MariaDB. La base de datos de desarrollo se ha levantado mediante Docker Compose y la primera migración ha sido ejecutada con éxito.
## Entidades modeladas

- Usuario.
- Rol.
- Empresa.
- Trabajador.
- Campus.
- Edificio.
- Servicio.
- Turno.
- AsignacionTurno.
- Ausencia.
- Sustitucion.
- Incidencia.
- VerificacionCobertura.
- CalendarioLaboral.
- Auditoria.

## Enums modelados

- `TipoTrabajador`: `VIGILANTE`, `AUXILIAR`, `JEFE_EQUIPO`, `OTRO`.
- `TipoPerfilRequerido`: `VIGILANTE`, `AUXILIAR`, `CUALQUIERA`.
- `EstadoTurno`: `SIN_CUBRIR`, `PARCIAL`, `CUBIERTO`, `INCIDENCIA`, `CANCELADO`.
- `EstadoAsignacion`: `ASIGNADO`, `CONFIRMADO`, `SUSTITUIDO`, `CANCELADO`.
- `TipoAusencia`: `VACACIONES`, `BAJA`, `PERMISO`, `INDISPONIBILIDAD`, `OTRO`.
- `EstadoIncidencia`: `ABIERTA`, `EN_CURSO`, `CERRADA`.
- `EstadoCobertura`: `CUBIERTO`, `INCIDENCIA`, `DESCUBIERTO`.
- `TipoDiaCalendario`: `FESTIVO`, `LECTIVO`, `ESPECIAL`, `CIERRE`.

## Criterio de diseno

El modelo no debe copiar directamente tablas o secciones visuales del prototipo HTML. Debe representar entidades reales de operacion, relaciones, fechas, estados y trazabilidad.

## Seed inicial

Existe `backend/prisma/seed.js` con datos ficticios para roles, empresa demo, campus, edificios, servicios, trabajadores y un turno/asignacion de ejemplo. No contiene datos personales reales.

## Pendiente

- Empezar a crear y modelar la autenticación con roles.
- Conectar `MotorReglasTurnos` con datos leidos desde Prisma mediante repositories o controladores.

> El schema Prisma esta validado y el Prisma Client esta generado. La primera migración real ha sido ejecutada contra una instancia local de MariaDB en Docker (PASO 12).
## Consumo API actual

La primera capa REST de negocio usa los repositories Prisma para exponer datos de lectura:

- Trabajadores.
- Servicios.
- Turnos.
- Asignaciones de turno.
- Ausencias.

La escritura basica esta limitada a:

- Empresas.
- Campus.
- Edificios.
- Servicios.
- Trabajadores.

No hay endpoints de escritura para turnos, asignaciones, sustituciones, incidencias, verificaciones, calendario, usuarios ni roles.
