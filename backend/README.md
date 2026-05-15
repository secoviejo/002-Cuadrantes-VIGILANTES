# Backend

API base de 002-Cuadrantes-VIGILANTES.

## Stack actual

- Node.js.
- Express.
- Prisma.
- MariaDB como base de datos prevista.

## Comandos

```bash
npm install
npm run dev
npm start
npm run prisma:validate
npm run prisma:generate
npm run test:reglas
```

Por defecto la API escucha en:

```text
http://127.0.0.1:4000
```

Puedes copiar `.env.example` a `.env` para ajustar `PORT`, `HOST`, `FRONTEND_ORIGIN` o `DATABASE_URL` cuando haga falta. No subas credenciales reales al repositorio.

## Rutas disponibles

- `GET /api`: informacion basica de la API.
- `GET /api/health`: comprobacion de salud del backend.
- `GET /api/trabajadores`: lista trabajadores con filtros basicos.
- `GET /api/trabajadores/:id`: obtiene un trabajador.
- `GET /api/servicios`: lista servicios con filtros basicos.
- `GET /api/servicios/:id`: obtiene un servicio.
- `GET /api/turnos`: lista turnos con filtros basicos.
- `GET /api/turnos/:id`: obtiene un turno.
- `GET /api/asignaciones-turno`: lista asignaciones de turno.
- `GET /api/asignaciones-turno/:id`: obtiene una asignacion de turno.
- `GET /api/ausencias`: lista ausencias.
- `GET /api/ausencias/:id`: obtiene una ausencia.

Estas rutas son de solo lectura. No existen todavia endpoints `POST`, `PUT`, `PATCH` ni `DELETE` de negocio.

Filtros soportados segun recurso:

- Comunes: `id`, `busqueda`, `activo`, `tipo`, `estado`, `pagina`, `elementosPorPagina`.
- Relaciones: `empresaId`, `campusId`, `servicioId`, `turnoId`, `trabajadorId`.
- Fechas: `fechaDesde`, `fechaHasta`.

Las respuestas de listado siguen esta forma:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "pagina": 1,
    "elementosPorPagina": 20
  }
}
```

Los endpoints consultan la capa `src/repositories/` con Prisma. Requieren una `DATABASE_URL` valida y una MariaDB migrada para devolver datos reales.

## MotorReglasTurnos

El modulo `src/services/motorReglasTurnos.service.js` centraliza reglas basicas antes de asignar trabajadores a turnos. Trabaja con objetos JavaScript normales y todavia no depende directamente de Prisma.

Reglas actuales:

- Solapamiento de turnos.
- Descanso minimo entre turnos.
- Perfil requerido por el servicio.
- Trabajador activo.
- Ausencias coincidentes con el turno.
- Dotacion minima.
- Estado de cobertura: `SIN_CUBRIR`, `PARCIAL`, `CUBIERTO`.

Ejemplos de uso:

- `src/services/motorReglasTurnos.examples.js`
- `src/scripts/probarMotorReglasTurnos.js`

Prueba manual:

```bash
npm run test:reglas
```

## Prisma y MariaDB

Prisma esta configurado en `prisma/schema.prisma` con proveedor `mysql`.

La URL esperada para desarrollo esta documentada en `.env.example`:

```text
DATABASE_URL="mysql://usuario:password@localhost:3306/cuadrantes_vigilantes"
```

Preparacion local orientativa de MariaDB:

```sql
CREATE DATABASE cuadrantes_vigilantes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON cuadrantes_vigilantes.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

Despues, crea un `.env` local a partir de `.env.example` y ajusta usuario/password. En este paso no se han ejecutado migraciones reales porque no se ha configurado una base MariaDB local.

Comandos disponibles:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

`npm run seed` requiere una base MariaDB configurada y migrada.

## Estado actual

Este backend tiene API Express, Prisma, repositories y controladores/rutas GET de solo lectura conectados a los repositories. No contiene todavia autenticacion JWT funcional, endpoints de escritura, migraciones ejecutadas ni integracion con frontend.

El siguiente paso recomendado es preparar MariaDB de desarrollo y ejecutar la primera migracion controlada, o completar la capa de endpoints de lectura para mas entidades antes de introducir escrituras con permisos.
