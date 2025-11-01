# Módulo de Pedidos (Orders)

## 📋 Descrição
Módulo responsável pelo gerenciamento de pedidos do sistema, incluindo criação de pedidos, checkout do carrinho, atualização de status e vinculação com clientes, empresas e endereços.

## 🚀 Funcionalidades

- Criar pedidos com múltiplos produtos
- Checkout do carrinho de compras
- Listar pedidos do usuário
- Atualizar status e informações do pedido
- Remover pedidos
- Cálculo automático de totais com descontos
- Vinculação com endereços de entrega

## 🔗 Endpoints

### `POST /v1/orders`
Cria um novo pedido
```json
{
  "clientId": "uuid-do-cliente",
  "companyId": "uuid-da-empresa",
  "addressId": "uuid-do-endereco",
  "discount": 10.00,
  "products": [
    {
      "productId": "uuid-do-produto",
      "quantity": 2,
      "price": 75.00
    }
  ]
}
```

### `POST /v1/orders/checkout`
Realiza checkout do carrinho de compras
```json
{
  "companyId": "uuid-da-empresa",
  "clientId": "uuid-do-cliente",
  "addressId": "uuid-do-endereco",
  "discount": 5.00
}
```

### `GET /v1/orders`
Lista todos os pedidos do usuário autenticado

### `GET /v1/orders/:id`
Busca um pedido específico por ID

### `PATCH /v1/orders/:id`
Atualiza um pedido
```json
{
  "status": "DELIVERED",
  "discount": 15.00
}
```

### `DELETE /v1/orders/:id`
Remove um pedido

## 🔒 Autenticação

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado via JWT
- Cada usuário só pode acessar seus próprios pedidos

## 🔧 Validações de Segurança

- ✅ Usuário só vê pedidos que criou
- ✅ Usuário só pode criar pedidos vinculados a ele
- ✅ Usuário só pode editar/deletar seus próprios pedidos
- ✅ Validação de acesso à empresa e cliente
- ✅ Validação de endereço de entrega

## 📊 Estrutura de Dados

### Order
- `id`: UUID único
- `userId`: ID do usuário que criou o pedido
- `clientId`: ID do cliente
- `companyId`: ID da empresa
- `addressId`: ID do endereço de entrega (opcional)
- `status`: Status do pedido
- `total`: Valor total do pedido
- `discount`: Valor do desconto aplicado
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### OrderProduct
- `id`: UUID único
- `orderId`: ID do pedido
- `productId`: ID do produto
- `quantity`: Quantidade
- `price`: Preço unitário no momento da compra

## 🔗 Relacionamentos

- **User**: Pedido pertence a um usuário
- **Client**: Pedido está vinculado a um cliente
- **Company**: Pedido está vinculado a uma empresa
- **Address**: Pedido pode ter um endereço de entrega
- **Products**: Pedido contém múltiplos produtos através de `OrderProduct`
- **Payments**: Pedido pode ter múltiplos pagamentos

## 📊 Status de Pedido

- **PENDING**: Pedido pendente (padrão)
- **CONFIRMED**: Pedido confirmado
- **PREPARING**: Pedido em preparação
- **SHIPPED**: Pedido enviado
- **DELIVERED**: Pedido entregue
- **CANCELED**: Pedido cancelado

## 💡 Características

- **Checkout do carrinho**: Converte automaticamente itens do carrinho em pedido
- **Cálculo automático**: Total calculado automaticamente com base nos produtos e descontos
- **Histórico de preços**: Preços dos produtos são salvos no momento da compra
- **Múltiplos pagamentos**: Suporte a pagamentos parcelados
- **Endereço de entrega**: Vinculação opcional com endereços cadastrados

## 🔧 Validações de Negócio

- Cliente deve existir e pertencer ao usuário
- Empresa deve existir e o usuário deve ter acesso
- Produtos devem existir e pertencer à empresa
- Endereço deve existir e pertencer ao cliente/usuário
- Quantidades devem ser maiores que zero
- Desconto não pode ser maior que o total