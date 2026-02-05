-- ================================================
-- MIGRATION: Add User Preferences Table
-- ================================================

-- Create user_preferences table
create table if not exists user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  theme text default 'system' check (theme in ('light', 'dark', 'system')),
  language text default 'pt-BR',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for user_preferences
alter table user_preferences enable row level security;

create policy "Users can view their own preferences"
  on user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can create their own preferences"
  on user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on user_preferences for update
  using (auth.uid() = user_id);

-- Index for performance
create index if not exists user_preferences_user_id_idx on user_preferences(user_id);

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add trigger for user_preferences
drop trigger if exists update_user_preferences_updated_at on user_preferences;
create trigger update_user_preferences_updated_at
  before update on user_preferences
  for each row
  execute function update_updated_at_column();
