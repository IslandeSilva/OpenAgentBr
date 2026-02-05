# 🔄 Migração de Banco de Dados - Sistema de Conversas

## ⚠️ IMPORTANTE - LEIA ANTES DE USAR O SISTEMA

Este projeto agora inclui um sistema completo de conversas que requer atualizações no banco de dados Supabase.

## 📋 O Que Mudou?

### Novas Funcionalidades:
1. ✅ **Sistema de Conversas** - Múltiplas conversas por agente
2. ✅ **Rastreamento de Tokens** - Contagem de tokens por mensagem
3. ✅ **Cálculo de Custos** - Custo estimado por conversa
4. ✅ **Menu Mobile Responsivo** - Menu hamburguer para mobile
5. ✅ **Editar e Deletar Agentes** - Gerenciamento completo de agentes
6. ✅ **Limite de Mensagens** - Máximo de 100 mensagens por conversa

### Novas Tabelas:
- `conversations` - Armazena as conversas
- `available_models` - Informações de preços dos modelos

### Colunas Adicionadas:
- `chat_messages.conversation_id` - Liga mensagens a conversas
- `chat_messages.tokens_used` - Tokens usados na mensagem
- `chat_messages.cost` - Custo da mensagem
- `file_uploads.message_id` - Liga arquivos a mensagens (se existir)

## 🚀 Como Aplicar a Migração

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para [https://supabase.com](https://supabase.com)
   - Faça login e selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute a Migração**
   - Copie TODO o conteúdo do arquivo `supabase/migrations/20240101_add_conversations.sql`
   - Cole no SQL Editor
   - Clique em **Run** (ou pressione Ctrl+Enter)
   - Aguarde a mensagem de sucesso ✅

4. **Verifique as Tabelas**
   - Vá em **Table Editor** no menu lateral
   - Você deve ver as novas tabelas:
     - `conversations`
     - `available_models`
   - E as colunas adicionadas em `chat_messages`

### Opção 2: Via Supabase CLI (Para Desenvolvedores)

```bash
# 1. Certifique-se de ter o Supabase CLI instalado
npm install -g supabase

# 2. Faça login no Supabase
supabase login

# 3. Link seu projeto local
supabase link --project-ref your-project-ref

# 4. Execute a migração
supabase db push
```

## 📊 Estrutura das Novas Tabelas

### Tabela: `conversations`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único da conversa |
| `user_id` | uuid | ID do usuário |
| `agent_id` | uuid | ID do agente |
| `title` | text | Título da conversa (primeira mensagem) |
| `message_count` | integer | Quantidade de mensagens |
| `total_tokens` | integer | Total de tokens usados |
| `total_cost` | decimal | Custo total da conversa |
| `last_message_at` | timestamp | Data da última mensagem |
| `created_at` | timestamp | Data de criação |

### Tabela: `available_models`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `user_id` | uuid | ID do usuário |
| `model_id` | text | ID do modelo (ex: gpt-4-turbo) |
| `model_name` | text | Nome amigável do modelo |
| `pricing` | jsonb | `{"prompt": 0.01, "completion": 0.03}` |
| `created_at` | timestamp | Data de criação |

## ✨ Funcionalidades Após a Migração

### 1. Sistema de Conversas
```typescript
// Criar nova conversa (automático ao enviar primeira mensagem)
// Alternar entre conversas
// Deletar conversas antigas
// Ver histórico de conversas no sidebar
```

### 2. Rastreamento de Tokens e Custos
```typescript
// Ver tokens usados por conversa
// Ver custo estimado por conversa
// Estatísticas em tempo real no header
```

### 3. Limite de Mensagens
```typescript
// Máximo de 100 mensagens por conversa
// Notificação quando atingir o limite
// Criar nova conversa automaticamente
```

### 4. Mobile Responsivo
```typescript
// Menu hamburguer em telas pequenas
// Sidebar de conversas oculta em mobile
// Interface totalmente responsiva
```

### 5. Gerenciamento de Agentes
```typescript
// Editar agente (nome, descrição, modelo, prompt, etc)
// Deletar agente com confirmação
// Botão "Editar" na página do agente
```

## 🔧 Triggers e Funções Automáticas

A migração cria automaticamente:

1. **Trigger `update_conversation_stats_trigger`**
   - Atualiza estatísticas da conversa quando uma nova mensagem é adicionada
   - Atualiza: `message_count`, `total_tokens`, `total_cost`, `last_message_at`

2. **Função `update_conversation_stats()`**
   - Calcula e atualiza as estatísticas da conversa
   - Executada automaticamente pelo trigger

## 🛡️ Políticas de Segurança (RLS)

Todas as novas tabelas têm Row Level Security (RLS) habilitado:

- ✅ Usuários podem ver apenas suas próprias conversas
- ✅ Usuários podem criar apenas suas próprias conversas
- ✅ Usuários podem atualizar apenas suas próprias conversas
- ✅ Usuários podem deletar apenas suas próprias conversas
- ✅ O mesmo se aplica para `available_models`

## 📝 Índices para Performance

A migração cria índices para melhorar a performance:

```sql
-- Conversas
CREATE INDEX conversations_user_id_idx ON conversations(user_id);
CREATE INDEX conversations_agent_id_idx ON conversations(agent_id);
CREATE INDEX conversations_last_message_at_idx ON conversations(last_message_at DESC);

-- Mensagens
CREATE INDEX chat_messages_conversation_id_idx ON chat_messages(conversation_id);

-- Modelos
CREATE INDEX available_models_user_id_idx ON available_models(user_id);
CREATE INDEX available_models_model_id_idx ON available_models(model_id);
```

## 🔄 Compatibilidade com Dados Existentes

### Mensagens Antigas sem Conversa

As mensagens antigas que não têm `conversation_id` continuarão funcionando:

- A coluna `conversation_id` é **nullable** (pode ser NULL)
- Novas mensagens sempre terão uma conversa
- Mensagens antigas sem conversa não aparecem no sidebar
- Você pode criar novas conversas normalmente

### Agentes Existentes

- Todos os agentes existentes continuam funcionando
- Agora podem ser editados e deletados
- Podem ter múltiplas conversas

## ❗ Possíveis Problemas e Soluções

### Erro: "Policy violation" ou "Permission denied"

**Causa**: As políticas RLS não foram aplicadas corretamente

**Solução**:
```sql
-- Execute no SQL Editor do Supabase
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_models ENABLE ROW LEVEL SECURITY;
```

### Erro: "Relation conversations does not exist"

**Causa**: A tabela não foi criada

**Solução**: Execute o script de migração completo novamente

### Erro: "Column conversation_id does not exist"

**Causa**: A coluna não foi adicionada a chat_messages

**Solução**:
```sql
-- Execute no SQL Editor do Supabase
ALTER TABLE chat_messages ADD COLUMN conversation_id uuid REFERENCES conversations ON DELETE CASCADE;
```

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs do Supabase SQL Editor
2. Certifique-se de estar executando o script completo
3. Verifique se seu usuário tem permissões de admin no projeto
4. Consulte a documentação do Supabase: [https://supabase.com/docs](https://supabase.com/docs)

## 🎉 Conclusão

Após executar a migração com sucesso, você terá acesso a todas as novas funcionalidades:

- ✅ Sistema completo de conversas
- ✅ Rastreamento de tokens e custos
- ✅ Menu mobile responsivo
- ✅ Edição e exclusão de agentes
- ✅ Interface melhorada e mais intuitiva

**Aproveite o novo sistema!** 🚀
