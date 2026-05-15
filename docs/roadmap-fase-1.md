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

## Estado del paso 9

Controladores y rutas REST GET de solo lectura creados sobre la capa de repositories Prisma. Recursos expuestos: trabajadores, servicios, turnos, asignaciones de turno y ausencias. No hay endpoints de escritura, login real, JWT funcional, conexion frontend-backend ni migraciones reales.

## Estado del paso 10

Escrituras basicas `POST` y `PUT` creadas para entidades maestras: empresas, campus, edificios, servicios y trabajadores. Se mantienen fuera las escrituras de turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios, login y JWT. No hay `PATCH`, `DELETE`, conexion frontend-backend ni migraciones reales.

## Estado del paso 11

Documentacion preparada para la primera migracion controlada de MariaDB de desarrollo.

- Schema Prisma validado: `prisma validate` ejecutado correctamente.
- Prisma Client generado: `prisma generate` ejecutado correctamente.
- `.env.example` actualizado con nombre de base de datos de desarrollo (`cuadrantes_vigilantes_dev`) y comentarios claros.
- `backend/README.md` ampliado con instrucciones detalladas de preparacion de MariaDB, migracion y seed.
- `docs/arquitectura.md` y `docs/roadmap-fase-1.md` actualizados.
- Contexto vivo actualizado.
- La migracion real NO se ha ejecutado: no hay MariaDB local disponible en este entorno.
- La carpeta `backend/prisma/migrations/` NO existe todavia: se creara con el primer `prisma migrate dev`.

## Estado del paso 12

Entorno MariaDB de desarrollo levantado con Docker Compose en el puerto 3308 para evitar conflictos. Configurado el archivo `.env` local (no versionado) con la conexión a la base de datos y la `SHADOW_DATABASE_URL` necesaria para Prisma Migrate. Se ha ejecutado la primera migración real y se ha cargado el seed. Validado el correcto funcionamiento mediante `npm run test:repos`.

## Estado del paso 13

Se ha validado la comunicación entre el backend Express y MariaDB levantada en Docker (puerto 3308). Los endpoints existentes GET (trabajadores, servicios), POST (empresas, campus) y PUT (empresas) responden correctamente, persistiendo y retornando información desde la base de datos real.

## Estado del paso 14

Se ha construido el primer Dashboard real en React conectado al backend. El Layout base (Sidebar, Header) y los estilos se han adaptado usando TailwindCSS y fuentes legacy. Se han creado clientes HTTP y componentes para cargar dinámicamente y visualizar los datos desde MariaDB. Aún no existe lógica CRUD en el frontend.

## Proximo paso recomendado

1. **PASO 15**: Implementar CRUD básico desde el frontend (creación y edición de entidades sencillas como empresas o trabajadores) para validar el flujo completo de lectura/escritura de datos, antes de integrar JWT o securización.
