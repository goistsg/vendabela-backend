# Módulo de Favoritos

## 📋 Descrição
Módulo responsável pelo gerenciamento de produtos favoritos dos usuários, permitindo marcar e desmarcar produtos como favoritos por empresa.

## 🚀 Funcionalidades

- Adicionar produto aos favoritos
- Remover produto dos favoritos
- Listar todos os favoritos do usuário por empresa
- Isolamento por usuário e empresa

## 🔗 Endpoints

### `POST /v1/favorites/:productId`
Adiciona um produto aos favoritos
```json
{
  "companyId": "uuid-da-empresa"
}
```

### `DELETE /v1/favorites/:productId`
Remove um produto dos favoritos
```json
{
  "companyId": "uuid-da-empresa"
}
```

### `GET /v1/favorites/:companyId`
Lista todos os produtos favoritos do usuário para uma empresa específica

**Resposta:**
```json
[
  {
    "id": "uuid-do-favorito",
    "product": {
      "id": "uuid-do-produto",
      "name": "Produto Exemplo",
      "salePrice": 99.90,
      "imageUrls": ["url1", "url2"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🔒 Autenticação

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado via JWT
- Cada usuário possui sua própria lista de favoritos

## 🔧 Validações

- Produto deve existir e pertencer à empresa especificada
- Usuário deve ter acesso à empresa
- Produto não pode ser adicionado duas vezes aos favoritos
- Validação de existência antes de remover

## 💡 Características

- Favoritos são específicos por empresa (`companyId`)
- Permite organizar produtos de interesse do usuário
- Facilita busca rápida de produtos preferidos
- Relacionamento muitos-para-muitos entre usuários e produtos
