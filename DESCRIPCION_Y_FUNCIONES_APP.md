# Cuadrantes UZ - Descripcion y funciones de la app

## 1. Objetivo general

La aplicacion **Cuadrantes UZ** es un prototipo navegable para gestionar y supervisar el servicio de vigilancia y seguridad de la Universidad de Zaragoza.

Su objetivo principal es centralizar en una unica interfaz:

- La vision operativa diaria del servicio.
- El cuadrante mensual de coberturas.
- El control de sustituciones, incidencias y descubiertos.
- El seguimiento de horas planificadas, ejecutadas y acumuladas.
- La preparacion de informes diarios, mensuales y anuales.
- La validacion mensual de desviaciones antes de factura.
- La configuracion basica de servicios, personal y calendario laboral.

Actualmente funciona como prototipo HTML de una sola pagina, con datos de demostracion y sin persistencia real. Las acciones se reflejan en pantalla durante la sesion, pero no se guardan en una base de datos.

## 2. Perfiles de usuario

La app contempla dos perfiles principales:

- **Unidad de Seguridad UZ**: perfil de supervision, consulta, control y validacion.
- **Contrata**: perfil operativo para revisar servicios, marcar coberturas y comunicar incidencias o descubiertos.

Segun el rol, la navegacion y algunas acciones cambian. Por ejemplo, el perfil de contrata no ve las secciones de control y configuracion reservadas a UZ.

## 3. Pantallas principales

### Resumen operativo

Es la pantalla principal de trabajo. Muestra el estado actual del servicio de vigilancia para el mes en curso.

Funciones incluidas:

- Panel de **verificacion de cobertura** por turno.
- Selector de turno: manana, tarde y noche.
- Listado de servicios a cubrir en el turno activo.
- Marcado por servicio como:
  - Cubierto.
  - Incidencia.
  - Descubierto.
- Caja de texto al marcar incidencia o descubierto para describir el problema.
- Guardado temporal de la descripcion en la propia fila.
- Visualizacion de incidencias y descubiertos en alertas dinamicas.
- Accion para marcar todos los servicios como cubiertos.
- Confirmacion de verificacion del turno.
- KPIs de cobertura mensual, horas planificadas, horas ejecutadas y acumulado anual.
- Alertas activas y ultimas sustituciones.
- Generacion de informes.

### Cuadrante mensual

Muestra una vista mensual de los servicios y turnos planificados.

Funciones incluidas:

- Vista por dias del mes.
- Identificacion visual de fines de semana y festivos.
- Turnos de manana, tarde, noche y dia.
- Simulacion de huecos descubiertos.
- Servicios 24/7 y servicios variables.
- Referencia visual para detectar coberturas incompletas.

### Importar Excel

Pantalla preparada para la carga de cuadrantes desde Excel.

Funciones incluidas:

- Zona de subida de archivo.
- Indicacion de formato esperado.
- Historial de importaciones.
- Estado de importaciones anteriores.

En el prototipo actual no realiza una importacion real, pero representa el flujo previsto.

### Sustituciones

Registro de cambios de personal comunicados por la contrata.

Funciones incluidas:

- Tabla de sustituciones.
- Fecha y turno afectados.
- Servicio afectado.
- Persona original.
- Persona sustituta.
- Motivo de la sustitucion.
- Fecha/hora de comunicacion.
- Control de cumplimiento de preaviso de 24 horas.

### Horas anuales

Pantalla de control acumulado de horas del contrato.

Funciones incluidas:

- Seguimiento de prestaciones fijas.
- Seguimiento de prestaciones variables.
- Desglose por campus y servicio.
- Comparacion entre horas ejecutadas y horas anuales previstas.
- Porcentaje de ejecucion del contrato.

### Cierre mensual

Pantalla orientada a validar el cierre del mes antes de aceptar o revisar la factura.

Funciones incluidas:

- Resumen de estado del cierre.
- Conciliacion por tipo de hora.
- Comparacion entre planificado, ejecutado y diferencia.
- Deteccion de desviaciones.
- Visualizacion de incidencias relevantes para el cierre.
- Apoyo a la validacion de factura.

### Catalogo de servicios

Pantalla de consulta y configuracion de los servicios activos.

Funciones incluidas:

- Listado de servicios del pliego y servicios a demanda.
- Filtro por campus.
- Datos de campus, tipo de servicio, modalidad, dotacion y vehiculo.
- Acceso a la creacion de nuevo servicio.

### Crear nuevo servicio

Formulario de alta de servicios.

Funciones incluidas:

- Nombre del servicio.
- Codigo o identificador.
- Campus.
- Tipo de servicio.
- Modalidad:
  - 24/7.
  - Horario fijo.
  - Calendario academico.
  - A demanda.
- Dias aplicables.
- Turnos.
- Numero de personas.
- Vehiculo.
- Vista previa del servicio configurado.
- Estimacion orientativa de horas anuales.

En el prototipo actual la creacion es visual y no persiste en una base de datos.

### Personal

Pantalla de consulta del personal adscrito al servicio.

Funciones incluidas:

- Listado de vigilantes y auxiliares.
- Identificacion profesional.
- Tipo de perfil.
- Control de formacion.
- Estado de actividad.
- Deteccion visual de formacion incompleta.

### Calendario laboral

Pantalla de referencia para festivos y periodos academicos.

Funciones incluidas:

- Festivos por ambito.
- Periodos lectivos y no lectivos.
- Cierres universitarios.
- Referencia para servicios condicionados por calendario academico.

## 4. Generacion de informes

La app permite generar informes desde el boton **Generar informe** del resumen operativo.

Antes de generar el documento, la aplicacion pregunta el tipo de informe:

- **Dia actual**: informe basico del dia completo.
- **Informe mensual**: resumen del mes en curso.
- **Informe del ano**: resumen anual del contrato.

Cada tipo de informe tiene contenido propio:

- El informe diario se centra en servicios previstos, incidencias, descubiertos y sustituciones del dia.
- El informe mensual incluye cobertura por campus, conciliacion horaria, incidencias del mes, sustituciones y prestaciones variables.
- El informe anual incluye avance anual, acumulados, resumen mensual, incidencias relevantes y prestaciones variables acumuladas.

Los informes se muestran en una vista previa con opcion de imprimir o guardar como PDF desde el navegador.

## 5. Incidencias y descubiertos

En el panel de verificacion de cobertura, cada servicio puede marcarse como:

- **Cubierto**: el servicio esta correctamente atendido.
- **Incidencia**: existe un problema, pero no necesariamente implica ausencia total de cobertura.
- **Descubierto**: el servicio queda sin cobertura o con una ausencia critica.

Cuando se pulsa **Incidencia** o **Descubierto**, se abre una caja de texto para describir el problema.

La descripcion:

- Se guarda temporalmente durante la sesion.
- Se muestra bajo la fila del servicio.
- Puede editarse.
- Se elimina si el servicio pasa a estado cubierto.
- Aparece en las alertas dinamicas del resumen operativo.

## 6. Limitaciones actuales del prototipo

La app todavia es un prototipo HTML y tiene estas limitaciones:

- No hay base de datos.
- No hay persistencia real al recargar la pagina.
- Las importaciones de Excel son simuladas.
- La creacion de servicios no guarda datos reales.
- Los informes usan datos de demostracion.
- La autenticacion es simulada.
- No hay integracion real con sistemas de facturacion, RRHH o gestion documental.

## 7. Evolucion prevista

Las siguientes mejoras naturales serian:

- Persistencia de verificaciones, incidencias y descubiertos.
- Guardado real de descripciones de problemas.
- Importacion real de cuadrantes desde Excel.
- Generacion de informes con datos reales.
- Exportacion a PDF con formato estable.
- Gestion historica por mes y ano.
- Backend con usuarios, roles y permisos.
- Registro de auditoria de acciones.
- Conexion con documentacion de contrato y facturacion.

