# Módulo Compartilhado (Shared)

## 📋 Descrição
Módulo compartilhado que contém serviços e utilitários reutilizáveis entre diferentes módulos da aplicação. Principalmente serviços de integração com APIs externas.

## 🚀 Funcionalidades

### ExternalApiService
Serviço para integração com APIs externas, incluindo:

- **Busca de CEP**: Integração com API ViaCEP para busca de endereços
- Validação e formatação de CEP
- Tratamento de erros e respostas da API externa

## 🔧 Serviços Disponíveis

### `searchCEP(cep: string)`
Busca informações de endereço através do CEP na API ViaCEP.

**Parâmetros:**
- `cep`: CEP no formato "00000-000" ou "00000000"

**Retorno:**
```typescript
{
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
```

**Exemplo de uso:**
```typescript
const addressData = await externalApiService.searchCEP('01310-100');
```

## 📦 Exportações

Este módulo exporta:
- `ExternalApiService`: Serviço para integrações com APIs externas

## 💡 Características

- Serviços reutilizáveis em múltiplos módulos
- Tratamento centralizado de erros de APIs externas
- Formatação automática de dados (ex: remoção de caracteres especiais do CEP)
- Configuração de timeout e retry para requisições

## 🔗 Dependências

- `@nestjs/axios`: Cliente HTTP para requisições
- Utilizado principalmente pelo módulo de endereços

## 🚀 Expansões Futuras

Este módulo pode ser expandido para incluir:
- Integração com outros serviços externos
- Cache de requisições
- Rate limiting
- Outros utilitários compartilhados
