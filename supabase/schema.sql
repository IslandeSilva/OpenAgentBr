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
  credits_total decimal,
  credits_used decimal,
  last_sync timestamp with time zone,
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

-- Create available_models table
create table available_models (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  model_id text not null,
  name text not null,
  provider text not null,
  pricing jsonb not null,
  context_length integer,
  supports_vision boolean default false,
  supports_function_calling boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for available_models
alter table available_models enable row level security;

create policy "Users can view their own models"
  on available_models for select
  using (auth.uid() = user_id);

create policy "Users can insert their own models"
  on available_models for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own models"
  on available_models for update
  using (auth.uid() = user_id);

create policy "Users can delete their own models"
  on available_models for delete
  using (auth.uid() = user_id);

-- Create file_uploads table
create table file_uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  message_id uuid references chat_messages,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  storage_path text not null,
  public_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for file_uploads
alter table file_uploads enable row level security;

create policy "Users can view their own files"
  on file_uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert their own files"
  on file_uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own files"
  on file_uploads for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index agents_user_id_idx on agents(user_id);
create index chat_messages_user_id_idx on chat_messages(user_id);
create index chat_messages_agent_id_idx on chat_messages(agent_id);
create index user_settings_user_id_idx on user_settings(user_id);
create index available_models_user_id_idx on available_models(user_id);
create unique index available_models_user_model_idx on available_models(user_id, model_id);
create index file_uploads_user_id_idx on file_uploads(user_id);
create index file_uploads_message_id_idx on file_uploads(message_id);
