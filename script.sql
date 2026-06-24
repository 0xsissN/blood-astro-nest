CREATE DATABASE blood

CREATE TABLE tipos_sangre (
    id_tipo_sangre SERIAL PRIMARY KEY,
    grupo VARCHAR(3) NOT NULL,
    factor_rh VARCHAR(5) NOT NULL,
    descripcion VARCHAR(100),
    nivel_critico INT NOT NULL CHECK (nivel_critico >= 0),
    CONSTRAINT chk_grupo_sangre CHECK (grupo IN ('A', 'B', 'AB', 'O')),
    CONSTRAINT chk_factor_rh CHECK (factor_rh IN ('+', '-')),
    CONSTRAINT uq_tipo_sangre UNIQUE (grupo, factor_rh)
);

CREATE TABLE donantes (
    id_donante SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    ci VARCHAR(30) UNIQUE NOT NULL,
    telefono VARCHAR(25),
    fecha_nacimiento DATE,
    id_tipo_sangre INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo',
    CONSTRAINT fk_donante_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipos_sangre(id_tipo_sangre)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_estado_donante CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE campanias (
    id_campania SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    lugar VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa',
    CONSTRAINT chk_fechas_campania CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT chk_estado_campania CHECK (estado IN ('activa', 'finalizada', 'cancelada'))
);

CREATE TABLE usuarios_sistema (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    rol VARCHAR(40) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo',
    CONSTRAINT chk_rol_usuario CHECK (rol IN ('administrador', 'personal', 'responsable')),
    CONSTRAINT chk_estado_usuario CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE donaciones (
    id_donacion SERIAL PRIMARY KEY,
    id_donante INT NOT NULL,
    id_campania INT,
    id_tipo_sangre INT NOT NULL,
    fecha_donacion DATE NOT NULL,
    cantidad_ml INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'aprobada',
    CONSTRAINT fk_donacion_donante FOREIGN KEY (id_donante)
        REFERENCES donantes(id_donante)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_donacion_campania FOREIGN KEY (id_campania)
        REFERENCES campanias(id_campania)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_donacion_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipos_sangre(id_tipo_sangre)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad_ml CHECK (cantidad_ml > 0),
    CONSTRAINT chk_estado_donacion CHECK (estado IN ('aprobada', 'rechazada', 'pendiente'))
);

CREATE TABLE unidades_sangre (
    id_unidad SERIAL PRIMARY KEY,
    codigo_unidad VARCHAR(50) UNIQUE NOT NULL,
    id_donacion INT NOT NULL,
    id_tipo_sangre INT NOT NULL,
    fecha_extraccion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado VARCHAR(25) DEFAULT 'disponible',
    CONSTRAINT fk_unidad_donacion FOREIGN KEY (id_donacion)
        REFERENCES donaciones(id_donacion)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_unidad_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipos_sangre(id_tipo_sangre)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_fechas_unidad CHECK (fecha_vencimiento > fecha_extraccion),
    CONSTRAINT chk_estado_unidad CHECK (estado IN ('disponible', 'usada', 'vencida', 'descartada'))
);

CREATE TABLE stock_sangre (
    id_stock SERIAL PRIMARY KEY,
    id_tipo_sangre INT NOT NULL,
    cantidad_unidades INT DEFAULT 0,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_stock VARCHAR(25),
    CONSTRAINT fk_stock_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipos_sangre(id_tipo_sangre)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades >= 0),
    CONSTRAINT chk_estado_stock CHECK (estado_stock IN ('normal', 'bajo', 'critico')),
    CONSTRAINT uq_stock_tipo_sangre UNIQUE (id_tipo_sangre)
);

CREATE TABLE alertas_stock (
    id_alerta SERIAL PRIMARY KEY,
    id_tipo_sangre INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_generada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'abierta',
    CONSTRAINT fk_alerta_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipos_sangre(id_tipo_sangre)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_estado_alerta CHECK (estado IN ('abierta', 'cerrada'))
);

CREATE TABLE reportes_dashboard (
    id_reporte SERIAL PRIMARY KEY,
    periodo VARCHAR(20) NOT NULL,
    total_donaciones INT DEFAULT 0,
    donantes_recurrentes INT DEFAULT 0,
    grupos_criticos INT DEFAULT 0,
    fecha_generacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_total_donaciones CHECK (total_donaciones >= 0),
    CONSTRAINT chk_donantes_recurrentes CHECK (donantes_recurrentes >= 0),
    CONSTRAINT chk_grupos_criticos CHECK (grupos_criticos >= 0)
);

CREATE INDEX idx_donantes_tipo_sangre ON donantes(id_tipo_sangre);
CREATE INDEX idx_donaciones_fecha ON donaciones(fecha_donacion);
CREATE INDEX idx_donaciones_donante ON donaciones(id_donante);
CREATE INDEX idx_donaciones_tipo_sangre ON donaciones(id_tipo_sangre);
CREATE INDEX idx_unidades_estado ON unidades_sangre(estado);
CREATE INDEX idx_stock_estado ON stock_sangre(estado_stock);
CREATE INDEX idx_alertas_estado ON alertas_stock(estado);

INSERT INTO tipos_sangre (grupo, factor_rh, descripcion, nivel_critico)
VALUES
('A', '+', 'Sangre tipo A positivo', 5),
('A', '-', 'Sangre tipo A negativo', 3),
('B', '+', 'Sangre tipo B positivo', 5),
('B', '-', 'Sangre tipo B negativo', 3),
('AB', '+', 'Sangre tipo AB positivo', 4),
('AB', '-', 'Sangre tipo AB negativo', 2),
('O', '+', 'Sangre tipo O positivo', 6),
('O', '-', 'Sangre tipo O negativo', 4);

INSERT INTO usuarios_sistema (nombre, correo, rol, password_hash, estado)
VALUES
('Administrador General', 'admin@bloodcare.com', 'administrador', 'hash_admin_123', 'activo'),
('Personal Banco de Sangre', 'personal@bloodcare.com', 'personal', 'hash_personal_123', 'activo'),
('Responsable de Stock', 'responsable@bloodcare.com', 'responsable', 'hash_responsable_123', 'activo');

INSERT INTO donantes (nombre_completo, ci, telefono, fecha_nacimiento, id_tipo_sangre, estado)
VALUES
('Alejandro Fernández Gareca', 'CI-1001', '70000001', '2003-05-12', 1, 'activo'),
('Adriana Gallardo Ramos', 'CI-1002', '70000002', '2002-08-20', 7, 'activo'),
('Erick Sivila Del Castillo', 'CI-1003', '70000003', '2001-03-15', 8, 'activo'),
('Sarah Chavez Valencia', 'CI-1004', '70000004', '2004-11-10', 3, 'activo'),
('Carlos Méndez Rojas', 'CI-1005', '70000005', '1999-01-25', 6, 'activo');

INSERT INTO campanias (nombre, lugar, fecha_inicio, fecha_fin, estado)
VALUES
('Campaña Universitaria UPDS', 'Universidad Privada Domingo Savio', '2026-06-01', '2026-06-07', 'activa'),
('Campaña Hospital Central', 'Hospital Central', '2026-06-10', '2026-06-15', 'activa'),
('Campaña Solidaria Tarija', 'Plaza Principal', '2026-05-01', '2026-05-05', 'finalizada');

INSERT INTO donaciones (id_donante, id_campania, id_tipo_sangre, fecha_donacion, cantidad_ml, estado)
VALUES
(1, 1, 1, '2026-06-01', 450, 'aprobada'),
(2, 1, 7, '2026-06-02', 450, 'aprobada'),
(3, 2, 8, '2026-06-03', 450, 'aprobada'),
(4, 2, 3, '2026-06-04', 450, 'aprobada'),
(5, 3, 6, '2026-05-02', 450, 'aprobada'),
(1, 2, 1, '2026-06-12', 450, 'aprobada');

INSERT INTO unidades_sangre (
    codigo_unidad,
    id_donacion,
    id_tipo_sangre,
    fecha_extraccion,
    fecha_vencimiento,
    estado
)
VALUES
('UNI-A+001', 1, 1, '2026-06-01', '2026-07-01', 'disponible'),
('UNI-O+001', 2, 7, '2026-06-02', '2026-07-02', 'disponible'),
('UNI-O-001', 3, 8, '2026-06-03', '2026-07-03', 'disponible'),
('UNI-B+001', 4, 3, '2026-06-04', '2026-07-04', 'disponible'),
('UNI-AB-001', 5, 6, '2026-05-02', '2026-06-02', 'vencida'),
('UNI-A+002', 6, 1, '2026-06-12', '2026-07-12', 'disponible');

INSERT INTO stock_sangre (id_tipo_sangre, cantidad_unidades, fecha_actualizacion, estado_stock)
VALUES
(1, 2, CURRENT_TIMESTAMP, 'bajo'),
(2, 0, CURRENT_TIMESTAMP, 'critico'),
(3, 1, CURRENT_TIMESTAMP, 'critico'),
(4, 0, CURRENT_TIMESTAMP, 'critico'),
(5, 0, CURRENT_TIMESTAMP, 'critico'),
(6, 0, CURRENT_TIMESTAMP, 'critico'),
(7, 1, CURRENT_TIMESTAMP, 'critico'),
(8, 1, CURRENT_TIMESTAMP, 'critico');

INSERT INTO alertas_stock (id_tipo_sangre, tipo, mensaje, fecha_generada, estado)
VALUES
(2, 'stock critico', 'El tipo de sangre A- se encuentra sin unidades disponibles.', CURRENT_TIMESTAMP, 'abierta'),
(4, 'stock critico', 'El tipo de sangre B- se encuentra sin unidades disponibles.', CURRENT_TIMESTAMP, 'abierta'),
(5, 'stock critico', 'El tipo de sangre AB+ se encuentra sin unidades disponibles.', CURRENT_TIMESTAMP, 'abierta'),
(6, 'stock critico', 'El tipo de sangre AB- se encuentra sin unidades disponibles.', CURRENT_TIMESTAMP, 'abierta');

INSERT INTO reportes_dashboard (
    periodo,
    total_donaciones,
    donantes_recurrentes,
    grupos_criticos,
    fecha_generacion
)
VALUES
('2026-06', 5, 1, 7, CURRENT_TIMESTAMP);