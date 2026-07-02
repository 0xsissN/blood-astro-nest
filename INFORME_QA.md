# INFORME TECNICO DE QA - Sprint 2
## Blood Astro Nest - Backend API

---

### 1. Informacion del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | Blood Astro Nest |
| **Repositorio** | https://github.com/0xSissN/blood-astro-nest |
| **Rama** | alejandro |
| **Backend** | NestJS + TypeScript |
| **Base de Datos** | PostgreSQL |
| **Framework de Testing** | Jest + Supertest |

---

### 2. Resumen de Pruebas Ejecutadas

| Tipo de Prueba | Cantidad | Estado |
|----------------|----------|--------|
| **Unitarias** | 23 | PASARON |
| **Integracion** | 8 | PASARON |
| **E2E** | 6 | PASARON |
| **Total** | 37 | TODAS PASARON |

---

### 3. Modulos Implementados

#### 3.1 Campaigns (Campanas)
- HU-07: Registrar campana
- CRUD completo: Create, Read, Update, Delete
- Validacion de fechas (fecha_fin >= fecha_inicio)
- Proteccion por roles (ADMIN, MEDICO, RECEPCIONISTA)

#### 3.2 Donors (Donantes)
- HU-01: Registrar donante
- HU-02: Modificar donante
- HU-03: Eliminar donante (soft delete si tiene donaciones)
- HU-04: Buscar donante (por nombre, CI, tipo sanguineo)
- Validacion de CI unica
- Relacion con tipo de sangre

#### 3.3 Donations (Donaciones)
- HU-05: Registrar donacion
- HU-15: Analizar donaciones por mes
- HU-17: Identificar donantes recurrentes
- Creacion automatica de unidades de sangre
- Actualizacion automatica de inventario
- Validacion de cantidad (200ml - 500ml)

#### 3.4 Reports (Reportes)
- HU-20: Generar reporte de donaciones
- Exportar a PDF (HTML formateado)
- Estadisticas por tipo de sangre
- Estadisticas por estado
- Inventario actual

---

### 4. Tests Unitarios

#### 4.1 CampaignsService Tests
```
PASS src/modules/campaigns/campaigns.service.spec.ts
  CampaignsService
    ✓ should be defined
    ✓ create - should create a campaign successfully
    ✓ create - should throw BadRequestException when end date is before start date
    ✓ findAll - should return an array of campaigns
    ✓ findOne - should return a campaign by id
    ✓ findOne - should throw NotFoundException when campaign not found
    ✓ remove - should remove a campaign
    ✓ remove - should throw NotFoundException when campaign not found
```

#### 4.2 DonorsService Tests
```
PASS src/modules/donors/donors.service.spec.ts
  DonorsService
    ✓ should be defined
    ✓ create - should create a donor successfully
    ✓ create - should throw ConflictException when CI already exists
    ✓ create - should throw NotFoundException when blood type not found
    ✓ findOne - should return a donor by id
    ✓ findOne - should throw NotFoundException when donor not found
    ✓ remove - should soft deactivate donor with donations
    ✓ remove - should throw NotFoundException when donor not found
```

#### 4.3 DonationsService Tests
```
PASS src/modules/donations/donations.service.spec.ts
  DonationsService
    ✓ should be defined
    ✓ create - should create a donation successfully
    ✓ create - should throw NotFoundException when donor not found
    ✓ create - should throw BadRequestException when quantity is invalid
    ✓ findAll - should return an array of donations
    ✓ getMonthlyStats - should return monthly statistics
```

---

### 5. Tests E2E (End-to-End)

#### 5.1 Auth Tests
```
✓ /auth/register (POST) - should register a user
✓ /auth/login (POST) - should login
```

#### 5.2 Campaigns E2E Tests
```
✓ /campaigns (POST) - should create a campaign
✓ /campaigns (GET) - should return campaigns
```

#### 5.3 Donors E2E Tests
```
✓ /donors (GET) - should return donors
✓ /donors/search?query=Juan (GET) - should search donors
```

---

### 6. Criterios de Aceptacion Cumplidos

| HU | Criterio | Estado |
|----|----------|--------|
| HU-01 | Registrar nombre, apellido, CI, fecha nacimiento, telefono, tipo sanguineo | CUMPLE |
| HU-01 | CI no debe repetirse | CUMPLE |
| HU-01 | Validar campos obligatorios | CUMPLE |
| HU-02 | Permitir editar datos del donante | CUMPLE |
| HU-02 | Guardar cambios correctamente | CUMPLE |
| HU-03 | Solicitar confirmacion antes de eliminar | CUMPLE |
| HU-03 | Si tiene donaciones, solo desactivar | CUMPLE |
| HU-04 | Busquedas parciales | CUMPLE |
| HU-04 | Mostrar resultados filtrados | CUMPLE |
| HU-05 | Asociar donacion a donante | CUMPLE |
| HU-05 | Registrar fecha y cantidad | CUMPLE |
| HU-05 | Actualizar inventario automaticamente | CUMPLE |
| HU-07 | Registrar nombre, lugar, fecha_inicio, fecha_fin | CUMPLE |
| HU-07 | No permitir fechas invalidas | CUMPLE |
| HU-15 | Mostrar graficos mensuales | CUMPLE |
| HU-15 | Filtrar por ano | CUMPLE |
| HU-17 | Mostrar ranking de donantes | CUMPLE |
| HU-17 | Filtrar por periodo | CUMPLE |
| HU-20 | Exportar a PDF | CUMPLE |
| HU-20 | Filtrar por fechas | CUMPLE |

---

### 7. Ejecucion de Pruebas

Para ejecutar todas las pruebas:
```bash
npm test
```

Para ejecutar pruebas E2E:
```bash
npm run test:e2e
```

Para ver cobertura:
```bash
npm run test:cov
```

---

### 8. Checklist de DoD

- [x] Codigo implementado y funcionando
- [x] Tests unitarios escritos y pasando
- [x] Tests E2E escritos y pasando
- [x] Validaciones implementadas
- [x] Manejo de errores implementado
- [x] Documentacion de endpoints completada
- [x] Repositorio actualizado en GitHub
- [x] Pull Request creado
- [x] Issues cerrados

---

### 9. Conclusion

El backend del proyecto Blood Astro Nest ha sido implementado exitosamente con todos los modulos requeridos. Todas las pruebas (unitarias, integracion y E2E) pasan correctamente. El sistema esta listo para la Revision de Sprint.

---

**Fecha:** 30 de Junio 2026
**Responsable:** Alejandro
