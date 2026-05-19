import type { AromaType } from "@/types";

export const aromaTypes: AromaType[] = [
  {
    id: "aroma-cheong",
    slug: "cheong",
    nameKo: "청향형",
    nameCn: "清香型",
    nameEn: "Light Aroma",
    description:
      "맑고 깔끔한 향이 특징인 향형입니다. 부드러운 곡물향과 은은한 단맛이 어우러져 백주가 처음인 분도 부담 없이 즐길 수 있습니다.",
    typicalFlavor: ["맑은 곡물향", "은은한 단맛", "산뜻한 끝맛", "깔끔한 피니쉬"],
    beginnerLevel: "쉬움",
    recommendedFoods: ["양꼬치", "탕수육", "깐풍기", "담백한 회"],
    representativeProductIds: ["fenjiu", "yantai-gulang", "jinmen-kaoliang"],
  },
  {
    id: "aroma-nong",
    slug: "nong",
    nameKo: "농향형",
    nameCn: "浓香型",
    nameEn: "Strong Aroma",
    description:
      "진하고 깊은 향이 특징인 가장 대중적인 향형입니다. 잘 익은 과실과 캐러멜 같은 달콤함이 입안 가득 퍼지며 풍성한 여운을 남깁니다.",
    typicalFlavor: ["과실향", "캐러멜", "풍부한 단맛", "긴 여운"],
    beginnerLevel: "보통",
    recommendedFoods: ["마라탕", "훠궈", "삼겹살", "양고기 구이"],
    representativeProductIds: [
      "wuliangye",
      "luzhou-laojiao",
      "guojiao-1573",
      "shuijingfang",
      "gongfu-jiajiu",
    ],
  },
  {
    id: "aroma-jang",
    slug: "jang",
    nameKo: "장향형",
    nameCn: "酱香型",
    nameEn: "Sauce Aroma",
    description:
      "장(醬) 같은 깊고 묵직한 향이 특징인 고급 향형입니다. 발효된 콩과 견과류, 가죽 같은 복합적인 향이 층층이 쌓여 천천히 음미해야 진가를 알 수 있습니다.",
    typicalFlavor: ["발효 콩향", "견과류", "묵직한 풍미", "스모키한 끝맛"],
    beginnerLevel: "어려움",
    recommendedFoods: ["동파육", "삼겹살", "구운 양고기", "회식 안주"],
    representativeProductIds: ["maotai", "maotai-prince", "langjiu", "xijiu"],
  },
  {
    id: "aroma-mi",
    slug: "mi",
    nameKo: "미향형",
    nameCn: "米香型",
    nameEn: "Rice Aroma",
    description:
      "쌀을 주원료로 한 부드럽고 단아한 향이 특징입니다. 곡물의 자연스러운 단맛과 깨끗한 끝맛으로 입문자에게도 친근하게 다가옵니다.",
    typicalFlavor: ["쌀 단맛", "꽃향", "부드러운 질감", "깨끗한 피니쉬"],
    beginnerLevel: "쉬움",
    recommendedFoods: ["담백한 국물 요리", "광둥식 딤섬", "찐 생선"],
    representativeProductIds: ["sanhuajiu"],
  },
  {
    id: "aroma-gyeom",
    slug: "gyeom",
    nameKo: "겸향형",
    nameCn: "兼香型",
    nameEn: "Mixed Aroma",
    description:
      "농향과 장향의 특징을 동시에 지닌 복합형 향형입니다. 진한 단맛과 묵직한 발효향이 균형 있게 어우러져 풍부한 맛의 세계를 보여줍니다.",
    typicalFlavor: ["복합 향", "균형 잡힌 단맛", "묵직한 끝맛"],
    beginnerLevel: "보통",
    recommendedFoods: ["훠궈", "마라샹궈", "양꼬치", "기름진 안주"],
    representativeProductIds: ["baiyunbian", "kouzijiu"],
  },
  {
    id: "aroma-etc",
    slug: "etc",
    nameKo: "기타 향형",
    nameCn: "其他香型",
    nameEn: "Other Aroma",
    description:
      "약초향(약향형), 봉향형, 시향형 등 지역별 개성을 살린 특수 향형들을 묶어 부르는 분류입니다. 지역 특산 곡물과 전통 비법으로 만들어 독특한 풍미를 자랑합니다.",
    typicalFlavor: ["약초향", "독특한 발효향", "지역 특색"],
    beginnerLevel: "어려움",
    recommendedFoods: ["회식 안주", "선물용"],
    representativeProductIds: [
      "zhuyeqing",
      "xifeng",
      "erguotou",
      "jiangxiaobai",
      "mengzhilan",
      "haizhilan",
      "tianzhilan",
      "guizhou-daqu",
    ],
  },
];

export function getAromaTypeBySlug(slug: string): AromaType | undefined {
  return aromaTypes.find((a) => a.slug === slug);
}

export function getAromaTypeByName(nameKo: string): AromaType | undefined {
  return aromaTypes.find((a) => a.nameKo === nameKo);
}
