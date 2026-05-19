export type BeginnerLevel = "쉬움" | "보통" | "어려움" | "전문가용";
export type AromaBeginnerLevel = "쉬움" | "보통" | "어려움";

export interface ProductRating {
  aromaIntensity: number;
  alcoholImpact: number;
  sweetness: number;
  beginnerFriendly: number;
  foodPairing: number;
  valueForMoney: number;
}

export interface Product {
  id: string;
  slug: string;

  nameKo: string;
  nameCn: string;
  nameEn: string;
  pinyin: string;

  category: string;
  aromaType: string;
  abv: number;
  volumeMl?: number;

  originCountry: string;
  originRegion: string;
  manufacturer?: string;

  ingredients: string[];
  flavorNotes: string[];
  recommendedFoods: string[];

  beginnerLevel: BeginnerLevel;

  priceLabel: string;
  regularPrice?: number;
  priceNote: string;

  oneLineReview: string;
  story: string;

  imageUrl: string;
  labelImageUrls?: string[];

  aliases: string[];
  labelKeywords: string[];
  searchKeywords: string[];

  rating?: ProductRating;

  sourceLinks?: string[];
  verified: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AromaType {
  id: string;
  slug: string;
  nameKo: string;
  nameCn: string;
  nameEn?: string;
  description: string;
  typicalFlavor: string[];
  beginnerLevel: AromaBeginnerLevel;
  recommendedFoods: string[];
  representativeProductIds: string[];
}

export interface Pairing {
  id: string;
  slug: string;
  foodName: string;
  description: string;
  recommendedAromaTypes: string[];
  recommendedProductIds: string[];
  reason: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  publishedAt: string;
}

export interface ProductFilters {
  query?: string;
  aromaTypes?: string[];
  abvMin?: number;
  abvMax?: number;
  priceTiers?: string[];
  beginnerLevels?: BeginnerLevel[];
  foods?: string[];
}

export type SortKey =
  | "name"
  | "beginner"
  | "abvAsc"
  | "abvDesc"
  | "priceAsc"
  | "priceDesc";
