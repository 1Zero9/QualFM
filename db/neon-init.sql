create table if not exists public.change_requests (
  id text primary key,
  block_id text not null,
  page text not null,
  section text not null,
  current_text text not null,
  new_text text not null,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requester text not null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text not null default '',
  review_notes text not null default ''
);

create index if not exists change_requests_submitted_at_idx
  on public.change_requests (submitted_at desc);

create index if not exists change_requests_requester_idx
  on public.change_requests (requester);

create index if not exists change_requests_status_idx
  on public.change_requests (status);

create table if not exists public.work_items (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  category text not null default 'general',
  owner text not null default '',
  due_date date,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  tags text[] not null default '{}',
  client_visible boolean not null default true,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists work_items_status_idx
  on public.work_items (status);

create index if not exists work_items_priority_idx
  on public.work_items (priority);

create index if not exists work_items_due_date_idx
  on public.work_items (due_date);
