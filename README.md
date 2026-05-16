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

**Pendiente:**
- Reforzar permisos por rol en todos los endpoints operativos
- Migrar hash de contrasenas demo de SHA-256 a bcrypt/argon2
- Despliegue en produccion

## Licencia

Proprietario - Universidad de Zaragoza
