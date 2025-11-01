# Módulo de Usuário-Empresa

## 📋 Descrição
Módulo responsável pelo gerenciamento da relação entre usuários e empresas, definindo quais usuários têm acesso a quais empresas e seus respectivos papéis/funções.

## 🚀 Funcionalidades

- Vincular usuários a empresas
- Definir papel/função do usuário na empresa
- Listar vínculos por usuário ou empresa
- Atualizar papel do usuário
- Remover vínculo entre usuário e empresa
- Controle de acesso restrito a administradores

## 🔗 Endpoints

### `POST /v1/user-companies` 🔒 Admin
Cria um vínculo entre usuário e empresa
```json
{
  "userId": "uuid-do-usuario",
  "companyId": "uuid-da-empresa",
  "role": "CONSULTORA"
}
```

### `GET /v1/user-companies` 🔒 Admin
Lista todos os vínculos, com filtros opcionais:
- `?userId=uuid` - Lista empresas do usuário
- `?companyId=uuid` - Lista usuários da empresa
- `?userId=uuid&companyId=uuid` - Busca vínculo específico

### `GET /v1/user-companies/:id` 🔒 Admin
Busca um vínculo específico por ID

### `PATCH /v1/user-companies/:id` 🔒 Admin
Atualiza o papel/função do usuário na empresa
```json
{
  "role": "GERENTE"
}
```

### `DELETE /v1/user-companies/:id` 🔒 Admin
Remove um vínculo específico

### `DELETE /v1/user-companies/user/:userId/company/:companyId` 🔒 Admin
Remove vínculo por usuário e empresa específicos

## 🔒 Permissões

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado
- **AdminGuard**: Usuário com privilégios de administrador

## 📊 Estrutura de Dados

### UserCompany
- `id`: UUID único
- `userId`: ID do usuário
- `companyId`: ID da empresa
- `role`: Papel/função do usuário na empresa (ex: CONSULTORA, GERENTE, ADMIN)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔗 Relacionamentos

- **User**: Um usuário pode estar vinculado a múltiplas empresas
- **Company**: Uma empresa pode ter múltiplos usuários
- Relacionamento muitos-para-muitos com informações adicionais (role)

## 💡 Casos de Uso

- Consultoras podem trabalhar para múltiplas empresas
- Definir permissões específicas por empresa
- Controlar acesso a produtos e funcionalidades por empresa
- Organizar equipes e hierarquias dentro de empresas

## 🔧 Validações

- Usuário e empresa devem existir antes de criar vínculo
- Um usuário pode ter apenas um papel por empresa
- Validação de existência antes de remover vínculo
