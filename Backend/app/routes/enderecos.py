# ============================================
#   VittaWear - Rotas de Endereços
# ============================================

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import query, execute

enderecos_bp = Blueprint("enderecos", __name__, url_prefix="/api/enderecos")


# --------------------------------------------------
# GET /api/enderecos  (protegido)
# --------------------------------------------------
@enderecos_bp.route("", methods=["GET"])
@jwt_required()
def listar_enderecos():
    usuario_id = int(get_jwt_identity())
    enderecos = query(
        "SELECT id, rua, cidade, cep FROM enderecos WHERE usuario_id = %s",
        (usuario_id,),
    )
    return jsonify(enderecos), 200


# --------------------------------------------------
# POST /api/enderecos  (protegido)
# Body: { "rua": "...", "cidade": "...", "cep": "..." }
# --------------------------------------------------
@enderecos_bp.route("", methods=["POST"])
@jwt_required()
def adicionar_endereco():
    usuario_id = int(get_jwt_identity())
    dados = request.get_json()

    rua    = (dados.get("rua")    or "").strip()
    cidade = (dados.get("cidade") or "").strip()
    cep    = (dados.get("cep")    or "").strip()

    if not rua or not cidade or not cep:
        return jsonify({"erro": "Rua, cidade e CEP são obrigatórios"}), 400

    endereco_id = execute(
        "INSERT INTO enderecos (usuario_id, rua, cidade, cep) VALUES (%s, %s, %s, %s)",
        (usuario_id, rua, cidade, cep),
    )

    return jsonify({
        "mensagem": "Endereço adicionado",
        "endereco": {"id": endereco_id, "rua": rua, "cidade": cidade, "cep": cep},
    }), 201


# --------------------------------------------------
# DELETE /api/enderecos/<id>  (protegido)
# --------------------------------------------------
@enderecos_bp.route("/<int:endereco_id>", methods=["DELETE"])
@jwt_required()
def remover_endereco(endereco_id):
    usuario_id = int(get_jwt_identity())

    # Garante que o endereço pertence ao usuário logado
    endereco = query(
        "SELECT id FROM enderecos WHERE id = %s AND usuario_id = %s",
        (endereco_id, usuario_id),
        fetch_one=True,
    )

    if not endereco:
        return jsonify({"erro": "Endereço não encontrado"}), 404

    execute("DELETE FROM enderecos WHERE id = %s", (endereco_id,))
    return jsonify({"mensagem": "Endereço removido"}), 200
