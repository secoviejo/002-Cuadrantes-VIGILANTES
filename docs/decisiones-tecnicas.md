# Decisiones tecnicas

## Decisiones tomadas

- Mantener `cuadrantes_uz_6.html` en la raiz por ahora.
- Conservar una copia historica en `legacy/html-original/`.
- Crear estructura base sin generar aplicaciones ni dependencias.
- Separar espacios futuros para frontend, backend y documentacion.
- Mantener la memoria viva del proyecto en `.agents/skills/cuadrantes-vigilantes-context/`.
- Inicializar el frontend con React + Vite + Tailwind CSS dentro de `frontend/`.
- Inicializar el backend con Node.js + Express dentro de `backend/`, solo con rutas minimas.
- Configurar Prisma con proveedor MySQL para MariaDB dentro de `backend/prisma/schema.prisma`.
- Crear un seed inicial con datos ficticios sin datos personales reales.
- Crear `MotorReglasTurnos` como servicio backend puro que trabaja con objetos JavaScript y no depende directamente de Prisma.
- Exponer primero endpoints REST GET de solo lectura conectados a repositories Prisma, sin escrituras hasta tener autenticacion, permisos y auditoria.

## Decisiones pendientes

- Convenciones de rutas frontend.
- Diseno detallado de API REST.
- Revision funcional del modelo Prisma inicial.
- Configuracion de MariaDB local o de desarrollo.
- Primera migracion Prisma.
- Ampliar endpoints de lectura a entidades restantes si hace falta.
- Decidir el orden de introduccion de escrituras protegidas.
- Estrategia de autenticacion JWT.
- Estrategia de auditoria.
- Estrategia de testing.

## Restricciones actuales

- No mover ni borrar el HTML original.
- No mezclar datos demo con modelo real.
- No implementar funcionalidades avanzadas antes de estabilizar la base.
- No exponer endpoints de escritura conectados a Prisma hasta validar autenticacion, permisos y auditoria.
- Mantener reglas de turnos en `MotorReglasTurnos`, no duplicarlas en frontend.
