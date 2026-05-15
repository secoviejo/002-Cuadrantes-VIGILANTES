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

Este backend es una inicializacion minima. No contiene todavia autenticacion JWT funcional, controladores conectados a Prisma ni migraciones ejecutadas.

El siguiente paso recomendado es crear rutas/controladores reales para trabajadores, servicios y turnos, o preparar antes una capa de repositorios para conectar Prisma sin acoplar controladores a la base de datos.
