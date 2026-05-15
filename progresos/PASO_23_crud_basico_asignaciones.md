# PASO 23 — CRUD basico de Asignaciones de trabajadores a turnos

## Objetivo

Crear el CRUD basico de Asignaciones, entendidas como la relacion entre un Turno y un Trabajador. Este paso permite asignar trabajadores a turnos de forma manual.

## Estado inicial

- Rama: main
- Sincronizado con origin/main
- Working tree con cambios pendientes del PASO 23
- Ultimo commit: 6db54cb PASO 22: Crear CRUD basico de turnos en React

## Comprobaciones iniciales

- Modelo AsignacionTurno en Prisma: ya existente
- Enum EstadoAsignacion: ya existente (ASIGNADO, CONFIRMADO, SUSTITUIDO, CANCELADO)
- Relación con Turno: ya existente
- Relación con Trabajador: ya existente
- Restricción unique turnoId + trabajadorId: ya existente (@@unique)

## Modelo de datos existente

El modelo AsignacionTurno de Prisma ya existia con estos campos:

| Campo | Tipo | Notas |
|-------|------|-------|
| id | Int | Autoincrement |
| turnoId | Int | Relation required |
| trabajadorId | Int | Relation required |
| estado | EstadoAsignacion | Default ASIGNADO |
| creadoEn | DateTime | Default now() |
| actualizadoEn | DateTime | Auto updated |

## Endpoints backend creados/revisados

| Endpoint | Estado |
|----------|--------|
| GET /api/asignaciones-turno | Ya existia, funcionando |
| GET /api/asignaciones-turno/:id | Ya existia, funcionando |
| POST /api/asignaciones-turno | Creado con control de duplicados |
| PUT /api/asignaciones-turno/:id | Creado |
| DELETE /api/asignaciones-turno/:id | Creado |

## Validaciones backend

- turnoId obligatorio
- trabajadorId obligatorio
- Control de duplicados: 409 Conflict si mismo turno+trabajador
- Estado validado contra enum

## Archivos modificados

### Backend
- `backend/src/controllers/asignacionTurno.controller.js` (agregadas funciones crear, actualizar, eliminar)
- `backend/src/routes/asignacionTurno.routes.js` (agregadas rutas POST, PUT, DELETE)

### Frontend
- `frontend/src/api/catalogos.js` (agregadas funciones getAsignaciones, createAsignacion, updateAsignacion, deleteAsignacion)
- `frontend/src/App.jsx` (agregada ruta para 'asignaciones')
- `frontend/src/components/layout/Sidebar.jsx` (agregada opcion Asignaciones)
- `frontend/src/pages/AsignacionesPage.jsx` (nuevo)
- `frontend/src/components/asignaciones/AsignacionesTable.jsx` (nuevo)
- `frontend/src/components/asignaciones/AsignacionForm.jsx` (nuevo)

### Documentacion
- `docs/roadmap-fase-1.md` (actualizado estado paso 23)

## Funcionalidades implementadas

### Tabla de Asignaciones
- Fecha, hora inicio y fin del turno
- Servicio asociado
- Trabajador asignado
- Tipo de trabajador
- Badge de estado con colores
- Botones editar y eliminar

### Formulario de Asignaciones
- Selector de turno (muestra: fecha · horaInicio-horaFin · servicio)
- Selector de trabajador (muestra: nombre · tipo)
- Selector de estado
- Botones guardar/cancelar

### Control de duplicados
- Backend responde con 409 Conflict si se intenta duplicar
- Mensaje claro: "Este trabajador ya esta asignado a este turno"

## Validaciones ejecutadas

### Backend (curl)
```bash
GET  /api/asignaciones-turno       -> 200 OK, devuelve asignaciones con turno y trabajador
GET  /api/asignaciones-turno/2     -> 200 OK, asignacion con relaciones
POST /api/asignaciones-turno       -> 201 Created (id=2)
PUT  /api/asignaciones-turno/2     -> 200 OK (estado actualizado a CONFIRMADO)
```

### Frontend
```bash
npm run build -> OK (275.62 kB JS, 20.23 kB CSS)
```

### Prisma
```bash
npx prisma validate -> OK
```

## Restricciones respetadas

- No se ha tocado legacy/
- No se ha tocado cuadrantes_uz_6.html
- No se han creado Sustituciones
- No se han creado Incidencias
- No se han creado Verificaciones
- No se ha conectado el MotorReglasTurnos
- No se ha creado cuadrante visual
- No se han usado datos personales reales
- No se han subido credenciales
- No se ha hecho git push

## Estado final

PASO 23 cerrado en local.

## Siguiente paso recomendado

**PASO 24 — Revisar turnos, asignaciones y cobertura basica**

Revisar la integracion entre Turnos y Asignaciones y mostrar una cobertura basica:
- Mostrar en Turnos el numero de trabajadores asignados
- Calcular visualmente: asignaciones activas / dotacionMinima
- Mejorar listado de Turnos si procede
- Mejorar listado de Asignaciones si procede

## Nota importante

El PASO 23 se limita a CRUD basico de Asignaciones. No se calcula cobertura automatica ni se conecta el MotorReglasTurnos.