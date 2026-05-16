# Frontend

Aplicacion frontend base de 002-Cuadrantes-VIGILANTES.

## Stack

- React.
- Vite.
- Tailwind CSS.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test:run
```

## Estado actual

El frontend React ya contiene layout principal, login JWT basico, Dashboard y pantallas de catalogos/operativa conectadas al backend.

Pantallas operativas recuperadas del HTML original:

- `Dashboard.jsx` implementa el Resumen operativo con KPIs, selector de turno, verificacion por puesto, alertas dinamicas, cobertura por campus y ultimas sustituciones.
- `CuadrantePage.jsx` muestra el cuadrante mensual completo de mayo 2026 con columnas 1-31, turnos `M`, `T`, `N`, `D` y `x` rojo para descubiertos.
- La navegacion de mes queda visible pero bloqueada a mayo 2026 en esta fase para conservar fidelidad con la fuente original.

El cliente API central vive en `src/api/client.js` y:

- Usa `VITE_API_BASE_URL` o `http://localhost:4000/api` por defecto.
- Adjunta `Authorization: Bearer <token>` cuando hay token en `localStorage`.
- Normaliza listados recibidos como array, `{ data: [] }` o `{ items: [] }`.
- Centraliza `GET`, `POST`, `PUT` y `DELETE`.
- Expone funciones de catalogo para `getResumenOperativo`, `getCuadranteMensual` y `createVerificacionesLote`.

Usuarios demo tras ejecutar el seed del backend:

| Email | Contrasena |
|-------|------------|
| `admin.demo@example.com` | `Demo1234!` |
| `supervision.demo@unizar.example` | `Demo1234!` |
| `contrata.demo@example.com` | `Demo1234!` |

La referencia visual historica sigue en `../legacy/html-original/`.
