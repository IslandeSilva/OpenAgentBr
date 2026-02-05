-- ================================================
-- MIGRATION: Add Conversations System
-- ================================================

-- Create conversations table
create table if not exists conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  agent_id uuid references agents on delete cascade not null,
  title text not null,
  message_count integer default 0,
  total_tokens integer default 0,
  total_cost decimal default 0,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add conversation_id to chat_messages if not exists
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'chat_messages' and column_name = 'conversation_id'
  ) then
    alter table chat_messages add column conversation_id uuid references conversations on delete cascade;
  end if;
end $$;

-- Add tokens_used column to chat_messages if not exists
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'chat_messages' and column_name = 'tokens_used'
  ) then
    alter table chat_messages add column tokens_used integer default 0;
  end if;
end $$;

-- Add cost column to chat_messages if not exists
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'chat_messages' and column_name = 'cost'
  ) then
    alter table chat_messages add column cost decimal default 0;
  end if;
end $$;

-- Add message_id column to file_uploads if not exists (for file attachments)
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'file_uploads' and column_name = 'message_id'
  ) then
    alter table file_uploads add column message_id uuid references chat_messages on delete cascade;
  end if;
end $$;

-- RLS Policies for conversations
alter table conversations enable row level security;

create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Users can create their own conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
  on conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
  on conversations for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists conversations_user_id_idx on conversations(user_id);
create index if not exists conversations_agent_id_idx on conversations(agent_id);
create index if not exists conversations_last_message_at_idx on conversations(last_message_at desc);
create index if not exists chat_messages_conversation_id_idx on chat_messages(conversation_id);

-- Create available_models table for pricing information if not exists
create table if not exists available_models (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  model_id text not null,
  model_name text not null,
  pricing jsonb default '{"prompt": 0, "completion": 0}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, model_id)
);

-- RLS Policies for available_models
alter table available_models enable row level security;

create policy "Users can view their own models"
  on available_models for select
  using (auth.uid() = user_id);

create policy "Users can create their own models"
  on available_models for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own models"
  on available_models for update
  using (auth.uid() = user_id);

create policy "Users can delete their own models"
  on available_models for delete
  using (auth.uid() = user_id);

-- Index for available_models
create index if not exists available_models_user_id_idx on available_models(user_id);
create index if not exists available_models_model_id_idx on available_models(model_id);

-- Function to update conversation stats
create or replace function update_conversation_stats()
returns trigger as $$
begin
  update conversations
  set 
    message_count = (
      select count(*) 
      from chat_messages 
      where conversation_id = new.conversation_id
    ),
    total_tokens = (
      select coalesce(sum(tokens_used), 0) 
      from chat_messages 
      where conversation_id = new.conversation_id
    ),
    total_cost = (
      select coalesce(sum(cost), 0) 
      from chat_messages 
      where conversation_id = new.conversation_id
    ),
    last_message_at = new.created_at
  where id = new.conversation_id;
  
  return new;
end;
$$ language plpgsql;

-- Trigger to update conversation stats on new message
drop trigger if exists update_conversation_stats_trigger on chat_messages;
create trigger update_conversation_stats_trigger
  after insert on chat_messages
  for each row
  when (new.conversation_id is not null)
  execute function update_conversation_stats();

-- ================================================
-- Migration Complete! ✅
-- ================================================
