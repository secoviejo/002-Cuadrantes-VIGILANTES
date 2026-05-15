# PASO 18 — CRUD basico de Edificios desde React

## Objetivo

Crear o consolidar el CRUD basico de Edificios desde React.

## Comprobaciones iniciales

- Estado inicial de git: limpio, 1 commit ahead of origin/main
- Estructura frontend existente: EmpresasPage, CampusPage funcionando
- Estructura backend existente: edificio.controller.js, edificio.routes.js, edificio.repository.js existentes
- Modelo Prisma revisado: Edificio tiene campos id, codigo, nombre, campusId
- Relacion Edificio-Campus: campusId es requerido en Prisma

## Cambios realizados

### Archivos creados (nuevos):
- `frontend/src/pages/EdificioPage.jsx` (148 lineas)
- `frontend/src/components/edificios/EdificioTable.jsx` (55 lineas)
- `frontend/src/components/edificios/EdificioForm.jsx` (126 lineas)

### Archivos modificados:
- `frontend/src/App.jsx` (agregado import EdificioPage y ruta para 'edificios')
- `frontend/src/api/catalogos.js` (agregadas funciones createEdificio y updateEdificio)
- `docs/roadmap-fase-1.md` (actualizado estado paso 18)
- `README.md` (actualizado estado tecnico)

### Funcionalidades implementadas:
- Listado de edificios con tabla
- Formulario para crear/editar edificios
- Campo campusId requerido (relacion con Campus)
- Feedback visual (exito/error)
- Estados de carga
- Navegacion desde sidebar

## Validaciones realizadas

### Backend (curl):
```bash
GET  /api/edificios       -> 200 OK, 5 registros
GET  /api/edificios/1     -> 200 OK
POST /api/edificios       -> 201 Created (id=6)
PUT  /api/edificios/6     -> 200 OK
```

### Frontend:
```bash
npm run build -> OK (228.59 kB JS)
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

- Listado de edificios: OK (5 edificios del seed)
- Creacion de edificios: OK (probado con id=6)
- Edicion de edificios: OK (probado update id=6)
- Relacion con Campus: OK (campusId requerido, se muestra en tabla si viene con include)
- Dashboard verificado: OK
- Empresas verificado: OK
- Campus verificado: OK

## Restricciones verificadas

- No se ha tocado legacy/
- No se ha tocado cuadrantes_uz_6.html
- No se han subido .env ni credenciales
- No se ha iniciado PASO 19
- Solo se ha trabajado con Edificios (no se toco Servicios)

## Estado final

PASO 18 cerrado en local.

## Pendiente

No se ha hecho git push. Queda pendiente hacer git push solo si Luis lo solicita expresamente.

## Commit realizado

```
git add .
git commit -m "PASO 18: Crear CRUD basico de edificios en React"
```

Archivos incluidos en el commit:
- frontend/src/pages/EdificioPage.jsx
- frontend/src/components/edificios/EdificioTable.jsx
- frontend/src/components/edificios/EdificioForm.jsx
- frontend/src/App.jsx
- frontend/src/api/catalogos.js
- docs/roadmap-fase-1.md
- README.md
- progresos/AVANCES_16_05_2026_PASO18.md