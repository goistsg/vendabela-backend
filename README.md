# Vendabela Backend

Backend da aplicação Vendabela, uma plataforma completa para gestão de vendas, produtos, clientes e pedidos desenvolvida com NestJS.

## 📋 Sobre

Sistema backend modular para gerenciamento de e-commerce, permitindo controle de produtos, clientes, pedidos, pagamentos e sorteios.

## 🛠️ Tecnologias

### Core
- **NestJS** (v11) - Framework Node.js para construção de aplicações escaláveis
- **TypeScript** (v5.7) - Linguagem de programação
- **Prisma** (v6.17) - ORM moderno para acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional

### Autenticação e Segurança
- **@nestjs/jwt** (v11) - Autenticação JWT
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de objetos

### Utilitários
- **Axios** - Cliente HTTP para requisições externas
- **RxJS** - Programação reativa

### Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **Jest** - Framework de testes
- **Docker** - Containerização

## 🏗️ Arquitetura

A aplicação é construída seguindo os princípios da arquitetura modular do NestJS, organizada em módulos independentes e reutilizáveis:

```
src/
├── app.module.ts              # Módulo raiz da aplicação
├── main.ts                    # Entry point principal
├── main_commerce.ts           # Entry point do serviço commerce
│
├── auth/                      # Autenticação e autorização
├── users/                     # Gestão de usuários
├── companies/                 # Gestão de empresas
├── user-companies/            # Vínculo usuário-empresa
├── clients/                   # Gestão de clientes
├── address/                   # Gestão de endereços
├── products/                  # Gestão de produtos
├── carts/                     # Carrinho de compras
├── orders/                    # Gestão de pedidos
├── payments/                  # Gestão de pagamentos
├── favorites/                 # Produtos favoritos
├── raffles/                   # Sistema de sorteios
├── plains/                    # Planos de assinatura
├── feedbacks/                 # Feedbacks e testes
├── prisma/                    # Configuração do Prisma
└── shared/                    # Serviços compartilhados
```

### Características da Arquitetura

- **Modularidade**: Cada funcionalidade é um módulo independente
- **Separação de Responsabilidades**: Controllers, Services e DTOs bem definidos
- **Reutilização**: Módulos compartilhados (Prisma, Auth, Shared)
- **Type Safety**: TypeScript em toda a aplicação
- **Validação**: DTOs com validação automática usando class-validator
- **Guards**: Proteção de rotas com AuthGuard e AdminGuard

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (ou Docker)
- Docker e Docker Compose (opcional, mas recomendado)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd vendabela-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vendabela?schema=public"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
PORT=3000
```

Para gerar um JWT_SECRET seguro:
```bash
npm run generate:jwt-secret
```

4. **Configure o banco de dados**

Com Docker:
```bash
docker-compose up -d db
```

Ou configure manualmente uma instância PostgreSQL.

5. **Execute as migrations**
```bash
npm run db:push
```

6. **Gere o cliente Prisma**
```bash
npm run db:generate
```

7. **Popule o banco (opcional)**
```bash
npm run db:seed
```

8. **Inicie a aplicação**

Desenvolvimento:
```bash
npm run start:dev
```

Produção:
```bash
npm run build
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Documentação da API

A API está organizada em módulos. Cada módulo possui sua própria documentação:

### Endpoints Principais

- **Base URL**: `http://localhost:3000/app`

### Módulos Documentados

- **[Autenticação](./src/auth/README.md)** - Sistema de login com WhatsApp + OTP
- **[Usuários](./src/users/README.md)** - Gestão de usuários do sistema
- **[Empresas](./src/companies/README.md)** - Gestão de empresas (Admin)
- **[Usuário-Empresa](./src/user-companies/README.md)** - Vínculo entre usuários e empresas
- **[Clientes](./src/clients/README.md)** - Gestão de clientes
- **[Endereços](./src/address/README.md)** - Gestão de endereços
- **[Produtos](./src/products/README.md)** - Gestão de produtos
- **[Carrinho](./src/carts/README.md)** - Carrinho de compras
- **[Pedidos](./src/orders/README.md)** - Gestão de pedidos e checkout
- **[Pagamentos](./src/payments/README.md)** - Gestão de pagamentos
- **[Favoritos](./src/favorites/README.md)** - Produtos favoritos
- **[Sorteios](./src/raffles/README.md)** - Sistema de sorteios
- **[Planos](./src/plains/README.md)** - Planos de assinatura
- **[Feedbacks](./src/feedbacks/README.md)** - Feedbacks e testes

### Estrutura de Endpoints

Todos os endpoints da API seguem o padrão:
- Autenticação: `/app/auth/*`
- API v1: `/app/v1/*`
- Proteção: Maioria requer autenticação JWT

## 🔐 Autenticação

O sistema utiliza autenticação baseada em **WhatsApp + OTP** e **JWT tokens**.

### Fluxo de Autenticação

1. **Login**: Usuário envia WhatsApp
   ```http
   POST /app/auth/login
   {
     "whatsapp": "+5511999999999"
   }
   ```

2. **OTP**: Sistema envia código de 6 dígitos via WhatsApp

3. **Verificação**: Usuário envia OTP para validar
   ```http
   POST /app/auth/verify-otp
   {
     "whatsapp": "+5511999999999",
     "otpCode": "123456"
   }
   ```

4. **Token**: Sistema retorna token JWT válido por 24 horas

5. **Requisições Autenticadas**: Incluir token no header
   ```http
   Authorization: Bearer <token>
   ```

### Proteção de Rotas

- **AuthGuard**: Protege rotas que requerem autenticação
- **AdminGuard**: Protege rotas que requerem privilégios de administrador
- **@CurrentUser()**: Decorator para extrair usuário autenticado nos controllers

### Mais Detalhes

Consulte a [documentação completa de autenticação](./src/auth/README.md).

## ✨ Funcionalidades Principais

### 👥 Gestão de Usuários e Empresas
- Cadastro e autenticação de usuários
- Sistema de planos e segmentos
- Vínculo de usuários com múltiplas empresas
- Controle de papéis e permissões (Admin, Consultora, etc.)

### 🛍️ E-commerce
- **Produtos**: Cadastro, atualização e busca de produtos por empresa
- **Carrinho**: Gerenciamento de carrinho de compras
- **Pedidos**: Criação de pedidos com checkout do carrinho
- **Pagamentos**: Gestão de pagamentos vinculados a pedidos
- **Favoritos**: Produtos favoritos do usuário

### 👤 Gestão de Clientes
- Cadastro completo de clientes
- Múltiplos endereços por cliente
- Sistema de qualificação (Lead Score)
- Histórico de pedidos por cliente

### 🎲 Sorteios
- Criação e gerenciamento de sorteios
- Inscrição de clientes
- Realização de sorteios com seleção aleatória de vencedores
- Controle de datas e limites

### 📦 Outras Funcionalidades
- **Endereços**: Integração com ViaCEP para busca automática
- **Feedbacks**: Coleta de feedbacks e sessões de teste
- **Planos**: Gestão de planos de assinatura com estatísticas

### 🔒 Segurança e Isolamento
- Dados isolados por usuário
- Validação de acesso a recursos
- Proteção contra acesso não autorizado
- Auditoria de operações

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
npm run start:dev              # Desenvolvimento com hot-reload
npm run start:dev:commerce    # Serviço commerce em desenvolvimento
npm run start:fast            # Desenvolvimento rápido
```

### Build e Produção
```bash
npm run build                  # Build da aplicação
npm run build:prod             # Build para produção
npm run start:prod            # Executar em produção
```

### Banco de Dados
```bash
npm run db:generate           # Gerar cliente Prisma
npm run db:push               # Aplicar schema ao banco
npm run db:seed               # Popular banco com dados de teste
npm run db:reset              # Reset e seed do banco
npm run db:studio             # Abrir Prisma Studio
npm run db:migrate            # Criar migration
```

### Qualidade de Código
```bash
npm run lint                  # Verificar e corrigir código
npm run format                # Formatar código
npm run test                  # Executar testes
npm run test:watch            # Testes em modo watch
npm run test:cov              # Testes com cobertura
```

### Utilitários
```bash
npm run generate:jwt-secret   # Gerar JWT secret
```

## 🐳 Docker

### Subir Serviços

```bash
# Todos os serviços
docker-compose up -d

# Apenas banco de dados
docker-compose up -d db

# Parar serviços
docker-compose down
```

### Portas

- **API Principal**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5433`
- **Adminer**: `http://localhost:8080`

## 📋 Estrutura do Projeto

```
vendabela-backend/
├── src/                     # Código fonte
│   ├── */                   # Módulos da aplicação
│   │   ├── controller/      # Controllers REST
│   │   ├── services/        # Lógica de negócio
│   │   ├── dto/             # Data Transfer Objects
│   │   └── *.module.ts      # Definição do módulo
│   ├── app.module.ts        # Módulo raiz
│   └── main.ts              # Entry point
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Seed do banco
├── test/                    # Testes E2E
├── docs/                    # Documentação adicional
├── docker-compose.yaml      # Configuração Docker
├── Dockerfile               # Dockerfile da aplicação
└── package.json             # Dependências e scripts
```

## 🔄 Workflow de Desenvolvimento

1. Crie uma branch para sua feature
2. Desenvolva a funcionalidade no módulo apropriado
3. Execute os testes: `npm run test`
4. Verifique o lint: `npm run lint`
5. Faça commit das mudanças
6. Abra um Pull Request

## 📚 Documentação Adicional

- [NestJS Documentation](https://nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 👤 Autores

**Tiago Gois** - [@goistsg](https://github.com/goistsg)

---

Desenvolvido com ❤️ usando NestJS e TypeScript