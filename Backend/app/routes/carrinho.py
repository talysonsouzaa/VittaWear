# ============================================
#   VittaWear - Rotas do Carrinho
# ============================================
#
# O carrinho fica no localStorage do frontend.
# Esta rota serve para VALIDAR estoque e calcular
# o total com os preços reais do banco (segurança).
#
# POST /api/carrinho/validar
# Body: {
#   "itens": [
#     { "produto_id": 1, "tamanho": "M", "cor": "Preto", "quantidade": 2 }
#   ]
# }
# ============================================

from flask import Blueprint, jsonify, request
from config.database import query

carrinho_bp = Blueprint("carrinho", __name__, url_prefix="/api/carrinho")


@carrinho_bp.route("/validar", methods=["POST"])
def validar_carrinho():
    dados = request.get_json()
    itens = dados.get("itens", [])

    if not itens:
        return jsonify({"erro": "Carrinho vazio"}), 400

    resultado = []
    total = 0.0
    erros = []

    for item in itens:
        produto_id = item.get("produto_id")
        tamanho    = item.get("tamanho")
        cor        = item.get("cor")
        quantidade = int(item.get("quantidade", 1))

        # Busca produto com preço real do banco
        produto = query(
            "SELECT id, nome, preco FROM produtos WHERE id = %s",
            (produto_id,),
            fetch_one=True,
        )

        if not produto:
            erros.append(f"Produto ID {produto_id} não encontrado")
            continue

        # Verifica estoque da variante
        variante = query(
            """
            SELECT pv.estoque
            FROM produto_variantes pv
            JOIN tamanhos t ON pv.tamanho_id = t.id
            JOIN cores    c ON pv.cor_id     = c.id
            WHERE pv.produto_id = %s
              AND LOWER(t.nome) = LOWER(%s)
              AND LOWER(c.nome) = LOWER(%s)
            """,
            (produto_id, tamanho, cor),
            fetch_one=True,
        )

        estoque_disponivel = variante["estoque"] if variante else 0

        if estoque_disponivel < quantidade:
            erros.append(
                f"Estoque insuficiente para '{produto['nome']}' "
                f"({tamanho} / {cor}). Disponível: {estoque_disponivel}"
            )
            quantidade = estoque_disponivel  # ajusta para o máximo disponível

        subtotal = float(produto["preco"]) * quantidade
        total   += subtotal

        resultado.append({
            "produto_id":  produto_id,
            "nome":        produto["nome"],
            "preco":       float(produto["preco"]),
            "tamanho":     tamanho,
            "cor":         cor,
            "quantidade":  quantidade,
            "subtotal":    round(subtotal, 2),
        })

    resposta = {
        "itens":  resultado,
        "total":  round(total, 2),
        "frete_gratis": total >= 299,
    }

    if erros:
        resposta["avisos"] = erros

    return jsonify(resposta), 200
