# 002-Cuadrantes-VIGILANTES

Aplicacion para gestionar y supervisar cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

## Estado actual

El proyecto parte de un prototipo HTML navegable:

- `cuadrantes_uz_6.html`: prototipo original en la raiz.
- `legacy/html-original/`: copia historica conservada como referencia visual.

Todavia no existe implementacion full-stack. Este repositorio queda preparado para una migracion progresiva.

## Estructura preparada

- `frontend/`: aplicacion base inicializada con React + Vite + Tailwind CSS.
- `backend/`: espacio reservado para la futura API Node.js + Express.
- `docs/`: documentacion tecnica y funcional de la migracion.
- `.agents/skills/cuadrantes-vigilantes-context/`: memoria viva del proyecto para decisiones futuras.

## Fuera de este paso

En esta fase solo se ha inicializado el frontend. Siguen sin crearse servidores backend, base de datos ni configuracion de ORM:

- No hay Express.
- No hay Prisma.
- No hay MariaDB.
- No hay API REST.
- No hay autenticacion JWT real.

La siguiente evolucion debe hacerse por pasos pequenos, manteniendo el HTML original como referencia visual.
