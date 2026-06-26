# Blood Bank System - Entities

Este documento define las entidades principales del sistema de gestión de donación de sangre.

---

## 🧩 1. Rol

Define los niveles de acceso del sistema.

### Campos:

- id (PK)
- nombre (admin, intermedio, publico)

---

## 👤 2. Usuario

Usuarios del sistema con autenticación.

### Campos:

- id (PK)
- nombre
- correo
- password_hash
- id_rol (FK → rol.id)
- activo (boolean)

### Relaciones:

- Muchos usuarios pertenecen a un rol

---

## 🩸 3. TipoSangre

Define los grupos sanguíneos disponibles.

### Campos:

- id (PK)
- grupo (A, B, AB, O)
- factor_rh (+, -)
- descripcion
- nivel_critico

### Reglas:

- combinación grupo + factor_rh única

---

## 🧑 4. Donante

Personas registradas que pueden donar sangre.

### Campos:

- id (PK)
- nombre
- apellido
- ci (único)
- telefono
- fecha_nacimiento
- id_tipo_sangre (FK → tipo_sangre.id)
- activo (boolean)

### Relaciones:

- Un donante tiene un tipo de sangre
- Un donante puede tener muchas donaciones

---

## 🎯 5. Campania

Eventos de recolección de sangre.

### Campos:

- id (PK)
- nombre
- lugar
- fecha_inicio
- fecha_fin
- activa (boolean)

---

## 💉 6. Donacion

Registro de cada donación realizada.

### Campos:

- id (PK)
- id_donante (FK → donante.id)
- id_campania (FK → campania.id, nullable)
- id_tipo_sangre (FK → tipo_sangre.id)
- fecha_donacion
- cantidad_ml
- estado (aprobada, rechazada, pendiente)

### Relaciones:

- Muchas donaciones pertenecen a un donante
- Muchas donaciones pueden pertenecer a una campaña

---

## 🧪 7. UnidadSangre

Representa una unidad física de sangre almacenada.

### Campos:

- id (PK)
- codigo_unidad (único)
- id_donacion (FK → donacion.id)
- id_tipo_sangre (FK → tipo_sangre.id)
- fecha_extraccion
- fecha_vencimiento
- activa (boolean)

### Reglas:

- fecha_vencimiento > fecha_extraccion

---

## 📦 8. StockSangre

Control del inventario por tipo de sangre.

### Campos:

- id (PK)
- id_tipo_sangre (FK → tipo_sangre.id)
- cantidad_unidades
- fecha_actualizacion
- estado_stock (normal, bajo, critico)

### Reglas:

- cantidad_unidades >= 0
- id_tipo_sangre único

---

## 🚨 9. AlertaStock

Alertas generadas por bajo inventario.

### Campos:

- id (PK)
- id_tipo_sangre (FK → tipo_sangre.id)
- tipo
- mensaje
- fecha_generada
- abierta (boolean)

---

## 📊 10. ReporteDashboard

Resumen estadístico del sistema.

### Campos:

- id (PK)
- periodo
- total_donaciones
- donantes_recurrentes
- grupos_criticos
- fecha_generacion

---

# 🔗 RELACIONES PRINCIPALES

- Usuario → Rol
- Donante → TipoSangre
- Donacion → Donante / Campania / TipoSangre
- UnidadSangre → Donacion / TipoSangre
- StockSangre → TipoSangre
- AlertaStock → TipoSangre

---

# 🧠 NOTAS IMPORTANTES

- Todas las entidades usan `id` como clave primaria
- Estados simples usan BOOLEAN (activo/inactiva)
- Estados complejos usan ENUM en VARCHAR
- La lógica de stock y alertas debe implementarse en backend (NestJS)
