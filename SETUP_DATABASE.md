# 🗄️ Setup do Banco de Dados - OpenAgentBr

Este guia mostra como configurar o banco de dados PostgreSQL no Supabase para o OpenAgentBr.

## 📋 Passo a Passo

### 1. Acesse o Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha um nome para seu projeto (ex: `openagentbr`)
5. Defina uma senha forte para o banco de dados
6. Escolha uma região próxima (ex: South America - São Paulo)
7. Clique em "Create new project"

### 2. Execute o Schema SQL

1. No dashboard do projeto, vá em **SQL Editor** (ícone de banco de dados no menu lateral)
2. Clique em **New Query**
3. **Copie todo o código SQL abaixo** e cole no editor:

```sql
-- ================================================
-- SCHEMA COMPLETO - OpenAgentBr
-- ================================================
-- Copie e execute todo este código no SQL Editor do Supabase
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ================================================
-- TABELA: agents
-- Armazena os agentes de IA criados pelos usuários
-- ================================================
create table agents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  system_prompt text not null,
  model text not null,
  temperature decimal default 0.7,
  max_tokens integer default 1000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for agents
alter table agents enable row level security;

create policy "Users can view their own agents"
  on agents for select
  using (auth.uid() = user_id);

create policy "Users can create their own agents"
  on agents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own agents"
  on agents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own agents"
  on agents for delete
  using (auth.uid() = user_id);

-- ================================================
-- TABELA: user_settings
-- Armazena configurações do usuário (API Keys)
-- ================================================
create table user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  openrouter_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for user_settings
alter table user_settings enable row level security;

create policy "Users can view their own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update their own settings"
  on user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

-- ================================================
-- TABELA: chat_messages
-- Armazena o histórico de mensagens dos chats
-- ================================================
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  agent_id uuid references agents not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for chat_messages
alter table chat_messages enable row level security;

create policy "Users can view their own messages"
  on chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can create their own messages"
  on chat_messages for insert
  with check (auth.uid() = user_id);

-- ================================================
-- ÍNDICES para melhor performance
-- ================================================
create index agents_user_id_idx on agents(user_id);
create index chat_messages_user_id_idx on chat_messages(user_id);
create index chat_messages_agent_id_idx on chat_messages(agent_id);
create index user_settings_user_id_idx on user_settings(user_id);

-- ================================================
-- PRONTO! ✅
-- As tabelas foram criadas com sucesso!
-- ================================================
```

4. Clique em **Run** ou pressione `Ctrl+Enter`
5. Aguarde a mensagem de sucesso ✅

### 3. Verifique a Criação das Tabelas

1. Vá em **Table Editor** no menu lateral
2. Você deve ver 3 tabelas criadas:
   - `agents`
   - `user_settings`
   - `chat_messages`

### 4. Copie as Credenciais

1. Vá em **Settings** > **API**
2. Copie os seguintes valores:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon public key**: `eyJhbGc...` (chave longa)

### 5. Configure no Projeto

Cole as credenciais no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Estrutura das Tabelas

### Tabela: `agents`
Armazena os agentes de IA criados pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único do agente |
| `user_id` | uuid | ID do usuário (dono) |
| `name` | text | Nome do agente |
| `description` | text | Descrição do agente |
| `system_prompt` | text | Prompt de sistema |
| `model` | text | Modelo de IA (ex: gpt-4) |
| `temperature` | decimal | Criatividade (0-2) |
| `max_tokens` | integer | Limite de tokens |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Última atualização |

### Tabela: `user_settings`
Configurações do usuário, incluindo API keys.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `user_id` | uuid | ID do usuário |
| `openrouter_api_key` | text | Chave API OpenRouter |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Última atualização |

### Tabela: `chat_messages`
Histórico de mensagens dos chats.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único da mensagem |
| `user_id` | uuid | ID do usuário |
| `agent_id` | uuid | ID do agente |
| `role` | text | 'user' ou 'assistant' |
| `content` | text | Conteúdo da mensagem |
| `created_at` | timestamp | Data da mensagem |

---

## 🔒 Segurança - Row Level Security (RLS)

Todas as tabelas têm **Row Level Security** habilitada, garantindo que:

- ✅ Usuários só veem seus próprios dados
- ✅ Não é possível acessar dados de outros usuários
- ✅ Políticas de segurança aplicadas automaticamente

---

## 🛠️ Queries Úteis

### Verificar se as tabelas foram criadas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Contar agentes criados

```sql
SELECT COUNT(*) as total_agents FROM agents;
```

### Ver todos os agentes (apenas seus)

```sql
SELECT name, model, created_at 
FROM agents 
ORDER BY created_at DESC;
```

### Adicionar sua API Key do OpenRouter manualmente

```sql
-- Primeiro, pegue seu user_id
SELECT id, email FROM auth.users;

-- Depois, insira sua API key (substitua os valores)
INSERT INTO user_settings (user_id, openrouter_api_key)
VALUES ('seu-user-id-aqui', 'sk-or-v1-sua-key-aqui')
ON CONFLICT (user_id) 
DO UPDATE SET openrouter_api_key = EXCLUDED.openrouter_api_key;
```

---

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado com sucesso
- [ ] 3 tabelas criadas (agents, user_settings, chat_messages)
- [ ] Credenciais copiadas (URL e anon key)
- [ ] Arquivo `.env.local` configurado
- [ ] Aplicação rodando localmente

---

## 🆘 Problemas Comuns

### Erro: "relation already exists"
✅ **Solução**: As tabelas já foram criadas. Você pode continuar!

### Erro: "permission denied"
✅ **Solução**: Certifique-se de estar executando no SQL Editor do projeto correto.

### Não consigo ver minhas tabelas
✅ **Solução**: Vá em Table Editor e atualize a página.

---

## 📞 Precisa de Ajuda?

- 📧 Abra uma [issue no GitHub](https://github.com/IslandeSilva/OpenAgentBr/issues)
- 📚 Consulte a [documentação do Supabase](https://supabase.com/docs)

---

**Pronto! Seu banco de dados está configurado! 🎉**

Agora você pode voltar para o README principal e continuar com o próximo passo.
