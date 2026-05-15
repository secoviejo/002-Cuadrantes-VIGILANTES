# Roadmap de Fase 1

## Objetivo

Transformar progresivamente el prototipo HTML en una aplicacion mantenible con frontend, backend, persistencia y reglas centralizadas.

## Pasos iniciales

1. Preservar el prototipo HTML como referencia visual.
2. Crear estructura base y documentacion tecnica.
3. Inicializar frontend con React + Vite + Tailwind CSS.
4. Inicializar backend con Node.js + Express.
5. Configurar Prisma con MariaDB y modelo inicial.
6. Crear `MotorReglasTurnos`.
7. Conectar funcionalidades reales de forma incremental.

## Prioridades funcionales

- Usuarios y roles.
- Empresas y trabajadores.
- Campus, edificios y servicios.
- Turnos y asignaciones.
- Sustituciones.
- Incidencias y descubiertos.
- Verificaciones de cobertura.
- Informes y exportaciones basicas.
- Auditoria.

## Fuera de alcance inicial

- GPS.
- NFC.
- QR.
- Geovallas.
- App movil nativa.
- Inteligencia artificial.
- Control de accesos.
- CAU.
- Nominas avanzadas.
- Biometria.
- SSO real.

## Estado del paso 4

El frontend base ya esta inicializado. Todavia no se ha migrado ninguna pantalla funcional del prototipo HTML.

## Estado del paso 5

El backend base ya esta inicializado con Express y rutas minimas. Todavia no hay Prisma, MariaDB, autenticacion JWT ni reglas de negocio.

## Estado del paso 6

Prisma ya esta configurado para MariaDB con `schema.prisma`, seed inicial y scripts de validacion/generacion. Se han ejecutado `prisma validate` y `prisma generate`, pero no migraciones reales porque no hay base MariaDB configurada.

## Estado del paso 7

`MotorReglasTurnos` ya existe como modulo backend independiente y testeable. Valida solapamientos, descanso minimo, perfil requerido, trabajador activo, ausencias, dotacion minima y estado de cobertura usando objetos JavaScript normales.

## Estado del paso 8

Capa de repositories preparada en `backend/src/repositories/` con Prisma. Incluye cliente singleton (`prisma.js`), utilidades base de filtrado/paginacion, y repositories para Trabajador, Servicio, Turno, AsignacionTurno y Ausencia. Validado con `prisma validate` y `prisma generate`. Sin controladores reales ni migraciones.

## Proximo paso recomendado

Crear controladores REST basicos conectados a los repositories para exponer los recursos de API. Esto permitira integrar el frontend React con datos reales desde Prisma cuando se disponga de MariaDB.
