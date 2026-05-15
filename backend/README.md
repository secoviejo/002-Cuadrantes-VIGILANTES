# Backend

API base de 002-Cuadrantes-VIGILANTES.

## Stack actual

- Node.js.
- Express.

## Comandos

```bash
npm install
npm run dev
npm start
```

Por defecto la API escucha en:

```text
http://127.0.0.1:4000
```

Puedes copiar `.env.example` a `.env` para ajustar `PORT`, `HOST` o `FRONTEND_ORIGIN` cuando haga falta.

## Rutas disponibles

- `GET /api`: informacion basica de la API.
- `GET /api/health`: comprobacion de salud del backend.

## Estado actual

Este backend es una inicializacion minima. No contiene todavia autenticacion JWT, roles reales, Prisma, MariaDB ni reglas de negocio.

La persistencia y el modelo de datos se definiran en pasos posteriores.
