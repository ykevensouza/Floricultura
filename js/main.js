// Estado global
let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let filteredProdutos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarCarrinho();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('searchInput').addEventListener('input', filtrarProdutos);
    document.getElementById('categoryFilter').addEventListener('change', filtrarProdutos);
    document.getElementById('sortFilter').addEventListener('change', filtrarProdutos);
    
    // Fechar modal ao clicar fora
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeProductModal();
        }
    });
}

// Carregar produtos da API
async function carregarProdutos() {
    try {
        const response = await fetch('tables/produtos?limit=100');
        const data = await response.json();
        produtos = data.data;
        filteredProdutos = [...produtos];
        renderizarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro ao carregar produtos. Por favor, tente novamente.</p>
            </div>
        `;
    }
}

// Filtrar produtos
function filtrarProdutos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    
    // Filtrar por busca e categoria
    filteredProdutos = produtos.filter(produto => {
        const matchSearch = produto.nome.toLowerCase().includes(searchTerm) || 
                          produto.descricao.toLowerCase().includes(searchTerm);
        const matchCategory = !category || produto.categoria === category;
        return matchSearch && matchCategory;
    });
    
    // Ordenar
    switch(sortBy) {
        case 'name':
            filteredProdutos.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'price-asc':
            filteredProdutos.sort((a, b) => a.preco - b.preco);
            break;
        case 'price-desc':
            filteredProdutos.sort((a, b) => b.preco - a.preco);
            break;
    }
    
    renderizarProdutos();
}

// Renderizar produtos
function renderizarProdutos() {
    const grid = document.getElementById('productsGrid');
    
    if (filteredProdutos.length === 0) {
        grid.innerHTML = `
            <div class="loading">
                <i class="fas fa-search"></i>
                <p>Nenhum produto encontrado.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProdutos.map(produto => `
        <div class="product-card" onclick="mostrarDetalhes('${produto.id}')">
            <div style="position: relative;">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=Imagem+Indisponível'">
                ${produto.destaque ? '<span class="product-badge">Destaque</span>' : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${produto.categoria}</span>
                <h3 class="product-name">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); adicionarAoCarrinho('${produto.id}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Mostrar detalhes do produto
function mostrarDetalhes(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    
    content.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" class="modal-product-image" onerror="this.src='https://via.placeholder.com/800x400?text=Imagem+Indisponível'">
        <div class="modal-product-info">
            <span class="product-category">${produto.categoria}</span>
            <h2 class="modal-product-name">${produto.nome}</h2>
            <p class="modal-product-description">${produto.descricao}</p>
            <div class="modal-product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
            <p style="color: var(--text-light); margin-bottom: 1rem;">
                <i class="fas fa-box"></i> ${produto.estoque} unidades em estoque
            </p>
            <button class="btn btn-primary btn-block" onclick="adicionarAoCarrinho('${produto.id}'); closeProductModal();">
                <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        if (itemExistente.quantidade < produto.estoque) {
            itemExistente.quantidade++;
        } else {
            alert('Estoque insuficiente!');
            return;
        }
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    
    // Animação de feedback
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 300);
}

// Remover do carrinho
function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    salvarCarrinho();
    atualizarCarrinho();
}

// Atualizar quantidade
function atualizarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (!item) return;
    
    const produto = produtos.find(p => p.id === produtoId);
    const novaQuantidade = item.quantidade + delta;
    
    if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    if (novaQuantidade > produto.estoque) {
        alert('Estoque insuficiente!');
        return;
    }
    
    item.quantidade = novaQuantidade;
    salvarCarrinho();
    atualizarCarrinho();
}

// Atualizar UI do carrinho
function atualizarCarrinho() {
    const count = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    document.querySelector('.cart-count').textContent = count;
    
    const cartItems = document.getElementById('cartItems');
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=Sem+Imagem'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="atualizarQuantidade('${item.id}', -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button class="qty-btn" onclick="atualizarQuantidade('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removerDoCarrinho('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Toggle carrinho
function toggleCart() {
    document.getElementById('cartModal').classList.toggle('active');
}

// Toggle menu mobile
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Finalizar pedido
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const nome = prompt('Digite seu nome:');
    if (!nome) return;
    
    const telefone = prompt('Digite seu telefone (com DDD):');
    if (!telefone) return;
    
    const endereco = prompt('Digite seu endereço completo para entrega:');
    if (!endereco) return;
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    // Criar pedido
    const pedido = {
        cliente_nome: nome,
        cliente_telefone: telefone,
        cliente_endereco: endereco,
        itens: carrinho,
        total: total,
        status: 'Pendente',
        data_pedido: new Date().toISOString()
    };
    
    // Salvar pedido na API
    fetch('tables/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Pedido realizado com sucesso! 🎉\n\nNúmero do pedido: ${data.id}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nEntraremos em contato em breve!`);
        
        // Limpar carrinho
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinho();
        toggleCart();
        
        // Enviar mensagem WhatsApp (opcional)
        const mensagem = `Olá! Gostaria de fazer um pedido:\n\n${carrinho.map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}\n\nNome: ${nome}\nEndereço: ${endereco}`;
        const whatsappUrl = `https://wa.me/5519000000000?text=${encodeURIComponent(mensagem)}`;
        
        if (confirm('Deseja confirmar o pedido pelo WhatsApp?')) {
            window.open(whatsappUrl, '_blank');
        }
    })
    .catch(error => {
        console.error('Erro ao criar pedido:', error);
        alert('Erro ao processar pedido. Por favor, tente novamente.');
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
