-- =============================================================================
-- RePlay Games — Base de datos relacional (EP2)
--
-- Compatible con MySQL 8.0+ y MariaDB 10.4+ (incluida la versión de XAMPP).
-- El script es reproducible: elimina y vuelve a crear la base completa con sus
-- datos de ejemplo cada vez que se ejecuta.
--
--   mysql -u root -p < database/replay_games.sql
--
-- Cuentas de ejemplo (contraseña de todas: replay123):
--   usuario@replay.cl  -> rol usuario
--   admin@replay.cl    -> rol administrador
-- =============================================================================

-- Fuerza UTF-8 en la conexión para que las tildes y la ñ se guarden correctamente
-- aunque el cliente (consola, Workbench, phpMyAdmin) use otra codificación por defecto.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP DATABASE IF EXISTS replay_games;
CREATE DATABASE replay_games CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE replay_games;

-- -----------------------------------------------------------------------------
-- Catálogos
-- -----------------------------------------------------------------------------

-- Roles del sistema (README, sección "Roles del Sistema"). El rol determina qué
-- rutas y acciones permite la API (FT-04, RNF-SEG-02).
CREATE TABLE roles (
  id INT UNSIGNED NOT NULL,
  nombre VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE regiones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(60) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_regiones_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE comunas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  region_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(60) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_comunas_region_nombre (region_id, nombre),
  CONSTRAINT fk_comunas_region FOREIGN KEY (region_id) REFERENCES regiones (id)
) ENGINE=InnoDB;

CREATE TABLE consolas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_consolas_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE generos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_generos_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE modalidades_entrega (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_modalidades_nombre (nombre)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Usuarios (FT-01, FT-02). La contraseña se guarda solo como hash bcrypt.
-- -----------------------------------------------------------------------------
CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_usuario VARCHAR(30) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  clave_hash CHAR(60) NOT NULL,
  rol_id INT UNSIGNED NOT NULL DEFAULT 1,
  region_id INT UNSIGNED NULL,
  comuna_id INT UNSIGNED NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  reputacion DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  total_calificaciones INT UNSIGNED NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo),
  UNIQUE KEY uq_usuarios_nombre (nombre_usuario),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles (id),
  CONSTRAINT fk_usuarios_region FOREIGN KEY (region_id) REFERENCES regiones (id),
  CONSTRAINT fk_usuarios_comuna FOREIGN KEY (comuna_id) REFERENCES comunas (id),
  CONSTRAINT ck_usuarios_reputacion CHECK (reputacion BETWEEN 0 AND 5)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Publicaciones (RF-01 a RF-04). "oculta" la usa la moderación del administrador.
-- -----------------------------------------------------------------------------
CREATE TABLE publicaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendedor_id INT UNSIGNED NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  consola_id INT UNSIGNED NOT NULL,
  genero_id INT UNSIGNED NOT NULL,
  precio INT UNSIGNED NOT NULL,
  estado_conservacion ENUM('Nuevo / sellado', 'Como nuevo', 'Bueno', 'Aceptable', 'Con detalles') NOT NULL,
  estado_publicacion ENUM('activa', 'pausada', 'vendida') NOT NULL DEFAULT 'activa',
  oculta TINYINT(1) NOT NULL DEFAULT 0,
  descripcion VARCHAR(400) NOT NULL,
  comuna_id INT UNSIGNED NOT NULL,
  incluye_caja TINYINT(1) NOT NULL DEFAULT 0,
  incluye_manual TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_publicaciones_catalogo (estado_publicacion, oculta, creado_en),
  CONSTRAINT fk_publicaciones_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_publicaciones_consola FOREIGN KEY (consola_id) REFERENCES consolas (id),
  CONSTRAINT fk_publicaciones_genero FOREIGN KEY (genero_id) REFERENCES generos (id),
  CONSTRAINT fk_publicaciones_comuna FOREIGN KEY (comuna_id) REFERENCES comunas (id),
  CONSTRAINT ck_publicaciones_precio CHECK (precio BETWEEN 1 AND 500000),
  CONSTRAINT ck_publicaciones_titulo CHECK (CHAR_LENGTH(titulo) >= 3),
  CONSTRAINT ck_publicaciones_descripcion CHECK (CHAR_LENGTH(descripcion) >= 20)
) ENGINE=InnoDB;

-- Modalidades de entrega que ofrece cada publicación (relación muchos a muchos, RF-06).
CREATE TABLE publicacion_entregas (
  publicacion_id INT UNSIGNED NOT NULL,
  modalidad_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (publicacion_id, modalidad_id),
  CONSTRAINT fk_entregas_publicacion FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
  CONSTRAINT fk_entregas_modalidad FOREIGN KEY (modalidad_id) REFERENCES modalidades_entrega (id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Operaciones de compra y venta (RF-06, RF-07). El vendedor se guarda para
-- conservar el historial aunque la publicación cambie.
-- -----------------------------------------------------------------------------
CREATE TABLE operaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  publicacion_id INT UNSIGNED NOT NULL,
  comprador_id INT UNSIGNED NOT NULL,
  vendedor_id INT UNSIGNED NOT NULL,
  modalidad_id INT UNSIGNED NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  calificada TINYINT(1) NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_operaciones_comprador (comprador_id),
  KEY idx_operaciones_vendedor (vendedor_id),
  CONSTRAINT fk_operaciones_publicacion FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id),
  CONSTRAINT fk_operaciones_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios (id),
  CONSTRAINT fk_operaciones_vendedor FOREIGN KEY (vendedor_id) REFERENCES usuarios (id),
  CONSTRAINT fk_operaciones_modalidad FOREIGN KEY (modalidad_id) REFERENCES modalidades_entrega (id),
  CONSTRAINT ck_operaciones_partes CHECK (comprador_id <> vendedor_id)
) ENGINE=InnoDB;

-- =============================================================================
-- Datos de ejemplo (los mismos que usaba el frontend de EP1)
-- =============================================================================

INSERT INTO roles (id, nombre) VALUES (1, 'usuario'), (2, 'administrador');

INSERT INTO regiones (nombre) VALUES ('Valparaíso'), ('Metropolitana'), ('Biobío');

INSERT INTO comunas (region_id, nombre)
  SELECT id, 'Valparaíso' FROM regiones WHERE nombre = 'Valparaíso' UNION ALL
  SELECT id, 'Viña del Mar' FROM regiones WHERE nombre = 'Valparaíso' UNION ALL
  SELECT id, 'Quilpué' FROM regiones WHERE nombre = 'Valparaíso' UNION ALL
  SELECT id, 'Villa Alemana' FROM regiones WHERE nombre = 'Valparaíso' UNION ALL
  SELECT id, 'Concón' FROM regiones WHERE nombre = 'Valparaíso' UNION ALL
  SELECT id, 'Santiago' FROM regiones WHERE nombre = 'Metropolitana' UNION ALL
  SELECT id, 'Providencia' FROM regiones WHERE nombre = 'Metropolitana' UNION ALL
  SELECT id, 'Ñuñoa' FROM regiones WHERE nombre = 'Metropolitana' UNION ALL
  SELECT id, 'Maipú' FROM regiones WHERE nombre = 'Metropolitana' UNION ALL
  SELECT id, 'La Florida' FROM regiones WHERE nombre = 'Metropolitana' UNION ALL
  SELECT id, 'Concepción' FROM regiones WHERE nombre = 'Biobío' UNION ALL
  SELECT id, 'Talcahuano' FROM regiones WHERE nombre = 'Biobío' UNION ALL
  SELECT id, 'San Pedro de la Paz' FROM regiones WHERE nombre = 'Biobío';

INSERT INTO consolas (nombre) VALUES
  ('PlayStation 5'), ('PlayStation 4'), ('Nintendo Switch'), ('Xbox Series X|S'), ('Xbox One'), ('Nintendo 3DS');

INSERT INTO generos (nombre) VALUES
  ('Acción / Aventura'), ('RPG'), ('Deportes'), ('Carreras'), ('Plataformas'), ('Estrategia'), ('Terror');

INSERT INTO modalidades_entrega (nombre) VALUES
  ('Retiro en persona'), ('Punto de encuentro'), ('Envío por pagar');

-- Hash bcrypt (10 rondas) de la contraseña de demostración "replay123".
SET @clave_demo = '$2b$10$sJnBPnLdAPUXgftHL6XNoeIeqr1fcVY2nleJlIER8Zsn8c4Ii71pu';

INSERT INTO usuarios (id, nombre_usuario, correo, clave_hash, rol_id, region_id, comuna_id, reputacion, total_calificaciones, creado_en) VALUES
  (1, 'sebastian_r', 'usuario@replay.cl', @clave_demo, 1,
   (SELECT id FROM regiones WHERE nombre = 'Valparaíso'),
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Valparaíso'),
   4.8, 12, '2026-03-14 10:00:00'),
  (2, 'camila_v', 'camila@replay.cl', @clave_demo, 1,
   (SELECT id FROM regiones WHERE nombre = 'Valparaíso'),
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Viña del Mar'),
   4.6, 27, '2025-11-02 10:00:00'),
  (3, 'diego_games', 'diego@replay.cl', @clave_demo, 1,
   (SELECT id FROM regiones WHERE nombre = 'Metropolitana'),
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'Ñuñoa'),
   4.2, 8, '2026-01-20 10:00:00'),
  (4, 'fernanda_m', 'fernanda@replay.cl', @clave_demo, 1,
   (SELECT id FROM regiones WHERE nombre = 'Biobío'),
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Biobío' AND c.nombre = 'Concepción'),
   5.0, 5, '2026-05-08 10:00:00'),
  (5, 'daniel_admin', 'admin@replay.cl', @clave_demo, 2,
   (SELECT id FROM regiones WHERE nombre = 'Metropolitana'),
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'Santiago'),
   0.0, 0, '2025-09-01 10:00:00');

INSERT INTO publicaciones (id, vendedor_id, titulo, consola_id, genero_id, precio, estado_conservacion, estado_publicacion, descripcion, comuna_id, incluye_caja, incluye_manual, creado_en) VALUES
  (1, 2, 'The Last of Us Part II',
   (SELECT id FROM consolas WHERE nombre = 'PlayStation 4'),
   (SELECT id FROM generos WHERE nombre = 'Acción / Aventura'),
   18990, 'Como nuevo', 'activa',
   'Disco sin rayas, se jugó una sola vez. Incluye caja original y manual. Se puede revisar antes de comprar.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Viña del Mar'),
   1, 1, '2026-09-10 12:00:00'),
  (2, 3, 'The Legend of Zelda: Tears of the Kingdom',
   (SELECT id FROM consolas WHERE nombre = 'Nintendo Switch'),
   (SELECT id FROM generos WHERE nombre = 'Acción / Aventura'),
   42990, 'Bueno', 'activa',
   'Cartucho funcionando perfecto, caja con una marca menor en la contraportada. Guardado sin uso desde el año pasado.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'Ñuñoa'),
   1, 0, '2026-09-12 12:00:00'),
  (3, 4, 'Elden Ring',
   (SELECT id FROM consolas WHERE nombre = 'PlayStation 5'),
   (SELECT id FROM generos WHERE nombre = 'RPG'),
   29990, 'Como nuevo', 'activa',
   'Terminado una vez y guardado. Disco impecable, sin marcas. Entrego en el centro de Concepción o por envío.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Biobío' AND c.nombre = 'Concepción'),
   1, 1, '2026-09-08 12:00:00'),
  (4, 2, 'EA Sports FC 25',
   (SELECT id FROM consolas WHERE nombre = 'PlayStation 5'),
   (SELECT id FROM generos WHERE nombre = 'Deportes'),
   24990, 'Bueno', 'activa',
   'Vendo porque ya salió la edición nueva. Disco con micro rayas superficiales que no afectan la lectura.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Quilpué'),
   1, 0, '2026-09-14 12:00:00'),
  (5, 1, 'Super Mario Odyssey',
   (SELECT id FROM consolas WHERE nombre = 'Nintendo Switch'),
   (SELECT id FROM generos WHERE nombre = 'Plataformas'),
   32990, 'Nuevo / sellado', 'activa',
   'Copia sellada, regalo repetido. Nunca abierta. Solo entrega en persona para que puedas revisarla.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Valparaíso'),
   1, 1, '2026-09-15 12:00:00'),
  (6, 3, 'Forza Horizon 5',
   (SELECT id FROM consolas WHERE nombre = 'Xbox Series X|S'),
   (SELECT id FROM generos WHERE nombre = 'Carreras'),
   21990, 'Bueno', 'activa',
   'Muy entretenido, lo dejo porque cambié de consola. Caja completa, disco en buen estado general.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'Maipú'),
   1, 0, '2026-09-05 12:00:00'),
  (7, 3, 'Resident Evil 4 Remake',
   (SELECT id FROM consolas WHERE nombre = 'PlayStation 5'),
   (SELECT id FROM generos WHERE nombre = 'Terror'),
   27990, 'Como nuevo', 'activa',
   'Jugado una vez, sin detalles. Incluye caja y manual. Disponible para revisar en punto de encuentro.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'Providencia'),
   1, 1, '2026-09-11 12:00:00'),
  (8, 2, 'Mario Kart 8 Deluxe',
   (SELECT id FROM consolas WHERE nombre = 'Nintendo Switch'),
   (SELECT id FROM generos WHERE nombre = 'Carreras'),
   36990, 'Bueno', 'pausada',
   'Pausada temporalmente mientras confirmo una entrega pendiente. Cartucho probado y funcionando.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Villa Alemana'),
   1, 0, '2026-08-29 12:00:00'),
  (9, 4, 'Red Dead Redemption 2',
   (SELECT id FROM consolas WHERE nombre = 'Xbox One'),
   (SELECT id FROM generos WHERE nombre = 'Acción / Aventura'),
   15990, 'Aceptable', 'vendida',
   'Disco con rayas visibles pero carga sin problemas. Caja con desgaste en los bordes. Precio acorde al estado.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Biobío' AND c.nombre = 'Talcahuano'),
   1, 0, '2026-09-02 12:00:00'),
  (10, 1, 'Animal Crossing: New Horizons',
   (SELECT id FROM consolas WHERE nombre = 'Nintendo Switch'),
   (SELECT id FROM generos WHERE nombre = 'Estrategia'),
   34990, 'Como nuevo', 'vendida',
   'Vendido a través de la plataforma. Se mantiene publicado como referencia del historial de ventas.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Valparaíso'),
   1, 1, '2026-08-21 12:00:00'),
  (11, 3, 'Pokémon Ultra Sun',
   (SELECT id FROM consolas WHERE nombre = 'Nintendo 3DS'),
   (SELECT id FROM generos WHERE nombre = 'RPG'),
   22990, 'Con detalles', 'activa',
   'Cartucho original con la etiqueta despegada en una esquina. Funciona perfecto, partida guardada borrada.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Metropolitana' AND c.nombre = 'La Florida'),
   0, 0, '2026-08-30 12:00:00'),
  (12, 4, 'God of War Ragnarök',
   (SELECT id FROM consolas WHERE nombre = 'PlayStation 4'),
   (SELECT id FROM generos WHERE nombre = 'Acción / Aventura'),
   19990, 'Bueno', 'activa',
   'Incluye caja original. Disco en buen estado, se probó antes de publicar. Entrega en Concón o Viña del Mar.',
   (SELECT c.id FROM comunas c JOIN regiones r ON r.id = c.region_id WHERE r.nombre = 'Valparaíso' AND c.nombre = 'Concón'),
   1, 0, '2026-09-13 12:00:00');

INSERT INTO publicacion_entregas (publicacion_id, modalidad_id)
  SELECT 1, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 1, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'
  UNION ALL
  SELECT 2, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 2, id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'
  UNION ALL
  SELECT 3, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'
  UNION ALL
  SELECT 3, id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'
  UNION ALL
  SELECT 4, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 5, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 5, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'
  UNION ALL
  SELECT 6, id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'
  UNION ALL
  SELECT 6, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'
  UNION ALL
  SELECT 7, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'
  UNION ALL
  SELECT 8, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 9, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 9, id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'
  UNION ALL
  SELECT 10, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 11, id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'
  UNION ALL
  SELECT 12, id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'
  UNION ALL
  SELECT 12, id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro';

INSERT INTO operaciones (id, publicacion_id, comprador_id, vendedor_id, modalidad_id, estado, calificada, creado_en) VALUES
  (1, 2, 1, 3, (SELECT id FROM modalidades_entrega WHERE nombre = 'Envío por pagar'), 'pendiente', 0, '2026-09-15 18:00:00'),
  (2, 3, 1, 4, (SELECT id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'), 'confirmada', 0, '2026-09-11 18:00:00'),
  (3, 9, 1, 4, (SELECT id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'), 'completada', 0, '2026-09-03 18:00:00'),
  (4, 10, 2, 1, (SELECT id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'), 'completada', 1, '2026-08-23 18:00:00'),
  (5, 5, 3, 1, (SELECT id FROM modalidades_entrega WHERE nombre = 'Punto de encuentro'), 'pendiente', 0, '2026-09-16 18:00:00'),
  (6, 8, 4, 1, (SELECT id FROM modalidades_entrega WHERE nombre = 'Retiro en persona'), 'cancelada', 0, '2026-08-27 18:00:00');
