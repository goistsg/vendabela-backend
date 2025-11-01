# Módulo de Endereços

## 📋 Descrição
Módulo responsável pelo gerenciamento de endereços de clientes e usuários, incluindo busca de CEP via API externa (ViaCEP).

## 🚀 Funcionalidades

- Cadastro, atualização e remoção de endereços
- Busca de endereços por cliente
- Busca de endereços do próprio usuário
- Integração com API ViaCEP para busca de endereço por CEP
- Vinculação com clientes, usuários e pedidos

## 🔗 Endpoints

### `GET /v1/addresses`
Lista todos os endereços do usuário autenticado

### `GET /v1/addresses/client/:clientId`
Lista todos os endereços de um cliente específico

### `GET /v1/addresses/me`
Lista todos os endereços do usuário autenticado

### `GET /v1/addresses/:id`
Busca um endereço específico por ID

### `POST /v1/addresses`
Cria um novo endereço
```json
{
  "street": "Rua Exemplo",
  "number": "123",
  "complement": "Apto 45",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100",
  "clientId": "uuid-do-cliente" // opcional
}
```

### `PATCH /v1/addresses/:id`
Atualiza um endereço existente

### `DELETE /v1/addresses/:id`
Remove um endereço

## 🔒 Autenticação

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado via JWT
- Cada usuário só pode acessar seus próprios endereços ou endereços de seus clientes

## 🔧 Validações

- Endereços devem estar vinculados a um usuário (`userId`)
- Opcionalmente podem estar vinculados a um cliente (`clientId`)
- Busca automática de dados via ViaCEP quando necessário

## 📊 Relacionamentos

- **User**: Endereço pertence a um usuário
- **Client**: Endereço pode estar vinculado a um cliente (opcional)
- **Orders**: Endereço pode ser usado em múltiplos pedidos
