-- ============================================
--   VittaWear - Banco de Dados Relacional
--   Criação das Tabelas
-- ============================================

-- Usar/criar banco de dados
CREATE DATABASE IF NOT EXISTS vittawear
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vittawear;

-- ============================================
--   CATEGORIAS
-- ============================================
CREATE TABLE categorias (
  id   INT          NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- ============================================
--   PRODUTOS
-- ============================================
CREATE TABLE produtos (
  id             INT            NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(150)   NOT NULL,
  descricao      TEXT,
  preco          DECIMAL(10, 2) NOT NULL,
  preco_original DECIMAL(10, 2),
  imagem         VARCHAR(255),
  destaque       TINYINT(1)     NOT NULL DEFAULT 0,
  categoria_id   INT            NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_produtos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- ============================================
--   TAMANHOS
-- ============================================
CREATE TABLE tamanhos (
  id   INT         NOT NULL AUTO_INCREMENT,
  nome VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);

-- ============================================
--   CORES
-- ============================================
CREATE TABLE cores (
  id   INT         NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- ============================================
--   PRODUTO_VARIANTES
-- ============================================
CREATE TABLE produto_variantes (
  id          INT NOT NULL AUTO_INCREMENT,
  produto_id  INT NOT NULL,
  tamanho_id  INT NOT NULL,
  cor_id      INT NOT NULL,
  estoque     INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_variantes_produto
    FOREIGN KEY (produto_id) REFERENCES produtos (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_variantes_tamanho
    FOREIGN KEY (tamanho_id) REFERENCES tamanhos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_variantes_cor
    FOREIGN KEY (cor_id) REFERENCES cores (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- ============================================
--   USUARIOS
-- ============================================
CREATE TABLE usuarios (
  id    INT          NOT NULL AUTO_INCREMENT,
  nome  VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,         -- armazene sempre o hash (bcrypt, etc.)
  PRIMARY KEY (id)
);

-- ============================================
--   ENDERECOS
-- ============================================
CREATE TABLE enderecos (
  id         INT          NOT NULL AUTO_INCREMENT,
  usuario_id INT          NOT NULL,
  rua        VARCHAR(200) NOT NULL,
  cidade     VARCHAR(100) NOT NULL,
  cep        VARCHAR(10)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_enderecos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);


-- ============================================
--   COMO INSERIR DADOS (exemplos comentados)
-- ============================================

-- >> CATEGORIAS
-- INSERT INTO categorias (nome) VALUES ('Camisetas');
-- INSERT INTO categorias (nome) VALUES ('Calças');
-- INSERT INTO categorias (nome) VALUES ('Acessórios');

-- >> TAMANHOS
-- INSERT INTO tamanhos (nome) VALUES ('PP');
-- INSERT INTO tamanhos (nome) VALUES ('P');
-- INSERT INTO tamanhos (nome) VALUES ('M');
-- INSERT INTO tamanhos (nome) VALUES ('G');
-- INSERT INTO tamanhos (nome) VALUES ('GG');

-- >> CORES
-- INSERT INTO cores (nome) VALUES ('Preto');
-- INSERT INTO cores (nome) VALUES ('Branco');
-- INSERT INTO cores (nome) VALUES ('Verde');

-- >> PRODUTOS
-- INSERT INTO produtos (nome, descricao, preco, preco_original, imagem, destaque, categoria_id)
-- VALUES ('Nome do Produto', 'Descrição aqui', 99.90, 129.90, 'imagens/produto.jpg', 1, 1);

-- >> PRODUTO_VARIANTES  (produto_id, tamanho_id, cor_id que já existem nas tabelas acima)
-- INSERT INTO produto_variantes (produto_id, tamanho_id, cor_id, estoque)
-- VALUES (1, 3, 1, 50);

-- >> USUARIOS  (NUNCA salve a senha em texto puro — use hash no backend)
-- INSERT INTO usuarios (nome, email, senha)
-- VALUES ('Maria Silva', 'maria@email.com', '$2b$10$hashGeradoPeloBcrypt');

-- >> ENDERECOS
-- INSERT INTO enderecos (usuario_id, rua, cidade, cep)
-- VALUES (1, 'Rua das Flores, 123', 'Belo Horizonte', '30140-110');

use vittawear;
SELECT * FROM usuarios;