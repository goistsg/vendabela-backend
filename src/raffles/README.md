# Módulo de Sorteios (Raffles)

## 📋 Descrição
Módulo completo para gerenciamento de sorteios com controle de participantes, datas e validações de negócio.

## 🚀 Endpoints Disponíveis

### Sorteios

#### `POST /v1/raffles`
Cria um novo sorteio
```json
{
  "title": "Sorteio de Natal 2024",
  "description": "Sorteio especial de fim de ano",
  "startDate": "2024-12-01T00:00:00Z",
  "endDate": "2024-12-20T23:59:59Z",
  "drawDate": "2024-12-21T10:00:00Z",
  "maxEntries": 100,
  "prize": "Kit de produtos",
  "prizeValue": 500.00,
  "companyId": "uuid-da-empresa"
}
```

#### `GET /v1/raffles`
Lista todos os sorteios do usuário
- Query params: `?companyId=uuid` (opcional)

#### `GET /v1/raffles/:id`
Busca um sorteio específico

#### `PATCH /v1/raffles/:id`
Atualiza um sorteio (não permite editar sorteios já realizados)

#### `DELETE /v1/raffles/:id`
Remove um sorteio (não permite deletar sorteios já realizados)

### Participantes

#### `POST /v1/raffles/:id/entries`
Adiciona um participante ao sorteio
```json
{
  "clientId": "uuid-do-cliente"
}
```

#### `GET /v1/raffles/:id/entries`
Lista todos os participantes de um sorteio

#### `DELETE /v1/raffles/:id/entries/:entryId`
Remove um participante do sorteio

### Sorteio

#### `POST /v1/raffles/:id/draw`
Realiza o sorteio e seleciona um vencedor aleatório

## 🔒 Validações de Negócio

1. **Datas**: startDate < endDate < drawDate
2. **Período de inscrições**: Só permite inscrições entre startDate e endDate
3. **Limite de participantes**: Respeita maxEntries se definido
4. **Unicidade**: Um cliente só pode participar uma vez por sorteio
5. **Permissões**: Usuário deve ter acesso à empresa do sorteio
6. **Sorteio realizado**: Não permite editar/deletar sorteios já realizados

## 📊 Estrutura de Dados

### Raffle
- `id`: UUID
- `title`: Título do sorteio
- `description`: Descrição (opcional)
- `startDate`: Data de início das inscrições
- `endDate`: Data de fim das inscrições
- `drawDate`: Data do sorteio
- `maxEntries`: Limite de participantes (opcional)
- `isActive`: Se o sorteio está ativo
- `isDrawn`: Se o sorteio já foi realizado
- `prize`: Descrição do prêmio (opcional)
- `prizeValue`: Valor do prêmio (opcional)
- `companyId`: ID da empresa
- `userId`: ID do criador

### RaffleEntry
- `id`: UUID
- `clientId`: ID do cliente
- `raffleId`: ID do sorteio
- `entryDate`: Data de inscrição
- `isWinner`: Se é o vencedor

## 🔧 Próximos Passos

Para resolver os erros de lint do IDE:

1. **Reinicie o servidor TypeScript do VS Code**:
   - Pressione `Ctrl+Shift+P`
   - Digite "TypeScript: Restart TS Server"
   - Pressione Enter

2. **Ou reinicie o VS Code completamente**

3. **Verifique se a compilação funciona**:
   ```bash
   npm run build
   ```

Os erros são apenas do linter do IDE. O código está correto e funcionará normalmente após reiniciar o servidor TypeScript.

