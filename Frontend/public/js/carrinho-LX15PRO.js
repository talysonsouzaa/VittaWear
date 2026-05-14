/* ============================================
   VittaWear - Scripts da Página de Carrinho
   ============================================ */

// Número do WhatsApp da loja 
const WHATSAPP_NUMERO = '5531975585057';

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
    inicializarEventos();
});

/**
 * Renderiza carrinho na página
 */
function renderizarCarrinho() {
    const carrinho = obterCarrinho();
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartList = document.getElementById('cartList');

    if (carrinho.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';

    // Renderiza itens
    cartList.innerHTML = carrinho.map((item, index) => renderizarItemCarrinho(item, index)).join('');

    // Atualiza resumo
    atualizarResumo();
}

/**
 * Renderiza um item do carrinho
 */
function renderizarItemCarrinho(item, index) {
    const variantInfo = [];
    if (item.tamanho) variantInfo.push(`Tamanho: ${item.tamanho}`);
    if (item.cor) variantInfo.push(`Cor: ${item.cor}`);

    return `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                ${item.imagem
            ? `<img src="${item.imagem}" alt="${item.nome}">`
            : `<div class="item-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                        </svg>
                    </div>`
        }
            </div>
            
            <div class="cart-item-details">
                <h3 class="cart-item-name">
                    <a href="produto.html?id=${item.id}">${item.nome}</a>
                </h3>
                ${variantInfo.length > 0 ? `<p class="cart-item-variant">${variantInfo.join(' | ')}</p>` : ''}
                <span class="cart-item-price">${formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            
            <div class="cart-item-actions">
                <button class="remove-item-btn" onclick="handleRemoverItem(${index})" aria-label="Remover item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
                
                <div class="qty-controls">
                    <button onclick="handleAlterarQuantidade(${index}, ${item.quantidade - 1})" aria-label="Diminuir quantidade">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <span>${item.quantidade}</span>
                    <button onclick="handleAlterarQuantidade(${index}, ${item.quantidade + 1})" aria-label="Aumentar quantidade">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Atualiza resumo do pedido
 */
function atualizarResumo() {
    const subtotal = calcularTotalCarrinho();
    const freteGratis = subtotal >= 299;
    const frete = freteGratis ? 0 : 29.90;
    const total = subtotal + frete;

    // Atualiza valores
    document.getElementById('subtotal').textContent = formatarMoeda(subtotal);

    const freteElement = document.getElementById('frete');
    if (freteGratis) {
        freteElement.textContent = 'Grátis';
        freteElement.classList.add('gratis');
    } else {
        freteElement.textContent = formatarMoeda(frete);
        freteElement.classList.remove('gratis');
    }

    document.getElementById('total').textContent = formatarMoeda(total);
}

/**
 * Inicializa eventos da página
 */
function inicializarEventos() {
    // Botão limpar carrinho
    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            limparCarrinho();
            renderizarCarrinho();
        }
    });

    // Botão finalizar via WhatsApp
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        finalizarCompraWhatsApp(WHATSAPP_NUMERO);
    });
}

/**
 * Handler para remover item
 */
function handleRemoverItem(index) {
    removerDoCarrinho(index);
    renderizarCarrinho();
}

/**
 * Handle=r para alterar quantidade
 */
function handleAlterarQuantidade(index, novaQuantidade) {
    atualizarQuantidadeCarrinho(index, novaQuantidade);
    renderizarCarrinho();
}
