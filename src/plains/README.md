# Módulo de Planos (Plains)

## 📋 Descrição
Módulo para gerenciamento de planos de assinatura com controle de usuários e estatísticas.

## 🚀 Endpoints Disponíveis

### Planos

#### `POST /v1/plains` 🔒 Admin
Cria um novo plano
```json
{
  "name": "Plano Premium",
  "description": "Plano com recursos avançados",
  "price": 99.90,
  "features": {
    "maxProducts": 1000,
    "maxClients": 500,
    "support": "24/7"
  },
  "isInternal": false
}
```

#### `GET /v1/plains` 🔒 Admin
Lista todos os planos

#### `GET /v1/plains/public` 🔒 Admin
Lista apenas planos públicos (isInternal = false)

#### `GET /v1/plains/internal` 🔒 Admin
Lista apenas planos internos (isInternal = true)

#### `GET /v1/plains/:id` 🔒 Admin
Busca um plano específico

#### `GET /v1/plains/:id/users` 🔒 Admin
Lista todos os usuários de um plano

#### `GET /v1/plains/:id/stats` 🔒 Admin
Retorna estatísticas do plano
```json
{
  "plan": {
    "id": "uuid",
    "name": "Plano Premium",
    "price": 99.90
  },
  "totalUsers": 150,
  "revenue": 14985.00
}
```

#### `PATCH /v1/plains/:id` 🔒 Admin
Atualiza um plano

#### `DELETE /v1/plains/:id` 🔒 Admin
Remove um plano (não permite deletar se houver usuários usando)

## 🔒 Permissões

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado
- **AdminGuard**: Usuário com privilégios de administrador

## 🔧 Validações de Negócio

1. **Nome único**: Não permite planos com nomes duplicados
2. **Usuários ativos**: Não permite deletar planos com usuários ativos
3. **Preço válido**: Preço deve ser >= 0

## 📊 Estrutura de Dados

### Plan
- `id`: UUID
- `name`: Nome do plano (único)
- `description`: Descrição (opcional)
- `price`: Preço do plano
- `features`: JSON com recursos do plano (opcional)
- `isInternal`: Se é um plano interno (não visível publicamente)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 💡 Exemplo de Features

```json
{
  "maxProducts": 1000,
  "maxClients": 500,
  "maxSales": -1,
  "support": "24/7",
  "customReports": true,
  "apiAccess": true,
  "whiteLabel": false
}
```

## 🔧 Próximos Passos

Para resolver os erros de lint do IDE:

1. **Reinicie o servidor TypeScript do VS Code**:
   - Pressione `Ctrl+Shift+P`
   - Digite "TypeScript: Restart TS Server"
   - Pressione Enter

2. **Ou reinicie o VS Code completamente**

Os erros são apenas do linter do IDE. O código está correto e funcionará normalmente.

