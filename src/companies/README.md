# Módulo de Empresas

## 📋 Descrição
Módulo responsável pelo gerenciamento de empresas do sistema. Permite criar, listar, atualizar e remover empresas. Requer privilégios de administrador.

## 🚀 Funcionalidades

- Cadastro de empresas
- Listagem de todas as empresas
- Busca de empresa específica
- Atualização de dados da empresa
- Remoção de empresas
- Controle de acesso restrito a administradores

## 🔗 Endpoints

### `POST /v1/companies` 🔒 Admin
Cria uma nova empresa
```json
{
  "name": "Empresa XYZ",
  "identifier": "empresa-xyz",
  "document": "12.345.678/0001-90",
  "email": "contato@empresa.com",
  "phone": "+5511999999999"
}
```

### `GET /v1/companies` 🔒 Admin
Lista todas as empresas cadastradas

### `GET /v1/companies/:id` 🔒 Admin
Busca uma empresa específica por ID

### `PATCH /v1/companies/:id` 🔒 Admin
Atualiza dados de uma empresa

### `DELETE /v1/companies/:id` 🔒 Admin
Remove uma empresa do sistema

## 🔒 Permissões

Todos os endpoints requerem:
- **AuthGuard**: Usuário autenticado
- **AdminGuard**: Usuário com privilégios de administrador

## 📊 Estrutura de Dados

### Company
- `id`: UUID único
- `name`: Nome da empresa
- `identifier`: Identificador único (usado em URLs)
- `document`: CNPJ da empresa
- `email`: Email de contato
- `phone`: Telefone de contato
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔗 Relacionamentos

- **Users**: Empresas estão vinculadas a usuários através de `UserCompany`
- **Products**: Empresa pode ter múltiplos produtos
- **Orders**: Empresa pode ter múltiplos pedidos
- **Clients**: Empresa pode ter múltiplos clientes
- **Raffles**: Empresa pode ter múltiplos sorteios

## 💡 Notas Importantes

- Empresas são criadas apenas por administradores
- Cada empresa possui um identificador único (`identifier`)
- Empresas são essenciais para organizar produtos, pedidos e clientes
