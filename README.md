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

- Frontend base React + Vite + Tailwind CSS inicializado.
- Backend Express inicializado.
- Prisma configurado para MariaDB.
- Schema y seed inicial creados.
- `MotorReglasTurnos` creado como modulo backend independiente.
- Capa de repositories Prisma preparada.
- Rutas REST GET de solo lectura para trabajadores, servicios, turnos, asignaciones de turno y ausencias.
- Rutas REST `POST` y `PUT` para empresas, campus, edificios, servicios y trabajadores.

## Pendiente

- No hay MariaDB real configurada ni migraciones ejecutadas.
- No hay autenticacion JWT real.
- No hay endpoints de escritura para turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios, login ni JWT.
- No hay conexion frontend-backend.
- No se han migrado pantallas funcionales del HTML a React.

La siguiente evolucion debe hacerse por pasos pequenos, manteniendo el HTML original como referencia visual.
