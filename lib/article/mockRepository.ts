import type { Article } from "@/types";
import { articles as mockArticles } from "@/data/articles";
import type { ArticleRepository } from "./repository";

/**
 * mock 데이터 (data/articles.ts) 위에 동작하는 repository 구현.
 *
 * 환경변수 미설정 시 기본으로 사용됩니다. 실제 DB 호출이 없으므로
 * 즉시 Promise를 resolve합니다.
 */
export const mockRepository: ArticleRepository = {
  async getAll(): Promise<Article[]> {
    return mockArticles;
  },

  async getBySlug(slug: string): Promise<Article | null> {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  },
};
