alter table public.articles enable row level security;
drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles for select using (status = 'published');
