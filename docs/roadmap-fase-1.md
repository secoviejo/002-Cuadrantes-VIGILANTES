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

## Proximo paso recomendado

Crear `MotorReglasTurnos` en backend para centralizar validaciones de turnos antes de conectar controladores reales a Prisma.
