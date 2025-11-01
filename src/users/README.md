# Módulo de Usuários

## 📋 Descrição
Módulo responsável pelo gerenciamento de usuários do sistema, incluindo criação, listagem, atualização e remoção. Integrado com autenticação e controle de acesso.

## 🚀 Funcionalidades

- Criar novos usuários
- Listar todos os usuários (apenas admin)
- Buscar usuário específico
- Atualizar dados do usuário (apenas admin)
- Remover usuário (apenas admin)
- Verificação de permissões para visualização de perfil

## 🔗 Endpoints

### `POST /v1/users`
Cria um novo usuário
```json
{
  "name": "João Silva",
  "whatsapp": "+5511999999999",
  "planId": "uuid-do-plano",
  "segmentId": "uuid-do-segmento"
}
```

### `GET /v1/users` 🔒 Admin
Lista todos os usuários cadastrados

### `GET /v1/users/:id`
Busca um usuário específico por ID
- Usuários podem ver apenas seu próprio perfil
- Administradores podem ver qualquer perfil

### `PATCH /v1/users/:id` 🔒 Admin
Atualiza dados de um usuário
```json
{
  "name": "João Silva Santos",
  "planId": "uuid-do-plano-atualizado"
}
```

### `DELETE /v1/users/:id` 🔒 Admin
Remove um usuário do sistema

## 🔒 Permissões

- **AuthGuard**: Todos os endpoints requerem autenticação
- **AdminGuard**: Apenas administradores podem listar, atualizar e remover
- **Auto-visualização**: Usuários podem ver apenas seu próprio perfil

## 📊 Estrutura de Dados

### User
- `id`: UUID único
- `name`: Nome do usuário
- `whatsapp`: Número de WhatsApp (usado para autenticação)
- `planId`: ID do plano de assinatura
- `segmentId`: ID do segmento do usuário
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔗 Relacionamentos

- **Plan**: Usuário possui um plano de assinatura
- **Segment**: Usuário pertence a um segmento
- **Companies**: Usuário pode estar vinculado a múltiplas empresas (via `UserCompany`)
- **Clients**: Usuário pode ter múltiplos clientes
- **Orders**: Usuário pode ter múltiplos pedidos

## 💡 Características

- WhatsApp é o identificador único para autenticação
- Integração com sistema de autenticação OTP
- Controle de acesso baseado em plano (admin vs. usuário comum)
- Isolamento de dados por usuário

## 🔧 Validações

- WhatsApp deve ser único no sistema
- Plano deve existir antes de vincular
- Segmento deve existir antes de vincular
- Validação de permissões antes de visualizar perfil de outros usuários
