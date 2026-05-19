# ============================================
#   VittaWear - Rotas de Produtos
# ============================================

from flask import Blueprint, jsonify, request
from config.database import query

produtos_bp = Blueprint("produtos", __name__, url_prefix="/api/produtos")


# --------------------------------------------------
# GET /api/produtos
# Parâmetros opcionais: categoria, preco_min, preco_max, tamanho, ordenacao
# --------------------------------------------------
@produtos_bp.route("", methods=["GET"])
def listar_produtos():
    categoria  = request.args.get("categoria")
    preco_min  = request.args.get("preco_min",  type=float)
    preco_max  = request.args.get("preco_max",  type=float)
    tamanho    = request.args.get("tamanho")
    ordenacao  = request.args.get("ordenacao", "relevancia")

    sql = """
        SELECT
            p.id,
            p.nome,
            p.descricao,
            p.preco,
            p.preco_original,
            p.imagem,
            p.destaque,
            c.nome AS categoria
        FROM produtos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE 1=1
    """
    params = []

    if categoria and categoria != "todos":
        sql += " AND LOWER(c.nome) = LOWER(%s)"
        params.append(categoria)

    if preco_min is not None:
        sql += " AND p.preco >= %s"
        params.append(preco_min)

    if preco_max is not None:
        sql += " AND p.preco <= %s"
        params.append(preco_max)

    # Filtro por tamanho (via variantes)
    if tamanho:
        sql += """
            AND p.id IN (
                SELECT pv.produto_id
                FROM produto_variantes pv
                JOIN tamanhos t ON pv.tamanho_id = t.id
                WHERE LOWER(t.nome) = LOWER(%s) AND pv.estoque > 0
            )
        """
        params.append(tamanho)

    # Ordenação
    ordens = {
        "menor-preco":  "p.preco ASC",
        "maior-preco":  "p.preco DESC",
        "nome":         "p.nome ASC",
        "relevancia":   "p.destaque DESC, p.id ASC",
    }
    sql += f" ORDER BY {ordens.get(ordenacao, 'p.destaque DESC, p.id ASC')}"

    produtos = query(sql, tuple(params))

    # Enriquece cada produto com tamanhos e cores disponíveis
    for p in produtos:
        p["tamanhos"] = _tamanhos_do_produto(p["id"])
        p["cores"]    = _cores_do_produto(p["id"])

    return jsonify(produtos), 200


# --------------------------------------------------
# GET /api/produtos/destaque
# --------------------------------------------------
@produtos_bp.route("/destaque", methods=["GET"])
def produtos_destaque():
    sql = """
        SELECT
            p.id,
            p.nome,
            p.descricao,
            p.preco,
            p.preco_original,
            p.imagem,
            p.destaque,
            c.nome AS categoria
        FROM produtos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE p.destaque = 1
        ORDER BY p.id ASC
    """
    produtos = query(sql)

    for p in produtos:
        p["tamanhos"] = _tamanhos_do_produto(p["id"])
        p["cores"]    = _cores_do_produto(p["id"])

    return jsonify(produtos), 200


# --------------------------------------------------
# GET /api/produtos/<id>
# --------------------------------------------------
@produtos_bp.route("/<int:produto_id>", methods=["GET"])
def detalhe_produto(produto_id):
    sql = """
        SELECT
            p.id,
            p.nome,
            p.descricao,
            p.preco,
            p.preco_original,
            p.imagem,
            p.destaque,
            c.nome AS categoria
        FROM produtos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = %s
    """
    produto = query(sql, (produto_id,), fetch_one=True)

    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    produto["tamanhos"] = _tamanhos_do_produto(produto_id)
    produto["cores"]    = _cores_do_produto(produto_id)
    produto["variantes"] = _variantes_do_produto(produto_id)
    produto["imagens"]   = _imagens_do_produto(produto_id)

    return jsonify(produto), 200


# --------------------------------------------------
# GET /api/produtos/<id>/estoque?tamanho=M&cor=Preto
# --------------------------------------------------
@produtos_bp.route("/<int:produto_id>/estoque", methods=["GET"])
def estoque_variante(produto_id):
    tamanho = request.args.get("tamanho")
    cor     = request.args.get("cor")

    if not tamanho or not cor:
        return jsonify({"erro": "Informe tamanho e cor"}), 400

    sql = """
        SELECT pv.estoque
        FROM produto_variantes pv
        JOIN tamanhos t ON pv.tamanho_id = t.id
        JOIN cores c    ON pv.cor_id     = c.id
        WHERE pv.produto_id = %s
          AND LOWER(t.nome) = LOWER(%s)
          AND LOWER(c.nome) = LOWER(%s)
    """
    resultado = query(sql, (produto_id, tamanho, cor), fetch_one=True)
    estoque = resultado["estoque"] if resultado else 0

    return jsonify({"produto_id": produto_id, "tamanho": tamanho, "cor": cor, "estoque": estoque}), 200


# --------------------------------------------------
# GET /api/produtos/categorias
# --------------------------------------------------
@produtos_bp.route("/categorias", methods=["GET"])
def listar_categorias():
    categorias = query("SELECT id, nome FROM categorias ORDER BY nome")
    return jsonify(categorias), 200


# --------------------------------------------------
# Helpers privados
# --------------------------------------------------
def _tamanhos_do_produto(produto_id: int):
    sql = """
        SELECT DISTINCT t.id, t.nome
        FROM produto_variantes pv
        JOIN tamanhos t ON pv.tamanho_id = t.id
        WHERE pv.produto_id = %s AND pv.estoque > 0
        ORDER BY t.id
    """
    rows = query(sql, (produto_id,))
    return [r["nome"] for r in rows]


def _cores_do_produto(produto_id: int):
    sql = """
        SELECT DISTINCT c.id, c.nome
        FROM produto_variantes pv
        JOIN cores c ON pv.cor_id = c.id
        WHERE pv.produto_id = %s AND pv.estoque > 0
        ORDER BY c.id
    """
    rows = query(sql, (produto_id,))
    return [r["nome"] for r in rows]
   


def _variantes_do_produto(produto_id: int):
    sql = """
        SELECT
            pv.id,
            t.nome AS tamanho,
            c.nome AS cor,
            pv.estoque
        FROM produto_variantes pv
        JOIN tamanhos t ON pv.tamanho_id = t.id
        JOIN cores    c ON pv.cor_id     = c.id
        WHERE pv.produto_id = %s
        ORDER BY t.id, c.id
    """
    return query(sql, (produto_id,))

def _imagens_do_produto(produto_id: int):
    sql = """
        SELECT caminho
        FROM produto_imagens
        WHERE produto_id = %s
        ORDER BY ordem ASC
    """
    rows = query(sql, (produto_id,))
    return [r["caminho"] for r in rows]