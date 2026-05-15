# Arquitectura prevista

## Estado actual

El proyecto conserva un prototipo HTML monolitico como referencia funcional y visual. La copia historica esta en `legacy/html-original/`.

El frontend ya tiene una aplicacion base React + Vite + Tailwind CSS dentro de `frontend/`. El backend ya tiene una API Express dentro de `backend/`, con Prisma configurado para MariaDB, repositories, rutas REST GET y escrituras basicas para entidades maestras.

El schema Prisma ha sido validado (`prisma validate`) y el Prisma Client ha sido generado (`prisma generate`). Se ha levantado un entorno de base de datos MariaDB local mediante Docker Compose y se ha ejecutado la migración inicial exitosamente, poblando la base de datos con un seed inicial de desarrollo.
## Arquitectura objetivo

- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express.
- Base de datos: MariaDB (base de desarrollo: `cuadrantes_vigilantes_dev`).
- ORM: Prisma configurado en `backend/prisma/schema.prisma`.
- API: REST.
- Seguridad: autenticacion JWT y roles.
- Trazabilidad: auditoria basica de acciones relevantes.

## Separacion prevista

- `frontend/`: aplicacion React + Vite + Tailwind CSS, componentes, paginas, layouts, hooks, servicios de cliente, utilidades y datos demo temporales.
- `backend/`: API Express base, Prisma, `MotorReglasTurnos`, repositories, controladores REST, rutas, servicios de negocio, middleware y utilidades.
- `docs/`: decisiones tecnicas, modelo de datos previsto y roadmap.
- `legacy/`: referencias historicas que no deben convertirse en codigo activo.

## Regla de migracion

La migracion debe ser progresiva. El HTML original no debe borrarse ni reescribirse de golpe. Las reglas de negocio deben tender a centralizarse en backend y no en componentes visuales.

`MotorReglasTurnos` ya existe como servicio backend puro y testeable con objetos JavaScript normales. Todavia no esta conectado a los endpoints reales ni a Prisma.

La API REST de negocio empezo por endpoints GET de solo lectura para trabajadores, servicios, turnos, asignaciones de turno y ausencias. Despues se han abierto escrituras basicas solo para entidades maestras: empresas, campus, edificios, servicios y trabajadores. No hay escrituras para turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios ni login.

El frontend ya cuenta con una estructura de Dashboard en React + Vite + Tailwind CSS que se comunica con el backend mediante `fetch` (cliente genérico). Este panel inicial ya es capaz de mostrar estadísticas básicas obtenidas en tiempo real de MariaDB.

El siguiente paso técnico recomendado es implementar las funcionalidades de escritura (CRUD básico) desde este nuevo panel de React, para validar el flujo completo antes de abordar la estrategia de autenticación (JWT) y el control de roles.
