# Instalacion desde GitHub en un equipo nuevo

Esta guia explica como levantar la aplicacion y la base de datos partiendo solo del repositorio de GitHub.

Repositorio:

```text
git@github.com:secoviejo/002-Cuadrantes-VIGILANTES.git
```

## 1. Requisitos

Instala en el equipo de trabajo:

- Git.
- Node.js 18 o superior.
- Docker Desktop, recomendado para levantar MariaDB sin instalarla a mano.
- Un editor, por ejemplo VS Code.

Comprueba versiones:

```bash
git --version
node --version
npm --version
docker --version
```

## 2. Descargar el proyecto

```bash
git clone git@github.com:secoviejo/002-Cuadrantes-VIGILANTES.git
cd "002-Cuadrantes-VIGILANTES"
```

Si en el trabajo no tienes clave SSH configurada en GitHub, usa HTTPS:

```bash
git clone https://github.com/secoviejo/002-Cuadrantes-VIGILANTES.git
cd "002-Cuadrantes-VIGILANTES"
```

## 3. Levantar MariaDB con Docker

Desde la raiz del proyecto:

```bash
docker compose up -d
```

Esto crea un contenedor MariaDB con:

```text
Host: 127.0.0.1
Puerto externo: 3308
Base de datos: cuadrantes_vigilantes_dev
Usuario: cuadrantes_user
Password: cuadrantes_pass_dev
```

Comprueba que el contenedor esta levantado:

```bash
docker compose ps
```

## 4. Configurar el backend

Entra en la carpeta del backend:

```bash
cd backend
npm install
```

Copia el archivo de ejemplo:

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux/macOS/Git Bash:

```bash
cp .env.example .env
```

Edita `backend/.env` y deja estos valores para Docker:

```env
PORT=4000
HOST=127.0.0.1
NODE_ENV=development
FRONTEND_ORIGIN=http://127.0.0.1:5173
DATABASE_URL="mysql://cuadrantes_user:cuadrantes_pass_dev@127.0.0.1:3308/cuadrantes_vigilantes_dev"
JWT_SECRET="cambiar_en_entorno_trabajo"
```

No subas nunca `backend/.env` a GitHub.

## 5. Crear las tablas y cargar datos

Desde `backend/`:

```bash
npm run prisma:validate
npm run prisma:generate
npx prisma migrate deploy
npm run seed
```

Notas:

- `prisma migrate deploy` aplica las migraciones que ya vienen en GitHub.
- `npm run seed` carga roles, usuarios demo, servicios, campus, turnos de mayo 2026, calendario y datos operativos iniciales.
- No hace falta subir una copia de la base de datos a GitHub: se reconstruye con migraciones y seed.

## 6. Levantar el backend

Desde `backend/`:

```bash
npm run dev
```

Debe quedar disponible en:

```text
http://127.0.0.1:4000
http://127.0.0.1:4000/api
http://127.0.0.1:4000/api/health
```

Deja esta terminal abierta.

## 7. Levantar el frontend

Abre otra terminal desde la raiz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador:

```text
http://127.0.0.1:5173
```

## 8. Usuarios demo

Tras ejecutar el seed, puedes entrar con:

| Perfil | Email | Contrasena |
|---|---|---|
| Administrador | `admin.demo@example.com` | `Demo1234!` |
| Unidad de Seguridad UZ | `supervision.demo@unizar.example` | `Demo1234!` |
| Contrata | `contrata.demo@example.com` | `Demo1234!` |

## 9. Comprobaciones rapidas

Backend:

```bash
curl http://127.0.0.1:4000/api/health
```

Frontend:

- Login con `contrata.demo@example.com`.
- Entrar en Resumen operativo.
- Ver tres tablas: turno manana, turno tarde y turno noche.
- Entrar en Cuadrante mensual y comprobar mayo 2026.

## 10. Alternativa sin Docker

Si en el trabajo ya tienes MariaDB instalado, crea una base equivalente:

```sql
CREATE DATABASE cuadrantes_vigilantes_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'cuadrantes_user'@'localhost' IDENTIFIED BY 'TU_PASSWORD_LOCAL';

GRANT ALL PRIVILEGES ON cuadrantes_vigilantes_dev.* TO 'cuadrantes_user'@'localhost';

FLUSH PRIVILEGES;
```

En `backend/.env`, usa el puerto real de tu MariaDB. Si es el puerto normal:

```env
DATABASE_URL="mysql://cuadrantes_user:TU_PASSWORD_LOCAL@127.0.0.1:3306/cuadrantes_vigilantes_dev"
```

Despues ejecuta igualmente:

```bash
cd backend
npm install
npm run prisma:validate
npm run prisma:generate
npx prisma migrate deploy
npm run seed
npm run dev
```

## 11. Actualizar el proyecto mas adelante

Cuando haya cambios nuevos en GitHub:

```bash
git pull
cd backend
npm install
npx prisma migrate deploy
npm run seed
cd ../frontend
npm install
```

Si hay cambios de frontend o backend, reinicia los servidores `npm run dev`.

## 12. Problemas habituales

### El backend no conecta con MariaDB

Revisa:

- Que Docker esta abierto.
- Que `docker compose ps` muestra MariaDB como levantada.
- Que `DATABASE_URL` usa puerto `3308` si usas Docker.
- Que el `.env` esta dentro de `backend/`, no en la raiz.

### El frontend dice que no conecta con backend

Revisa:

- Backend levantado en `http://127.0.0.1:4000`.
- Frontend levantado en `http://127.0.0.1:5173`.
- `FRONTEND_ORIGIN=http://127.0.0.1:5173` en `backend/.env`.

### El login no funciona

Ejecuta otra vez:

```bash
cd backend
npm run seed
```

Y usa la contrasena demo:

```text
Demo1234!
```

### Quiero borrar la base local y empezar de cero

Con Docker, desde la raiz:

```bash
docker compose down -v
docker compose up -d
cd backend
npx prisma migrate deploy
npm run seed
```

Esto borra los datos locales de desarrollo.
