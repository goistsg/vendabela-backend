# 🛍️ Vendabela Backend

Backend completo para e-commerce desenvolvido com **NestJS**, **Prisma** e **PostgreSQL**. Sistema modular, escalável e pronto para produção com autenticação multi-método, sistema de avaliações, promoções e muito mais.

[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Sobre o Projeto

**Vendabela Backend** é uma API RESTful completa para e-commerce multi-tenant, oferecendo:

- 🔐 **Autenticação Multi-Método** (Email/Senha, OAuth, Phone, TOTP)
- 🛒 **E-commerce Completo** (Produtos, Carrinho, Checkout, Pagamentos)
- ⭐ **Sistema de Avaliações** com moderação e compra verificada
- 🎁 **Promoções Avançadas** (Cupons, BOGO, Frete Grátis, Desconto %)
- 📧 **Email Transacional** com templates personalizados (Resend)
- 🏢 **Multi-Tenant** com configuração por empresa
- 🎲 **Sistema de Sorteios** para engajamento
- 📊 **Diagramas e Documentação** completa

---

## 🚀 Principais Funcionalidades

### 🔐 Autenticação e Segurança

- ✅ **Multi-Auth**: Email/Password, Google OAuth (preparado), Facebook (preparado), Phone/WhatsApp, TOTP/2FA (preparado)
- ✅ **JWT Tokens** com expiração configurável
- ✅ **Recuperação de Senha** com tokens temporários
- ✅ **Verificação de Email** automática
- ✅ **Guards Customizados**: `AuthGuard`, `AdminGuard`, `CompanyAdminGuard`, `OptionalAuthGuard`
- ✅ **Decorators Customizados**: `@CurrentUser()`, `@CurrentCompany()`, `@IsCompanyAdmin()`
- ✅ **Bcrypt** para hash de senhas (salt 10 rounds)

### 🛍️ E-commerce Completo

#### 📦 Produtos
- Cadastro com imagens, SKU, categorias
- Ingredientes e alérgenos
- Gestão de estoque em tempo real
- Sistema de favoritos
- Média de avaliações automática

#### 🛒 Carrinho
- Carrinho persistente por usuário
- Cálculo de frete automático
- Aplicação de cupons/promoções
- Sessão anônima suportada

#### 💰 Checkout e Pagamentos
- Transações atômicas (Prisma)
- Validação de estoque antes da compra
- Múltiplos métodos: PIX, Cartão, Boleto
- Geração de QR Code PIX
- Webhooks para confirmação

#### ⭐ Sistema de Avaliações
- Review com nota (1-5), título, comentário e fotos
- **Compra Verificada** (badge)
- Sistema de moderação (Pending → Approved/Rejected)
- Votos "útil" em reviews
- Resposta do vendedor
- Report de reviews inadequados

#### 🎁 Promoções e Descontos
- **6 Tipos de Promoção**:
  - 💯 Porcentagem (ex: 20% OFF)
  - 💵 Valor Fixo (ex: R$ 50 OFF)
  - 🚚 Frete Grátis
  - 🎁 BOGO (Compre X, Leve Y)
  - 💰 Preço Fixo
  - 📦 Desconto por Quantidade
- Cupons com código personalizado
- Validações automáticas (período, limite de uso, valor mínimo)
- Promoções automáticas (aplicadas no carrinho)
- Acumulação de promoções (configurável)
- Restrições por produto/categoria/empresa

### 📧 Sistema de Emails

- **Provider**: Resend (transacional)
- **Templates**: HTML responsivos com cores da marca
- **Multi-Tenant**: Configuração por empresa
- **Tipos de Email**:
  - ✉️ Confirmação de cadastro
  - 🔐 Recuperação de senha
  - ✅ Verificação de email
  - 📦 Confirmação de pedido
  - 🚚 Atualização de status
  - 🎁 Promoções e ofertas

### 🏢 Multi-Tenant

- Isolamento de dados por empresa
- Roles por empresa: `CONSUMER`, `CONSULTANT`, `DIRECTOR`, `COMPANY_ADMIN`, `STORE`
- Header `x-company-id` para contexto
- Configurações personalizadas (email, branding, URL)

### 👥 Gestão de Clientes

- Cadastro completo com endereços
- Lead scoring
- Histórico de compras
- Múltiplos endereços
- Integração ViaCEP

### 🎲 Sistema de Sorteios

- Criação de rifas/sorteios
- Inscrição de clientes
- Código único por participante
- Seleção aleatória de vencedores
- Controle de datas e limites

---

## 🛠️ Stack Tecnológica

### **Core**
- **NestJS** v11 - Framework Node.js modular e escalável
- **TypeScript** v5.7 - Type safety em toda aplicação
- **Prisma** v6.17 - ORM moderno com type-safe queries
- **PostgreSQL** - Banco de dados relacional

### **Autenticação**
- **@nestjs/jwt** v11 - JWT tokens
- **bcrypt** v5.1 - Hash de senhas
- **crypto** (Node.js) - Geração de tokens

### **Email**
- **Resend** - Email transacional
- **Templates HTML** - Personalizados e responsivos

### **Validação**
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos
- **Swagger/OpenAPI** - Documentação automática

### **Utilidades**
- **Axios** - Cliente HTTP
- **RxJS** - Programação reativa

### **DevOps**
- **Docker** & **Docker Compose** - Containerização
- **ESLint** & **Prettier** - Qualidade de código
- **Jest** - Testes unitários e E2E

---

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Docker & Docker Compose (opcional)

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/vendabela-backend.git
cd vendabela-backend
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vendabela?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"

# App
NODE_ENV="development"
PORT=3000
APP_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@vendabela.com.br"
EMAIL_FROM_NAME="Vendabela"

# Multi-tenant (opcional - defaults)
DEFAULT_COMPANY_ID="default-company-uuid"
```

💡 **Gerar JWT_SECRET seguro:**
```bash
npm run generate:jwt-secret
```

#### 4. Configure o banco de dados

**Opção A: Docker (Recomendado)**
```bash
docker-compose up -d db
```

**Opção B: PostgreSQL Local**
```bash
# Configure uma instância PostgreSQL e ajuste DATABASE_URL no .env
```

#### 5. Execute as migrations
```bash
# Gera o cliente Prisma
npm run db:generate

# Aplica o schema ao banco
npm run db:push

# OU cria uma migration
npm run db:migrate
```

#### 6. Popule o banco (Opcional)
```bash
npm run db:seed
```

#### 7. Inicie a aplicação

**Desenvolvimento:**
```bash
npm run start:dev
```

**Produção:**
```bash
npm run build
npm run start:prod
```

🎉 **API disponível em:** `http://localhost:3000`

📚 **Documentação Swagger:** `http://localhost:3000/api`

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/
├── auth/                      # 🔐 Autenticação e Guards
│   ├── guards/                # AuthGuard, AdminGuard, etc.
│   ├── decorators/            # @CurrentUser, etc.
│   └── services/              # AuthService, JWT
│
├── users/                     # 👥 Gestão de usuários
├── companies/                 # 🏢 Gestão de empresas
├── user-companies/            # 🔗 Vínculo usuário-empresa
├── clients/                   # 👤 Gestão de clientes
├── address/                   # 📍 Endereços
│
├── products/                  # 📦 Catálogo de produtos
├── products-review/           # ⭐ Avaliações de produtos
├── carts/                     # 🛒 Carrinho de compras
├── orders/                    # 📋 Pedidos e checkout
├── payments/                  # 💳 Pagamentos
├── promotions/                # 🎁 Promoções e cupons
├── favorites/                 # ❤️ Produtos favoritos
│
├── raffles/                   # 🎲 Sistema de sorteios
├── feedbacks/                 # 💬 Feedbacks e testes
├── plains/                    # 📊 Planos de assinatura
│
├── store/                     # 🏪 API pública da loja
│   ├── decorators/            # @IsCompanyAdmin, helpers
│   └── services/              # StoreService
│
├── shared/                    # 🔧 Serviços compartilhados
│   └── services/
│       ├── email.service.ts           # Email com Resend
│       ├── payment-generator.ts       # Geração de PIX
│       ├── calculation.service.ts     # Cálculos
│       └── validate-user-company.ts   # Validações
│
├── prisma/                    # 🗄️ ORM e Database
│   ├── schema.prisma          # Schema do banco
│   └── seed.ts                # Seed inicial
│
└── main.ts                    # 🚀 Entry point

prisma/
├── schema.prisma              # Schema completo
├── migrations/                # Migrations do banco
└── seed.ts                    # Dados iniciais

docs/                          # 📚 Documentação
├── MIGRATION_EMAIL_AUTH.md    # Migração de autenticação
├── EMAIL_SERVICE_SETUP.md     # Setup do serviço de email
├── PROMOTIONS_SYSTEM.md       # Sistema de promoções
├── CUSTOM_DECORATORS.md       # Decorators customizados
└── CHANGELOG.md               # Histórico de mudanças

diagrams/                      # 📊 Diagramas
├── use-case-ecommerce.html    # Casos de uso
└── sequence-checkout.html     # Diagramas de sequência
```

### Princípios Arquiteturais

✅ **Modularidade** - Cada feature é um módulo independente  
✅ **Separation of Concerns** - Controllers, Services, DTOs bem separados  
✅ **DRY (Don't Repeat Yourself)** - Serviços compartilhados e reutilizáveis  
✅ **Type Safety** - TypeScript + Prisma em toda aplicação  
✅ **Dependency Injection** - IoC container do NestJS  
✅ **Guards e Decorators** - Autenticação e autorização declarativa  
✅ **Transações Atômicas** - Prisma transactions para consistência  

---

## 📚 Documentação da API

### Base URLs

- **API Principal**: `http://localhost:3000`
- **API v1**: `/v1/*`
- **Autenticação**: `/auth/*`
- **Swagger**: `/api`

### Autenticação

Todas as rotas protegidas requerem o header:

```http
Authorization: Bearer {seu_jwt_token}
```

Para rotas multi-tenant, adicione:

```http
x-company-id: {uuid_da_empresa}
```

### Módulos e Endpoints

#### 🔐 Autenticação (`/auth`)

```http
POST   /auth/register          # Criar conta (email/senha)
POST   /auth/login             # Login
POST   /auth/logout            # Logout
GET    /auth/profile           # Perfil do usuário
POST   /auth/forgot-password   # Recuperar senha
POST   /auth/reset-password    # Redefinir senha
POST   /auth/refresh           # Renovar token
```

#### 👥 Usuários (`/v1/users`)

```http
GET    /v1/users               # Listar (Admin)
GET    /v1/users/:id           # Buscar por ID
POST   /v1/users               # Criar usuário
PATCH  /v1/users/:id           # Atualizar
DELETE /v1/users/:id           # Remover (Admin)
POST   /v1/users/change-password  # Alterar senha
```

#### 📦 Produtos (`/v1/products`)

```http
GET    /v1/products            # Listar produtos da empresa
GET    /v1/products/:id        # Buscar por ID
POST   /v1/products            # Criar produto
PATCH  /v1/products/:id        # Atualizar
DELETE /v1/products/:id        # Remover
GET    /v1/products/:id/reviews # Listar avaliações
```

#### ⭐ Avaliações (`/v1/reviews`)

```http
GET    /v1/reviews             # Listar reviews (com filtros)
POST   /v1/reviews             # Criar review
PATCH  /v1/reviews/:id         # Editar review
DELETE /v1/reviews/:id         # Remover review
PATCH  /v1/reviews/:id/approve # Aprovar (Vendedor/Admin)
PATCH  /v1/reviews/:id/reject  # Rejeitar (Vendedor/Admin)
POST   /v1/reviews/:id/helpful # Marcar como útil
POST   /v1/reviews/:id/respond # Responder como vendedor
```

#### 🛒 Carrinho (`/v1/cart`)

```http
GET    /v1/cart                # Ver carrinho
POST   /v1/cart/items          # Adicionar item
PATCH  /v1/cart/items/:id      # Atualizar quantidade
DELETE /v1/cart/items/:id      # Remover item
POST   /v1/cart/calculate-shipping  # Calcular frete
POST   /v1/cart/apply-coupon   # Aplicar cupom
DELETE /v1/cart/coupon         # Remover cupom
DELETE /v1/cart                # Limpar carrinho
```

#### 📋 Pedidos (`/v1/orders`)

```http
GET    /v1/orders              # Listar pedidos
GET    /v1/orders/:id          # Buscar por ID
POST   /v1/orders              # Criar pedido
POST   /v1/orders/checkout     # Checkout do carrinho
PATCH  /v1/orders/:id          # Atualizar status
DELETE /v1/orders/:id          # Cancelar pedido
```

#### 🎁 Promoções (`/v1/promotions`)

```http
GET    /v1/promotions          # Listar promoções
GET    /v1/promotions/active   # Promoções ativas
GET    /v1/promotions/:id      # Buscar por ID
POST   /v1/promotions          # Criar (Admin)
PATCH  /v1/promotions/:id      # Atualizar (Admin)
DELETE /v1/promotions/:id      # Remover (Admin)
POST   /v1/promotions/validate # Validar cupom
GET    /v1/promotions/:id/stats # Estatísticas de uso
```

#### 💳 Pagamentos (`/v1/payments`)

```http
GET    /v1/payments            # Listar pagamentos
GET    /v1/payments/:id        # Buscar por ID
POST   /v1/payments/generate-pix  # Gerar PIX
POST   /webhooks/payment-confirmed # Webhook confirmação
```

#### 🎲 Sorteios (`/v1/raffles`)

```http
GET    /v1/raffles             # Listar sorteios
GET    /v1/raffles/:id         # Buscar por ID
POST   /v1/raffles             # Criar sorteio
POST   /v1/raffles/:id/enter   # Inscrever cliente
POST   /v1/raffles/:id/draw    # Realizar sorteio
GET    /v1/raffles/:id/winner  # Ver vencedor
```

#### 🏪 Store (API Pública)

```http
GET    /v1/store/products      # Catálogo público
GET    /v1/store/products/:id  # Detalhes do produto
GET    /v1/store/promotions    # Promoções ativas
```

### Swagger/OpenAPI

Documentação interativa disponível em:

```
http://localhost:3000/api
```

Ou importe o arquivo OpenAPI para Postman/Insomnia.

---

## 🔐 Sistema de Autenticação

### Métodos Suportados

| Método | Status | Descrição |
|--------|--------|-----------|
| Email/Password | ✅ Implementado | Login tradicional com hash bcrypt |
| Google OAuth | 🔜 Preparado | Schema e estrutura prontos |
| Facebook OAuth | 🔜 Preparado | Schema e estrutura prontos |
| Phone/WhatsApp | ⚠️ Legado | Sistema anterior (OTP SMS) |
| TOTP/2FA | 🔜 Preparado | Autenticador apps (Google, Microsoft) |
| Magic Link | 🔜 Preparado | Login sem senha via email |

### Fluxo de Autenticação (Email/Password)

```
1. Cliente → POST /auth/register
   { email, password, name }
   
2. Backend → Valida dados
           → Hash senha (bcrypt)
           → Cria usuário no banco
           → Envia email de boas-vindas
           
3. Cliente ← { user, message }

4. Cliente → POST /auth/login
   { email, password }
   
5. Backend → Busca usuário
           → Verifica se está ativo
           → Compara senha (bcrypt)
           → Gera JWT token
           → Atualiza lastLoginAt
           
6. Cliente ← { user, token }

7. Cliente → Requisições autenticadas
   Header: Authorization: Bearer {token}
```

### Recuperação de Senha

```
1. Cliente → POST /auth/forgot-password
   { email }
   
2. Backend → Gera token único (crypto)
           → Define expiração (1 hora)
           → Salva no banco
           → Envia email com link
           
3. Cliente → Abre email e clica no link

4. Cliente → POST /auth/reset-password
   { token, newPassword }
   
5. Backend → Valida token (existe e não expirou)
           → Hash nova senha
           → Atualiza senha
           → Limpa token
           → Envia email de confirmação
           
6. Cliente ← { message: "Senha atualizada" }
```

### Guards Disponíveis

```typescript
// 1. AuthGuard - Requer usuário autenticado
@UseGuards(AuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}

// 2. AdminGuard - Requer plan.name === 'ADMIN'
@UseGuards(AdminGuard)
@Delete(':id')
async delete(@Param('id') id: string) {
  // Apenas admins
}

// 3. CompanyAdminGuard - Requer role COMPANY_ADMIN na empresa
@UseGuards(CompanyAdminGuard)
@Patch(':id')
async update(@Body() dto: UpdateDto) {
  // Apenas admins da empresa
}

// 4. OptionalAuthGuard - Autenticação opcional
@UseGuards(OptionalAuthGuard)
@Get('products')
async findAll(@CurrentUser() user?: any) {
  // user pode ser null
}
```

### Decorators Customizados

```typescript
// Extrair usuário autenticado
@Get()
async find(@CurrentUser() user: any) {
  console.log(user.id, user.email);
}

// Extrair companyId do header
@Get()
async find(@CurrentCompany() companyId: string) {
  console.log(companyId);
}

// Verificar se é admin da empresa
@Get()
async find(@IsCompanyAdmin() isAdmin: boolean) {
  if (isAdmin) {
    // Lógica para admin
  }
}
```

**Documentação completa:** [`docs/CUSTOM_DECORATORS.md`](./docs/CUSTOM_DECORATORS.md)

---

## 📧 Sistema de Emails

### Provider: Resend

Configuração no `.env`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@vendabela.com.br"
EMAIL_FROM_NAME="Vendabela"
```

### Multi-Tenant

Cada empresa pode ter configurações próprias no banco:

```prisma
model Company {
  emailFrom     String?  // ex: noreply@minhaempresa.com
  emailFromName String?  // ex: "Minha Empresa"
  emailReplyTo  String?  // ex: contato@minhaempresa.com
  appUrl        String?  // ex: https://minhaempresa.com
}
```

### Templates Disponíveis

| Template | Descrição | Variáveis |
|----------|-----------|-----------|
| **Welcome** | Boas-vindas ao novo usuário | `userName`, `brandName`, `appUrl` |
| **Reset Password** | Link para redefinir senha | `resetLink`, `userName`, `brandName` |
| **Verification** | Verificação de email | `verificationLink`, `userName`, `brandName` |
| **Order Confirmation** | Confirmação de pedido | `orderNumber`, `items`, `total` |

### Cores Personalizadas

Todos os templates usam as cores da marca Vendabela:

- **Marsala**: `#B2515E` (primária)
- **Gold Soft**: `#BFA06A` (acentos)
- **Champagne**: `#F8E9E0` (fundos)
- **Charcoal**: `#2B2B2B` (textos)

### Uso no Código

```typescript
// Inject o EmailService
constructor(private emailService: EmailService) {}

// Enviar email de boas-vindas
await this.emailService.sendWelcomeEmail(
  user.email, 
  user.name,
  companyId // opcional
);

// Enviar email de reset de senha
await this.emailService.sendResetPasswordEmail(
  user.email,
  resetToken,
  user.name,
  companyId
);
```

**Documentação completa:** [`docs/EMAIL_SERVICE_SETUP.md`](./docs/EMAIL_SERVICE_SETUP.md)

---

## 🎁 Sistema de Promoções

### Tipos de Promoção

#### 1. **Porcentagem** (PERCENTAGE)
```json
{
  "type": "PERCENTAGE",
  "discountValue": 20,
  "maxDiscountAmount": 100
}
```
**Resultado:** 20% de desconto (máximo R$ 100)

#### 2. **Valor Fixo** (FIXED_AMOUNT)
```json
{
  "type": "FIXED_AMOUNT",
  "discountValue": 50
}
```
**Resultado:** R$ 50 de desconto

#### 3. **Frete Grátis** (FREE_SHIPPING)
```json
{
  "type": "FREE_SHIPPING",
  "isFreeShipping": true
}
```
**Resultado:** Frete zerado

#### 4. **BOGO** (Buy One Get One)
```json
{
  "type": "BOGO",
  "buyQuantity": 2,
  "getQuantity": 3
}
```
**Resultado:** Compre 2, Leve 3 (produto mais barato grátis)

#### 5. **Preço Fixo** (FIXED_PRICE)
```json
{
  "type": "FIXED_PRICE",
  "discountValue": 99.90
}
```
**Resultado:** Produto por R$ 99,90

#### 6. **Desconto por Quantidade** (QUANTITY_DISCOUNT)
```json
{
  "type": "QUANTITY_DISCOUNT",
  "minQuantity": 3,
  "discountValue": 10
}
```
**Resultado:** Compre 3+, ganhe 10% OFF

### Validações Automáticas

✅ Código existe?  
✅ Promoção ativa?  
✅ Dentro do período?  
✅ Limite total não atingido?  
✅ Limite por usuário OK?  
✅ Valor mínimo atingido?  
✅ Produtos aplicáveis?  
✅ Categorias aplicáveis?  
✅ Empresa aplicável?  

### Exemplo de Uso

```typescript
// Validar cupom
POST /v1/promotions/validate
{
  "code": "NATAL2024",
  "cartTotal": 150.00,
  "productIds": ["prod-1", "prod-2"]
}

// Resposta
{
  "valid": true,
  "discountAmount": 30.00,
  "promotion": { ... }
}
```

**Documentação completa:** [`docs/PROMOTIONS_SYSTEM.md`](./docs/PROMOTIONS_SYSTEM.md)

---

## 🛠️ Comandos Disponíveis

### Desenvolvimento

```bash
npm run start:dev              # Hot-reload
npm run start:dev:commerce     # Serviço commerce
npm run start:fast             # Modo rápido
```

### Build e Produção

```bash
npm run build                  # Compilar TypeScript
npm run build:prod             # Build otimizado
npm run start:prod             # Executar produção
```

### Banco de Dados (Prisma)

```bash
npm run db:generate            # Gerar Prisma Client
npm run db:push                # Aplicar schema (dev)
npm run db:migrate             # Criar migration (prod)
npm run db:seed                # Popular com dados
npm run db:reset               # Reset completo
npm run db:studio              # Abrir Prisma Studio
```

### Qualidade de Código

```bash
npm run lint                   # ESLint
npm run format                 # Prettier
npm run test                   # Testes unitários
npm run test:watch             # Modo watch
npm run test:cov               # Cobertura
npm run test:e2e               # Testes E2E
```

### Utilidades

```bash
npm run generate:jwt-secret    # Gerar JWT secret seguro
```

---

## 🐳 Docker

### Subir Serviços

```bash
# Todos os serviços
docker-compose up -d

# Apenas banco
docker-compose up -d db

# Logs
docker-compose logs -f

# Parar
docker-compose down

# Reset completo
docker-compose down -v
```

### Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| API | 3000 | http://localhost:3000 |
| PostgreSQL | 5433 | localhost:5433 |
| Adminer | 8080 | http://localhost:8080 |

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD ["node", "dist/main"]
```

---

## 📊 Diagramas

### Diagrama de Casos de Uso

Visualize todos os casos de uso do e-commerce:

```bash
open diagrams/use-case-ecommerce.html
```

**Inclui:**
- 🔐 Autenticação e cadastro
- 🔍 Navegação e busca
- 🛒 Gestão do carrinho
- 💰 Checkout e pagamento
- 📦 Pós-compra e avaliações
- 🎁 Promoções e sorteios

### Diagramas de Sequência

4 fluxos detalhados:

```bash
open diagrams/sequence-checkout.html
```

**Abas:**
1. **💰 Checkout Completo** - Do carrinho ao pagamento
2. **🔐 Autenticação** - Login e recuperação de senha
3. **⭐ Avaliar Produto** - Sistema de reviews
4. **🎁 Aplicar Promoção** - Validação de cupons

---

## 🧪 Testes

### Estrutura

```
test/
├── unit/                   # Testes unitários
├── integration/            # Testes de integração
└── e2e/                    # Testes end-to-end
```

### Executar Testes

```bash
# Todos os testes
npm run test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:cov

# E2E
npm run test:e2e

# Específico
npm run test -- users.service
```

### Coverage Goals

- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## 🔄 Workflow de Desenvolvimento

### Git Flow

```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver
# ... código ...

# 3. Testar
npm run test
npm run lint

# 4. Commit
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 5. Push
git push origin feature/nova-funcionalidade

# 6. Pull Request
# Abrir PR no GitHub
```

### Conventional Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas gerais
```

### Code Review Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes passando
- [ ] Sem erros de lint
- [ ] Documentação atualizada
- [ ] Types corretos (TypeScript)
- [ ] Sem logs de debug
- [ ] Performance adequada

---

## 📚 Documentação Adicional

### Documentos Internos

- [📧 Email Service Setup](./docs/EMAIL_SERVICE_SETUP.md)
- [🔐 Migration Email Auth](./docs/MIGRATION_EMAIL_AUTH.md)
- [🎁 Promotions System](./docs/PROMOTIONS_SYSTEM.md)
- [🎨 Custom Decorators](./docs/CUSTOM_DECORATORS.md)
- [📝 Changelog](./docs/CHANGELOG.md)

### Links Externos

- [NestJS Documentation](https://nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Resend API Docs](https://resend.com/docs)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👥 Equipe

**Desenvolvedor Principal:** Tiago Gois  
**GitHub:** [@goistsg](https://github.com/goistsg)

---

## 🙏 Agradecimentos

- NestJS Team
- Prisma Team
- Resend Team
- Open Source Community

---

<p align="center">
  Desenvolvido com ❤️ usando <strong>NestJS</strong> e <strong>TypeScript</strong>
</p>

<p align="center">
  <strong>Vendabela Backend</strong> - E-commerce Moderno e Escalável
</p>
