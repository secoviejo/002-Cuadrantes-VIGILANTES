# Avances 14 de Mayo 2026 - Modal de Generación de Informes

## Cambios realizados
Se ha implementado una mejora en la funcionalidad de generación de informes dentro de la interfaz de Cuadrantes:

1. **Nuevo Modal de Selección de Informe**: 
   - Se ha añadido un nuevo modal (`#report-type-overlay`) que intercepta la acción de "Generar informe".
   - Este modal permite al usuario seleccionar entre tres tipos de informes distintos antes de previsualizar el documento:
     - **Día actual (Básico)**: Pensado para informes rápidos de incidencias del día.
     - **Informe Mensual**: Un resumen ejecutivo del mes en curso.
     - **Informe del Año**: Estadísticas globales y rendimiento anual.

2. **Refactorización de JavaScript**:
   - Modificación del botón `Generar informe` para llamar a `openReportPrompt()` en lugar de abrir el informe directamente.
   - Creación de la función `generateReport(type)` para manejar la selección del usuario.
   - Actualización de la función `openReport(type)` para inyectar dinámicamente el título del informe, el periodo y la fecha de la barra de herramientas, basándose en el tipo de informe seleccionado.

3. **Modificaciones UI/UX**:
   - Aplicación de los estilos existentes para asegurar que el nuevo modal de selección mantenga la coherencia visual con el resto de la aplicación (tipografía Fraunces, botones estandarizados, y bordes interactivos al hacer hover).

## Estado actual
La previsualización del informe (`#report-overlay`) se actualiza correctamente y muestra la cabecera correspondiente al tipo de informe elegido. Todos los cambios se han aplicado al archivo principal `cuadrantes_uz_6.html`.
