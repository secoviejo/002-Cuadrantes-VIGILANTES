# PASO 22 — CRUD basico de Turnos desde React

## Objetivo

Crear el CRUD basico de Turnos desde React, siguiendo el patron ya usado para Empresas, Campus, Edificios, Servicios y Trabajadores.

## Estado inicial

- Rama: main
- Sincronizado con origin/main
- Working tree limpio
- Ultimo commit: 1fbe0a7 PASO 21: Revisar catalogos y navegacion general

## Comprobaciones iniciales

- Estado git: limpio
- Modelo Turno en Prisma: ya existente
- Enum EstadoTurno: ya existente (SIN_CUBRIR, PARCIAL, CUBIERTO, INCIDENCIA, CANCELADO)
- Relación con Servicio: ya existente

## Modelo de datos existente

El modelo Turno de Prisma ya existia con estos campos:

| Campo | Tipo | Notas |
|-------|------|-------|
| id | Int | Autoincrement |
| codigo | String | Unique |
| servicioId | Int | Relation required |
| fecha | DateTime | Date only |
| horaInicio | DateTime | DateTime |
| horaFin | DateTime | DateTime |
| estado | EstadoTurno | Default SIN_CUBRIR |
| dotacionMinima | Int | Default 1 |

## Endpoints backend creados/revisados

| Endpoint | Estado |
|----------|--------|
| GET /api/turnos | Ya existia, funcionando |
| GET /api/turnos/:id | Ya existia, funcionando |
| POST /api/turnos | Creado |
| PUT /api/turnos/:id | Creado |

## Archivos modificados

### Backend
- `backend/src/controllers/turno.controller.js` (agregadas funciones crearTurno y actualizarTurno)
- `backend/src/routes/turno.routes.js` (agregadas rutas POST y PUT)

### Frontend
- `frontend/src/api/catalogos.js` (agregadas funciones getTurnos, createTurno, updateTurno)
- `frontend/src/App.jsx` (agregada ruta para 'turnos')
- `frontend/src/components/layout/Sidebar.jsx` (agregada opcion Turnos)
- `frontend/src/pages/TurnosPage.jsx` (nuevo)
- `frontend/src/components/turnos/TurnosTable.jsx` (nuevo)
- `frontend/src/components/turnos/TurnoForm.jsx` (nuevo)

### Documentacion
- `docs/roadmap-fase-1.md` (actualizado estado paso 22)

## Funcionalidades implementadas

### Tabla de Turnos
- Fecha formateada (DD/MM/YYYY)
- Hora inicio y fin formateadas (HH:MM)
- Servicio asociado
- Dotacion minima
- Badge de estado con colores
- Boton editar

### Formulario de Turnos
- Campo codigo (requerido)
- Selector de servicio (requerido)
- Campo fecha (type="date")
- Campo hora inicio (type="time")
- Campo hora fin (type="time")
- Campo dotacion minima (number, min 1)
- Selector de estado
- Botones guardar/cancelar

## Validaciones ejecutadas

### Backend (curl)
```bash
GET  /api/turnos       -> 200 OK, devuelve turnos con servicio
GET  /api/turnos/1     -> 200 OK, turno con servicio y asignaciones
POST /api/turnos       -> 201 Created (id=2)
PUT  /api/turnos/2     -> 200 OK (estado actualizado)
```

### Frontend
```bash
npm run build -> OK (263.90 kB JS, 20.23 kB CSS)
```

### Prisma
```bash
npx prisma validate -> OK
```

## Restricciones respetadas

- No se ha tocado legacy/
- No se ha tocado cuadrantes_uz_6.html
- No se han creado Asignaciones
- No se han creado Sustituciones
- No se han creado Incidencias
- No se han creado Verificaciones
- No se ha conectado el MotorReglasTurnos
- No se ha creado cuadrante visual
- No se han usado datos personales reales
- No se han subido credenciales
- No se ha hecho git push

## Estado final

PASO 22 cerrado en local.

## Siguiente paso recomendado

**PASO 23 — CRUD basico de Asignaciones**

Asignar trabajadores a turnos es el siguiente paso logico:
- Turnos ya existe y funciona
- Trabajadores ya existe y funciona
- AsignacionTurno es la entidad que relaciona ambos

Este paso permitira asignar trabajadores a turnos existentes.

## Nota importante

El PASO 22 se limita a CRUD basico de Turnos. No se asignan trabajadores todavia.

### Commit realizado

```
git add .
git commit -m "PASO 22: Crear CRUD basico de turnos en React"
```

Archivos incluidos en el commit:
- backend/src/controllers/turno.controller.js
- backend/src/routes/turno.routes.js
- frontend/src/api/catalogos.js
- frontend/src/App.jsx
- frontend/src/components/layout/Sidebar.jsx
- frontend/src/pages/TurnosPage.jsx
- frontend/src/components/turnos/TurnosTable.jsx
- frontend/src/components/turnos/TurnoForm.jsx
- docs/roadmap-fase-1.md
- progresos/PASO_22_crud_basico_turnos_react.md