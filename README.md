## Definition of Done (DoD)

Una Historia de Usuario se considera completada únicamente cuando cumple con todos los los siguientes criterios:

### 1. Calidad de Código

* El código pasa las verificaciones del linter sin errores ni advertencias críticas.
* Se respetan las convenciones de codificación establecidas por el equipo.
* No existen errores de compilación ni código duplicado innecesario.

### 2. Pruebas y Fiabilidad (ISO 25010 - Reliability)

* Las pruebas unitarias asociadas a la funcionalidad se ejecutan correctamente.
* La funcionalidad opera sin fallos en el entorno de integración.
* Los cambios no generan regresiones en funcionalidades existentes.

### 3. Mantenibilidad (ISO 25010 - Maintainability)

* El código es modular, legible y documentado cuando corresponde.
* Se actualizan los diagramas UML (clases y secuencia) afectados por los cambios.
* La estructura del código facilita futuras modificaciones y reutilización.

### 4. Adecuación Funcional (ISO 25010 - Functional Suitability)

* Se cumplen al 100% los criterios de aceptación definidos para la Historia de Usuario.
* La funcionalidad satisface los requisitos de negocio establecidos.
* La funcionalidad ha sido validada por el equipo.

### 5. Seguridad y Ética de Datos (ISO 25010 - Security)

* Los datos del usuario son tratados únicamente para los fines definidos por el sistema.
* No se almacenan datos sensibles innecesarios.
* Se validan las entradas del usuario para prevenir errores e inyecciones de datos.
* Se respetan principios de privacidad, confidencialidad e integridad de la información.

### 6. Compatibilidad y Eficiencia (ISO 25010)

* La funcionalidad es compatible con la arquitectura Astro, NestJS y PostgreSQL.
* Las consultas a la base de datos no presentan ineficiencias evidentes.
* No se introducen problemas de rendimiento significativos.

### 7. Revisión de Código

* Los cambios fueron enviados mediante Pull Request.
* Al menos un integrante del Squad revisó y aprobó el código.
* Todas las observaciones fueron resueltas antes de la integración.

### 8. Integración

* Los cambios fueron integrados exitosamente a la rama principal.
* El sistema funciona correctamente después de la integración.
* No existen conflictos pendientes ni errores de ejecución.
