# ============================================
#   VittaWear - Rotas de Autenticação
# ============================================

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from config.database import query, execute

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# --------------------------------------------------
# POST /api/auth/cadastro
# Body: { "nome": "...", "email": "...", "senha": "..." }
# --------------------------------------------------
@auth_bp.route("/cadastro", methods=["POST"])
def cadastro():
    dados = request.get_json()

    nome  = (dados.get("nome")  or "").strip()
    email = (dados.get("email") or "").strip().lower()
    senha = (dados.get("senha") or "").strip()

    # Validações básicas
    if not nome or not email or not senha:
        return jsonify({"erro": "Nome, e-mail e senha são obrigatórios"}), 400

    if len(senha) < 6:
        return jsonify({"erro": "A senha deve ter ao menos 6 caracteres"}), 400

    # Verifica se e-mail já existe
    existente = query("SELECT id FROM usuarios WHERE email = %s", (email,), fetch_one=True)
    if existente:
        return jsonify({"erro": "E-mail já cadastrado"}), 409

    # Hash da senha
    hash_senha = bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    usuario_id = execute(
        "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)",
        (nome, email, hash_senha),
    )

    token = create_access_token(identity=str(usuario_id))

    return jsonify({
        "mensagem": "Cadastro realizado com sucesso",
        "token": token,
        "usuario": {"id": usuario_id, "nome": nome, "email": email},
    }), 201


# --------------------------------------------------
# POST /api/auth/login
# Body: { "email": "...", "senha": "..." }
# --------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    dados = request.get_json()

    email = (dados.get("email") or "").strip().lower()
    senha = (dados.get("senha") or "").strip()

    if not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios"}), 400

    usuario = query(
        "SELECT id, nome, email, senha FROM usuarios WHERE email = %s",
        (email,),
        fetch_one=True,
    )

    if not usuario or not bcrypt.checkpw(senha.encode("utf-8"), usuario["senha"].encode("utf-8")):
        return jsonify({"erro": "E-mail ou senha incorretos"}), 401

    token = create_access_token(identity=str(usuario["id"]))

    return jsonify({
        "mensagem": "Login realizado com sucesso",
        "token": token,
        "usuario": {
            "id":    usuario["id"],
            "nome":  usuario["nome"],
            "email": usuario["email"],
        },
    }), 200


# --------------------------------------------------
# GET /api/auth/perfil  (rota protegida)
# Header: Authorization: Bearer <token>
# --------------------------------------------------
@auth_bp.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    usuario_id = int(get_jwt_identity())

    usuario = query(
        "SELECT id, nome, email FROM usuarios WHERE id = %s",
        (usuario_id,),
        fetch_one=True,
    )

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    enderecos = query(
        "SELECT id, rua, cidade, cep FROM enderecos WHERE usuario_id = %s",
        (usuario_id,),
    )

    usuario["enderecos"] = enderecos
    return jsonify(usuario), 200
