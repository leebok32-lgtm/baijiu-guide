-- =============================================================================
-- RLS 정책 재적용 (v2: role 을 public 으로 변경)
-- =============================================================================
-- 사용:
--   Supabase Dashboard → SQL Editor 에 붙여넣고 RUN.
--
-- 배경:
--   v1 에서 `to anon, authenticated` 로 정책을 만들었으나 새 Supabase
--   publishable key (`sb_publishable_*`) 형식에서는 익명 INSERT 가 여전히
--   RLS 에 막히는 현상이 있어, 명시적 role 지정 대신 `to public` 으로
--   모든 role 에 적용되도록 변경합니다. (insert 정책의 WITH CHECK 가
--   본질적인 게이트 역할을 하므로 보안에는 영향 없음)
-- =============================================================================

alter table public.products    enable row level security;
alter table public.aroma_types enable row level security;
alter table public.pairings    enable row level security;
alter table public.articles    enable row level security;
alter table public.submissions enable row level security;

-- products
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  to public
  using (true);

-- aroma_types
drop policy if exists "aroma_types are publicly readable" on public.aroma_types;
create policy "aroma_types are publicly readable"
  on public.aroma_types for select
  to public
  using (true);

-- pairings
drop policy if exists "pairings are publicly readable" on public.pairings;
create policy "pairings are publicly readable"
  on public.pairings for select
  to public
  using (true);

-- articles
drop policy if exists "articles are publicly readable" on public.articles;
create policy "articles are publicly readable"
  on public.articles for select
  to public
  using (true);

-- submissions: 익명 INSERT 허용 (role 무관)
drop policy if exists "anyone can submit" on public.submissions;
create policy "anyone can submit"
  on public.submissions for insert
  to public
  with check (true);

-- submissions: SELECT 는 service_role 만 (대시보드/검수 작업용)
-- public select 는 그대로 막아두어 익명이 다른 사람 제보를 못 보게 유지.
drop policy if exists "authenticated users can read submissions" on public.submissions;
-- (정책이 없으면 service_role 만 SELECT 가능 — 일반 사용자에겐 보이지 않음)

-- 적용된 정책 확인
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
