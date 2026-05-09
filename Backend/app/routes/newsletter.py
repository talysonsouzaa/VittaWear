# ============================================
#   VittaWear - Rota de Newsletter
# ============================================
#
# Cria a tabela newsletter se não existir e
# salva os e-mails cadastrados.
# ============================================

from flask import Blueprint, jsonify, request
from config.database import query, execute

newsletter_bp = Blueprint("newsletter", __name__, url_prefix="/api/newsletter")

# Garante que a tabela existe (roda uma vez na inicialização)
def criar_tabela_newsletter():
    from config.database import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS newsletter (
            id         INT          NOT NULL AUTO_INCREMENT,
            email      VARCHAR(150) NOT NULL UNIQUE,
            criado_em  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    """)
    conn.commit()
    cursor.close()
    conn.close()


# --------------------------------------------------
# POST /api/newsletter
# Body: { "email": "..." }
# --------------------------------------------------
@newsletter_bp.route("", methods=["POST"])
def cadastrar():
    dados = request.get_json()
    email = (dados.get("email") or "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"erro": "E-mail inválido"}), 400

    existente = query("SELECT id FROM newsletter WHERE email = %s", (email,), fetch_one=True)
    if existente:
        return jsonify({"mensagem": "E-mail já cadastrado na newsletter"}), 200

    execute("INSERT INTO newsletter (email) VALUES (%s)", (email,))
    return jsonify({"mensagem": "E-mail cadastrado com sucesso! Você receberá nossas novidades."}), 201
