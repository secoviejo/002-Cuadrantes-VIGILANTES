# Cuadrantes VIGILANTES - UZ

Sistema de gestión de cuadrantes de vigilantes de seguridad para la Universidad de Zaragoza.

## Tecnologias

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + Prisma
- **Base de datos:** MariaDB

## Requisitos

- Node.js 18+
- MariaDB 10.5+
- npm o yarn

## Instalacion

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con la configuracion de la base de datos
npx prisma migrate dev
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Estructura del proyecto

```
/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Modelo de datos
│   ├── src/
│   │   ├── controllers/      # Controladores API
│   │   ├── middleware/        # Middleware (auth)
│   │   ├── repositories/     # Acceso a datos
│   │   ├── routes/           # Rutas API
│   │   ├── services/         # Logica de negocio
│   │   └── utils/            # Utilidades
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/              # Funciones API cliente
│       ├── components/       # Componentes React
│       ├── pages/            # Paginas
│       └── utils/            # Utilidades
└── README.md
```

## Entidades del sistema

| Entidad | Descripcion |
|---------|-------------|
| Empresa | Empresas de seguridad |
| Campus | Campus universitarios |
| Edificio | Edificios dentro de campus |
| Servicio | Servicios de vigilancia |
| Trabajador | Vigilantes y auxiliares |
| Turno | Turnos de trabajo |
| Asignacion | Asignaciones trabajador-turno |
| Sustitucion | Sustituciones entre trabajadores |
| Incidencia | Incidencias operativas |
| Verificacion | Verificaciones de cobertura |
| Usuario | Usuarios del sistema |
| Rol | Roles (ADMIN, GESTOR, etc.) |

## Rutas API

### Catalogo
- `GET /api/empresas`
- `GET /api/campus`
- `GET /api/edificios`
- `GET /api/servicios`
- `GET /api/trabajadores`

### Operativo
- `GET /api/turnos`
- `GET /api/asignaciones-turno`
- `GET /api/sustituciones`
- `GET /api/incidencias`
- `GET /api/verificaciones`
- `GET /api/resumen-operativo?fecha=2026-05-16&turno=M|T|N`
- `GET /api/cuadrante-mensual?anio=2026&mes=1..12`
- `GET /api/informes-operativos?tipo=diario|mensual|anual&fecha=2026-05-16&anio=2026&mes=5`
- `GET /api/horas-anuales?anio=2026`
- `PUT /api/contrato-anual/:anio`
- `GET /api/cierre-mensual?anio=2026&mes=5`
- `GET /api/calendario-laboral?anio=2026`
- `POST /api/calendario-laboral`
- `POST /api/verificaciones/lote`

### Utilidades
- `GET /api/validaciones/validar-asignacion`
- `GET /api/auditoria`

### Autenticacion
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/auth/roles`

Usuarios demo tras ejecutar `npm run seed` en `backend/`:

| Email | Rol | Contrasena |
|-------|-----|------------|
| `admin.demo@example.com` | ADMIN | `Demo1234!` |
| `supervision.demo@unizar.example` | UNIDAD_SEGURIDAD_UZ | `Demo1234!` |
| `contrata.demo@example.com` | CONTRATA | `Demo1234!` |

## Configuracion

Variables de entorno necesarias en `backend/.env`:

```
DATABASE_URL="mysql://user:password@localhost:3306/cuadrantes"
SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/cuadrantes_shadow"
JWT_SECRET="tu-secret-key"
JWT_EXPIRES="24h"
PORT=4000
```

## Comandos de desarrollo

```bash
# Backend
cd backend
npm run dev          # Desarrollo con nodemon
npm run lint         # Linting

# Frontend
cd frontend
npm run dev          # Desarrollo
npm run build        # Produccion
```

## Estado del proyecto

**Version:** MVP 1.0

**Funcionalidades implementadas:**
- CRUD completo de todas las entidades
- Validacion de asignaciones
- Exportacion a CSV
- Autenticacion JWT
- Roles y permisos
- Auditoria de acciones
- Normalizacion del contrato API en frontend para listados `array`, `{ data }` y `{ items }`
- Verificaciones de cobertura creadas con token JWT
- Resumen operativo React alimentado por API con datos reales recuperados del HTML original y verificacion visible en tres tablas: manana, tarde y noche.
- Cuadrante mensual navegable para todo 2026: mayo conserva servicios, turnos, horas y descubiertos reales del HTML original; el resto de meses muestra planificacion base por modalidad si no hay turnos persistidos. El encabezado resalta dias normales, festivos y no lectivos segun reglas derivadas del PTT.
- Seed idempotente con servicios operativos, horas de contrato y puestos verificables, sin importar nombres ficticios de vigilantes
- PTT de vigilancia archivado como fuente de conocimiento en `docs/fuentes/PTT-Vigilancia-UZ.md`.
- Navegacion y permisos por rol: ADMIN/Unidad de Seguridad con acceso completo; Contrata limitada a Operacion.
- Informes operativo diario, mensual y anual con vista previa imprimible.
- Pantallas de Horas anuales y Cierre mensual para validacion de factura.
- Edicion administrativa del contrato anual desde Horas anuales: bolsa variable y categorias del pliego persistidas en MariaDB con auditoria.
- Calendario laboral 2026 con festivos reales del HTML original, periodos academicos y alta manual de festivos.
- Formulario avanzado de servicios con metadatos operativos y filtro por campus.

**Pendiente:**
- Reforzar permisos por rol en todos los endpoints operativos
- Migrar hash de contrasenas demo de SHA-256 a bcrypt/argon2
- Persistir/importar turnos reales para meses distintos de mayo 2026
- Despliegue en produccion

## Licencia

Proprietario - Universidad de Zaragoza
