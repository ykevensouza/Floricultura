// Estado global
let produtos = [];
let pedidos = [];
let filteredProdutos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    carregarPedidos();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('adminSearchInput').addEventListener('input', filtrarProdutosAdmin);
    document.getElementById('adminCategoryFilter').addEventListener('change', filtrarProdutosAdmin);
    
    // Formulário novo produto
    document.getElementById('formNovoProduto').addEventListener('submit', adicionarProduto);
    
    // Formulário editar produto
    document.getElementById('formEditarProduto').addEventListener('submit', salvarEdicao);
    
    // Fechar modal ao clicar fora
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeEditModal();
        }
    });
}

// Carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch('tables/produtos?limit=100');
        const data = await response.json();
        produtos = data.data;
        filteredProdutos = [...produtos];
        renderizarProdutosAdmin();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('adminProductsList').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro ao carregar produtos</p>
            </div>
        `;
    }
}

// Carregar pedidos
async function carregarPedidos() {
    try {
        const response = await fetch('tables/pedidos?limit=100&sort=created_at');
        const data = await response.json();
        pedidos = data.data.reverse(); // Mais recentes primeiro
        renderizarPedidos();
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        document.getElementById('adminOrdersList').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro ao carregar pedidos</p>
            </div>
        `;
    }
}

// Filtrar produtos no admin
function filtrarProdutosAdmin() {
    const searchTerm = document.getElementById('adminSearchInput').value.toLowerCase();
    const category = document.getElementById('adminCategoryFilter').value;
    
    filteredProdutos = produtos.filter(produto => {
        const matchSearch = produto.nome.toLowerCase().includes(searchTerm) || 
                          produto.descricao.toLowerCase().includes(searchTerm);
        const matchCategory = !category || produto.categoria === category;
        return matchSearch && matchCategory;
    });
    
    renderizarProdutosAdmin();
}

// Renderizar produtos no admin
function renderizarProdutosAdmin() {
    const container = document.getElementById('adminProductsList');
    
    if (filteredProdutos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProdutos.map(produto => `
        <div class="admin-product-item">
            <img src="${produto.imagem}" alt="${produto.nome}" class="admin-product-image" onerror="this.src='https://via.placeholder.com/100?text=Sem+Imagem'">
            <div class="admin-product-info">
                <h3>
                    ${produto.nome}
                    ${produto.destaque ? '<span class="badge-destaque">DESTAQUE</span>' : ''}
                    ${produto.estoque < 10 ? '<span class="badge-estoque-baixo">Estoque Baixo</span>' : ''}
                </h3>
                <p>${produto.descricao}</p>
                <p><strong>Categoria:</strong> ${produto.categoria}</p>
                <p><strong>Estoque:</strong> ${produto.estoque} unidades</p>
                <div class="admin-product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-admin btn-edit" onclick="editarProduto('${produto.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-admin btn-delete" onclick="excluirProduto('${produto.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar pedidos
function renderizarPedidos() {
    const container = document.getElementById('adminOrdersList');
    
    if (pedidos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>Nenhum pedido recebido ainda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pedidos.map(pedido => {
        const data = new Date(pedido.data_pedido || pedido.created_at);
        const dataFormatada = data.toLocaleString('pt-BR');
        
        return `
            <div class="admin-order-item">
                <div class="order-header">
                    <span class="order-id">Pedido #${pedido.id.substring(0, 8)}</span>
                    <span class="order-status ${pedido.status.toLowerCase()}">${pedido.status}</span>
                </div>
                <div class="order-info">
                    <p><strong>Cliente:</strong> ${pedido.cliente_nome}</p>
                    <p><strong>Telefone:</strong> ${pedido.cliente_telefone}</p>
                    <p><strong>Endereço:</strong> ${pedido.cliente_endereco}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                </div>
                <div class="order-items">
                    <h4>Itens do Pedido:</h4>
                    <ul>
                        ${pedido.itens.map(item => `
                            <li>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="order-total">
                    Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}
                </div>
                <div class="order-actions">
                    <button class="btn-admin btn-edit" onclick="atualizarStatusPedido('${pedido.id}', 'Confirmado')">
                        <i class="fas fa-check"></i> Confirmar
                    </button>
                    <button class="btn-admin btn-edit" onclick="atualizarStatusPedido('${pedido.id}', 'Em Entrega')">
                        <i class="fas fa-truck"></i> Em Entrega
                    </button>
                    <button class="btn-admin btn-edit" onclick="atualizarStatusPedido('${pedido.id}', 'Entregue')">
                        <i class="fas fa-check-double"></i> Entregue
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Adicionar produto
async function adicionarProduto(e) {
    e.preventDefault();
    
    const form = e.target;
    const novoProduto = {
        nome: form.nome.value,
        descricao: form.descricao.value,
        preco: parseFloat(form.preco.value),
        estoque: parseInt(form.estoque.value),
        categoria: form.categoria.value,
        imagem: form.imagem.value,
        destaque: form.destaque.checked
    };
    
    try {
        const response = await fetch('tables/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto)
        });
        
        if (response.ok) {
            alert('Produto adicionado com sucesso! 🎉');
            form.reset();
            carregarProdutos();
            showTab('produtos');
        } else {
            alert('Erro ao adicionar produto');
        }
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto');
    }
}

// Editar produto
function editarProduto(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;
    
    document.getElementById('edit_id').value = produto.id;
    document.getElementById('edit_nome').value = produto.nome;
    document.getElementById('edit_descricao').value = produto.descricao;
    document.getElementById('edit_preco').value = produto.preco;
    document.getElementById('edit_estoque').value = produto.estoque;
    document.getElementById('edit_categoria').value = produto.categoria;
    document.getElementById('edit_imagem').value = produto.imagem;
    document.getElementById('edit_destaque').checked = produto.destaque;
    
    document.getElementById('editModal').classList.add('active');
}

// Salvar edição
async function salvarEdicao(e) {
    e.preventDefault();
    
    const id = document.getElementById('edit_id').value;
    const produtoAtualizado = {
        nome: document.getElementById('edit_nome').value,
        descricao: document.getElementById('edit_descricao').value,
        preco: parseFloat(document.getElementById('edit_preco').value),
        estoque: parseInt(document.getElementById('edit_estoque').value),
        categoria: document.getElementById('edit_categoria').value,
        imagem: document.getElementById('edit_imagem').value,
        destaque: document.getElementById('edit_destaque').checked
    };
    
    try {
        const response = await fetch(`tables/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoAtualizado)
        });
        
        if (response.ok) {
            alert('Produto atualizado com sucesso! 🎉');
            closeEditModal();
            carregarProdutos();
        } else {
            alert('Erro ao atualizar produto');
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto');
    }
}

// Excluir produto
async function excluirProduto(produtoId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/produtos/${produtoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Produto excluído com sucesso!');
            carregarProdutos();
        } else {
            alert('Erro ao excluir produto');
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
    }
}

// Atualizar status do pedido
async function atualizarStatusPedido(pedidoId, novoStatus) {
    try {
        const response = await fetch(`tables/pedidos/${pedidoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });
        
        if (response.ok) {
            alert(`Status atualizado para: ${novoStatus}`);
            carregarPedidos();
        } else {
            alert('Erro ao atualizar status');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status');
    }
}

// Gerenciar tabs
function showTab(tabName) {
    // Desativar todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar tab selecionada
    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}
