# Avances 15 de Mayo de 2026 - PASO 12

## Resumen de la sesión
En esta sesión nos centramos en el **PASO 12**: levantar un entorno de base de datos MariaDB real para el desarrollo usando Docker Compose, y ejecutar la primera migración de Prisma.

## Tareas Completadas

1. **Verificación Inicial**
   - Confirmado que el repositorio estaba sincronizado con `origin/main` y limpio.
   - Confirmado que el puerto 3308 estaba libre para MariaDB y no entrar en conflicto con otras instancias de bases de datos locales.

2. **Entorno Docker MariaDB**
   - Creado `docker-compose.yml` en la raíz del proyecto para levantar `mariadb:11` en el puerto `3308`.
   - Incluida configuración de credenciales exclusivas para desarrollo local: `cuadrantes_vigilantes_dev`.
   - Se configuró el contenedor para usar un volumen local persistente (`cuadrantes_mariadb_data`).

3. **Configuración de Variables de Entorno (`.env`)**
   - Creado el archivo `backend/.env` con las variables de conexión correctas hacia el contenedor Docker.
   - Se verificó que el archivo `backend/.env` continuara ignorado por Git.
   - **Solución a Shadow Database**: Para que Prisma Migrate pudiera crear su base de datos temporal (*shadow database*) y calcular las diferencias sin comprometer la seguridad del usuario de la app, se añadió la variable `SHADOW_DATABASE_URL` conectada mediante el usuario root.

4. **Migración Inicial y Seed**
   - Ejecutado `npx prisma migrate dev --name init`. La migración inicial se aplicó correctamente contra MariaDB en Docker.
   - El cliente Prisma fue generado en sincronía con el schema.
   - Ejecutado el script `npm run seed`, poblando exitosamente la base de datos de desarrollo con datos de prueba predefinidos.

5. **Validación Práctica**
   - Ejecutado el script de validación de repositorios `npm run test:repos`.
   - El script devolvió lecturas exitosas confirmando la correcta inserción de roles, trabajadores, servicios y turnos ficticios.

## Estado de Seguridad
- Las credenciales usadas en `docker-compose.yml` y `backend/.env` son exclusivas para entornos de desarrollo aislados.
- Ningún archivo `.env` fue, ni será, versionado en el repositorio público.
- No se han utilizado datos reales ni contraseñas de producción.

## Siguiente Paso Recomendado
- **PASO 13**: Validar los endpoints (GET, POST) existentes en la API REST (Express) para asegurar que se comunican correctamente con la nueva base de datos real.
- Empezar a planificar el esquema de autenticación (JWT) y gestión de sesiones para los distintos roles.
