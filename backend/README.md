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
- `GET /api/trabajadores`: lista trabajadores con filtros basicos, incluyendo `fotoUrl` cuando exista.
- `GET /api/trabajadores/:id`: obtiene un trabajador.
- `POST /api/trabajadores`: crea un trabajador, con `fotoUrl` opcional.
- `PUT /api/trabajadores/:id`: actualiza un trabajador, con `fotoUrl` opcional.
- `GET /api/servicios`: lista servicios con filtros basicos.
- `GET /api/servicios/:id`: obtiene un servicio.
- `POST /api/servicios`: crea un servicio.
- `PUT /api/servicios/:id`: actualiza un servicio.
- `GET /api/turnos`: lista turnos con filtros basicos.
- `GET /api/turnos/:id`: obtiene un turno.
- `POST /api/turnos`: crea un turno.
- `PUT /api/turnos/:id`: actualiza un turno.
- `GET /api/asignaciones-turno`: lista asignaciones de turno.
- `GET /api/asignaciones-turno/:id`: obtiene una asignacion de turno.
- `POST /api/asignaciones-turno`: crea una asignacion de turno.
- `PUT /api/asignaciones-turno/:id`: actualiza una asignacion de turno.
- `DELETE /api/asignaciones-turno/:id`: elimina una asignacion de turno.
- `GET /api/sustituciones`: lista sustituciones.
- `POST /api/sustituciones`: crea una sustitucion.
- `PUT /api/sustituciones/:id`: actualiza una sustitucion.
- `DELETE /api/sustituciones/:id`: elimina una sustitucion.
- `GET /api/incidencias`: lista incidencias.
- `POST /api/incidencias`: crea una incidencia.
- `PUT /api/incidencias/:id`: actualiza una incidencia.
- `DELETE /api/incidencias/:id`: elimina una incidencia.
- `GET /api/verificaciones`: lista verificaciones.
- `POST /api/verificaciones`: crea una verificacion de cobertura. Requiere JWT y usa el usuario autenticado.
- `POST /api/verificaciones/lote`: crea verificaciones de varios puestos/turnos en una sola operacion. Requiere JWT y usa el usuario autenticado.
- `GET /api/resumen-operativo?fecha=2026-05-16&turno=M|T|N`: devuelve KPIs, horas, servicios a verificar, cobertura por campus, alertas y ultimas sustituciones para el Resumen operativo.
- `GET /api/cuadrante-mensual?anio=2026&mes=1..12`: devuelve dias, servicios y celdas del cuadrante mensual. Cada dia incluye `tipoDia` (`NORMAL`, `FESTIVO`, `NO_LECTIVO`) segun festivos, fin de semana y periodos academicos usados por el PTT. Los turnos incluyen `verificacionEstado` y `verificacionResumen` cuando hay incidencias o descubiertos confirmados por verificacion de cobertura.
- `GET /api/informes-operativos?tipo=diario|mensual|anual&fecha=2026-05-16&anio=2026&mes=5`: devuelve informe estructurado para vista previa imprimible. El informe diario agrega las verificaciones de los turnos manana, tarde y noche, incluyendo incidencias, descubiertos y notas confirmadas.
- `GET /api/horas-anuales?anio=2026`: devuelve acumulado anual, contrato persistido, categorias de hora y variables informativas.
- `PUT /api/contrato-anual/:anio`: actualiza bolsa variable anual y categorias del pliego. Requiere JWT y rol `ADMIN` o `UNIDAD_SEGURIDAD_UZ`.
- `GET /api/cierre-mensual?anio=2026&mes=5`: devuelve conciliacion mensual planificado/ejecutado y checklist de validacion.
- `GET /api/calendario-laboral?anio=2026`: devuelve festivos y periodos academicos del calendario laboral.
- `POST /api/calendario-laboral`: alta manual de festivo. Requiere JWT y rol `ADMIN` o `UNIDAD_SEGURIDAD_UZ`.
- `GET /api/ausencias`: lista ausencias.
- `GET /api/ausencias/:id`: obtiene una ausencia.
- `POST /api/auth/login`: inicia sesion y devuelve JWT.
- `GET /api/auth/profile`: devuelve el perfil autenticado.
- `GET /api/auth/roles`: lista roles.
- `GET /api/auditoria`: lista auditoria. Requiere JWT y rol `ADMIN` o `GESTOR`.

Hay escrituras basicas para entidades maestras y varias entidades operativas. No hay endpoints `PATCH`. Los permisos por rol aun deben endurecerse en algunos endpoints operativos.

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

El seed carga roles, empresa demo, usuarios demo, campus, edificios, trabajadores ficticios y datos operativos reales recuperados del HTML original. Los servicios, horarios, horas de contrato y descubiertos de mayo 2026 se consideran datos funcionales reales; los nombres de vigilantes del HTML no se importan como trabajadores reales.

Datos operativos recuperados:

- Servicios activos: San Francisco, Paraiso, Veterinaria, Rio Ebro, CECO, CECO jefe equipo, Teruel, Huesca, OCA San Francisco, C.M.U. Pedro Cerbuna, C.M.U. Ramon Acin, Residencia Jaca y Salas estudio.
- Horas mayo 2026: 5.394 h planificadas, 5.308 h ejecutadas, desviacion -86 h.
- Contrato anual: 63.508 h; acumulado anual inicial: 26.140 h.
- Contrato anual editable: prestaciones fijas calculadas desde categorias del pliego y bolsa variable inicial de 2.000 h.
- Descubiertos iniciales: Huesca tarde 10/05, CECO jefe 06/05 y 14/05.

Usuarios demo creados o actualizados por el seed:

| Email | Rol | Contrasena |
|-------|-----|------------|
| `admin.demo@example.com` | ADMIN | `Demo1234!` |
| `supervision.demo@unizar.example` | UNIDAD_SEGURIDAD_UZ | `Demo1234!` |
| `contrata.demo@example.com` | CONTRATA | `Demo1234!` |

### Comandos disponibles

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run seed
```

## Estado actual

- Schema Prisma validado y Prisma Client generado.
- MariaDB de desarrollo puede ejecutarse con Docker Compose y seed local.
- API Express registra correctamente todas las rutas desde `createApp()`.
- Autenticacion JWT basica disponible con usuarios demo.
- `POST /api/verificaciones` requiere token JWT y deriva `usuarioId` del usuario autenticado.
- `GET /api/resumen-operativo` y `GET /api/cuadrante-mensual` sirven los datos reales de mayo 2026 migrados desde el HTML original. El cuadrante clasifica los dias segun reglas derivadas del PTT archivado en `docs/fuentes/`.
- `GET /api/horas-anuales` lee `ContratoAnual` y `ContratoCategoriaHora`; `PUT /api/contrato-anual/:anio` actualiza esos valores y registra auditoria.
- `POST /api/verificaciones/lote` persiste verificaciones por puesto de cobertura con el usuario autenticado.
- Los endpoints operativos y de catalogo se han endurecido con JWT y permisos por rol.
- `ADMIN` y `UNIDAD_SEGURIDAD_UZ` tienen acceso completo; `CONTRATA` queda limitada a Resumen, Cuadrante, Sustituciones y Verificaciones.
- Los servicios aceptan metadatos operativos ya presentes en Prisma: tipo operativo, modalidad, horario, vehiculo, orden y visibilidad en cuadrante.
- El seed carga los festivos 2026 y elimina registros demo antiguos de calendario.
- Hay tests unitarios y smoke test de arranque de rutas.

El siguiente paso recomendado es reforzar permisos por rol en endpoints operativos y migrar el hash de contrasenas demo a bcrypt/argon2 antes de acercarse a un entorno real.
