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
