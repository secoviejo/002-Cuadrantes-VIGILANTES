# PASO 20 — CRUD basico de Trabajadores desde React

## Objetivo

Crear o consolidar el CRUD basico de Trabajadores desde React.

## Comprobaciones iniciales

- Estado inicial de git: limpio, sincronizado con origin/main
- Estructura frontend existente: EmpresasPage, CampusPage, EdificioPage, ServiciosPage funcionando
- Estructura backend existente: trabajador.controller.js, trabajador.routes.js, trabajador.repository.js existentes
- Modelo Prisma revisado: Trabajador con campos id, codigo, nombre, tipo, identificadorProfesional, activo, empresaId

## Campos del modelo Trabajador (revisados del schema Prisma)

| Campo | Tipo | Requerido |
|-------|------|-----------|
| id | Int | SI (auto) |
| codigo | String | SI (unique) |
| nombre | String | SI |
| tipo | Enum TipoTrabajador | SI |
| identificadorProfesional | String? | No |
| activo | Boolean | No (default true) |
| empresaId | Int | SI (relation) |

## Enum TipoTrabajador

- VIGILANTE
- AUXILIAR
- JEFE_EQUIPO
- OTRO

## Relaciones de Trabajador

- Trabajador -> Empresa (muchos a uno, empresaId requerido)
- Trabajador -> AsignacionTurno (uno a muchos)
- Trabajador -> Ausencia (uno a muchos)
- Trabajador -> Sustitucion (dos relaciones)
- Trabajador -> Incidencia (uno a muchos)

## Datos ficticios usados en pruebas

```json
{
  "codigo": "TEST_PASO20",
  "nombre": "Trabajador Prueba",
  "tipo": "VIGILANTE",
  "empresaId": 1,
  "activo": true
}
```

No se usaron datos personales reales (DNI, telefono, email, etc.) segun las restricciones del paso.

## Cambios realizados

### Archivos creados (nuevos):
- `frontend/src/pages/TrabajadoresPage.jsx` (145 lineas)
- `frontend/src/components/trabajadores/TrabajadoresTable.jsx` (81 lineas)
- `frontend/src/components/trabajadores/TrabajadorForm.jsx` (190 lineas)

### Archivos modificados:
- `frontend/src/App.jsx` (agregado import TrabajadoresPage y ruta para 'trabajadores')
- `frontend/src/api/catalogos.js` (agregadas funciones createTrabajador y updateTrabajador)
- `docs/roadmap-fase-1.md` (actualizado estado paso 20)
- `README.md` (actualizado estado tecnico)

### Funcionalidades implementadas:
- Listado de trabajadores con tabla (incluye badges para tipo y estado)
- Formulario completo: codigo, nombre, tipo, identificadorProfesional, activo, empresaId
- Selector de empresa en formulario (relacion obligatoria)
- Selector de tipo/perfil (enum)
- Badges de colores para tipo (VIGILANTE=azul, AUXILIAR=verde, JEFE_EQUIPO=morado, OTRO=gris)
- Checkbox para activo/inactivo
- Feedback visual (exito/error)
- Estados de carga

## Validaciones realizadas

### Backend (curl):
```bash
GET  /api/trabajadores       -> 200 OK, devuelve trabajadores con empresa
GET  /api/trabajadores/1    -> 200 OK, devuelve trabajador con relaciones
POST /api/trabajadores      -> 201 Created (id=5, TEST_PASO20)
PUT  /api/trabajadores/5    -> 200 OK (editado correctamente)
```

### Frontend:
```bash
npm run build -> OK (251.41 kB JS, 19.85 kB CSS)
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

- Listado de trabajadores: OK (trabajadores con empresa incluidos)
- Creacion de trabajadores: OK (probado con id=5)
- Edicion de trabajadores: OK (probado update id=5)
- Relacion con Empresa: OK (empresaId requerido, selector en formulario)
- Selector de tipo/perfil: OK (VIGILANTE, AUXILIAR, JEFE_EQUIPO, OTRO)
- Estado activo/inactivo: OK (checkbox)
- Dashboard verificado: OK
- Empresas verificado: OK
- Campus verificado: OK
- Edificios verificado: OK
- Servicios verificado: OK

## Restricciones verificadas

- No se ha tocado legacy/
- No se ha tocado cuadrantes_uz_6.html
- No se han subido .env ni credenciales
- No se han introducido datos personales reales (DNI, telefono, email)
- No se ha iniciado PASO 21
- Solo se ha trabajado con Trabajadores (no se toco Turnos ni Asignaciones)
- No se ha hecho git push

## Estado final

PASO 20 cerrado en local.

## Pendiente

No se ha hecho git push. Queda pendiente hacer git push solo si Luis lo solicita expresamente.

## Commit realizado

```
git add .
git commit -m "PASO 20: Crear CRUD basico de trabajadores en React"
```

Archivos incluidos en el commit:
- frontend/src/pages/TrabajadoresPage.jsx
- frontend/src/components/trabajadores/TrabajadoresTable.jsx
- frontend/src/components/trabajadores/TrabajadorForm.jsx
- frontend/src/App.jsx
- frontend/src/api/catalogos.js
- docs/roadmap-fase-1.md
- README.md
- progresos/AVANCES_16_05_2026_PASO20.md