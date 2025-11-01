# Módulo de Clientes

## Vínculo com Usuários

O sistema de clientes agora está vinculado aos usuários. Cada usuário só pode acessar clientes que criou ou que pertencem às suas empresas.

### Como funciona

1. **Relação no banco**: Clientes estão vinculados a usuários (`userId`) e empresas (`companyId`)
2. **Filtros automáticos**: Quando um `userId` é fornecido, apenas clientes do usuário são retornados
3. **Isolamento por usuário**: Cada usuário tem sua própria base de clientes

### Uso da API

#### Headers necessários
```
user-id: <uuid-do-usuario>
```

#### Endpoints

**Listar clientes do usuário**
```http
GET /clients
Headers: user-id: <uuid-do-usuario>
```

**Buscar cliente específico**
```http
GET /clients/{id}
Headers: user-id: <uuid-do-usuario>
```

**Criar cliente**
```http
POST /clients
Headers: user-id: <uuid-do-usuario>
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "birthday": "1990-01-01T00:00:00.000Z",
  "companyId": "<uuid-da-empresa>"
}
```

**Atualizar cliente**
```http
PATCH /clients/{id}
Headers: user-id: <uuid-do-usuario>
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "+5511888888888"
}
```

**Deletar cliente**
```http
DELETE /clients/{id}
Headers: user-id: <uuid-do-usuario>
```

### Validações de Segurança

- ✅ Usuário só vê clientes que criou
- ✅ Usuário só pode criar clientes vinculados a ele
- ✅ Usuário só pode editar/deletar seus próprios clientes
- ✅ Erro 404 se tentar acessar cliente sem permissão

### Exemplo de Resposta

```json
{
  "id": "uuid-do-cliente",
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "birthday": "1990-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "whatsapp": "+5511777777777"
  },
  "company": {
    "id": "uuid-da-empresa",
    "name": "Nome da Empresa",
    "identifier": "empresa-123"
  },
  "addresses": [],
  "sales": []
}
```

### Relacionamentos

- **User**: Cliente pertence a um usuário
- **Company**: Cliente está vinculado a uma empresa
- **Addresses**: Cliente pode ter múltiplos endereços
- **Sales**: Cliente pode ter múltiplas vendas


### Lead Score (Qualificação)
- **Escala**: 0-100 pontos
- **Critérios de pontuação**:
  - 0-20: Lead frio (apenas cadastrado)
  - 21-40: Lead morno (demonstrou interesse)
  - 41-60: Lead quente (interesse ativo)
  - 61-80: Lead muito quente (pronto para compra)
  - 81-100: Cliente fidelizado (compras recorrentes)