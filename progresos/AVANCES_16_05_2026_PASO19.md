# PASO 19 — CRUD basico de Servicios desde React

## Objetivo

Crear o consolidar el CRUD basico de Servicios desde React.

## Comprobaciones iniciales

- Estado inicial de git: limpio, sincronizado con origin/main
- Estructura frontend existente: EmpresasPage, CampusPage, EdificioPage funcionando
- Estructura backend existente: servicio.controller.js, servicio.routes.js, servicio.repository.js existentes
- Modelo Prisma revisado: Servicio tiene campos id, codigo, nombre, descripcion, perfilRequerido (enum), dotacionMinima, activo, edificioId

## Campos del modelo Servicio

| Campo | Tipo | Requerido |
|-------|------|-----------|
| id | Int | SI (auto) |
| codigo | String | SI |
| nombre | String | SI |
| descripcion | String? | No |
| perfilRequerido | Enum | SI |
| dotacionMinima | Int | No (default 1) |
| activo | Boolean | No (default true) |
| edificioId | Int | SI |
| edificio | Relation | - |

## Relaciones de Servicio

- Servicio -> Edificio (muchos a uno, edificioId requerido)
- Edificio -> Campus (muchos a uno)
- Servicio -> Turno (uno a muchos)

## Cambios realizados

### Archivos creados (nuevos):
- `frontend/src/pages/ServiciosPage.jsx` (145 lineas)
- `frontend/src/components/servicios/ServiciosTable.jsx` (91 lineas)
- `frontend/src/components/servicios/ServicioForm.jsx` (190 lineas)

### Archivos modificados:
- `frontend/src/App.jsx` (agregado import ServiciosPage y ruta para 'servicios')
- `frontend/src/api/catalogos.js` (agregadas funciones createServicio y updateServicio)
- `docs/roadmap-fase-1.md` (actualizado estado paso 19)
- `README.md` (actualizado estado tecnico)

### Funcionalidades implementadas:
- Listado de servicios con tabla (incluye badges para perfil y estado)
- Formulario completo: codigo, nombre, descripcion, perfilRequerido, dotacionMinima, activo, edificioId
- Selector de edificio en formulario
- Badges de colores para perfil requerido (VIGILANTE, AUXILIAR, CUALQUIERA)
- Checkbox para activo/inactivo
- Feedback visual (exito/error)
- Estados de carga

## Validaciones realizadas

### Backend (curl):
```bash
GET  /api/servicios       -> 200 OK, devuelve servicios con edificio y campus
POST /api/servicios       -> 201 Created (id=6, TEST_PASO19)
PUT  /api/servicios/6     -> 200 OK (editado correctamente)
```

### Frontend:
```bash
npm run build -> OK (240.15 kB JS, 19.65 kB CSS)
```

### Prisma:
```bash
npx prisma validate     -> OK
npx prisma migrate status -> OK (1 migration, schema up to date)
```

### Otras entidades verificadas:
- GET /api/empresas -> 200 OK
- GET /api/campus   -> 200 OK

## Resultado funcional

- Listado de servicios: OK (servicios con edificio y campus incluidos)
- Creacion de servicios: OK (probado con id=6)
- Edicion de servicios: OK (probado update id=6)
- Relacion con Edificio: OK (edificioId requerido, selector en formulario)
- Dashboard verificado: OK
- Empresas verificado: OK
- Campus verificado: OK
- Edificios verificado: OK

## Restricciones verificadas

- No se ha tocado legacy/
- No se ha tocado cuadrantes_uz_6.html
- No se han subido .env ni credenciales
- No se ha iniciado PASO 20
- Solo se ha trabajado con Servicios (no se toco Trabajadores ni Turnos)
- No se ha hecho git push

## Estado final

PASO 19 cerrado en local.

## Pendiente

No se ha hecho git push. Queda pendiente hacer git push solo si Luis lo solicita expresamente.

## Commit realizado

```
git add .
git commit -m "PASO 19: Crear CRUD basico de servicios en React"
```

Archivos incluidos en el commit:
- frontend/src/pages/ServiciosPage.jsx
- frontend/src/components/servicios/ServiciosTable.jsx
- frontend/src/components/servicios/ServicioForm.jsx
- frontend/src/App.jsx
- frontend/src/api/catalogos.js
- docs/roadmap-fase-1.md
- README.md
- progresos/AVANCES_16_05_2026_PASO19.md