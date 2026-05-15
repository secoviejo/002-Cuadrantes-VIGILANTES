# 002-Cuadrantes-VIGILANTES

Aplicacion para gestionar y supervisar cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

## Estado actual

El proyecto parte de un prototipo HTML navegable:

- `cuadrantes_uz_6.html`: prototipo original en la raiz.
- `legacy/html-original/`: copia historica conservada como referencia visual.

Ya existen bases tecnicas separadas para frontend y backend. La migracion funcional del prototipo seguira haciendose de forma progresiva.

## Estructura preparada

- `frontend/`: aplicacion base inicializada con React + Vite + Tailwind CSS.
- `backend/`: API Node.js + Express con Prisma, repositories, motor de reglas, rutas GET y escrituras basicas en entidades maestras.
- `docs/`: documentacion tecnica y funcional de la migracion.
- `.agents/skills/cuadrantes-vigilantes-context/`: memoria viva del proyecto para decisiones futuras.

## Estado tecnico actual

- Frontend React + Vite + Tailwind CSS conectado a backend mediante cliente HTTP.
- Primer Dashboard implementado mostrando datos reales (KPIs, listados de Trabajadores y Servicios).
- Backend Express sirviendo API REST en puerto 4000.
- Entorno MariaDB local con Docker Compose en puerto 3308.
- Prisma configurado y primera migracion ejecutada con seed de datos inicial.
- `MotorReglasTurnos` creado como modulo backend independiente.
- Capa de repositories Prisma preparada.
- Rutas REST GET para trabajadores, servicios, turnos, asignaciones de turno y ausencias.
- Rutas REST `POST` y `PUT` para empresas, campus, edificios, servicios y trabajadores.
- CRUD completo implementado en frontend para Empresas, Campus, Edificios, Servicios y Trabajadores.

## Pendiente

- Autenticacion JWT real y securizacion de endpoints.
- Endpoints de escritura para turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios.
- Conexion de reglas de negocio complejas (MotorReglasTurnos) al flujo principal.
