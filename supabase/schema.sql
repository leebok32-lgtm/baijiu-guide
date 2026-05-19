-- =============================================================================
-- 고량주가이드 Supabase Schema
-- =============================================================================
-- 실행 방법:
--   Supabase Dashboard → SQL Editor 에 이 파일을 붙여넣고 RUN.
--   또는 supabase CLI: `supabase db push` / `psql < schema.sql`
--
-- 안전성:
--   모든 CREATE 는 IF NOT EXISTS, 모든 POLICY 는 DROP-then-CREATE 로 작성되어
--   여러 번 실행해도 안전합니다.
--
-- 변경 시:
--   이 파일을 수정했다면 다음도 함께 갱신해 주세요.
--     - lib/supabase/database.types.ts (snake_case Row 타입)
--     - lib/supabase/mappers.ts (rowToProduct / productToInsert)
--     - types/index.ts (어플리케이션 camelCase 타입)
-- =============================================================================

-- =====================================================
-- 1. products  — 백주 제품
-- =====================================================
create table if not exists public.products (
  id                   text primary key,
  slug                 text unique not null,
  name_ko              text not null,
  name_cn              text not null,
  name_en              text not null,
  pinyin               text not null,
  category             text not null,
  aroma_type           text not null,
  abv                  numeric(5, 2) not null check (abv >= 0 and abv <= 100),
  volume_ml            integer check (volume_ml > 0),
  origin_country       text not null,
  origin_region        text not null,
  manufacturer         text,
  ingredients          text[] not null default '{}',
  flavor_notes         text[] not null default '{}',
  recommended_foods    text[] not null default '{}',
  beginner_level       text   not null check (beginner_level in ('쉬움','보통','어려움','전문가용')),
  price_label          text   not null,
  regular_price        integer check (regular_price >= 0),
  price_note           text   not null default '',
  one_line_review      text   not null,
  story                text   not null default '',
  image_url            text   not null default '',
  label_image_urls     text[],
  aliases              text[] not null default '{}',
  label_keywords       text[] not null default '{}',
  search_keywords      text[] not null default '{}',
  rating               jsonb,
  source_links         text[],
  verified             boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 인덱스
create index if not exists products_slug_idx              on public.products (slug);
create index if not exists products_aroma_type_idx        on public.products (aroma_type);
create index if not exists products_beginner_level_idx    on public.products (beginner_level);
create index if not exists products_verified_idx          on public.products (verified);
create index if not exists products_regular_price_idx     on public.products (regular_price);

-- 다국어/별칭 검색용 GIN 인덱스 (text[] 컬럼 매칭 가속)
create index if not exists products_aliases_gin_idx        on public.products using gin (aliases);
create index if not exists products_label_keywords_gin_idx on public.products using gin (label_keywords);
create index if not exists products_search_keywords_gin_idx on public.products using gin (search_keywords);


-- =====================================================
-- 2. aroma_types — 향형 사전
-- =====================================================
create table if not exists public.aroma_types (
  id                        text primary key,
  slug                      text unique not null,
  name_ko                   text not null,
  name_cn                   text not null,
  name_en                   text,
  description               text not null,
  typical_flavor            text[] not null default '{}',
  beginner_level            text   not null check (beginner_level in ('쉬움','보통','어려움')),
  recommended_foods         text[] not null default '{}',
  representative_product_ids text[] not null default '{}',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists aroma_types_slug_idx on public.aroma_types (slug);


-- =====================================================
-- 3. pairings — 음식 페어링
-- =====================================================
create table if not exists public.pairings (
  id                       text primary key,
  slug                     text unique not null,
  food_name                text not null,
  description              text not null,
  recommended_aroma_types  text[] not null default '{}',
  recommended_product_ids  text[] not null default '{}',
  reason                   text not null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists pairings_slug_idx on public.pairings (slug);


-- =====================================================
-- 4. articles — 백주 이야기 (칼럼)
-- =====================================================
create table if not exists public.articles (
  id            text primary key,
  slug          text unique not null,
  title         text not null,
  excerpt       text not null,
  body          text not null,
  tag           text not null,
  published_at  date not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_slug_idx         on public.articles (slug);
create index if not exists articles_published_at_idx on public.articles (published_at desc);


-- =====================================================
-- 5. submissions — 사용자 제보
-- =====================================================
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  product_name  text not null,
  abv           text,
  source        text,
  price         text,
  description   text,
  submitter     text,
  contact       text,
  image_path    text,
  status        text not null default 'pending'
                check (status in ('pending','reviewed','accepted','rejected')),
  created_at    timestamptz not null default now()
);

create index if not exists submissions_status_idx     on public.submissions (status);
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);


-- =====================================================
-- 6. updated_at 자동 갱신 트리거
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- 트리거를 적용할 테이블 목록
do $$
declare
  t text;
begin
  foreach t in array array['products','aroma_types','pairings','articles']
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at
         before update on public.%I
         for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end $$;


-- =====================================================
-- 7. Row Level Security (RLS)
-- =====================================================
-- 공개 콘텐츠 테이블은 anon/authenticated 모두에게 SELECT 허용.
-- submissions 는 익명 INSERT 만 허용, SELECT 는 로그인 유저(검수자)만.

alter table public.products    enable row level security;
alter table public.aroma_types enable row level security;
alter table public.pairings    enable row level security;
alter table public.articles    enable row level security;
alter table public.submissions enable row level security;

-- products
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using (true);

-- aroma_types
drop policy if exists "aroma_types are publicly readable" on public.aroma_types;
create policy "aroma_types are publicly readable"
  on public.aroma_types for select
  to anon, authenticated
  using (true);

-- pairings
drop policy if exists "pairings are publicly readable" on public.pairings;
create policy "pairings are publicly readable"
  on public.pairings for select
  to anon, authenticated
  using (true);

-- articles
drop policy if exists "articles are publicly readable" on public.articles;
create policy "articles are publicly readable"
  on public.articles for select
  to anon, authenticated
  using (true);

-- submissions
drop policy if exists "anyone can submit" on public.submissions;
create policy "anyone can submit"
  on public.submissions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated users can read submissions" on public.submissions;
create policy "authenticated users can read submissions"
  on public.submissions for select
  to authenticated
  using (true);


-- =============================================================================
-- 끝.
-- 이후 mock 데이터를 실제 DB로 옮기는 시드는 별도 스크립트(예: scripts/seed.ts)로
-- 구성하여 createdAt/updatedAt 을 보존하면서 import 하는 방식을 권장합니다.
-- =============================================================================
