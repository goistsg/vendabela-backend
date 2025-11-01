# Módulo de Pagamentos

## 📋 Descrição
Módulo responsável pelo gerenciamento de pagamentos do sistema, incluindo criação, atualização e controle de status de pagamentos vinculados a pedidos.

## 🚀 Funcionalidades

- Criar pagamentos vinculados a pedidos
- Listar pagamentos com filtro por status
- Buscar pagamentos por pedido
- Atualizar informações de pagamento
- Atualizar status de pagamento
- Remover pagamentos

## 🔗 Endpoints

### `POST /v1/payments`
Cria um novo pagamento
```json
{
  "orderId": "uuid-do-pedido",
  "amount": 150.00,
  "paymentMethod": "PIX",
  "status": "PENDING",
  "metadata": {
    "transactionId": "abc123",
    "pixKey": "email@example.com"
  }
}
```

### `GET /v1/payments`
Lista todos os pagamentos (ou filtrados por status)
```
GET /v1/payments?status=PENDING
```

### `GET /v1/payments/order/:orderId`
Busca todos os pagamentos de um pedido específico

### `GET /v1/payments/:id`
Busca um pagamento específico por ID

### `PUT /v1/payments/:id`
Atualiza informações de um pagamento
```json
{
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD",
  "metadata": {
    "cardLastDigits": "1234"
  }
}
```

### `PATCH /v1/payments/:id/status`
Atualiza apenas o status do pagamento
```json
{
  "status": "PAID"
}
```

### `DELETE /v1/payments/:id`
Remove um pagamento

## 🔒 Autenticação

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado via JWT

## 📊 Status de Pagamento

- **PENDING**: Pagamento pendente
- **PAID**: Pagamento confirmado
- **FAILED**: Pagamento falhou
- **REFUNDED**: Pagamento reembolsado
- **CANCELLED**: Pagamento cancelado

## 💳 Métodos de Pagamento

- **PIX**: Pagamento via PIX
- **CREDIT_CARD**: Cartão de crédito
- **DEBIT_CARD**: Cartão de débito
- **CASH**: Dinheiro
- **BANK_TRANSFER**: Transferência bancária

## 🔗 Relacionamentos

- **Order**: Pagamento está vinculado a um pedido
- Cada pedido pode ter múltiplos pagamentos (parcelas)

## 💡 Características

- Suporte a múltiplos pagamentos por pedido
- Histórico completo de alterações de status
- Metadados flexíveis para informações específicas do método de pagamento
- Rastreamento de transações e identificadores externos
