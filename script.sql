CREATE DATABASE blood;

CREATE TABLE tipo_sangre (
    id SERIAL PRIMARY KEY,
    grupo VARCHAR(3) NOT NULL,
    factor_rh VARCHAR(5) NOT NULL,
    descripcion VARCHAR(100),
    nivel_critico INT NOT NULL CHECK (nivel_critico >= 0),

    CONSTRAINT chk_grupo_sangre CHECK (grupo IN ('A', 'B', 'AB', 'O')),
    CONSTRAINT chk_factor_rh CHECK (factor_rh IN ('+', '-')),
    CONSTRAINT uq_tipo_sangre UNIQUE (grupo, factor_rh)
);

CREATE TABLE donante (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60) NOT NULL,
    ci VARCHAR(30) UNIQUE NOT NULL,
    telefono VARCHAR(25),
    fecha_nacimiento DATE,
    id_tipo_sangre INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_donante_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipo_sangre(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE campania (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    lugar VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,

    CONSTRAINT chk_fechas_campania CHECK (fecha_fin >= fecha_inicio)
);

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol)
        REFERENCES rol(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE donacion (
    id SERIAL PRIMARY KEY,
    id_donante INT NOT NULL,
    id_campania INT,
    id_tipo_sangre INT NOT NULL,
    fecha_donacion DATE NOT NULL,
    cantidad_ml INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'aprobada',

    CONSTRAINT fk_donacion_donante FOREIGN KEY (id_donante)
        REFERENCES donante(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_donacion_campania FOREIGN KEY (id_campania)
        REFERENCES campania(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_donacion_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipo_sangre(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_cantidad_ml CHECK (cantidad_ml > 0),
    CONSTRAINT chk_estado_donacion CHECK (estado IN ('aprobada', 'rechazada', 'pendiente'))
);

CREATE TABLE unidad_sangre (
    id SERIAL PRIMARY KEY,
    codigo_unidad VARCHAR(50) UNIQUE NOT NULL,
    id_donacion INT NOT NULL,
    id_tipo_sangre INT NOT NULL,
    fecha_extraccion DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_unidad_donacion FOREIGN KEY (id_donacion)
        REFERENCES donacion(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_unidad_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipo_sangre(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_fechas_unidad CHECK (fecha_vencimiento > fecha_extraccion)
);

CREATE TABLE stock_sangre (
    id SERIAL PRIMARY KEY,
    id_tipo_sangre INT NOT NULL,
    cantidad_unidades INT DEFAULT 0,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_stock VARCHAR(25),

    CONSTRAINT fk_stock_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipo_sangre(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_cantidad_unidades CHECK (cantidad_unidades >= 0),
    CONSTRAINT chk_estado_stock CHECK (estado_stock IN ('normal', 'bajo', 'critico')),
    CONSTRAINT uq_stock_tipo UNIQUE (id_tipo_sangre)
);

CREATE TABLE alerta_stock (
    id SERIAL PRIMARY KEY,
    id_tipo_sangre INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_generada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    abierta BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_alerta_tipo_sangre FOREIGN KEY (id_tipo_sangre)
        REFERENCES tipo_sangre(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE reporte_dashboard (
    id SERIAL PRIMARY KEY,
    periodo VARCHAR(20) NOT NULL,
    total_donaciones INT DEFAULT 0,
    donantes_recurrentes INT DEFAULT 0,
    grupos_criticos INT DEFAULT 0,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_total_donaciones CHECK (total_donaciones >= 0),
    CONSTRAINT chk_donantes_recurrentes CHECK (donantes_recurrentes >= 0),
    CONSTRAINT chk_grupos_criticos CHECK (grupos_criticos >= 0)
);

CREATE INDEX idx_donante_tipo_sangre ON donante(id_tipo_sangre);
CREATE INDEX idx_donacion_fecha ON donacion(fecha_donacion);
CREATE INDEX idx_donacion_donante ON donacion(id_donante);
CREATE INDEX idx_donacion_tipo_sangre ON donacion(id_tipo_sangre);
CREATE INDEX idx_unidad_activa ON unidad_sangre(activa);
CREATE INDEX idx_stock_estado ON stock_sangre(estado_stock);
CREATE INDEX idx_alerta_abierta ON alerta_stock(abierta);

INSERT INTO rol(nombre) VALUES ('ADMIN'),('MEDICO'),('LABORISTA'),('RECEPCIONISTA')
