/* ============================================
   VittaWear - Utilitários JavaScript
   ============================================ */

/**
 * Produtos fixos/destacados (hardcoded)
 * Esses produtos NÃO vêm do backend
 */
const PRODUTOS_FIXOS = [
    {
        id: 'api-1',
        nome: 'Scrub Standard Masculino',
        categoria: 'scrubs',
        preco: 124.90,
        precoOriginal: null,
        descricao: 'Scrub masculino funcional e resistente, ideal para o dia a dia acadêmico e hospitalar, garantindo conforto e mobilidade.',
        tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
        cores: ['Azul Marinho', 'Verde Escuro'],
        imagens: [
            "../images/Scrubs/ScrubStandardMasc/ScrubMasc.jpg",
            "../images/Scrubs/ScrubStandardMasc/ScrubMasc1.jpg",
            "../images/Scrubs/ScrubStandardMasc/ScrubMasc2.jpg",
            "../images/Scrubs/ScrubStandardMasc/ScrubMasc3.jpg"
        ],
        destaque: false
    },
    {
        id: 'fixo-2',
        nome: 'Jaleco Classic Gabardine',
        categoria: 'jalecos',
        preco: 129.90,
        precoOriginal: null,
        descricao: 'Modelo masculino com visual alinhado e maior resistência, indicado para uso profissional contínuo.',
        tamanhos: ['P', 'M', 'G', 'GG'],
        cores: ['Branco', 'Off-White'],
        imagens: [
            "../images/Jalecos/JalecoGarGeral/JalecoGab.jpg",
            "../images/Jalecos/JalecoGarGeral/JalecoGab1.jpg",
            "../images/Jalecos/JalecoGarGeral/JalecoGab2.jpg",
            "../images/Jalecos/JalecoGarGeral/JalecoGab3.jpg",
        ],
        destaque: false
    },
    {
        id: 'fixo-3',
        nome: 'Conjunto Scrub Basic Feminino',
        categoria: 'scrubs',
        preco: 99.90,
        precoOriginal: null,
        descricao: 'Confeccionado em Oxfordine, o conjunto Basic é leve, macio e não amassa, garantindo conforto ao longo do dia. Possui blusa com decote em V e bolsos funcionais, além de calça com cós elástico para melhor ajuste. ✨ Ideal para quem busca elegância e praticidade na rotina profissional.',
        tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
        cores: ['Rosa Coral'],
        imagens: [
            "../images/Scrubs/ScrubBasicFem/ScrubBaFem.jpg",
            "../images/Scrubs/ScrubBasicFem/ScrubBaFem1.jpg",
            "../images/Scrubs/ScrubBasicFem/ScrubBaFem2.jpg",
            "../images/Scrubs/ScrubBasicFem/ScrubBaFem3.jpg",
        ],
        destaque: false
    },
    {
        id: 'fixo-4',
        nome: 'Scrub Moove Feminino',
        categoria: 'scrubs',
        preco: 239.90,
        precoOriginal: null,
        descricao: 'Scrub desenvolvido para ambiente cirúrgico. Tecido com tratamento antimicrobiano avançado. Costuras seladas e acabamento de alta qualidade.',
        tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
        cores: ['Verde Oliva', 'Azul Royal'],
        imagens: [
            "../images/Scrubs/ScrubMooveFem/ScrubMoFem.jpg",
            "../images/Scrubs/ScrubMooveFem/ScrubMoFem1.jpg",
            "../images/Scrubs/ScrubMooveFem/ScrubMoFem2.jpg",
            "../images/Scrubs/ScrubMooveFem/ScrubMoFem3.jpg",
        ],
        destaque: false
    }
];

/**
 * Formata valor para moeda brasileira
 * @param {number} valor 
 * @returns {string}
 */
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Gera URL para página de produto
 * @param {string} id 
 * @returns {string}
 */
function gerarUrlProduto(id) {
    return `produto.html?id=${id}`;
}

/**
 * Obtém parâmetro da URL
 * @param {string} nome 
 * @returns {string|null}
 */
function obterParametroUrl(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

/**
 * Busca produto por ID (fixo ou dinâmico)
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
async function buscarProdutoPorId(id) {
    // Verifica nos produtos fixos (compara como string)
    const produtoFixo = PRODUTOS_FIXOS.find(p => String(p.id) === String(id));
    if (produtoFixo) return produtoFixo;

    // Busca na API com URL completa
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/produtos/${id}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }

    return null;
}

/**
 * Busca produtos da API
 * @param {object} filtros 
 * @returns {Promise<array>}
 */
async function buscarProdutosApi(filtros = {}) {
    try {
        let url = '/api/produtos';
        const params = new URLSearchParams();

        if (filtros.categoria) {
            params.append('categoria', filtros.categoria);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }

    return [];
}

/**
 * Renderiza card de produto
 * @param {object} produto 
 * @returns {string}
 */
function renderizarCardProduto(produto) {
    const urlProduto = gerarUrlProduto(produto.id);
    const badge = produto.destaque ? '<span class="product-badge">Destaque</span>' : '';
    const precoOriginal = produto.precoOriginal
        ? `<span class="original">${formatarMoeda(produto.precoOriginal)}</span>`
        : '';

    const primeiraImagem = produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : null;

    return `
        <article class="product-card" onclick="window.location.href='${urlProduto}'">
            <div class="product-image">
                ${badge}
                ${primeiraImagem
            ? `<img src="${primeiraImagem}" alt="${produto.nome}">`
            : `<div class="product-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                        </svg>
                    </div>`
        }
                <div class="product-actions">
                    <button onclick="event.stopPropagation(); adicionarAoCarrinho('${produto.id}')" aria-label="Adicionar ao carrinho">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-content">
                <span class="product-category">${produto.categoria}</span>
                <h3 class="product-name">${produto.nome}</h3>
                <div class="product-price">
                    <span class="current">${formatarMoeda(produto.preco)}</span>
                    ${precoOriginal}
                </div>
            </div>
        </article>
    `;
}

/**
 * Mostra notificação toast
 * @param {string} mensagem 
 * @param {string} tipo - success, error, warning, info
 */
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Remove notificação existente
    const existente = document.querySelector('.toast-notification');
    if (existente) {
        existente.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    toast.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    // Estilos inline para o toast
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: ${tipo === 'success' ? '#768857' : tipo === 'error' ? '#dc3545' : '#C2A878'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    // Adiciona keyframes se não existir
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Inicializa navbar com scroll e menu mobile
 */
function inicializarNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    // Fecha menu ao clicar em link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
}

// Inicializa navbar em todas as páginas
document.addEventListener('DOMContentLoaded', inicializarNavbar);