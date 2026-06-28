INSERT INTO rol(nombre) VALUES ('ADMIN'),('MEDICO'),('LABORISTA'),('RECEPCIONISTA');

INSERT INTO tipo_sangre (grupo, factor_rh, descripcion, nivel_critico)
VALUES
    ('A',  '+', 'Grupo sanguíneo A positivo', 10),
    ('A',  '-', 'Grupo sanguíneo A negativo', 5),
    ('B',  '+', 'Grupo sanguíneo B positivo', 10),
    ('B',  '-', 'Grupo sanguíneo B negativo', 5),
    ('AB', '+', 'Grupo sanguíneo AB positivo', 8),
    ('AB', '-', 'Grupo sanguíneo AB negativo', 3),
    ('O',  '+', 'Grupo sanguíneo O positivo', 15),
    ('O',  '-', 'Grupo sanguíneo O negativo (donante universal)', 5);

INSERT INTO stock_sangre (
    id_tipo_sangre,
    cantidad_unidades,
    fecha_actualizacion,
    estado_stock
)
VALUES
(1, 0, CURRENT_TIMESTAMP, 'bajo'),
(2, 0, CURRENT_TIMESTAMP, 'bajo'),
(3, 0, CURRENT_TIMESTAMP, 'bajo'),
(4, 0, CURRENT_TIMESTAMP, 'bajo'),
(5, 0, CURRENT_TIMESTAMP, 'bajo'),
(6, 0, CURRENT_TIMESTAMP, 'bajo'),
(7, 0, CURRENT_TIMESTAMP, 'bajo'),
(8, 0, CURRENT_TIMESTAMP, 'bajo');

INSERT INTO campania (
    nombre,
    lugar,
    fecha_inicio,
    fecha_fin,
    activa
)
VALUES
(
    'Jornada de Donación - Universidad Mayor de San Andrés',
    'Campus Central UMSA, La Paz',
    '2026-07-05',
    '2026-07-05',
    TRUE
),
(
    'Campaña Solidaria Hospital de Clínicas',
    'Hospital de Clínicas, La Paz',
    '2026-07-10',
    '2026-07-11',
    TRUE
),
(
    'Donación Voluntaria - Plaza San Francisco',
    'Plaza San Francisco, La Paz',
    '2026-07-18',
    '2026-07-18',
    TRUE
),
(
    'Jornada Empresarial de Donación',
    'Zona Sur, La Paz',
    '2026-07-24',
    '2026-07-25',
    TRUE
),
(
    'Campaña Hemocentro El Alto',
    'Plaza del Lustrabotas, El Alto',
    '2026-08-02',
    '2026-08-02',
    TRUE
),
(
    'Donatón Departamental',
    'Estadio Hernando Siles, La Paz',
    '2026-08-15',
    '2026-08-16',
    TRUE
),
(
    'Campaña Universitaria de Invierno',
    'Universidad Católica Boliviana, La Paz',
    '2026-08-22',
    '2026-08-22',
    TRUE
),
(
    'Jornada Comunitaria de Donación',
    'Centro Cívico de El Alto',
    '2026-09-05',
    '2026-09-05',
    FALSE
);
