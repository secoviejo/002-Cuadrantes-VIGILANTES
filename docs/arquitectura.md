# Arquitectura prevista

## Estado actual

El proyecto conserva un prototipo HTML monolitico como referencia funcional y visual. La copia historica esta en `legacy/html-original/`.

El frontend ya tiene una aplicacion React + Vite + Tailwind CSS dentro de `frontend/`. El backend ya tiene una API Express dentro de `backend/`, con Prisma configurado para MariaDB, repositories, rutas REST y escrituras basicas para entidades maestras y operativas.

El schema Prisma esta validado, Prisma Client esta generado y la base de datos MariaDB de desarrollo se puede poblar con `backend/prisma/seed.js`.

## Arquitectura objetivo

- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express.
- Base de datos: MariaDB.
- ORM: Prisma configurado en `backend/prisma/schema.prisma`.
- API: REST.
- Seguridad: autenticacion JWT y roles.
- Trazabilidad: auditoria basica de acciones relevantes.

## Separacion prevista

- `frontend/`: aplicacion React, componentes, paginas, layouts, servicios de cliente, utilidades y estilos.
- `backend/`: API Express, Prisma, repositories, controladores REST, rutas, servicios de negocio, middleware y utilidades.
- `docs/`: decisiones tecnicas, modelo de datos, arquitectura, roadmap y fuentes documentales operativas.
- `legacy/`: referencias historicas que no deben convertirse en codigo activo.

## Regla de migracion

La migracion debe ser progresiva. El HTML original no debe borrarse ni reescribirse de golpe. Las reglas de negocio deben tender a centralizarse en backend y no en componentes visuales.

`MotorReglasTurnos` existe como servicio backend puro y testeable con objetos JavaScript normales. Algunas reglas de asignacion siguen pendientes de integrarse de forma completa con todos los flujos reales.

## Estado operativo recuperado

El Resumen operativo y el Cuadrante mensual ya consumen servicios backend especificos para datos operativos de mayo 2026 recuperados desde el HTML original:

- `GET /api/resumen-operativo`: KPIs, horas, servicios verificables, alertas, cobertura por campus y ultimas sustituciones.
- `GET /api/cuadrante-mensual`: dias, servicios y celdas M/T/N/D del mes. Mayo 2026 usa turnos persistidos del seed; si el mes solicitado no tiene turnos guardados, devuelve una planificacion base por modalidad de servicio para poder navegar todo 2026. Los dias se clasifican como normal, festivo o no lectivo a partir de festivos, fines de semana y periodos academicos interpretados con el PTT.
- `POST /api/verificaciones/lote`: persistencia de verificaciones por puesto, siempre con JWT.
- `GET /api/informes-operativos`: informe diario, mensual o anual estructurado para vista previa imprimible.
- `GET /api/horas-anuales` y `GET /api/cierre-mensual`: seguimiento contractual y conciliacion mensual para validacion de factura.
- `GET /api/calendario-laboral` y `POST /api/calendario-laboral`: consulta y alta manual de festivos del calendario laboral.

El seed idempotente carga servicios, turnos, horas de contrato, descubiertos de mayo 2026 y festivos reales de 2026. Los nombres ficticios de vigilantes del HTML no se importan como trabajadores reales. El PTT vigente queda archivado como fuente de conocimiento en `docs/fuentes/PTT-Vigilancia-UZ.md`.

La navegacion y backend aplican permisos basicos por rol. ADMIN y Unidad de Seguridad tienen acceso completo. Contrata queda limitada a Operacion: Resumen, Cuadrante, Sustituciones y Verificaciones. La navegacion de meses del cuadrante esta activa para todo 2026; los meses sin datos persistidos se identifican como planificacion base calculada.
