create table if not exists public.articles (
  id serial primary key,
  slug text unique not null,
  title text not null,
  excerpt text default '',
  date text not null,
  tags text[] default '{}',
  pillar text,
  cover text,
  content text default '',
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists articles_status_date_idx on public.articles (status, date desc);
