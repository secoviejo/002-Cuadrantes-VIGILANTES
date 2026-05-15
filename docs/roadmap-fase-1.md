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

## Estado del paso 15

Se ha consolidado el contrato de la API REST base. Se han añadido métodos de lectura genérica y por ID a los repositorios Prisma y controladores de Express para las entidades maestras de `empresas`, `campus` y `edificios`. Se han habilitado sus rutas GET y se han eliminado los parches (`.catch(() => [])`) en el cliente API de React, garantizando que el frontend consuma datos reales y estructurados directamente de MariaDB, con respuestas preparadas (`[]` en lugar de error 404) para colecciones vacías.

## Estado del paso 16

Se ha implementado CRUD basico en el frontend React para la entidad Empresas. Se creo el patron base reusable incluyendo:
- EmpresasPage, EmpresasTable, EmpresaForm
- Funciones API createEmpresa y updateEmpresa
- Navegacion dinamica con estado currentRoute
- Mensajes de feedback (exito/error) y gestion de estados de carga

## Estado del paso 17

Se ha verificado y consolidado el CRUD de Campus. Todo estaba implementado correctamente:
- CampusPage, CampusTable, CampusForm ya existian y funcionan correctamente
- Navegacion a Campus desde el menu lateral funcionando
- Endpoints backend GET/POST/PUT /api/campus funcionando y probados
- Empresas y Dashboard siguen operativos
- Frontend compila sin errores (npm run build)
- Prisma validate y migrate status OK
- Solo se han añadido las funciones createCampus y updateCampus faltantes en el cliente API

## Estado del paso 18

Se ha creado el CRUD basico de Edificios desde React:
- Creados: EdificioPage.jsx, EdificioTable.jsx, EdificioForm.jsx
- Agregadas funciones API createEdificio y updateEdificio
- Agregada navegacion en App.jsx
- Endpoints backend GET/POST/PUT /api/edificios funcionando y probados
- Relacion Edificio-Campus verificada (campusId requerido)
- Empresas, Campus y Dashboard siguen operativos
- Prisma validate y migrate status OK
- npm run build OK

## Estado del paso 19

Se ha creado el CRUD basico de Servicios desde React:
- Creados: ServiciosPage.jsx, ServiciosTable.jsx, ServicioForm.jsx
- Agregadas funciones API createServicio y updateServicio
- Agregada navegacion en App.jsx
- Endpoints backend GET/POST/PUT /api/servicios funcionando y probados
- Campos especificos: codigo, nombre, descripcion, perfilRequerido (enum), dotacionMinima, activo, edificioId
- Selector de edificio en formulario
- Badges para perfil requerido y estado activo
- Empresas, Campus, Edificios y Dashboard verificados
- npm run build OK

## Estado del paso 20

Se ha creado el CRUD basico de Trabajadores desde React:
- Creados: TrabajadoresPage.jsx, TrabajadoresTable.jsx, TrabajadorForm.jsx
- Campos del modelo: codigo, nombre, tipo, identificadorProfesional, activo, empresaId
- Selector de empresa en formulario (relacion obligatoria)
- Selector de tipo/perfil (VIGILANTE, AUXILIAR, JEFE_EQUIPO, OTRO)
- npm run build OK
- Datos ficticios usados en pruebas

## Estado del paso 21

Revision global de catalogos y navegacion completada:
- 6 paginas funcionando (Dashboard + 5 catalogos)
- 15+ componentes (Table, Form, Layout, UI)
- Navegacion por estado funcionando
- Menu lateral con 6 opciones
- Estilo consistente entre entidades
- CORS configurado para multiples origenes

## Estado del paso 22

Se ha creado el CRUD basico de Turnos desde React:
- Creados: TurnosPage.jsx, TurnosTable.jsx, TurnoForm.jsx
- Campos del modelo: codigo, servicioId, fecha, horaInicio, horaFin, dotacionMinima, estado
- Selector de servicio en formulario
- Selector de estado (SIN_CUBRIR, PARCIAL, CUBIERTO, INCIDENCIA, CANCELADO)
- Badges de colores para estados
- Navegacion actualizada con opcion Turnos
- Endpoints backend: GET, POST, PUT /api/turnos
- Pruebas con datos ficticios OK

## Estado del paso 23

Se ha creado el CRUD basico de Asignaciones desde React:
- Creados: AsignacionesPage.jsx, AsignacionesTable.jsx, AsignacionForm.jsx
- Campos del modelo: turnoId, trabajadorId, estado
- Selector de turno (muestra fecha, hora y servicio)
- Selector de trabajador (muestra nombre y tipo)
- Selector de estado (ASIGNADO, CONFIRMADO, SUSTITUIDO, CANCELADO)
- Badges de colores para estados
- Navegacion actualizada con opcion Asignaciones
- Control de duplicados en backend (409 Conflict)
- Endpoints backend: GET, POST, PUT, DELETE /api/asignaciones-turno
- Pruebas con datos ficticios OK

## Proximo paso recomendado

1. **PASO 24**: Revisar turnos, asignaciones y cobertura basica.
