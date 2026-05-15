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

Prisma esta configurado en `prisma/schema.prisma` con proveedor `mysql` para MariaDB.

La URL de conexion usa la variable de entorno `DATABASE_URL`. Esta variable **nunca** se sube al repositorio. Se gestiona unicamente a traves de un archivo `.env` local, ignorado por Git.

Copia `.env.example` a `.env` y ajusta los valores antes de ejecutar cualquier migracion o seed.

### Preparar la base de datos MariaDB de desarrollo

Estos son los comandos SQL orientativos para crear la base de datos local de **desarrollo**. No son credenciales reales. Cambia usuario y password segun tu entorno.

> **Importante**: esta base de datos es solo de desarrollo. No toques ni configures la base de datos de produccion en este paso.

```sql
CREATE DATABASE cuadrantes_vigilantes_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'cuadrantes_user'@'localhost' IDENTIFIED BY 'CAMBIAR_PASSWORD_LOCAL';

GRANT ALL PRIVILEGES ON cuadrantes_vigilantes_dev.* TO 'cuadrantes_user'@'localhost';

FLUSH PRIVILEGES;
```

Despues de crear la base, edita tu `.env` local con los valores reales:

```text
DATABASE_URL="mysql://cuadrantes_user:TU_PASSWORD_LOCAL@localhost:3306/cuadrantes_vigilantes_dev"
```

### Ejecutar la primera migracion Prisma

Una vez configurado `.env` con una `DATABASE_URL` valida que apunte a MariaDB local:

```bash
# Desde backend/
npm run prisma:validate        # Valida el schema (no requiere base de datos real)
npm run prisma:migrate         # Ejecuta: prisma migrate dev --name init
npm run prisma:generate        # Genera Prisma Client (puede ejecutarse sin MariaDB)
```

La primera migracion creara la carpeta `backend/prisma/migrations/` con el SQL inicial.

### Verificar la migracion

```bash
npx prisma migrate status      # Muestra que migraciones se han ejecutado
npx prisma studio              # Abre un explorador visual de la base de datos (opcional)
```

### Cargar datos de ejemplo (seed)

```bash
npm run seed                   # Requiere MariaDB migrada
```

El seed carga datos ficticios: roles, empresa demo, campus, edificios, servicios y trabajadores. No contiene datos personales reales.

### Comandos disponibles

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

## Estado actual (PASO 11)

- Schema Prisma validado (`prisma validate` ejecutado con URL de entorno temporal).
- Prisma Client generado (`prisma generate` ejecutado correctamente).
- `.env.example` actualizado con comentarios claros y nombre de base de datos de desarrollo.
- No hay MariaDB local configurada en este entorno: **la migracion real no se ha ejecutado**.
- La carpeta `backend/prisma/migrations/` no existe todavia: se creara con la primera migracion.
- No hay conexion frontend-backend todavia.
- No hay autenticacion JWT funcional todavia.

El siguiente paso, cuando el usuario disponga de MariaDB local, es ejecutar `npm run prisma:migrate` y `npm run seed` para probar los endpoints contra datos reales.
