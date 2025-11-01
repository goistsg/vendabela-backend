# Módulo de Feedbacks

## 📋 Descrição
Módulo responsável pelo gerenciamento de feedbacks de usuários e sessões de teste. Permite coletar feedbacks sobre o sistema e rastrear sessões de teste.

## 🚀 Funcionalidades

- Criar sessões de teste
- Coletar feedbacks de usuários
- Rastrear interações durante testes
- Armazenar informações sobre experiência do usuário

## 🔗 Endpoints

### `POST /v1/feedbacks/session/start`
Inicia uma nova sessão de teste
```json
{
  "userId": "uuid-do-usuario",
  "sessionType": "FEATURE_TEST",
  "metadata": {
    "feature": "checkout",
    "version": "1.0.0"
  }
}
```

### `POST /v1/feedbacks`
Cria um novo feedback
```json
{
  "sessionId": "uuid-da-sessao",
  "rating": 5,
  "comment": "Ótima experiência de uso",
  "category": "USER_EXPERIENCE",
  "metadata": {
    "screen": "checkout",
    "action": "payment_completed"
  }
}
```

## 🔒 Autenticação

- Endpoints públicos (sem autenticação obrigatória)
- Pode ser protegido conforme necessidade do negócio

## 📊 Estrutura de Dados

### TestSession
- `id`: UUID único
- `userId`: ID do usuário (opcional)
- `sessionType`: Tipo de sessão
- `startedAt`: Data de início
- `endedAt`: Data de término (opcional)
- `metadata`: Dados adicionais em JSON

### UserFeedback
- `id`: UUID único
- `sessionId`: ID da sessão de teste
- `rating`: Nota de 1 a 5
- `comment`: Comentário do usuário
- `category`: Categoria do feedback
- `metadata`: Dados adicionais em JSON
- `createdAt`: Data de criação

## 💡 Casos de Uso

- Coletar feedback sobre novas funcionalidades
- Rastrear experiência do usuário durante testes
- Identificar problemas e pontos de melhoria
- Analisar satisfação do usuário
