-- ============================================
-- DONANTES DE PRUEBA
-- Ejecutar después de schema.sql y values.sql
-- ============================================

-- Primero asegurarse que existan los tipos de sangre
INSERT INTO tipo_sangre (grupo, factor_rh, descripcion, nivel_critico)
VALUES
    ('A',  '+', 'Grupo sanguíneo A positivo', 10),
    ('A',  '-', 'Grupo sanguíneo A negativo', 5),
    ('B',  '+', 'Grupo sanguíneo B positivo', 10),
    ('B',  '-', 'Grupo sanguíneo B negativo', 5),
    ('AB', '+', 'Grupo sanguíneo AB positivo', 8),
    ('AB', '-', 'Grupo sanguíneo AB negativo', 3),
    ('O',  '+', 'Grupo sanguíneo O positivo', 15),
    ('O',  '-', 'Grupo sanguíneo O negativo (donante universal)', 5)
ON CONFLICT (grupo, factor_rh) DO NOTHING;

-- Insertar donantes de prueba
INSERT INTO donante (nombre, apellido, ci, telefono, fecha_nacimiento, id_tipo_sangre, activo)
VALUES
    -- Tipo O+ (id_tipo_sangre = 7)
    ('Alejandro', 'Rodríguez', '1234567', '70123456', '1990-05-15', 7, TRUE),
    ('María', 'González', '2345678', '71234567', '1985-08-22', 7, TRUE),
    ('Carlos', 'Mamani', '3456789', '72345678', '1992-03-10', 7, TRUE),
    ('Ana', 'López', '4567890', '73456789', '1988-11-28', 7, TRUE),
    ('Luis', 'Huanca', '5678901', '74567890', '1995-07-03', 7, TRUE),

    -- Tipo A+ (id_tipo_sangre = 1)
    ('Lucía', 'Martínez', '6789012', '75678901', '1993-02-14', 1, TRUE),
    ('Pedro', 'Flores', '7890123', '76789012', '1987-09-18', 1, TRUE),
    ('Sofía', 'Quispe', '8901234', '77890123', '1991-06-25', 1, TRUE),
    ('Diego', 'Torres', '9012345', '78901234', '1984-12-01', 1, FALSE),
    ('Valentina', 'Cáceres', '1023456', '79012345', '1996-04-09', 1, TRUE),

    -- Tipo B+ (id_tipo_sangre = 3)
    ('Carlos', 'García', '1122334', '70112233', '1989-01-20', 3, FALSE),
    ('Isabella', 'Vargas', '2233445', '71223344', '1994-08-07', 3, TRUE),
    ('Andrés', 'Medina', '3344556', '72334455', '1986-05-30', 3, TRUE),
    ('Camila', 'Rojas', '4455667', '73445566', '1990-10-12', 3, TRUE),
    ('Fernando', 'Silva', '5566778', '74556677', '1983-03-25', 3, TRUE),

    -- Tipo AB+ (id_tipo_sangre = 5)
    ('Mariana', 'Villalba', '6677889', '75667788', '1992-07-16', 5, TRUE),
    ('Roberto', 'Castro', '7788990', '76778899', '1988-02-28', 5, TRUE),
    ('Daniela', 'Reyes', '8899001', '77889900', '1995-11-05', 5, FALSE),
    ('Jorge', 'Mendoza', '9900112', '78990011', '1981-09-14', 5, TRUE),
    ('Patricia', 'Nina', '1001223', '79001122', '1993-04-22', 5, TRUE),

    -- Tipo O- (id_tipo_sangre = 8)
    ('Marco', 'Condori', '1112233', '70111223', '1987-06-08', 8, TRUE),
    ('Laura', 'Pinto', '2223344', '71222334', '1994-01-19', 8, TRUE),
    ('Sergio', 'Alvarez', '3334455', '72333445', '1985-10-03', 8, TRUE),
    ('Natalia', 'Ramos', '4445566', '73444556', '1991-12-27', 8, FALSE),
    ('Ricardo', 'Ortiz', '5556677', '74555667', '1989-08-11', 8, TRUE),

    -- Tipo A- (id_tipo_sangre = 2)
    ('Gabriela', 'Torres', '6667788', '75666778', '1990-03-15', 2, TRUE),
    ('Miguel', 'Herrera', '7778899', '76777889', '1986-07-22', 2, TRUE),
    ('Carmen', 'Díaz', '8889900', '77888990', '1993-09-06', 2, TRUE),
    ('Arturo', 'Guerrero', '9990011', '78889901', '1984-05-18', 2, FALSE),
    ('Teresa', 'Soto', '1010101', '79990012', '1997-02-28', 2, TRUE),

    -- Tipo B- (id_tipo_sangre = 4)
    ('Francisco', 'Ruiz', '2020202', '70202020', '1988-11-09', 4, TRUE),
    ('Claudia', 'Morales', '3030303', '71303030', '1992-04-14', 4, TRUE),
    ('Ricardo', 'Jiménez', '4040404', '72404040', '1985-08-26', 4, TRUE),
    ('Verónica', 'Peña', '5050505', '73505050', '1990-06-02', 4, FALSE),
    ('Eduardo', 'Cruz', '6060606', '74606060', '1983-01-30', 4, TRUE),

    -- Tipo AB- (id_tipo_sangre = 6)
    ('Alejandra', 'Vargas', '7070707', '75707070', '1991-10-17', 6, TRUE),
    ('Raúl', 'Sánchez', '8080808', '76808080', '1987-03-05', 6, TRUE),
    ('Mónica', 'Delgado', '9090909', '77909090', '1994-07-21', 6, TRUE),
    ('Óscar', 'Luna', '1010110', '78101010', '1986-12-13', 6, FALSE),
    ('Diana', 'Córdova', '2020220', '79202020', '1995-05-08', 6, TRUE)
ON CONFLICT (ci) DO NOTHING;

-- ============================================
-- VERIFICAR DATOS INSERTADOS
-- ============================================

-- Contar donantes por tipo de sangre
SELECT 
    ts.grupo || ts.factor_rh AS tipo_sangre,
    COUNT(d.id) AS total_donantes
FROM donante d
JOIN tipo_sangre ts ON d.id_tipo_sangre = ts.id
GROUP BY ts.grupo, ts.factor_rh
ORDER BY total_donantes DESC;

-- Total de donantes activos
SELECT COUNT(*) AS total_donantes_activos
FROM donante
WHERE activo = TRUE;

-- Total de donantes inactivos
SELECT COUNT(*) AS total_donantes_inactivos
FROM donante
WHERE activo = FALSE;
