-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create agents table
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

-- Create user_settings table
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

-- Create chat_messages table
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

-- Create indexes for better performance
create index agents_user_id_idx on agents(user_id);
create index chat_messages_user_id_idx on chat_messages(user_id);
create index chat_messages_agent_id_idx on chat_messages(agent_id);
create index user_settings_user_id_idx on user_settings(user_id);
