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
- `POST /api/empresas`: crea una empresa.
- `PUT /api/empresas/:id`: actualiza una empresa.
- `POST /api/campus`: crea un campus.
- `PUT /api/campus/:id`: actualiza un campus.
- `POST /api/edificios`: crea un edificio.
- `PUT /api/edificios/:id`: actualiza un edificio.
- `GET /api/trabajadores`: lista trabajadores con filtros basicos.
- `GET /api/trabajadores/:id`: obtiene un trabajador.
- `POST /api/trabajadores`: crea un trabajador.
- `PUT /api/trabajadores/:id`: actualiza un trabajador.
- `GET /api/servicios`: lista servicios con filtros basicos.
- `GET /api/servicios/:id`: obtiene un servicio.
- `POST /api/servicios`: crea un servicio.
- `PUT /api/servicios/:id`: actualiza un servicio.
- `GET /api/turnos`: lista turnos con filtros basicos.
- `GET /api/turnos/:id`: obtiene un turno.
- `GET /api/asignaciones-turno`: lista asignaciones de turno.
- `GET /api/asignaciones-turno/:id`: obtiene una asignacion de turno.
- `GET /api/ausencias`: lista ausencias.
- `GET /api/ausencias/:id`: obtiene una ausencia.

Las escrituras estan limitadas a entidades maestras: empresas, campus, edificios, servicios y trabajadores. No existen todavia escrituras para turnos, asignaciones, sustituciones, incidencias, verificaciones, usuarios, login ni JWT. Tampoco hay endpoints `PATCH` ni `DELETE` de negocio.

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

Los endpoints de escritura devuelven `201` en creacion y `{ "data": ... }` en creacion o actualizacion. Validan campos obligatorios, IDs positivos, booleanos y enums basicos antes de delegar en Prisma.

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

Este backend tiene API Express, Prisma, repositories, controladores/rutas GET conectados a repositories y escrituras basicas para entidades maestras. No contiene todavia autenticacion JWT funcional, escrituras operativas de turnos/asignaciones/incidencias/verificaciones, migraciones ejecutadas ni integracion con frontend.

El siguiente paso recomendado es preparar MariaDB de desarrollo y ejecutar la primera migracion controlada para probar estas rutas contra datos reales antes de ampliar escrituras operativas.
