# Módulo Prisma

## 📋 Descrição
Módulo que fornece o serviço Prisma para acesso ao banco de dados. Este é um módulo core da aplicação, utilizado por todos os outros módulos que precisam interagir com o banco de dados.

## 🚀 Funcionalidades

- Fornece conexão única com o banco de dados (singleton)
- Gerencia lifecycle da conexão Prisma
- Disponibiliza cliente Prisma para injeção de dependência
- Garante encerramento adequado da conexão ao desligar a aplicação

## 🔧 PrismaService

O `PrismaService` é um serviço injetável que:

- Estende `PrismaClient` do Prisma
- Implementa `OnModuleInit` e `OnModuleDestroy` para gerenciar conexão
- Conecta ao banco de dados quando o módulo é inicializado
- Desconecta do banco de dados quando a aplicação é encerrada
- Pode ser usado com lazy loading (conexão sob demanda)

## 📦 Exportações

Este módulo exporta:
- `PrismaService`: Serviço principal para acesso ao banco de dados
- `PrismaModule`: Módulo para importação em outros módulos

## 💡 Uso em Outros Módulos

```typescript
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  // ...
})
export class MeuModulo {}
```

**Injeção do serviço:**
```typescript
constructor(private prisma: PrismaService) {}

async findOne(id: string) {
  return this.prisma.user.findUnique({
    where: { id }
  });
}
```

## 🔗 Configuração

- Schema do banco de dados: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts`

## 🔒 Características

- Singleton pattern: apenas uma instância do PrismaClient
- Gerenciamento automático de conexão
- Type-safe: todas as queries são tipadas pelo Prisma
- Suporte a transações
- Suporte a relacionamentos complexos

## ⚙️ Comandos Úteis

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrations
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio

# Reset do banco
npx prisma migrate reset
```
