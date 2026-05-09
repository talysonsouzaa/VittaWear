# VittaWear — Backend Python/Flask

API REST completa para o site VittaWear, integrada ao banco MySQL existente.

---

## 🗂️ Estrutura de Arquivos

```
vittawear-backend/
├── app.py                        ← Ponto de entrada da aplicação
├── requirements.txt              ← Dependências Python
├── .env.example                  ← Modelo de variáveis de ambiente
│
├── config/
│   └── database.py               ← Conexão com MySQL (pool de conexões)
│
└── app/
    └── routes/
        ├── produtos.py           ← CRUD de produtos, categorias, estoque
        ├── auth.py               ← Cadastro e login (JWT)
        ├── carrinho.py           ← Validação do carrinho com preços reais
        ├── enderecos.py          ← Endereços do usuário logado
        └── newsletter.py         ← Cadastro de e-mails na newsletter
```

---

## ⚙️ Instalação e Execução

### 1. Pré-requisitos
- Python 3.10+
- MySQL rodando com o banco `vittawear` criado (use o `vittawear_banco.sql`)

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com seus dados reais:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET_KEY
```

### 4. Rodar o servidor
```bash
python app.py
```
O servidor sobe em `http://localhost:5000`

---

## 📡 Endpoints da API

### 🟢 Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Lista todos os produtos |
| GET | `/api/produtos?categoria=scrubs` | Filtra por categoria |
| GET | `/api/produtos?preco_min=100&preco_max=200` | Filtra por faixa de preço |
| GET | `/api/produtos?tamanho=M` | Filtra por tamanho (com estoque) |
| GET | `/api/produtos?ordenacao=menor-preco` | Ordena (menor-preco, maior-preco, nome) |
| GET | `/api/produtos/destaque` | Apenas produtos em destaque |
| GET | `/api/produtos/categorias` | Lista todas as categorias |
| GET | `/api/produtos/<id>` | Detalhes de um produto |
| GET | `/api/produtos/<id>/estoque?tamanho=M&cor=Preto` | Estoque de uma variante |

### 🔐 Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/cadastro` | Cria novo usuário |
| POST | `/api/auth/login` | Login, retorna token JWT |
| GET | `/api/auth/perfil` | Perfil do usuário logado *(requer token)* |

**Exemplo de cadastro:**
```json
POST /api/auth/cadastro
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "minhasenha123"
}
```

**Exemplo de login:**
```json
POST /api/auth/login
{
  "email": "maria@email.com",
  "senha": "minhasenha123"
}
```
Retorna:
```json
{
  "token": "eyJhbG...",
  "usuario": { "id": 1, "nome": "Maria Silva", "email": "maria@email.com" }
}
```

**Como usar o token nas rotas protegidas:**
```
Authorization: Bearer eyJhbG...
```

### 🛒 Carrinho

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/carrinho/validar` | Valida itens e retorna preços reais do banco |

**Exemplo:**
```json
POST /api/carrinho/validar
{
  "itens": [
    { "produto_id": 1, "tamanho": "M", "cor": "Preto", "quantidade": 2 }
  ]
}
```
Retorna total real, verifica estoque e avisa se algo estiver indisponível.

### 🏠 Endereços *(requer token)*

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/enderecos` | Lista endereços do usuário |
| POST | `/api/enderecos` | Adiciona novo endereço |
| DELETE | `/api/enderecos/<id>` | Remove endereço |

### 📧 Newsletter

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/newsletter` | Cadastra e-mail na newsletter |

---

## 🔗 Como conectar ao frontend

No seu JavaScript, substitua as funções `simularApiProdutos()` por chamadas reais à API. Exemplo:

```javascript
// Antes (simulado):
async function simularApiProdutos() { ... }

// Depois (real):
async function carregarProdutosDinamicos() {
    const response = await fetch('http://localhost:5000/api/produtos');
    const produtos = await response.json();
    // ... renderiza normalmente
}
```

**Para login:**
```javascript
async function login(email, senha) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    const dados = await response.json();
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
}
```

**Para rotas protegidas:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/auth/perfil', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🚀 Deploy em Produção

1. Troque `FLASK_DEBUG=False` no `.env`
2. No `app.py`, substitua `origins="*"` pelo domínio real do site
3. Use **Gunicorn** para servir a aplicação:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
   ```
4. Configure Nginx como proxy reverso na frente do Gunicorn

---

## 🛡️ Segurança

- Senhas armazenadas com **bcrypt** (hash seguro, nunca texto puro)
- Autenticação via **JWT** (token no header)
- Pool de conexões MySQL (sem SQL injection via parâmetros preparados)
- CORS configurado (controle de quais domínios acessam a API)
