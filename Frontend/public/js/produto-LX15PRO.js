/* ============================================
   VittaWear - Scripts da Página de Produto
   ============================================ */

// Estado do produto atual
let produtoAtual = null;
let tamanhoSelecionado = null;
let corSelecionada = null;
let quantidade = 1;

// Estado do carrossel
let imagemAtual = 0;

document.addEventListener('DOMContentLoaded', () => {
    carregarProduto();
    inicializarQuantidade();
});

/**
 * Carrega dados do produto
 */
async function carregarProduto() {
    const loading = document.getElementById('loadingProduto');
    const productDetail = document.getElementById('productDetail');
    const notFound = document.getElementById('productNotFound');

    const produtoId = obterParametroUrl('id');

    if (!produtoId) {
        mostrarNaoEncontrado();
        return;
    }

    try {
        produtoAtual = await buscarProdutoPorId(produtoId);

        if (!produtoAtual) {
            produtoAtual = await buscarProdutoSimulado(produtoId);
        }

        if (produtoAtual) {
            renderizarProduto();
            loading.style.display = 'none';
            productDetail.style.display = 'block';
        } else {
            mostrarNaoEncontrado();
        }

    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        mostrarNaoEncontrado();
    }
}

/**
 * Simula busca na API para produtos dinâmicos
 */
async function buscarProdutoSimulado(id) {
    const produtosApi = [
        {
            id: 'api-1',
            nome: 'Scrub Standard Masculino',
            categoria: 'scrubs',
            preco: 124.90,
            precoOriginal: 234.90,
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
            id: 'api-2',
            nome: 'Scrub Action Masculino',
            categoria: 'scrubs',
            preco: 154.90,
            precoOriginal: 164.90,
            descricao: 'Scrub masculino com modelagem confortável e bolsos funcionais. Tecido com tratamento anti-manchas.',
            tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
            cores: ['Preto'],
            imagens: [
                "../images/Jalecos/JalecoMasc.jpg",
                "../images/Jalecos/JalecoMasc1.jpg",
                "../images/Jalecos/JalecoMasc2.jpg",
                "../images/Jalecos/JalecoMasc3.jpg",
            ],
            destaque: false
        },
        {
            id: 'api-3',
            nome: 'Conjunto Scrub Essential',
            categoria: 'scrubs',
            preco: 149.90,
            precoOriginal: 239.90,
            descricao: 'Scrub premium feminino que une conforto térmico e flexibilidade, ideal para longos turnos.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Azul Turquesa'],
            imagens: [
                "../images/Scrubs/ScrubEssenctialFem/ScrubFem.jpg",
                "../images/Scrubs/ScrubEssenctialFem/ScrubFem.jpg",
                "../images/Scrubs/ScrubEssenctialFem/ScrubFem.jpg",
                "../images/Scrubs/ScrubEssenctialFem/ScrubFem.jpg"
            ],
            destaque: false
        },
        {
            id: 'api-4',
            nome: 'Conjunto Scrub Basic Feminino',
            categoria: 'scrubs',
            preco: 99.90,
            precoOriginal: 109.90,
            descricao: 'Confeccionado em Oxfordine, o conjunto Basic é leve, macio e não amassa, garantindo conforto ao longo do dia. Possui blusa com decote em V e bolsos funcionais, além de calça com cós elástico para melhor ajuste. ✨ Ideal para quem busca elegância e praticidade na rotina profissional.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Rosa Coral'],
            imagens: [
                "../images/Scrubs/ScrubBasicFem/ScrubBaFem.jpg",
                "../images/Scrubs/ScrubBasicFem/ScrubBaFem.jpg",
                "../images/Scrubs/ScrubBasicFem/ScrubBaFem.jpg",
                "../images/Scrubs/ScrubBasicFem/ScrubBaFem.jpg"
            ],
            destaque: false
        },
        {
            id: 'api-5',
            nome: 'Scrub Moove Feminino',
            categoria: 'scrubs',
            preco: 239.90,
            precoOriginal: 329.90,
            descricao: 'Scrub desenvolvido para ambiente cirúrgico. Tecido com tratamento antimicrobiano avançado. Costuras seladas e acabamento de alta qualidade.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Verde Oliva', 'Azul Royal'],
            imagens: [
                "../images/Scrubs/ScrubMooveFem/ScrubMoFem.jpg",
                "../images/Scrubs/ScrubMooveFem/ScrubMoFem.jpg",
                "../images/Scrubs/ScrubMooveFem/ScrubMoFem.jpg",
                "../images/Scrubs/ScrubMooveFem/ScrubMoFem.jpg"
            ],
            destaque: false
        },
        {
            id: 'api-6',
            nome: 'Scrub Classic Feminino',
            categoria: 'scrubs',
            preco: 119.90,
            precoOriginal: 229.90,
            descricao: 'Modelo feminino com visual mais estruturado e elegante, ideal para quem busca um scrub tradicional com acabamento superior.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Vinho'],
            imagens: [
                "../images/Scrubs/ScrubClasscFem/ScrubCLFem.jpg",
                "../images/Scrubs/ScrubClasscFem/ScrubCLFem.jpg",
                "../images/Scrubs/ScrubClasscFem/ScrubCLFem.jpg",
                "../images/Scrubs/ScrubClasscFem/ScrubCLFem.jpg"
            ],
            destaque: false
        },
        {
            id: 'api-7',
            nome: 'Scrub Deluxe Feminino',
            categoria: 'scrubs',
            preco: 189.90,
            precoOriginal: 229.90,
            descricao: 'Modelo sofisticado, com toque leve e caimento elegante, indicado para quem busca diferenciação estética.',
            tamanhos: ['PP', 'P', 'M', 'G', 'GG'],
            cores: ['Vermelho'],
            imagens: [
                "../images/Scrubs/ScrubDeluxeFem/ScrubDeluxeFem.jpg",
                "../images/Scrubs/ScrubDeluxeFem/ScrubDeluxeFem1.jpg",
                "../images/Scrubs/ScrubDeluxeFem/ScrubDeluxeFem2.jpg",
                "../images/Scrubs/ScrubDeluxeFem/ScrubDeluxeFem3.jpg"
            ],
            destaque: false
        },
        {
            id: 'api-8',
            nome: 'Kit Máscaras N95',
            categoria: 'acessorios',
            preco: 89.90,
            precoOriginal: null,
            descricao: 'Kit com 10 máscaras N95 de alta proteção. Ajuste perfeito ao rosto. Certificação de qualidade.',
            tamanhos: ['Único'],
            cores: ['Branco'],
            imagens: [],
            destaque: false
        }
    ];

    return produtosApi.find(p => p.id === id) || null;
}

/**
 * Renderiza produto na página
 */
function renderizarProduto() {
    const produto = produtoAtual;

    document.title = `${produto.nome} - VittaWear`;

    document.getElementById('breadcrumbProduto').textContent = produto.nome;

    const badge = document.getElementById('productBadge');
    if (produto.destaque) {
        badge.style.display = 'block';
    }

    // Renderiza carrossel
    renderizarCarrossel(produto.imagens, produto.nome);

    document.getElementById('productCategory').textContent = produto.categoria;
    document.getElementById('productTitle').textContent = produto.nome;
    document.getElementById('productPrice').textContent = formatarMoeda(produto.preco);
    document.getElementById('productDescription').textContent = produto.descricao;

    const precoOriginal = document.getElementById('productPriceOriginal');
    const desconto = document.getElementById('productDiscount');

    if (produto.precoOriginal) {
        precoOriginal.textContent = formatarMoeda(produto.precoOriginal);
        const percentDesconto = Math.round((1 - produto.preco / produto.precoOriginal) * 100);
        desconto.textContent = `-${percentDesconto}%`;
    } else {
        precoOriginal.style.display = 'none';
        desconto.style.display = 'none';
    }

    renderizarTamanhos(produto.tamanhos);
    renderizarCores(produto.cores);

    document.getElementById('addToCartBtn').addEventListener('click', handleAddToCart);
    document.getElementById('buyNowBtn').addEventListener('click', handleBuyNow);
}

/* ============================================
   CARROSSEL
   ============================================ */

/**
 * Renderiza o carrossel de imagens no lugar do productMainImage
 */
function renderizarCarrossel(imagens, nomeAlt) {
    const container = document.getElementById('productMainImage');

    // Se não tiver imagens, mantém o placeholder original
    if (!imagens || imagens.length === 0) {
        container.innerHTML = `
            <div class="product-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
            </div>`;
        return;
    }

    // Se tiver só uma imagem, mostra sem controles
    if (imagens.length === 1) {
        container.innerHTML = `<img src="${imagens[0]}" alt="${nomeAlt}">`;
        return;
    }

    // Monta o carrossel completo
    imagemAtual = 0;

    const slides = imagens.map((src, i) => `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}">
            <img src="${src}" alt="${nomeAlt} - foto ${i + 1}">
        </div>
    `).join('');

    const dots = imagens.map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'active' : ''}" 
                onclick="irParaImagem(${i})" 
                aria-label="Foto ${i + 1}">
        </button>
    `).join('');

    container.innerHTML = `
        <div class="carousel">
            <div class="carousel-track" id="carouselTrack">
                ${slides}
            </div>

            <button class="carousel-btn carousel-btn-prev" onclick="mudarImagem(-1)" aria-label="Foto anterior">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>

            <button class="carousel-btn carousel-btn-next" onclick="mudarImagem(1)" aria-label="Próxima foto">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>

            <div class="carousel-dots">
                ${dots}
            </div>
        </div>
    `;

    // Suporte a swipe no mobile
    inicializarSwipe();
}

/**
 * Avança ou volta uma imagem (-1 ou +1)
 */
function mudarImagem(direcao) {
    const total = produtoAtual.imagens.length;
    imagemAtual = (imagemAtual + direcao + total) % total;
    atualizarCarrossel();
}

/**
 * Vai direto para uma imagem pelo índice
 */
function irParaImagem(index) {
    imagemAtual = index;
    atualizarCarrossel();
}

/**
 * Atualiza o estado visual do carrossel
 */
function atualizarCarrossel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === imagemAtual);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === imagemAtual);
    });
}

/**
 * Suporte a swipe no mobile
 */
function inicializarSwipe() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    let startX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            mudarImagem(diff > 0 ? 1 : -1);
        }
    }, { passive: true });
}

/* ============================================
   RESTO DA PÁGINA (sem alterações)
   ============================================ */

function renderizarTamanhos(tamanhos) {
    const container = document.getElementById('sizeOptions');

    if (!tamanhos || tamanhos.length === 0) {
        container.parentElement.style.display = 'none';
        return;
    }

    container.innerHTML = tamanhos.map((tamanho, index) => `
        <button type="button" 
                class="size-option ${index === 0 ? 'active' : ''}" 
                data-size="${tamanho}">
            ${tamanho}
        </button>
    `).join('');

    tamanhoSelecionado = tamanhos[0];

    container.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tamanhoSelecionado = btn.dataset.size;
        });
    });
}

function renderizarCores(cores) {
    const container = document.getElementById('colorOptions');
    const containerWrapper = document.getElementById('colorOptionContainer');

    if (!cores || cores.length === 0) {
        containerWrapper.style.display = 'none';
        return;
    }

    container.innerHTML = cores.map((cor, index) => `
        <button type="button" 
                class="color-option ${index === 0 ? 'active' : ''}" 
                data-color="${cor}">
            ${cor}
        </button>
    `).join('');

    corSelecionada = cores[0];

    container.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            corSelecionada = btn.dataset.color;
        });
    });
}

function inicializarQuantidade() {
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const input = document.getElementById('quantity');

    minusBtn?.addEventListener('click', () => {
        if (quantidade > 1) {
            quantidade--;
            input.value = quantidade;
        }
    });

    plusBtn?.addEventListener('click', () => {
        if (quantidade < 10) {
            quantidade++;
            input.value = quantidade;
        }
    });
}

async function handleAddToCart() {
    if (!produtoAtual) return;
    await adicionarAoCarrinho(produtoAtual.id, quantidade, tamanhoSelecionado, corSelecionada);
}

async function handleBuyNow() {
    if (!produtoAtual) return;
    await adicionarAoCarrinho(produtoAtual.id, quantidade, tamanhoSelecionado, corSelecionada);
    window.location.href = 'carrinho.html';
}

function mostrarNaoEncontrado() {
    document.getElementById('loadingProduto').style.display = 'none';
    document.getElementById('productDetail').style.display = 'none';
    document.getElementById('productNotFound').style.display = 'block';
}