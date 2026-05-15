# PASO 24 — Revisar turnos, asignaciones y cobertura basica

## Objetivo

Revisar la integracion entre Turnos y Asignaciones y mostrar una cobertura basica.

## Estado inicial

- Rama: main
- Sincronizado con origin/main
- Working tree limpio
- Ultimo commit: ff6d403 PASO 23: Crear CRUD basico de asignaciones

## Cambios realizados

### Mejoras en TurnosTable.jsx

Se ha añadido una columna de cobertura que muestra:

| Valor | Color | Significado |
|-------|-------|-------------|
| 0/X | Rojo | Sin cubrir |
| 1/X a (X-1)/X | Amarillo | Parcial |
| X/X o mas | Verde | Cubierto |

La formula es simple: `asignaciones.count / dotacionMinima`

El backend ya devuelve `_count: { asignaciones: N }` en la respuesta de turnos.

### Componente CoberturaBadge

Creado componente que recibe:
- `count`: numero de asignaciones activas
- `min`: dotacion minima del turno

Muestra un badge con el formato "X/Y" donde:
- X = numero de trabajadores asignados
- Y = dotacion minima requerida

## Validaciones ejecutadas

### Backend
```bash
GET /api/turnos?limit=1 -> Devuelve _count.asignaciones
```

### Frontend
```bash
npm run build -> OK (276.15 kB JS)
```

## Restricciones respetadas

- No se ha tocado legacy/
- No se ha conectado el MotorReglasTurnos
- No se ha creado cuadrante visual
- No se han usado datos personales reales
- No se ha hecho git push

## Resultado final

La tabla de Turnos ahora muestra una columna adicional de Cobertura que indica visualmente si un turno tiene suficientes trabajadores asignados.

## Siguiente paso recomendado

**PASO 25 — Filtros y busqueda en Turnos y Asignaciones**

Añadir filtros basicos:
- En Turnos: Fecha, Servicio, Estado
- En Asignaciones: Turno, Trabajador, Servicio, Estado