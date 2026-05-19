import type {
  AromaType,
  Article,
  Pairing,
  Product,
  ProductRating,
} from "@/types";
import type {
  AromaTypeRow,
  ArticleRow,
  PairingRow,
  ProductInsert,
  ProductRow,
} from "./database.types";

/**
 * Supabase 행 데이터를 어플리케이션 도메인 타입으로 변환합니다.
 *
 * DB는 snake_case + nullable, 어플리케이션은 camelCase + optional 로
 * 표현합니다. 양방향 변환을 한곳에서 관리하기 위해 이 파일을 사용합니다.
 */

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nameKo: row.name_ko,
    nameCn: row.name_cn,
    nameEn: row.name_en,
    pinyin: row.pinyin,
    category: row.category,
    aromaType: row.aroma_type,
    abv: row.abv,
    volumeMl: row.volume_ml ?? undefined,
    originCountry: row.origin_country,
    originRegion: row.origin_region,
    manufacturer: row.manufacturer ?? undefined,
    ingredients: row.ingredients,
    flavorNotes: row.flavor_notes,
    recommendedFoods: row.recommended_foods,
    beginnerLevel: row.beginner_level,
    priceLabel: row.price_label,
    regularPrice: row.regular_price ?? undefined,
    priceNote: row.price_note,
    oneLineReview: row.one_line_review,
    story: row.story,
    imageUrl: row.image_url,
    labelImageUrls: row.label_image_urls ?? undefined,
    aliases: row.aliases,
    labelKeywords: row.label_keywords,
    searchKeywords: row.search_keywords,
    rating: (row.rating ?? undefined) as ProductRating | undefined,
    sourceLinks: row.source_links ?? undefined,
    verified: row.verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function productToInsert(p: Product): ProductInsert {
  return {
    id: p.id,
    slug: p.slug,
    name_ko: p.nameKo,
    name_cn: p.nameCn,
    name_en: p.nameEn,
    pinyin: p.pinyin,
    category: p.category,
    aroma_type: p.aromaType,
    abv: p.abv,
    volume_ml: p.volumeMl ?? null,
    origin_country: p.originCountry,
    origin_region: p.originRegion,
    manufacturer: p.manufacturer ?? null,
    ingredients: p.ingredients,
    flavor_notes: p.flavorNotes,
    recommended_foods: p.recommendedFoods,
    beginner_level: p.beginnerLevel,
    price_label: p.priceLabel,
    regular_price: p.regularPrice ?? null,
    price_note: p.priceNote,
    one_line_review: p.oneLineReview,
    story: p.story,
    image_url: p.imageUrl,
    label_image_urls: p.labelImageUrls ?? null,
    aliases: p.aliases,
    label_keywords: p.labelKeywords,
    search_keywords: p.searchKeywords,
    rating: p.rating ?? null,
    source_links: p.sourceLinks ?? null,
    verified: p.verified,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export function rowToAromaType(row: AromaTypeRow): AromaType {
  return {
    id: row.id,
    slug: row.slug,
    nameKo: row.name_ko,
    nameCn: row.name_cn,
    nameEn: row.name_en ?? undefined,
    description: row.description,
    typicalFlavor: row.typical_flavor,
    beginnerLevel: row.beginner_level,
    recommendedFoods: row.recommended_foods,
    representativeProductIds: row.representative_product_ids,
  };
}

export function rowToPairing(row: PairingRow): Pairing {
  return {
    id: row.id,
    slug: row.slug,
    foodName: row.food_name,
    description: row.description,
    recommendedAromaTypes: row.recommended_aroma_types,
    recommendedProductIds: row.recommended_product_ids,
    reason: row.reason,
  };
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    tag: row.tag,
    publishedAt: row.published_at,
  };
}
