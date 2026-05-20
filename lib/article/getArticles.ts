import type { Article } from "@/types";
import { getActiveArticleRepository } from "./repository";

/**
 * 모든 아티클을 반환합니다. (활성 repository — mock 또는 supabase — 를 통과)
 */
export async function getArticles(): Promise<Article[]> {
  return getActiveArticleRepository().getAll();
}

/**
 * 슬러그로 단일 아티클을 조회합니다. 찾지 못하면 `null`.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  return getActiveArticleRepository().getBySlug(slug);
}
