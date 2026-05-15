---
name: cuadrantes-vigilantes-context
description: Contexto vivo del proyecto 002-Cuadrantes-VIGILANTES. Usar siempre que trabajes en mejoras, auditorias, nuevas funcionalidades, correcciones, frontend, backend, base de datos, migracion a React, despliegue, documentacion o decisiones de producto. Ayuda a entender que hace el programa, que pantallas existen, que riesgos hay y como aconsejar al usuario.
---

# 002-Cuadrantes-VIGILANTES Context

## Objetivo

002-Cuadrantes-VIGILANTES es una aplicacion para gestionar y supervisar cuadrantes de vigilantes de seguridad y auxiliares de servicio vinculados a la Universidad de Zaragoza.

Actualmente existe como prototipo navegable en HTML, con datos de demostracion y flujos simulados. Su evolucion prevista es convertirse progresivamente en una aplicacion full-stack con frontend React, backend Express, Prisma, MariaDB, API REST, autenticacion preparada con JWT, roles y auditoria basica.

La aplicacion sirve a dos perfiles principales:

- Unidad de Seguridad UZ: supervision, consulta, control y validacion.
- Contrata: revision operativa de servicios, comunicacion de sustituciones y marcado de coberturas, incidencias o descubiertos.

Esta skill debe ayudar a aconsejar, guiar y explicar decisiones en lenguaje claro.

## Fuente Viva

La fuente profunda y canonica del contexto funcional y tecnico es:

- `references/contexto-operativo.md`

Lee siempre esa fuente antes de:

- Proponer o implementar cambios funcionales.
- Tocar frontend, backend, base de datos, Prisma, Express, API REST o arquitectura.
- Migrar codigo HTML a React.
- Modificar documentacion del proyecto.
- Trabajar con turnos, asignaciones, sustituciones, incidencias, verificaciones, informes o exportaciones.
- Tomar decisiones sobre estructura de carpetas, dependencias o roadmap.

## Flujo de Trabajo

1. Identifica la pantalla, archivo, modulo o documento afectado.
2. Explica en una frase que hace hoy esa zona.
3. Distingue explicitamente entre "actual", "visual", "simulado", "pendiente" y "futuro".
4. Evalua impacto para usuario, operacion, datos, informes, permisos y futura base de datos.
5. Propone el camino mas seguro, priorizando estabilidad y migracion progresiva.
6. Si implementas, valida la zona afectada y cualquier zona conectada.
7. Al cerrar, revisa si hay que actualizar `references/contexto-operativo.md`.

## Reglas de Consejo

- Habla claro y sin asumir que el usuario conoce arquitectura, APIs, Prisma, React, Express, MariaDB o Git.
- Recomienda cuando veas riesgo: no te limites a obedecer una solucion peligrosa.
- No confundas datos demo con reglas reales.
- No confundas botones visuales con funcionalidad implementada.
- No propongas funcionalidades avanzadas antes de completar la base de Fase 1.
- Mantener fuera de Fase 1: GPS, geovallas, NFC, QR, app movil nativa, inteligencia artificial, control de accesos, CAU, nominas avanzadas, biometria y SSO real.
- Prioriza primero datos reales, persistencia, modelo de datos, CRUD, reglas basicas, exportaciones e informes.
- Mantener separacion futura entre frontend React, backend Express, Prisma y MariaDB.
- Evitar mezclar logica de negocio directamente en componentes visuales.
- Las reglas de turnos deben tender a centralizarse en backend, preferiblemente en un servicio tipo `MotorReglasTurnos`.
- El HTML original debe tratarse como referencia visual hasta que exista una migracion controlada.

## Alcance Prioritario de Fase 1

La Fase 1 debe centrarse en:

- Reorganizacion del proyecto.
- Migracion progresiva del prototipo HTML a React.
- Backend Node.js + Express.
- Base de datos MariaDB.
- ORM Prisma.
- API REST.
- Gestion de usuarios y roles.
- Gestion de empresas.
- Gestion de trabajadores.
- Gestion de campus.
- Gestion de edificios.
- Gestion de servicios.
- Gestion de turnos.
- Asignaciones de trabajadores a turnos.
- Sustituciones.
- Incidencias.
- Verificaciones de cobertura.
- Exportaciones basicas.
- Auditoria.

## Funcionalidades Descartadas por Ahora

No implementar todavia:

- GPS.
- Geovallas.
- NFC.
- QR.
- App movil nativa.
- Inteligencia artificial para autoasignacion.
- Integracion con control de accesos.
- Integracion con CAU.
- Calculo completo de nominas.
- Biometria.
- SSO real de la Universidad.

Estas funcionalidades pueden documentarse como futuras, pero no deben bloquear ni contaminar la Fase 1.

## Mantenimiento Vivo

Despues de cambios relevantes, comprobar si hay que actualizar:

- `references/contexto-operativo.md`

Actualizarlo cuando cambie:

- Una pantalla.
- Un flujo funcional.
- El modelo de datos.
- Una API.
- Una regla de negocio.
- La arquitectura.
- Las dependencias.
- El estado de validacion.
- Los riesgos conocidos.
- El roadmap.

Si no se actualiza, indicar explicitamente que no hacia falta y por que.
