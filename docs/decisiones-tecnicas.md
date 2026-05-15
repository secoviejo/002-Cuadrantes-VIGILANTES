# Decisiones tecnicas

## Decisiones tomadas

- Mantener `cuadrantes_uz_6.html` en la raiz por ahora.
- Conservar una copia historica en `legacy/html-original/`.
- Crear estructura base sin generar aplicaciones ni dependencias.
- Separar espacios futuros para frontend, backend y documentacion.
- Mantener la memoria viva del proyecto en `.agents/skills/cuadrantes-vigilantes-context/`.
- Inicializar el frontend con React + Vite + Tailwind CSS dentro de `frontend/`.

## Decisiones pendientes

- Convenciones de rutas frontend.
- Inicializacion de Express.
- Diseno detallado de API REST.
- Diseno definitivo de modelo Prisma.
- Configuracion de MariaDB.
- Estrategia de autenticacion JWT.
- Estrategia de auditoria.
- Estrategia de testing.

## Restricciones actuales

- No crear dependencias todavia.
- No mover ni borrar el HTML original.
- No mezclar datos demo con modelo real.
- No implementar funcionalidades avanzadas antes de estabilizar la base.
