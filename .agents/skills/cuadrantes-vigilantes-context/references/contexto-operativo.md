# Contexto Operativo de 002-Cuadrantes-VIGILANTES

## Proposito

002-Cuadrantes-VIGILANTES es una aplicacion para centralizar la supervision operativa de cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

El objetivo funcional es controlar servicios, turnos, coberturas, sustituciones, incidencias, descubiertos, verificaciones, horas, cierres mensuales, informes y exportaciones. El proyecto parte de un prototipo HTML navegable y debe evolucionar de forma progresiva hacia una aplicacion full-stack mantenible.

## Inventario Actual del Repositorio

- `cuadrantes_uz_6.html`: prototipo principal de una sola pagina. Contiene estructura HTML, estilos CSS inline, JavaScript inline, datos de demostracion, navegacion interna, modales, pantallas y logica visual.
- `legacy/html-original/cuadrantes_uz_6.html`: copia historica del prototipo HTML original, conservada como referencia visual para la migracion progresiva.
- `legacy/html-original/README.md`: documenta el uso de `legacy/html-original/` como referencia visual historica del prototipo.
- `README.md`: resumen del proyecto, estado actual, rutas API, usuarios demo, validaciones y limites pendientes.
- `DESCRIPCION_Y_FUNCIONES_APP.md`: documento funcional con objetivo, perfiles, pantallas, informes, incidencias y limitaciones actuales.
- `progresos/AVANCES_14_05_2026_INFORMES.md`: registro de avance sobre el modal de seleccion de informes diario, mensual y anual.
- `frontend/`: aplicacion base React + Vite + Tailwind CSS. Contiene `package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, `src/main.jsx`, `src/styles.css`, README, `.gitignore` y `package-lock.json`.
- `backend/`: API Node.js + Express. Contiene `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, `src/app.js`, `src/server.js`, rutas, controladores, repositories, README y estructura preparada.
- `backend/prisma/schema.prisma`: schema Prisma configurado para MariaDB con proveedor `mysql`, incluyendo contrato anual editable.
- `backend/prisma/seed.js`: seed idempotente con roles, usuarios demo, empresa, campus, edificios, trabajadores ficticios y datos operativos reales recuperados del HTML original: servicios, horas, contrato anual, puestos de cobertura, turnos de mayo 2026 y descubiertos. Los usuarios demo usan la contrasena comun `Demo1234!`.
- `backend/src/services/motorReglasTurnos.service.js`: motor central de reglas de turnos, independiente de Prisma y basado en objetos JavaScript.
- `backend/src/services/motorReglasTurnos.examples.js`: datos mock para entender y probar el motor.
- `backend/src/scripts/probarMotorReglasTurnos.js`: script manual para ejecutar casos basicos del motor.
- `backend/src/utils/dateUtils.js`: utilidades de fechas para rangos, solapamientos y calculo de descanso.
- `docs/`: documentacion base de arquitectura prevista, modelo de datos, roadmap de Fase 1 y decisiones tecnicas.
- `docs/instalacion-desde-github.md`: guia practica para clonar desde GitHub, levantar MariaDB, aplicar migraciones, cargar seed y arrancar backend/frontend en un equipo nuevo.
- `docs/fuentes/PTT-Vigilancia-UZ.md`: PTT archivado como fuente documental operativa para reglas de vigilancia, auxiliares, festivos, no lectivos y futuros analisis de nuevos PTT.
- `.agents/skills/cuadrantes-vigilantes-context/`: skill de contexto vivo del proyecto.
- `backend/src/repositories/`: capa de acceso a datos con Prisma. Contiene `base.repository.js` con utilidades de filtrado y paginacion, repositories de Trabajador, Servicio, Turno, AsignacionTurno, Ausencia, Empresa, Campus y Edificio, e `index.js` que exporta todos los repositorios.
- `backend/src/db/prisma.js`: cliente Prisma singleton para evitar conexiones multiples.
- `backend/src/controllers/`: controladores GET para consultas principales y controladores `POST`/`PUT` basicos para entidades maestras.
- `backend/src/routes/`: rutas REST registradas bajo `/api`.
- Existen controladores y rutas para catalogos, turnos, asignaciones, sustituciones, incidencias, verificaciones, autenticacion JWT basica y auditoria. Los permisos por rol aun deben reforzarse en endpoints operativos.
- Existe `legacy/html-original/` para preservar la maqueta historica. Esta carpeta no es una nueva arquitectura de ejecucion.
- Existe `frontend/package.json` con React, Vite, Tailwind CSS y scripts frontend.
- Existe `backend/package.json` con Express, CORS, dotenv y scripts backend.
- Prisma esta configurado con MariaDB.
- Base de datos MariaDB real levantada vía Docker Compose, con migraciones ejecutadas y seed cargado. La autenticacion real y escrituras operativas complejas quedan para pasos posteriores.- El remoto Git configurado apunta a `git@github.com:secoviejo/002-Cuadrantes-VIGILANTES.git`.
- La skill `.agents/skills/cuadrantes-vigilantes-context/` esta versionada y se usa como memoria viva.

## Estado Actual de la Arquitectura

- Stack actual: HTML + CSS inline + JavaScript inline en un unico archivo.
- `frontend/` ya contiene una aplicacion base ejecutable con React + Vite + Tailwind CSS.
- `backend/` ya contiene una API Express minima ejecutable.
- Prisma Client esta instalado y el schema valida correctamente.
- El HTML tiene CSS embebido entre `<style>` y `</style>`, con estilos generales, responsive, roles, modales e impresion.
- El JavaScript esta embebido al final del HTML, entre `<script>` y `</script>`.
- No hay CSS externo propio ni JavaScript externo propio.
- Se cargan fuentes desde Google Fonts.
- La navegacion no usa rutas ni router: cambia clases entre vistas `#view-*`.
- La autenticacion es simulada: cualquier credencial permite entrar.
- El SSO institucional es simulado y fuerza el rol UZ.
- Los roles se aplican en cliente con clases CSS (`role-uz`, `role-contrata`), no con permisos reales.
- Las acciones se guardan solo en memoria durante la sesion y se pierden al recargar.
- El prototipo HTML no tiene `fetch`, `axios`, `localStorage`, `sessionStorage` ni llamadas a servicios externos.
- La API Express expone `GET /api`, `GET /api/health`, endpoints de catalogos y operativa, autenticacion JWT basica, auditoria protegida, verificaciones de cobertura con usuario autenticado, `GET /api/resumen-operativo`, `GET /api/cuadrante-mensual`, `GET /api/informes-operativos`, `GET /api/horas-anuales`, `PUT /api/contrato-anual/:anio`, `GET /api/cierre-mensual` y `POST /api/verificaciones/lote`.
- Hay controladores conectados a repositories Prisma. El frontend React consume el backend mediante `frontend/src/api/client.js` y normaliza listados en forma de array, `{ data }` o `{ items }`.
- `MotorReglasTurnos` ya existe como modulo backend independiente; todavia no esta conectado a controladores reales ni a Prisma.

## Pantallas y Estado Funcional

| Pantalla o seccion | Estado actual | Descripcion |
|---|---|---|
| Login | Simulado | Permite seleccionar Unidad de Seguridad UZ o Contrata y entrar con cualquier credencial. |
| SSO UZ | Simulado | Boton visual que fuerza perfil UZ, sin integracion real. |
| Sidebar y navegacion | Implementado por rol en React | Contrata ve solo Operacion; ADMIN y Unidad de Seguridad ven todas las secciones. |
| Resumen operativo | Implementado en React con API | Muestra KPIs, alertas, ultimas sustituciones, cobertura por campus y tres tablas de verificacion para los turnos manana, tarde y noche con datos de mayo 2026. |
| Verificacion de cobertura | Persistente por API | Permite marcar cubierto, incidencia o descubierto, anadir notas y guardar lote con JWT para los turnos visibles. |
| Cuadrante mensual | Implementado en React con API | Permite seleccionar cualquier mes de 2026. Mayo renderiza turnos reales recuperados del HTML y descubiertos marcados; meses sin turnos persistidos muestran planificacion base calculada por modalidad. El encabezado clasifica dias normales, festivos y no lectivos. |
| Importar Excel | Solo visual | Representa carga e historial, pero no lee ni valida archivos. |
| Sustituciones | Tabla demo generada | Muestra sustituciones con preaviso, sin alta ni persistencia real. |
| Horas anuales | Implementado en React con API | Muestra contrato, acumulado, categorias de hora y variables informativas. Permite editar bolsa variable y categorias del pliego para ADMIN/Unidad de Seguridad. |
| Cierre mensual | Implementado en React con API | Muestra conciliacion planificado/ejecutado y checklist de validacion de factura. |
| Catalogo de servicios | Visual con filtro cliente | Lista 13 servicios y filtra por campus manipulando filas HTML. |
| Nuevo servicio | Implementado en React con persistencia | Formulario avanzado con metadatos operativos y previsualizacion. |
| Personal | Implementado en React con API | Lista vigilantes y auxiliares con acreditacion, estado y foto opcional mediante `fotoUrl`. El alta de trabajador incluye avatar demo por defecto y vista previa. |
| Calendario laboral | Implementado en React con API | Muestra festivos 2026, periodos academicos y permite alta manual de festivos para UZ/ADMIN. |
| Informes | Implementado en React con API | Permite elegir informe diario, mensual o anual y previsualizarlo para imprimir/PDF del navegador. El informe diario agrega las verificaciones confirmadas de manana, tarde y noche, incluyendo incidencias, descubiertos y notas. Las filas cubiertas se resaltan en verde, `warn`/incidencia en amarillo y `danger`/descubierto en rojo. |
| Impresion/PDF | Dependiente del navegador | Usa `window.print()` para imprimir o guardar PDF desde el navegador. |

## Funcionalidades que Funcionan Hoy en Cliente

- Seleccion de rol visual entre UZ y Contrata.
- Login y logout simulados.
- Cambio de vistas internas desde la barra lateral.
- Ocultacion visual de secciones de control/configuracion para Contrata.
- Verificacion temporal de cobertura por turno.
- Marcado de servicios como cubiertos, con incidencia o descubiertos.
- Edicion temporal de notas de incidencia o descubierto.
- Alertas dinamicas derivadas de la verificacion temporal.
- Render del cuadrante mensual desde arrays demo.
- Render de tablas de sustituciones y personal desde arrays demo.
- Filtro de catalogo de servicios por campus.
- Formulario de nuevo servicio con previsualizacion y estimacion orientativa de horas.
- Modal de seleccion de tipo de informe.
- Previsualizacion de informes diario, mensual y anual.
- Cierre de modales con Escape.
- Estilos responsive e impresion definidos dentro del HTML.

## Funcionalidades Simuladas o Solo Visuales

- Autenticacion, contrasena, recordar sesion y recuperacion de contrasena.
- SSO institucional.
- Permisos reales por rol.
- Importacion Excel.
- Validacion de archivos.
- Exportar PDF del dashboard.
- Exportar Excel del cuadrante.
- Vista por persona del cuadrante.
- Filtros avanzados de sustituciones.
- Nueva sustitucion.
- Cambio de ano.
- Aprobacion para facturacion.
- Exportaciones de horas, servicios o informes.
- Editar servicios existentes.
- Guardar borrador o crear servicio.
- Importar plantilla de personal.
- Anadir persona.
- Anadir festivo.
- Persistencia de notas, verificaciones, incidencias, descubiertos y formularios.
- Importacion Excel real.
- Calculo real de horas, cierre mensual o factura.
- Auditoria.

## Datos Reales Recuperados del HTML Original

- Servicios activos migrados al seed: San Francisco, Paraiso, Veterinaria, Rio Ebro, CECO, CECO jefe equipo, Teruel, Huesca, OCA San Francisco, C.M.U. Pedro Cerbuna, C.M.U. Ramon Acin, Residencia Jaca y Salas estudio.
- El cuadrante mensual navega enero-diciembre de 2026. Mayo conserva datos reales persistidos; el resto de meses usa planificacion base no persistida por modalidad del servicio hasta importar/generar turnos reales.
- El PTT de vigilancia queda archivado en `docs/fuentes/PTT-Vigilancia-UZ.md` como fuente de conocimiento. Sus reglas se usan para interpretar normal/festivo/no lectivo y orientar la planificacion base.
- Horas mayo 2026: 5.394 h planificadas, 5.308 h ejecutadas y desviacion -86 h.
- Contrato anual editable: prestaciones fijas calculadas desde categorias del pliego (63.508 h iniciales), bolsa variable inicial de 2.000 h y acumulado anual inicial de 26.140 h.
- Turnos base: `M` 06:00-14:00, `T` 14:00-22:00, `N` 22:00-06:00 y `D` para CECO jefe.
- Descubiertos iniciales: Huesca tarde 10/05, CECO jefe 06/05 y CECO jefe 14/05.
- Los nombres de vigilantes del HTML se consideran inventados y no se migran como trabajadores reales.

## Datos Simulados Identificados

- `REPORT_TYPES`: define tipos de informe y funciones de render para diario, mensual y anual.
- Arrays demo del HTML original: conservados solo como referencia historica; los servicios/horas/turnos de mayo 2026 ya viven en MariaDB mediante seed.
- `subsData`: sustituciones de ejemplo.
- `personalData`: trabajadores de ejemplo.
- `verifyServices`: servicios a cubrir en el turno actual.
- `serviceStates`: estados temporales de verificacion en memoria.
- `serviceNotes`: notas temporales de incidencia o descubierto.
- Filas HTML estaticas del catalogo de servicios.
- Tablas y KPIs hardcodeados de horas, cierre, calendario e informes.

## Modelo Funcional Futuro Previsto

La aplicacion futura debe contemplar, al menos, estas entidades funcionales:

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
- ContratoAnual.
- ContratoCategoriaHora.
- Auditoria.

Estas entidades no deben implementarse todavia en el primer paso documental. Deben guiar la futura normalizacion de datos y evitar modelar la base de datos copiando directamente las pantallas del prototipo.

## Arquitectura Prevista para Fases Posteriores

- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express.
- Base de datos: MariaDB.
- ORM: Prisma.
- API REST.
- Autenticacion preparada con JWT.
- Roles y permisos reales.
- Auditoria basica.
- Exportaciones basicas de cuadrantes e informes.
- Migracion progresiva desde el HTML actual.

Importante: el frontend React, el backend Express y Prisma estan inicializados como bases tecnicas. La API REST de negocio ya tiene lecturas y escrituras basicas de entidades maestras y operativas, ademas de endpoints especificos para Resumen operativo y Cuadrante mensual. MariaDB esta levantada localmente (Docker), las migraciones se han ejecutado con exito y JWT basico esta disponible con usuarios demo. Queda pendiente reforzar permisos por rol y endurecer contrasenas antes de uso real.

La estructura base de carpetas ya existe para orientar la migracion. Los puntos ejecutables actuales son el frontend Vite y la API Express minima. Prisma validate/generate y las migraciones funcionan con la base de datos local en el puerto 3308.
## Reglas de Negocio Previstas

- No permitir solapamiento de turnos para el mismo trabajador.
- Alertar si hay menos de 12 horas entre turnos del mismo trabajador.
- No asignar auxiliar a un servicio que requiere vigilante acreditado.
- Avisar si falta dotacion minima para un servicio/turno.
- Avisar si el trabajador esta inactivo.
- Avisar si existe ausencia registrada para el trabajador en la fecha del turno.
- Marcar turnos descubiertos cuando no haya asignacion suficiente.
- Registrar sustituciones con trabajador original, sustituto, motivo, fecha/hora de comunicacion y preaviso.
- Registrar verificaciones de cobertura con usuario, fecha/hora, turno y estado por servicio.
- Guardar trazabilidad de acciones importantes en auditoria.
- Centralizar reglas en backend, preferiblemente en un servicio tipo `MotorReglasTurnos`, evitando duplicarlas en componentes React.
- Las reglas de calendario derivadas del PTT distinguen dia normal, festivo y no lectivo. En el cuadrante, sabados, domingos y festivos oficiales computan como `FESTIVO`; periodos no lectivos o cierres universitarios laborables computan como `NO_LECTIVO`; el resto como `NORMAL`.
- `MotorReglasTurnos` implementa ya reglas iniciales de solapamiento, descanso, perfil requerido, trabajador activo, ausencias, dotacion minima y estado de cobertura.
- Capa de repositories preparada para conectar Prisma manteniendo bajo acoplamiento; permite que el MotorReglasTurnos y controladores accedan a datos sin dependencia directa del ORM.
- Rutas y controladores GET de solo lectura ya disponibles para trabajadores, servicios, turnos, asignaciones de turno y ausencias.
- Rutas y controladores `POST`/`PUT` basicos ya disponibles para empresas, campus, edificios, servicios, trabajadores, turnos, asignaciones, sustituciones, incidencias y verificaciones. `POST /api/verificaciones` requiere JWT y deriva el usuario desde el token.
- `PUT /api/contrato-anual/:anio` permite actualizar bolsa variable y categorias del pliego, solo para ADMIN/Unidad de Seguridad y con registro de auditoria.
- El siguiente paso tecnico recomendado es probar los endpoints existentes contra la base de datos MariaDB real.
## Riesgos Tecnicos Actuales

- El HTML monolitico mezcla estructura, estilos, datos demo y logica.
- Tocar directamente `cuadrantes_uz_6.html` puede romper la maqueta visual de referencia.
- Los datos hardcodeados pueden confundirse con modelo de dominio real.
- El control por rol basado en CSS no es seguridad real.
- Las acciones visuales sin handler pueden generar falsas expectativas funcionales.
- La persistencia en memoria desaparece al recargar.
- Si se sigue ampliando el HTML, la migracion a React sera mas costosa.
- Si las reglas de turnos se implementan en React, se duplicara logica que debe vivir en backend.
- Si la base de datos se disena copiando tablas de pantalla, puede quedar mal normalizada.
- Hay riesgo de problemas de codificacion en textos con caracteres especiales durante la migracion.
- Las exportaciones e informes actuales dependen de datos demo y del navegador.
- El login JWT conserva hash SHA-256 por alcance de estabilizacion; debe migrarse a bcrypt/argon2 antes de un entorno real.
- Algunos endpoints operativos siguen sin permisos por rol estrictos.

## Recomendaciones para Migracion Progresiva

- No borrar ni mover el HTML original hasta tener una referencia visual versionada.
- Mantener `legacy/html-original/` como referencia historica del prototipo original antes de la migracion.
- No reescribir toda la aplicacion de golpe.
- No ejecutar migraciones MariaDB ni ampliar Prisma sin una fase previa de modelo de datos y decisiones tecnicas.
- Usar el HTML como maqueta funcional y visual, no como fuente de verdad de datos.
- Migrar primero piezas de bajo riesgo: layout, navegacion, dashboard visual y tablas demo.
- Separar desde el inicio datos, servicios de API, componentes visuales y reglas de negocio.
- Documentar cada cambio relevante en esta skill.
- Mantener fuera de Fase 1: GPS, NFC, QR, geovallas, IA, app movil nativa, control de accesos, CAU, nominas avanzadas, biometria y SSO real.

## Checklist de Validacion para Cambios Futuros

Al tocar el prototipo o migrar una pantalla, comprobar:

- Login por rol.
- Visibilidad UZ/Contrata.
- Navegacion entre vistas.
- Verificacion de cobertura.
- Notas de incidencia y descubierto.
- Alertas dinamicas.
- Modal de informes.
- Impresion/PDF del navegador.
- Filtro de servicios.
- Preview de nuevo servicio.
- Responsive.

Al tocar backend/API futura, comprobar:

- Rutas.
- Validaciones.
- Errores.
- Contrato de respuesta `data`/`meta` en listados.
- Codigo `201` en creaciones.
- No abrir escrituras de turnos/asignaciones sin reglas, permisos y auditoria.
- Permisos.
- Persistencia.
- Auditoria.
- `npm run test:reglas` si se toca `MotorReglasTurnos`.
- Importacion de `createApp` si se registran nuevas rutas.
- Smoke test de `createApp` para detectar errores de importacion o montaje de rutas.

Al tocar Prisma/MariaDB futura, comprobar:

- `npx prisma validate`.
- `npx prisma generate`.
- No ejecutar migraciones contra una base no confirmada.
- No subir credenciales reales.

## Roadmap Tecnico

### Fase 0 - Prototipo actual

HTML visual, datos demo, login simulado, navegacion cliente, informes demo y sin persistencia real.

### Fase 1 - Preparacion y MVP progresivo

Reorganizacion controlada, migracion progresiva a React, backend Express, MariaDB, Prisma, API REST, usuarios, roles, empresas, trabajadores, campus, edificios, servicios, turnos, asignaciones, sustituciones, incidencias, verificaciones, auditoria e informes con datos reales.

### Fase 2 - Operativa avanzada

Mejora de informes, historico, importacion Excel real, validaciones avanzadas, cierre mensual robusto, conciliacion de horas, filtros avanzados, trazabilidad ampliada y controles de calidad de datos.

### Fase 3 - Integraciones futuras

GPS, QR, NFC, CAU, control de accesos, inteligencia artificial de apoyo, app movil, nominas avanzadas, biometria, SSO real e integraciones institucionales.

## Regla de Documentacion Viva

Actualizar este archivo cuando cambie:

- Una pantalla.
- Un flujo funcional.
- El modelo de datos.
- Una API.
- Una regla de negocio.
- La arquitectura.
- Las dependencias.
- El estado de validacion.
- Los riesgos conocidos.
- El roadmap.

Si un cambio no modifica comportamiento, arquitectura ni datos, indicar explicitamente que no hacia falta actualizar este contexto.

## Regla obligatoria de cierre de paso

Cada vez que se implemente un paso funcional, tecnico, documental o de arquitectura, el agente debe cerrar el paso con esta secuencia obligatoria:

1. Ejecutar las validaciones correspondientes al tipo de cambio:
   - `npm run test:reglas` si afecta a reglas de turnos.
   - `npm run prisma:validate` y `npm run prisma:generate` si afecta a Prisma.
   - `npm run build` si afecta al frontend.
   - `node --check` o una validacion equivalente sobre los archivos JavaScript afectados si afecta al backend.
2. Actualizar la documentacion afectada:
   - `README.md` si cambia el uso, estructura o estado general del proyecto.
   - `backend/README.md` si cambia el backend.
   - `frontend/README.md` si cambia el frontend.
   - `docs/` si cambia arquitectura, modelo de datos, roadmap o decisiones tecnicas.
   - `.agents/skills/cuadrantes-vigilantes-context/references/contexto-operativo.md` si cambia estado funcional, arquitectura, rutas, riesgos, validaciones o pasos completados.
3. Ejecutar `git status`.
4. Si hay cambios pendientes del paso, hacer commit con un mensaje claro y especifico.
5. Despues del commit, ejecutar de nuevo `git status`.
6. Informar siempre al usuario de:
   - Validaciones ejecutadas.
   - Documentacion actualizada.
   - Contexto vivo actualizado.
   - Commit creado.
   - Archivos incluidos en el commit.
   - Estado final de Git.
   - Si la rama queda por delante de `origin/main`.
   - Si queda pendiente hacer `git push`.
7. No empezar el siguiente paso si el paso actual deja cambios sin commit, salvo que el usuario lo pida expresamente.
8. No hacer `git push` salvo que el usuario lo pida expresamente o el prompt del paso lo indique.
9. No incluir archivos sensibles en commits:
   - No subir `.env`.
   - No subir credenciales.
   - No subir tokens.
   - No subir datos personales reales.
   - Mantener solo `.env.example` como plantilla.
   - Si aparece un archivo sensible como pendiente, excluirlo del commit y avisar al usuario.

## Historial de Cambios de Contexto

- 2026-05-16: Incorporada informacion funcional clave de la conversacion original al React/Express actual. La navegacion queda filtrada por rol, Contrata solo accede a Operacion, ADMIN/Unidad de Seguridad ven todo, se anaden informes operativo diario/mensual/anual con vista previa imprimible, APIs de horas anuales y cierre mensual, paginas React de Horas anuales y Cierre mensual, filtro por campus en Servicios y formulario avanzado de servicio con metadatos operativos persistidos. La importacion Excel queda aplazada hasta disponer de fichero real.
- 2026-05-17: Activada la seleccion de meses en el Cuadrante mensual para todo 2026. El frontend permite cambiar con desplegable y botones anterior/siguiente. El backend devuelve mayo desde turnos persistidos y, para meses sin datos, una planificacion base calculada por modalidad de servicio marcada como origen `patron`.
- 2026-05-17: Archivado `docs/fuentes/PTT-Vigilancia-UZ.md` como fuente de conocimiento del proyecto. El cuadrante mensual clasifica y resalta dias normales, festivos y no lectivos, y la planificacion base de Huesca se ajusta al patron del PTT para lectivo/no lectivo/festivo.
- 2026-05-17: Anadida edicion administrativa del contrato anual en Horas anuales. Nuevos modelos `ContratoAnual` y `ContratoCategoriaHora`, seed desde PTT, API `PUT /api/contrato-anual/:anio` con auditoria y modal React para editar bolsa variable y categorias del pliego.
- 2026-05-17: Ajustado el Resumen operativo React para mostrar simultaneamente los tres turnos del cuadrante diario en tres tablas de verificacion: manana, tarde y noche. El frontend carga los tres resumenes de `GET /api/resumen-operativo` en paralelo y conserva el guardado por lotes con JWT.
- 2026-05-17: Anadida guia `docs/instalacion-desde-github.md` para desplegar el entorno de desarrollo desde GitHub en un equipo nuevo, con MariaDB por Docker, migraciones Prisma, seed, backend, frontend y usuarios demo.
- 2026-05-17: Corregido el informe operativo diario para que no use solo el turno noche. Ahora agrega los turnos manana, tarde y noche, muestra 23 servicios verificables, separa incidencias/descubiertos confirmados y conserva las notas guardadas por la contrata.
- 2026-05-17: Anadida foto opcional de trabajador (`fotoUrl`) al modelo Prisma, API y frontend. El formulario de trabajadores muestra un avatar demo inventado por defecto y permite sustituirlo por una URL.
- 2026-05-17: Mejorada la vista previa del informe diario para resaltar visualmente estados de verificacion: cubierto en verde, `warn`/incidencia/pendiente en amarillo y `danger`/descubierto en rojo.
- 2026-05-16: Migrado Calendario laboral 2026 desde el HTML original. Anadida API `GET/POST /api/calendario-laboral`, seed con 11 festivos reales y periodos academicos servidos como constantes operativas, pagina React de calendario visible para ADMIN/Unidad de Seguridad y alta manual de festivos.
- 2026-05-16: Estabilizada la integracion React/Express tras trabajo de varios agentes. Corregido el montaje de rutas backend (`auditoriaRouter`, `trabajadorRouter`), anadido smoke test de `createApp`, centralizado el cliente API frontend con `normalizeList` y `deleteJson`, eliminado uso de URLs hardcodeadas en login/deletes, alineado el seed con usuarios demo funcionales (`Demo1234!`) y protegido `POST /api/verificaciones` con JWT usando el usuario autenticado.
- 2026-05-15: Creada memoria operativa inicial a partir de `cuadrantes_uz_6.html`, `DESCRIPCION_Y_FUNCIONES_APP.md` y `progresos/AVANCES_14_05_2026_INFORMES.md`.
- 2026-05-15: Actualizada memoria viva tras analisis del repositorio. Se documenta inventario real, estado por pantalla, funcionalidades cliente, simulaciones, datos demo, riesgos y limites de la fase documental previa a la migracion full-stack.
- 2026-05-15: Aniadida carpeta `legacy/html-original/` con copia del HTML original y README para conservar la referencia visual historica antes de iniciar la migracion.
- 2026-05-15: Creada estructura base documental con `README.md`, `frontend/`, `backend/` y `docs/`, sin inicializar React, Express, Prisma, MariaDB ni dependencias.
- 2026-05-15: Inicializado frontend base en `frontend/` con React, Vite y Tailwind CSS. Verificado `npm run build`. No se ha creado backend, Prisma ni MariaDB.
- 2026-05-15: Inicializado backend base en `backend/` con Node.js + Express, CORS y dotenv. Verificadas rutas `GET /api` y `GET /api/health`. No se ha creado Prisma ni MariaDB.
- 2026-05-15: Configurado Prisma en `backend/prisma/schema.prisma` con proveedor MySQL para MariaDB, modelo inicial, enums requeridos y seed ficticio. Verificados `npx prisma validate` y `npx prisma generate`; no se ejecutaron migraciones reales ni se conectaron controladores a Prisma.
- 2026-05-15: Creado `MotorReglasTurnos` como servicio backend independiente y testeable con objetos JavaScript. Valida reglas basicas de asignacion de turnos y cuenta con ejemplos y script manual `npm run test:reglas`; sigue sin conectarse a controladores reales ni Prisma.
- 2026-05-15: Preparada capa de repositories Prisma para Trabajador, Servicio, Turno, AsignacionTurno y Ausencia, con cliente singleton y script manual `npm run test:repos`.
- 2026-05-15: Creados controladores y rutas REST GET de solo lectura conectados a repositories Prisma para trabajadores, servicios, turnos, asignaciones de turno y ausencias. No se han creado endpoints de escritura, login real, JWT, migraciones ni conexion frontend-backend.
- 2026-05-15: Creados endpoints `POST` y `PUT` basicos para entidades maestras: empresas, campus, edificios, servicios y trabajadores. Se mantienen fuera escrituras de turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios, login y JWT.
- 2026-05-15: Incorporada regla permanente de cierre de paso para validar, actualizar documentacion, revisar `git status`, crear commit descriptivo, excluir archivos sensibles y no publicar con `git push` salvo peticion explicita.
- 2026-05-15 (PASO 11): Preparada la documentacion para la primera migracion MariaDB de desarrollo. Schema Prisma validado (`prisma validate`). Prisma Client generado (`prisma generate`). `.env.example` actualizado con nombre de base de datos de desarrollo (`cuadrantes_vigilantes_dev`) y comentarios claros. `backend/README.md` ampliado con instrucciones detalladas de preparacion de MariaDB, migracion, seed y verificacion. `docs/arquitectura.md`, `docs/modelo-datos.md` y `docs/roadmap-fase-1.md` actualizados.
- 2026-05-15 (PASO 12): Levantado entorno MariaDB de desarrollo con Docker Compose (puerto 3308). Configurada `SHADOW_DATABASE_URL` para Prisma. Ejecutada la primera migración real de Prisma (`npx prisma migrate dev --name init`) y cargado el seed de datos. Validado el acceso a base de datos mediante repositorios. El proyecto ahora tiene una base de datos real para desarrollo local.
- 2026-05-15 (PASO 13): Probado el backend Express conectando contra MariaDB Docker real. Validado el inicio en el puerto 4000. Probados exitosamente los endpoints GET disponibles (`/api/trabajadores`, `/api/servicios`) retornando JSON correcto desde la DB. Probados con éxito los endpoints POST (`/api/empresas`, `/api/campus`) insertando registros en BD. Comprobado también el endpoint PUT (`/api/empresas/2`) actualizando registros. Las entidades `empresas`, `edificios` y `campus` carecen de endpoint GET, que se añadirá más adelante. Confirmada la correcta integración entre Controladores de Express, Repositorios de Prisma y MariaDB. Queda pendiente el git push.
- 2026-05-15 (PASO 14): Creada la primera interfaz real en React conectada a MariaDB mediante el backend. Se construyó el layout base (Sidebar, Header, Dashboard) usando TailwindCSS y fuentes legacy (DM Sans, Fraunces). Se programaron utilidades API (`api/client.js`, `api/catalogos.js`) para peticiones HTTP e integración. Las tarjetas de resumen muestran ahora datos consumidos desde los endpoints de backend. No se dispone aún de operaciones CRUD en frontend ni de autenticación.
- 2026-05-15 (PASO 15): Consolidación del contrato API REST base. Se han añadido métodos `findAll` y `findById` en repositorios y controladores para `empresas`, `campus` y `edificios`, exponiéndolos a través de rutas `GET`. Se eliminaron los parches temporales (`.catch(() => [])`) en el frontend (`api/catalogos.js`), garantizando que la lectura y consumo desde el panel de control se haga con datos reales estructurados sin parches, devolviendo arrays vacíos en caso de ausencia de resultados.
