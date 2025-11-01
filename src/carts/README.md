# Módulo de Carrinho de Compras

## 📋 Descrição
Módulo responsável pelo gerenciamento de carrinhos de compras, permitindo que usuários adicionem, atualizem e removam produtos antes de finalizar um pedido.

## 🚀 Funcionalidades

- Criar e gerenciar carrinho por empresa
- Adicionar produtos ao carrinho
- Atualizar quantidade de itens
- Remover itens do carrinho
- Limpar carrinho completo
- Isolamento por usuário e empresa

## 🔗 Endpoints

### `GET /v1/cart/:companyId`
Busca o carrinho do usuário para uma empresa específica

### `POST /v1/cart/:companyId/items`
Adiciona um item ao carrinho
```json
{
  "productId": "uuid-do-produto",
  "quantity": 2
}
```

### `PUT /v1/cart/:companyId/items/:itemId`
Atualiza a quantidade de um item no carrinho
```json
{
  "quantity": 3
}
```

### `DELETE /v1/cart/:companyId/items/:itemId`
Remove um item específico do carrinho

### `DELETE /v1/cart/:companyId`
Limpa todo o carrinho

## 🔒 Autenticação

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado via JWT
- Cada usuário possui seu próprio carrinho por empresa

## 🔧 Validações

- Usuário deve ter acesso à empresa especificada
- Produto deve existir e estar disponível
- Quantidade deve ser maior que zero
- Validação de estoque (quando aplicável)

## 💡 Características

- Cada carrinho é específico para uma empresa (`companyId`)
- Itens são agrupados por produto
- Carrinho mantém-se entre sessões (salvo no banco de dados)
- Permite adicionar múltiplos produtos de uma vez
