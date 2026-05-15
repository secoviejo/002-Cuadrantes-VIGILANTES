# Contexto Operativo de 002-Cuadrantes-VIGILANTES

## Proposito

002-Cuadrantes-VIGILANTES es una aplicacion para centralizar la supervision operativa de cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

El objetivo funcional es controlar servicios, turnos, coberturas, sustituciones, incidencias, descubiertos, verificaciones, horas, cierres mensuales, informes y exportaciones. El proyecto parte de un prototipo HTML navegable y debe evolucionar de forma progresiva hacia una aplicacion full-stack mantenible.

## Inventario Actual del Repositorio

- `cuadrantes_uz_6.html`: prototipo principal de una sola pagina. Contiene estructura HTML, estilos CSS inline, JavaScript inline, datos de demostracion, navegacion interna, modales, pantallas y logica visual.
- `DESCRIPCION_Y_FUNCIONES_APP.md`: documento funcional con objetivo, perfiles, pantallas, informes, incidencias y limitaciones actuales.
- `progresos/AVANCES_14_05_2026_INFORMES.md`: registro de avance sobre el modal de seleccion de informes diario, mensual y anual.
- `.agents/skills/cuadrantes-vigilantes-context/`: skill de contexto vivo del proyecto.
- No existe `README.md`.
- No existen carpetas `frontend/`, `backend/`, `prisma/`, `docs/`, `src/`, `server/` ni `tests/`.
- No existen `package.json`, dependencias Node, Vite, React, Express, Prisma ni MariaDB configurados.
- No hay backend, API REST, base de datos, autenticacion real ni persistencia.
- El remoto Git configurado apunta a `git@github.com:secoviejo/002-Cuadrantes-VIGILANTES.git`.
- En el estado observado, `.agents/` aparece como no trackeado en Git.

## Estado Actual de la Arquitectura

- Stack actual: HTML + CSS inline + JavaScript inline en un unico archivo.
- El HTML tiene CSS embebido entre `<style>` y `</style>`, con estilos generales, responsive, roles, modales e impresion.
- El JavaScript esta embebido al final del HTML, entre `<script>` y `</script>`.
- No hay CSS externo propio ni JavaScript externo propio.
- Se cargan fuentes desde Google Fonts.
- La navegacion no usa rutas ni router: cambia clases entre vistas `#view-*`.
- La autenticacion es simulada: cualquier credencial permite entrar.
- El SSO institucional es simulado y fuerza el rol UZ.
- Los roles se aplican en cliente con clases CSS (`role-uz`, `role-contrata`), no con permisos reales.
- Las acciones se guardan solo en memoria durante la sesion y se pierden al recargar.
- No hay `fetch`, `axios`, `localStorage`, `sessionStorage`, API REST ni llamadas a servicios externos.

## Pantallas y Estado Funcional

| Pantalla o seccion | Estado actual | Descripcion |
|---|---|---|
| Login | Simulado | Permite seleccionar Unidad de Seguridad UZ o Contrata y entrar con cualquier credencial. |
| SSO UZ | Simulado | Boton visual que fuerza perfil UZ, sin integracion real. |
| Sidebar y navegacion | Funcional en cliente | Cambia vistas internas con `navTo`, sin URL ni router. |
| Resumen operativo | Visual con partes interactivas | Muestra KPIs, alertas, ultimas sustituciones y panel de verificacion. |
| Verificacion de cobertura | Interactiva sin persistencia | Permite marcar cubierto, incidencia o descubierto y guardar notas temporales. |
| Cuadrante mensual | Generado por JS demo | Renderiza mayo de 2026 con turnos y descubiertos simulados. |
| Importar Excel | Solo visual | Representa carga e historial, pero no lee ni valida archivos. |
| Sustituciones | Tabla demo generada | Muestra sustituciones con preaviso, sin alta ni persistencia real. |
| Horas anuales | Solo visual | Muestra avance anual y desglose estatico. |
| Cierre mensual | Solo visual | Simula conciliacion y validacion de factura. |
| Catalogo de servicios | Visual con filtro cliente | Lista 13 servicios y filtra por campus manipulando filas HTML. |
| Nuevo servicio | Formulario visual interactivo | Calcula una previsualizacion y horas estimadas, pero no guarda. |
| Personal | Tabla demo generada | Lista vigilantes y auxiliares con formacion, acreditacion y estado. |
| Calendario laboral | Estatico | Muestra festivos y periodos academicos sin CRUD ni reglas conectadas. |
| Informes | Interactivo con datos demo | Permite elegir informe diario, mensual o anual y previsualizarlo. |
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
- Cambio de mes o ano.
- Aprobacion para facturacion.
- Exportaciones de horas, servicios o informes.
- Editar servicios existentes.
- Guardar borrador o crear servicio.
- Importar plantilla de personal.
- Anadir persona.
- Anadir festivo.
- Persistencia de notas, verificaciones, incidencias, descubiertos y formularios.
- Informes con datos reales.
- Calculo real de horas, cierre mensual o factura.
- Auditoria.

## Datos Simulados Identificados

- `REPORT_TYPES`: define tipos de informe y funciones de render para diario, mensual y anual.
- `servicios`: array demo para construir el cuadrante mensual.
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

Importante: React, Express, Prisma, MariaDB, JWT y la estructura full-stack quedan para pasos posteriores. En esta fase solo se consolida memoria operativa y contexto vivo.

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

## Recomendaciones para Migracion Progresiva

- No borrar ni mover el HTML original hasta tener una referencia visual versionada.
- No reescribir toda la aplicacion de golpe.
- No crear frontend, backend, Prisma ni MariaDB sin una fase previa de estructura y decisiones tecnicas.
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
- Permisos.
- Persistencia.
- Auditoria.

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

## Historial de Cambios de Contexto

- 2026-05-15: Creada memoria operativa inicial a partir de `cuadrantes_uz_6.html`, `DESCRIPCION_Y_FUNCIONES_APP.md` y `progresos/AVANCES_14_05_2026_INFORMES.md`.
- 2026-05-15: Actualizada memoria viva tras analisis del repositorio. Se documenta inventario real, estado por pantalla, funcionalidades cliente, simulaciones, datos demo, riesgos y limites de la fase documental previa a la migracion full-stack.
