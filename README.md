# 🌸 BellaFlor Artur Nogueira - Floricultura Online

Site completo de e-commerce para a floricultura BellaFlor, localizada em Artur Nogueira - SP. Sistema de venda de flores, arranjos, cestas e plantas com carrinho de compras funcional e painel administrativo.

## 🎯 Objetivo do Projeto

Criar uma presença online profissional para a floricultura BellaFlor, permitindo que clientes naveguem pelo catálogo, façam pedidos online e entrem em contato. Facilitar a gestão de produtos e pedidos através de um painel administrativo.

## ✨ Funcionalidades Implementadas

### 🛍️ Loja Virtual (index.html)
- ✅ **Catálogo de Produtos**: Exibição de 40 produtos organizados por categorias
- ✅ **Busca e Filtros**: Sistema de busca por nome/descrição e filtro por categoria
- ✅ **Ordenação**: Produtos podem ser ordenados por nome ou preço
- ✅ **Carrinho de Compras**: Sistema completo com adição, remoção e ajuste de quantidades
- ✅ **Modal de Detalhes**: Visualização detalhada de cada produto
- ✅ **Sistema de Pedidos**: Finalização de pedido com dados do cliente
- ✅ **Persistência**: Carrinho salvo no localStorage
- ✅ **Integração WhatsApp**: Opção de confirmar pedido via WhatsApp
- ✅ **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Seções Informativas**: Sobre a floricultura, contato e informações

### 👨‍💼 Painel Administrativo (admin.html)
- ✅ **Gerenciar Produtos**: Visualizar, editar e excluir produtos
- ✅ **Adicionar Produtos**: Formulário completo para cadastro de novos produtos
- ✅ **Gestão de Pedidos**: Visualizar pedidos recebidos
- ✅ **Atualizar Status**: Alterar status dos pedidos (Pendente → Confirmado → Em Entrega → Entregue)
- ✅ **Filtros Admin**: Busca e filtro por categoria no painel
- ✅ **Indicadores**: Badges de destaque e estoque baixo

## 📊 Estrutura de Dados

### Tabela: produtos
- `id` (text): ID único do produto
- `nome` (text): Nome do produto
- `descricao` (text): Descrição detalhada
- `preco` (number): Preço em reais
- `categoria` (text): Buquês, Arranjos, Cestas, Plantas ou Ocasiões Especiais
- `imagem` (text): URL da imagem
- `estoque` (number): Quantidade disponível
- `destaque` (bool): Produto em destaque

### Tabela: pedidos
- `id` (text): ID único do pedido
- `cliente_nome` (text): Nome do cliente
- `cliente_telefone` (text): Telefone do cliente
- `cliente_endereco` (text): Endereço de entrega
- `itens` (array): Array de produtos do pedido
- `total` (number): Valor total
- `status` (text): Status do pedido
- `data_pedido` (datetime): Data e hora do pedido

## 🗂️ Estrutura de Arquivos

```
/
├── index.html              # Página principal da loja
├── admin.html              # Painel administrativo
├── css/
│   ├── style.css          # Estilos principais
│   └── admin.css          # Estilos do painel admin
├── js/
│   ├── main.js            # JavaScript da loja
│   └── admin.js           # JavaScript do admin
└── README.md              # Documentação
```

## 🎨 Design e Tecnologias

### Bibliotecas e Recursos
- **Font Awesome 6.4.0**: Ícones
- **Google Fonts**: Playfair Display (títulos) + Inter (texto)
- **Unsplash**: Imagens de alta qualidade dos produtos

### Paleta de Cores
- **Primary**: #c2185b (Rosa vibrante)
- **Primary Dark**: #8e0038
- **Primary Light**: #fa5788
- **Secondary**: #4caf50 (Verde)
- **Accent**: #ffc107 (Amarelo/Dourado)

### Recursos de Design
- Animações suaves e transições
- Efeitos hover em cards
- Modal lateral para carrinho
- Layout responsivo com grid CSS
- Smooth scroll para navegação

## 🌐 Endpoints da API RESTful

### Produtos
- `GET tables/produtos?limit=100` - Listar todos os produtos
- `GET tables/produtos/{id}` - Obter produto específico
- `POST tables/produtos` - Criar novo produto
- `PUT tables/produtos/{id}` - Atualizar produto completo
- `PATCH tables/produtos/{id}` - Atualizar campos específicos
- `DELETE tables/produtos/{id}` - Deletar produto

### Pedidos
- `GET tables/pedidos?limit=100` - Listar todos os pedidos
- `GET tables/pedidos/{id}` - Obter pedido específico
- `POST tables/pedidos` - Criar novo pedido
- `PATCH tables/pedidos/{id}` - Atualizar status do pedido

## 📱 Funcionalidades por Página

### Página Principal (index.html)
- **Entrada**: `/` ou `/index.html`
- **Seções**:
  - Hero com apresentação da floricultura
  - Filtros de busca e categoria
  - Grid de produtos com paginação automática
  - Seção "Sobre Nós"
  - Informações de contato
  - Footer com redes sociais

### Painel Admin (admin.html)
- **Entrada**: `/admin.html`
- **Tabs**:
  - Gerenciar Produtos: Lista editável de produtos
  - Pedidos: Visualização e gestão de pedidos
  - Adicionar Produto: Formulário de cadastro

## 🚀 Catálogo de Produtos (40 itens)

### Buquês (10 produtos)
1. Buquê de Rosas Vermelhas - R$ 89,90
2. Buquê de Rosas Brancas - R$ 89,90
3. Buquê de Rosas Cor-de-Rosa - R$ 89,90
4. Buquê Misto Colorido - R$ 79,90
5. Buquê de Girassóis - R$ 95,90
6. Buquê de Lírios Brancos - R$ 99,90
7. Buquê de Tulipas - R$ 119,90
8. Buquê de Margaridas - R$ 65,90
9. Buquê de Orquídeas - R$ 149,90
10. Buquê Campestre - R$ 75,90

### Arranjos (8 produtos)
11. Arranjo de Mesa Elegante - R$ 129,90
12. Arranjo Tropical - R$ 159,90
13. Arranjo de Lírios - R$ 139,90
14. Arranjo Primaveril - R$ 109,90
15. Arranjo Luxo - R$ 249,90
16. Arranjo Zen - R$ 179,90
17. Arranjo de Girassóis - R$ 119,90
18. Arranjo Romântico - R$ 134,90

### Cestas (6 produtos)
19. Cesta de Café da Manhã - R$ 189,90
20. Cesta de Flores Variadas - R$ 149,90
21. Cesta Gourmet - R$ 279,90
22. Cesta de Chocolates - R$ 159,90
23. Cesta Natalina - R$ 199,90
24. Cesta de Frutas Premium - R$ 169,90

### Plantas (8 produtos)
25. Orquídea Phalaenopsis - R$ 89,90
26. Suculentas Mini - R$ 45,90
27. Violeta Africana - R$ 39,90
28. Antúrio Vermelho - R$ 79,90
29. Jardim Zen Miniatura - R$ 99,90
30. Lírio da Paz - R$ 69,90
31. Bromélia Colorida - R$ 59,90
32. Cactos Decorativos - R$ 49,90

### Ocasiões Especiais (8 produtos)
33. Buquê de Noiva Clássico - R$ 299,90
34. Arranjo Nascimento Bebê - R$ 139,90
35. Coroa de Flores - R$ 189,90
36. Arranjo Aniversário - R$ 129,90
37. Buquê Dia das Mães - R$ 109,90
38. Arranjo Dia dos Namorados - R$ 159,90
39. Buquê Formatura - R$ 119,90
40. Arranjo Empresarial - R$ 199,90

## 📋 Próximos Passos Recomendados

### Melhorias Futuras
- [ ] Implementar sistema de avaliações de produtos
- [ ] Adicionar galeria de fotos para cada produto
- [ ] Criar sistema de cupons de desconto
- [ ] Implementar cálculo automático de frete por CEP
- [ ] Adicionar notificações por email para pedidos
- [ ] Criar área de depoimentos de clientes
- [ ] Implementar sistema de favoritos
- [ ] Adicionar chat online com atendimento
- [ ] Criar blog com dicas de cuidados com flores
- [ ] Implementar programa de fidelidade

### Recursos Administrativos
- [ ] Dashboard com estatísticas de vendas
- [ ] Relatórios de produtos mais vendidos
- [ ] Controle de estoque com alertas
- [ ] Sistema de backup de dados
- [ ] Gestão de múltiplos usuários admin

## 💡 Como Usar

### Para Clientes
1. Acesse `index.html`
2. Navegue pelo catálogo usando filtros e busca
3. Clique em um produto para ver detalhes
4. Adicione produtos ao carrinho
5. Clique no ícone do carrinho no header
6. Ajuste quantidades se necessário
7. Clique em "Finalizar Pedido"
8. Preencha seus dados e confirme
9. Opcionalmente, confirme via WhatsApp

### Para Administradores
1. Acesse `admin.html`
2. **Gerenciar Produtos**: Visualize, edite ou exclua produtos
3. **Pedidos**: Acompanhe pedidos e atualize status
4. **Adicionar Produto**: Cadastre novos produtos no catálogo

## 🎯 Informações de Contato (BellaFlor)

- **Localização**: Artur Nogueira - SP
- **Telefone**: (19) 3827-XXXX
- **Email**: contato@bellaflor.com.br
- **Horário**: Seg-Sex: 8h às 18h | Sáb: 8h às 14h

## 📱 Responsividade

O site é totalmente responsivo e se adapta a:
- 📱 Mobile (< 480px)
- 📱 Tablet (480px - 768px)
- 💻 Desktop (> 768px)

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- RESTful API
- LocalStorage
- Font Awesome Icons
- Google Fonts

---

**Desenvolvido com 💚 para BellaFlor Artur Nogueira**

*Site pronto para publicação! Use a aba Publish para colocar online.*
