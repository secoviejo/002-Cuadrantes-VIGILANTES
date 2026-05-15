# Arquitectura prevista

## Estado actual

El proyecto conserva un prototipo HTML monolitico como referencia funcional y visual. La copia historica esta en `legacy/html-original/`.

El frontend ya tiene una aplicacion base React + Vite + Tailwind CSS dentro de `frontend/`. El backend ya tiene una API Express dentro de `backend/`, con Prisma configurado para MariaDB, repositories y rutas REST GET de solo lectura conectadas a esos repositories. Todavia no hay migraciones reales ejecutadas ni base MariaDB conectada.

## Arquitectura objetivo

- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express.
- Base de datos: MariaDB.
- ORM: Prisma configurado en `backend/prisma/schema.prisma`.
- API: REST.
- Seguridad: autenticacion JWT y roles.
- Trazabilidad: auditoria basica de acciones relevantes.

## Separacion prevista

- `frontend/`: aplicacion React + Vite + Tailwind CSS, componentes, paginas, layouts, hooks, servicios de cliente, utilidades y datos demo temporales.
- `backend/`: API Express base, Prisma, `MotorReglasTurnos`, repositories, controladores GET de solo lectura, rutas, servicios de negocio, middleware y utilidades.
- `docs/`: decisiones tecnicas, modelo de datos previsto y roadmap.
- `legacy/`: referencias historicas que no deben convertirse en codigo activo.

## Regla de migracion

La migracion debe ser progresiva. El HTML original no debe borrarse ni reescribirse de golpe. Las reglas de negocio deben tender a centralizarse en backend y no en componentes visuales.

`MotorReglasTurnos` ya existe como servicio backend puro y testeable con objetos JavaScript normales. Todavia no esta conectado a los endpoints reales ni a Prisma.

La API REST de negocio empieza por endpoints GET de solo lectura para trabajadores, servicios, turnos, asignaciones de turno y ausencias. No se han expuesto escrituras para evitar crear cambios de datos sin autenticacion, permisos ni auditoria.

El siguiente paso tecnico recomendado es preparar MariaDB de desarrollo y la primera migracion controlada, o ampliar lecturas antes de introducir escrituras protegidas.
