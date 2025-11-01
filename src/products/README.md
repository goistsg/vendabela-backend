# Módulo de Produtos

## Vínculo com Usuários

O sistema de produtos agora está vinculado aos usuários através das empresas. Cada usuário só pode acessar produtos das empresas das quais faz parte.

### Como funciona

1. **Relação no banco**: Produtos estão vinculados a empresas (`companyId`)
2. **Usuários e empresas**: Usuários são vinculados a empresas através da tabela `UserCompany`
3. **Filtros automáticos**: Quando um `userId` é fornecido, apenas produtos das empresas do usuário são retornados

### Uso da API

#### Headers necessários
```
user-id: <uuid-do-usuario>
```

#### Endpoints

**Listar produtos do usuário**
```http
GET /v1/products
Headers: user-id: <uuid-do-usuario>
```

**Buscar produto específico**
```http
GET /v1/products/{id}
Headers: user-id: <uuid-do-usuario>
```

**Criar produto**
```http
POST /v1/products
Headers: user-id: <uuid-do-usuario>
Content-Type: application/json

{
  "name": "Produto Exemplo",
  "companyId": "<uuid-da-empresa>",
  "costPrice": 10.0,
  "lastPrice": 15.0,
  "salePrice": 20.0,
  "stock": 100
}
```

**Atualizar produto**
```http
PATCH /v1/products/{id}
Headers: user-id: <uuid-do-usuario>
Content-Type: application/json

{
  "name": "Produto Atualizado",
  "stock": 150
}
```

**Deletar produto**
```http
DELETE /v1/products/{id}
Headers: user-id: <uuid-do-usuario>
```

### Validações de Segurança

- ✅ Usuário só vê produtos das suas empresas
- ✅ Usuário só pode criar produtos em empresas das quais faz parte
- ✅ Usuário só pode editar/deletar produtos das suas empresas
- ✅ Erro 404 se tentar acessar produto sem permissão

### Exemplo de Resposta

```json
{
  "id": "uuid-do-produto",
  "name": "Produto Exemplo",
  "category": "Categoria",
  "sku": "SKU123",
  "description": "Descrição do produto",
  "imageUrls": ["url1", "url2"],
  "recommendations": ["produto1", "produto2"],
  "usageNotes": "Notas de uso",
  "costPrice": 10.0,
  "lastPrice": 15.0,
  "salePrice": 20.0,
  "stock": 100,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "company": {
    "id": "uuid-da-empresa",
    "name": "Nome da Empresa",
    "identifier": "empresa-123"
  }
}
```
