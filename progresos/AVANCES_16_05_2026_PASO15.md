# AVANCES PASO 15 - Consolidación de Endpoints REST base

**Fecha:** 16/05/2026

## Resumen de la Tarea

El objetivo del **PASO 15** ha sido consolidar el contrato de la API entre el frontend de React y el backend de Express, asegurando que todos los catálogos principales dispongan de sus correspondientes endpoints de lectura (`GET`), y eliminando los parches temporales que ocultaban su carencia en el frontend.

## Acciones Realizadas

### 1. Extensión de los Repositorios Prisma
Se han incorporado los métodos de búsqueda genérica (`findAll` ordenando por `nombre` ascendente) y de búsqueda por identificador único (`findById`) en los siguientes repositorios:
- `backend/src/repositories/empresa.repository.js`
- `backend/src/repositories/campus.repository.js`
- `backend/src/repositories/edificio.repository.js`

### 2. Implementación en los Controladores
Se han añadido los métodos `listar[Entidad]` y `obtener[Entidad]` en los controladores para encapsular la lógica de negocio y preparar las respuestas HTTP estandarizadas:
- `backend/src/controllers/empresa.controller.js`
- `backend/src/controllers/campus.controller.js`
- `backend/src/controllers/edificio.controller.js`
*Se garantiza la devolución de un array vacío `[]` si no hay resultados en las consultas a colecciones para evitar errores 404 en el cliente.*

### 3. Apertura de Rutas Express
Se han registrado y habilitado los endpoints `GET /` y `GET /:id` en las rutas del servidor:
- `backend/src/routes/empresa.routes.js`
- `backend/src/routes/campus.routes.js`
- `backend/src/routes/edificio.routes.js`

### 4. Limpieza del Cliente Frontend
- En `frontend/src/api/catalogos.js`, se han eliminado los parches `.catch(() => [])` que simulaban respuestas en los métodos `getEmpresas()`, `getCampus()` y `getEdificios()`. Ahora el frontend consume directamente las respuestas estructuradas del backend real.

### 5. Verificación de Integración
- Validado el acceso a todos los endpoints mediante consola (`curl`) comprobando que devuelven correctamente los datos sembrados por la migración inicial de la base de datos (Seed ficticio).

## Siguientes Pasos (Próximo PASO)
Comenzar a implementar el **CRUD básico (Escritura)** desde el frontend.
Esto implica:
- Desarrollo de formularios en React.
- Integración de llamadas `POST` y `PUT`.
- Lógica de confirmación y feedback para el usuario.
- Enfoque pantalla a pantalla basándonos en el `legacy`.
