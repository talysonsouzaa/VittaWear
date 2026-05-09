# ============================================
#   VittaWear - Configuração do Banco de Dados
# ============================================

import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

# Pool de conexões (evita abrir/fechar conexão a cada request)
_pool = None

def get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="vittawear_pool",
            pool_size=5,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            database=os.getenv("DB_NAME", "vittawear"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            charset="utf8mb4",
            collation="utf8mb4_unicode_ci",
        )
    return _pool


def get_connection():
    """Retorna uma conexão do pool."""
    return get_pool().get_connection()


def query(sql: str, params: tuple = (), fetch_one: bool = False):
    """
    Executa SELECT e retorna lista de dicts (ou um único dict com fetch_one=True).
    """
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        result = cursor.fetchone() if fetch_one else cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()


def execute(sql: str, params: tuple = ()):
    """
    Executa INSERT / UPDATE / DELETE.
    Retorna o lastrowid (útil para INSERTs).
    """
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql, params)
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()
