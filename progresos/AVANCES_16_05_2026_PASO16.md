# AVANCES 16-05-2026: PASO 16 - CRUD Básico de Empresas (Frontend React)

## Objetivo
Desarrollar el molde o patrón base para los mantenimientos de catálogos en el frontend de React. Elegimos la entidad `Empresas` por ser sencilla y fundamental.

## Acciones Realizadas

1. **Ampliación del Cliente API (`api/client.js`)**:
   - Se agregaron las funciones base `postJson` y `putJson` para interactuar con los endpoints de creación y modificación del backend de forma estandarizada.

2. **Endpoints Específicos (`api/catalogos.js`)**:
   - Implementadas las funciones `createEmpresa` y `updateEmpresa` que consumen `postJson` y `putJson` respectivamente.

3. **Navegación Dinámica (`App.jsx`, `AppLayout.jsx`, `Header.jsx`, `Sidebar.jsx`, `Dashboard.jsx`)**:
   - Se modificó la arquitectura base para soportar "vistas" basadas en un estado `currentRoute` manejado en `App.jsx`, sin necesidad de introducir librerías de enrutamiento pesadas todavía.
   - El `Sidebar` notifica a `App.jsx` el cambio de ruta y actualiza su estilo activo.

4. **Componentes CRUD**:
   - `EmpresasPage.jsx`: Orquesta el estado de la lista de empresas, muestra estados de carga y error, y coordina el cambio entre la tabla (`EmpresasTable.jsx`) y el formulario (`EmpresaForm.jsx`). Incluye mensajes de feedback visual (success/error).
   - `EmpresasTable.jsx`: Muestra los datos de las empresas en una tabla moderna con su botón de edición por fila.
   - `EmpresaForm.jsx`: Gestiona un formulario único que funciona tanto para "Crear" (sin id) como para "Editar" (con datos pre-cargados). Incluye validaciones básicas, llamadas a API, estado de carga (para deshabilitar el botón submit) y gestión de errores del servidor.

## Resultados y Validación
- Todo el frontend React compila sin errores.
- Los componentes CRUD han sido creados correctamente usando CSS Tailwind.
- Se ha establecido el patrón base: Listado → Crear/Editar → Formulario → Submit → Actualizar vista. Este molde será el usado para replicar `Campus`, `Edificios`, etc.

## Próximos Pasos
- Proceder al **PASO 17**, que idealmente debería ser replicar este molde para la siguiente entidad (Campus o Edificios), o si el usuario lo prefiere, testear end-to-end las Empresas contra la base de datos local y pasar a otro nivel de la arquitectura.
