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
- HorasContratoServicio.
- ContratoAnual.
- ContratoCategoriaHora.
- PuestoCobertura.
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

## Datos operativos recuperados del HTML original

Se ha ampliado el modelo para que los datos reales de `legacy/html-original/cuadrantes_uz_6.html` vivan en MariaDB y no en arrays del frontend:

- `Servicio` incorpora metadatos operativos: tipo operativo, modalidad, horario descriptivo, vehiculo, orden y visibilidad en cuadrante.
- `HorasContratoServicio` guarda horas planificadas y ejecutadas por periodo y servicio.
- `ContratoAnual` guarda los parametros editables del contrato por anio: bolsa variable y observaciones.
- `ContratoCategoriaHora` guarda las horas contratadas por categoria del pliego. Las prestaciones fijas son la suma calculada de estas categorias.
- `PuestoCobertura` define los puestos verificables por servicio, turno y etiqueta operativa.
- `VerificacionCobertura` puede asociarse opcionalmente a un puesto de cobertura ademas de a un turno.

El primer periodo fiel es mayo 2026. Incluye 13 servicios, 5.394 h planificadas, 5.308 h ejecutadas, contrato anual de 63.508 h, acumulado inicial de 26.140 h y los descubiertos de Huesca tarde 10/05, CECO jefe 06/05 y CECO jefe 14/05.

Los informes, Horas anuales y Cierre mensual usan estos datos persistidos y constantes operativas recuperadas del HTML. Las categorias laboral diurno/nocturno, festivo diurno/nocturno y la bolsa variable ya viven en `ContratoAnual` y `ContratoCategoriaHora`.

`CalendarioLaboral` guarda festivos puntuales por fecha, ambito general o campus local. Los periodos academicos de 2026 se sirven como constantes operativas porque el modelo actual no tiene una tabla de rangos lectivos/no lectivos. El cuadrante mensual expone una clasificacion derivada para cada dia: `NORMAL`, `FESTIVO` o `NO_LECTIVO`.

El PTT de vigilancia se archiva en `docs/fuentes/PTT-Vigilancia-UZ.md` como fuente documental. En esta fase no se ha creado una tabla especifica de versiones de PTT; cuando llegue un nuevo documento, se comparara contra esta fuente antes de migrar cambios de reglas al modelo.

## Seed inicial

Existe `backend/prisma/seed.js` con roles, usuarios demo, empresa demo, campus, edificios, servicios, trabajadores ficticios, turnos de mayo 2026, horas de contrato, contrato anual editable y puestos de cobertura. No contiene datos personales reales: los nombres inventados de vigilantes del HTML original no se importan como trabajadores reales.

## Pendiente

- Empezar a crear y modelar la autenticación con roles.
- Conectar `MotorReglasTurnos` con datos leidos desde Prisma mediante repositories o controladores.

> El schema Prisma esta validado y el Prisma Client esta generado. La primera migración real ha sido ejecutada contra una instancia local de MariaDB en Docker (PASO 12).
## Consumo API actual (PASO 14)

El frontend de React ya consume activamente los endpoints GET de lectura mediante un cliente HTTP (`api/client.js`) para mostrar KPIs y listas en el Dashboard.

Los endpoints GET disponibles y funcionales:
- Trabajadores.
- Servicios.
*(Las rutas GET de Empresas, Campus y Edificios aún están pendientes de implementar en backend).*

La escritura basica esta limitada a:
- Empresas (POST, PUT).
- Campus (POST).
- Edificios.
- Servicios.
- Trabajadores.

No hay endpoints de escritura para turnos, asignaciones, sustituciones, incidencias, verificaciones, calendario, usuarios ni roles.
