# ============================================
#   VittaWear - Aplicação Flask Principal
# ============================================

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)

    # ── Configurações ──────────────────────────────
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-troque-em-producao")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False  # Token não expira (ajuste se quiser, ex: timedelta(days=7))

    # ── Extensões ──────────────────────────────────
    CORS(app, origins="*", supports_credentials=True)  # Em produção, substitua "*" pelo domínio do site
    JWTManager(app)

    # ── Registra Blueprints (rotas) ─────────────────
    from app.routes.produtos   import produtos_bp
    from app.routes.auth       import auth_bp
    from app.routes.carrinho   import carrinho_bp
    from app.routes.enderecos  import enderecos_bp
    from app.routes.newsletter import newsletter_bp, criar_tabela_newsletter

    app.register_blueprint(produtos_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(carrinho_bp)
    app.register_blueprint(enderecos_bp)
    app.register_blueprint(newsletter_bp)

    # Cria tabela de newsletter se não existir
    with app.app_context():
        try:
            criar_tabela_newsletter()
        except Exception as e:
            print(f"[AVISO] Não foi possível criar tabela newsletter: {e}")

    # ── Rota de health check ────────────────────────
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "app": "VittaWear API"}), 200

    # ── Erros globais ───────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"erro": "Rota não encontrada"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"erro": "Erro interno no servidor"}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=os.getenv("FLASK_DEBUG", "True") == "True",
    )
