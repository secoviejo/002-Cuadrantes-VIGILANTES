# AVANCES - 16/05/2026 - PASO 14

## Resumen del paso
En este paso se ha creado la primera interfaz real en React conectada al backend, reemplazando la plantilla inicial por un Dashboard estructurado. Este hito marca la unión funcional de las tres piezas principales del proyecto: Frontend (React+Vite), Backend (Express) y Base de Datos (MariaDB en Docker).

## Tareas completadas
1. **Configuración de variables de entorno frontend**: Creado `.env.local` y `.env.example` con `VITE_API_BASE_URL` para conectar de forma segura con el backend, sin versionar datos sensibles.
2. **Cliente API**: Desarrollado un cliente ligero y genérico (`api/client.js`) que envuelve `fetch` para realizar peticiones HTTP de forma simplificada, y `api/catalogos.js` con las llamadas a los endpoints del catálogo (con un fallback seguro mediante `.catch()` para aquellos recursos que aún no disponen de endpoints GET).
3. **Componentes visuales de Layout**: 
   - `Sidebar.jsx`: Menú de navegación principal con estructura e iconos basados en el diseño heredado (legacy).
   - `Header.jsx`: Cabecera del Dashboard.
   - `AppLayout.jsx`: Contenedor principal que une Sidebar, Header y el área de contenido, manejando un diseño fluido.
   - `StatusBadge.jsx`: Un indicador visual del estado de conexión de React con el backend (Conectado, Cargando, o Error).
4. **Dashboard y KPIs (`Dashboard.jsx` y `StatCard.jsx`)**: Se ha creado un panel resumen que carga asíncronamente los datos de los 5 catálogos (Empresas, Campus, Edificios, Trabajadores, Servicios) y renderiza métricas (tarjetas de resumen) y listas descriptivas de las primeras entidades de "Trabajadores" y "Servicios".
5. **Estilos**: Se han importado las tipografías del prototipo original (`DM Sans` y `Fraunces`) dentro de TailwindCSS v4 mediante la directiva `@theme`.

## Componentes o archivos principales creados
- `frontend/src/api/client.js`
- `frontend/src/api/catalogos.js`
- `frontend/src/components/layout/AppLayout.jsx`
- `frontend/src/components/layout/Sidebar.jsx`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/ui/StatCard.jsx`
- `frontend/src/components/ui/StatusBadge.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/.env.local` y `frontend/.env.example`

## Endpoints consumidos desde React
- `GET /api/trabajadores`
- `GET /api/servicios`
*(Nota: `/api/empresas`, `/api/campus` y `/api/edificios` retornan arreglos vacíos o errores controlados por frontend dado que actualmente no existen los métodos GET en el API).*

## Validaciones ejecutadas
- ✅ Git status limpio antes de iniciar.
- ✅ Docker Compose levantado en puerto 3308 (`docker compose ps`).
- ✅ Backend respondiendo en puerto 4000.
- ✅ Linter y build del frontend completados (`npm run build`).
- ✅ Archivos sensibles correctamente ignorados y verificados en `.gitignore`.

## Errores encontrados y correcciones
- El `.gitignore` del proyecto carecía del archivo en la raíz para ignorar los `.env.*`. Se ha creado y ajustado tanto a nivel raíz como en la carpeta `frontend/` para asegurar que `.env.local` no se sube bajo ningún concepto.
- Para las entidades que aún no tenían controladores GET implementados en backend (empresas, edificios, campus), se ha configurado la petición `fetch` en el frontend para atrapar el error `404 Not Found` en `api/catalogos.js` con `.catch(() => [])`, evitando romper la interfaz y permitiendo mostrar datos de manera parcial y robusta.

## Siguiente Paso Recomendado
**PASO 15**: Implementar CRUD básico desde el frontend para entidades sencillas, desarrollando las vistas completas de listados, así como creación/edición, incluyendo los correspondientes endpoints en el backend si no existen.
