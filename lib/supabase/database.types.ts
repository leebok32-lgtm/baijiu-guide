/**
 * Supabase 데이터베이스 타입 정의.
 *
 * 실제로 `supabase gen types typescript` 로 자동 생성하는 형태와 동일하게
 * 작성되어 있습니다. 스키마를 변경할 때마다 이 파일과 `mappers.ts`,
 * `supabase/schema.sql` 을 함께 갱신해 주세요.
 *
 * 모든 컬럼은 snake_case 이며, 어플리케이션 타입(`Product` 등)과의 변환은
 * `lib/supabase/mappers.ts` 에서 처리됩니다.
 */

export type BeginnerLevelDb = "쉬움" | "보통" | "어려움" | "전문가용";
export type AromaBeginnerLevelDb = "쉬움" | "보통" | "어려움";

export interface ProductRatingJson {
  aromaIntensity: number;
  alcoholImpact: number;
  sweetness: number;
  beginnerFriendly: number;
  foodPairing: number;
  valueForMoney: number;
}

export interface ProductRow {
  id: string;
  slug: string;
  name_ko: string;
  name_cn: string;
  name_en: string;
  pinyin: string;
  category: string;
  aroma_type: string;
  abv: number;
  volume_ml: number | null;
  origin_country: string;
  origin_region: string;
  manufacturer: string | null;
  ingredients: string[];
  flavor_notes: string[];
  recommended_foods: string[];
  beginner_level: BeginnerLevelDb;
  price_label: string;
  regular_price: number | null;
  price_note: string;
  one_line_review: string;
  story: string;
  image_url: string;
  label_image_urls: string[] | null;
  aliases: string[];
  label_keywords: string[];
  search_keywords: string[];
  rating: ProductRatingJson | null;
  source_links: string[] | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<ProductRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<Omit<ProductRow, "id">>;

export interface AromaTypeRow {
  id: string;
  slug: string;
  name_ko: string;
  name_cn: string;
  name_en: string | null;
  description: string;
  typical_flavor: string[];
  beginner_level: AromaBeginnerLevelDb;
  recommended_foods: string[];
  representative_product_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface PairingRow {
  id: string;
  slug: string;
  food_name: string;
  description: string;
  recommended_aroma_types: string[];
  recommended_product_ids: string[];
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface SubmissionRow {
  id: string;
  product_name: string;
  abv: string | null;
  source: string | null;
  price: string | null;
  description: string | null;
  submitter: string | null;
  contact: string | null;
  image_path: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export type SubmissionInsert = Omit<SubmissionRow, "id" | "status" | "created_at"> & {
  id?: string;
  status?: SubmissionStatus;
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
      aroma_types: {
        Row: AromaTypeRow;
        Insert: AromaTypeRow;
        Update: Partial<AromaTypeRow>;
        Relationships: [];
      };
      pairings: {
        Row: PairingRow;
        Insert: PairingRow;
        Update: Partial<PairingRow>;
        Relationships: [];
      };
      articles: {
        Row: ArticleRow;
        Insert: ArticleRow;
        Update: Partial<ArticleRow>;
        Relationships: [];
      };
      submissions: {
        Row: SubmissionRow;
        Insert: SubmissionInsert;
        Update: Partial<SubmissionRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      beginner_level: BeginnerLevelDb;
      aroma_beginner_level: AromaBeginnerLevelDb;
      submission_status: SubmissionStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
