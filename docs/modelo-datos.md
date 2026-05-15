# Modelo de datos inicial

Prisma ya esta configurado en `backend/prisma/schema.prisma` con proveedor `mysql` para MariaDB. Todavia no se han ejecutado migraciones reales porque no hay base MariaDB configurada en el repositorio.

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

- Revisar campos con usuarios funcionales.
- Instalar MariaDB local (o levantar con Docker).
- Crear base de datos `cuadrantes_vigilantes_dev` con el SQL documentado en `backend/README.md`.
- Configurar `.env` local con `DATABASE_URL` real.
- Ejecutar primera migracion Prisma: `npm run prisma:migrate`.
- Ejecutar seed: `npm run seed`.
- Probar los endpoints GET/POST/PUT actuales contra una base MariaDB migrada y con seed.
- Conectar `MotorReglasTurnos` con datos leidos desde Prisma mediante repositories o controladores.

> El schema Prisma esta validado y el Prisma Client esta generado. La migracion real no se ha ejecutado porque no hay MariaDB local disponible en este entorno (PASO 11).

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
