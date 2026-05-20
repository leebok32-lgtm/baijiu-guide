# 고량주가이드

한국어로 고량주·백주·바이주 정보를 쉽게 제공하는 웹사이트.

> “고량주, 어렵지 않게 시작하세요.
> 사진으로 찾고, 향형으로 이해하고, 음식과 함께 즐기는 한국어 백주 가이드.”

## 기술 스택

- Next.js 15 (App Router)
- React 19, TypeScript
- Tailwind CSS

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

빌드/실행:

```bash
npm run build
npm run start
```

## 주요 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 — Hero, 주요 기능, 입문자 추천, 향형, 페어링, 칼럼 |
| `/guide` | 5분 입문가이드 |
| `/photo-search` | 사진으로 백주 찾기 (mock OCR) |
| `/products` | 제품찾기 (검색·필터·정렬) |
| `/products/[slug]` | 제품 상세 |
| `/aroma` · `/aroma/[slug]` | 향형사전 |
| `/pairing` | 음식 페어링 |
| `/ranking` | 추천 랭킹 |
| `/articles` · `/articles/[slug]` | 백주 이야기 |
| `/submit` | 제보하기 |

## 폴더 구조

```
app/                # Next.js App Router 페이지
  api/
    ocr/            # POST /api/ocr — 사진 OCR
    submit/         # POST /api/submit — 제보 저장 (Supabase or mock)
components/
  product/          # 제품 카드/상세 컴포넌트
  search/           # 검색·필터 컴포넌트
  photo/            # 사진 업로드/결과 컴포넌트
  layout/           # Header, Footer
  common/           # 뱃지·랭킹·페어링 등 공통 UI
data/               # mock 데이터 (products, aromaTypes, pairings, articles)
                    # ⚠ 직접 import 금지 — lib/*/ 통해서만 접근
lib/
  products/         # ★ Product repository (mock + supabase)
  aroma/            # ★ AromaType repository (mock + supabase)
  pairing/          # ★ Pairing repository (mock + supabase)
  article/          # ★ Article repository (mock + supabase)
  supabase/
    client.ts              # 환경변수 있을 때만 client 반환, 없으면 null
    database.types.ts      # snake_case Row 타입
    mappers.ts             # row → domain 타입 변환
  search/           # 순수 함수: 메모리 내 검색/필터 (클라이언트 UI 용)
  ocr/              # mockOcr, normalizeOcrText, matchProduct
  utils/            # cn, formatPrice
scripts/
  seed.ts           # mock 데이터 → Supabase upsert (npx tsx scripts/seed.ts)
supabase/
  schema.sql        # 테이블, 인덱스, RLS 정책
types/              # 공용 타입 정의
.env.example        # 환경변수 템플릿
```

## Supabase 연동

현재는 mock 데이터로 동작합니다. Supabase로 전환하려면:

1. Supabase 프로젝트 생성 후 `supabase/schema.sql` 을 SQL Editor 에서 실행
2. `.env.example` 을 `.env.local` 로 복사하고 키 입력
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
3. 시드 스크립트로 mock 데이터를 Supabase에 import
   ```bash
   npx tsx scripts/seed.ts
   ```
4. `npm run dev` — 환경변수가 감지되면 자동으로 Supabase repository 가 활성화됩니다.

모든 데이터 계층은 repository 패턴으로 추상화되어 있어, mock ↔ Supabase 전환 시
페이지·컴포넌트 코드는 그대로 유지됩니다.

| 데이터 | Mock 소스 | Repository |
|---|---|---|
| 제품 (products) | `data/products.ts` | `lib/products/` |
| 향형 (aroma_types) | `data/aromaTypes.ts` | `lib/aroma/` |
| 페어링 (pairings) | `data/pairings.ts` | `lib/pairing/` |
| 칼럼 (articles) | `data/articles.ts` | `lib/article/` |
| 제보 (submissions) | mock fallback | `POST /api/submit` |

새 페이지에서 데이터가 필요하면 반드시 `lib/*/get*.ts` 의 async 함수를 사용하세요
(`data/*.ts` 직접 import 금지).

## OCR 모듈

multi-provider 구조로 mock / Google Cloud Vision / OpenAI Vision 을 전환할 수 있습니다.
API key 보호를 위해 OCR 호출은 반드시 서버 (`POST /api/ocr`) 에서 일어나고,
클라이언트는 결과 텍스트만 받아 매칭을 수행합니다.

```
lib/ocr/
  providers/
    types.ts                  # OcrProvider 인터페이스
    mockProvider.ts           # 기본값 (무작위 라벨 반환)
    googleVisionProvider.ts   # Google Cloud Vision REST (API key)
    openaiVisionProvider.ts   # OpenAI Chat Completions + vision
    index.ts                  # OCR_PROVIDER + key 검사 → 활성 provider 선택
  normalizeOcrText.ts         # full-width 정규화, CJK n-gram, 도수/용량 추출
  matchProduct.ts             # 3-tier 점수 (substring / CJK gram / Latin 단어)
app/api/ocr/route.ts          # multipart 업로드 → provider 호출 → 텍스트 반환
```

### Provider 전환

```env
OCR_PROVIDER=mock                 # 기본, 키 불필요
OCR_PROVIDER=google               # GOOGLE_VISION_API_KEY 필요
OCR_PROVIDER=openai               # OPENAI_API_KEY 필요 (선택: OPENAI_MODEL)
```

키가 누락되어 있으면 에러 대신 **자동으로 mock fallback** 합니다. 응답의
`fallbackFrom` 필드로 UI 에서 사용자에게 안내합니다.

### 매칭 알고리즘

`matchProducts(rawText, products, 3)` 는 정규화된 OCR 텍스트와 각 제품 필드를
세 단계로 비교합니다:

| Tier | 매칭 방식 | 점수 |
|---|---|---|
| 1 | substring 완전 일치 (정규화 후) | weight + 길이 보너스 |
| 2 | CJK n-gram 부분 일치 (2~4자 슬라이딩) | weight × 0.4 + n × 4 |
| 3 | Latin 단어 단위 일치 (병음·영문) | weight × 0.4 + hits × 6 |

ABV / 용량 일치 시 추가 보너스. 최종 점수에 0~100 사이로 정규화한
`confidence` 도 함께 반환합니다.

### 프라이버시

- 업로드된 이미지는 **메모리에서만** 처리되며 디스크/DB 에 저장되지 않습니다.
- `/api/ocr` 는 8MB 한도, `image/*` content-type 검증을 거칩니다.
- 응답에는 OCR 텍스트와 provider 메타데이터만 포함되며 이미지는 반환되지 않습니다.

## 데이터 정책

- 모든 제품 데이터는 `verified: false` 로 시작합니다 (정보 검수 중).
- 가격은 “참고가”, “판매처별 상이” 등으로 표기되며 본 사이트는 주류를
  직접 판매하지 않습니다.
- 잘못된 정보는 `/submit` 페이지로 제보를 받습니다 (현재는 mock 처리).

## 한국어 검색

`lib/search/searchProducts.ts` 는 한글, 중국어, 영어, 병음, 별칭, 라벨 키워드,
검색 키워드, 추천 음식, 맛 노트 모두를 인덱스에 포함합니다.

예) `마오타이`, `모태주`, `귀주모태주`, `Moutai`, `Maotai`, `茅台`, `Kweichow Moutai`
모두 동일한 제품으로 검색됩니다.
