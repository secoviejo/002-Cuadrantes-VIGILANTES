# 002-Cuadrantes-VIGILANTES

Aplicacion para gestionar y supervisar cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

## Estado actual

El proyecto parte de un prototipo HTML navegable:

- `cuadrantes_uz_6.html`: prototipo original en la raiz.
- `legacy/html-original/`: copia historica conservada como referencia visual.

Ya existen bases tecnicas separadas para frontend y backend. La migracion funcional del prototipo seguira haciendose de forma progresiva.

## Estructura preparada

- `frontend/`: aplicacion base inicializada con React + Vite + Tailwind CSS.
- `backend/`: API base Node.js + Express con rutas minimas de salud.
- `docs/`: documentacion tecnica y funcional de la migracion.
- `.agents/skills/cuadrantes-vigilantes-context/`: memoria viva del proyecto para decisiones futuras.

## Fuera de este paso

En esta fase ya se han inicializado frontend y backend base. Siguen sin crearse base de datos ni configuracion de ORM:

- No hay Prisma.
- No hay MariaDB.
- No hay API REST funcional de negocio.
- No hay autenticacion JWT real.

La siguiente evolucion debe hacerse por pasos pequenos, manteniendo el HTML original como referencia visual.
