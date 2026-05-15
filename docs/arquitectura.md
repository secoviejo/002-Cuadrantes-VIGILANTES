# Arquitectura prevista

## Estado actual

El proyecto conserva un prototipo HTML monolitico como referencia funcional y visual. La copia historica esta en `legacy/html-original/`.

En este paso solo se crea estructura documental y carpetas base. No se ha generado ninguna aplicacion ejecutable.

## Arquitectura objetivo

- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express.
- Base de datos: MariaDB.
- ORM: Prisma.
- API: REST.
- Seguridad: autenticacion JWT y roles.
- Trazabilidad: auditoria basica de acciones relevantes.

## Separacion prevista

- `frontend/`: interfaz de usuario, componentes, paginas, layouts, hooks, servicios de cliente, utilidades y datos demo temporales.
- `backend/`: API REST, controladores, rutas, servicios de negocio, middleware y utilidades.
- `docs/`: decisiones tecnicas, modelo de datos previsto y roadmap.
- `legacy/`: referencias historicas que no deben convertirse en codigo activo.

## Regla de migracion

La migracion debe ser progresiva. El HTML original no debe borrarse ni reescribirse de golpe. Las reglas de negocio deben tender a centralizarse en backend y no en componentes visuales.
