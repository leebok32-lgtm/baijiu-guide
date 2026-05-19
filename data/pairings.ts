import type { Pairing } from "@/types";

export const pairings: Pairing[] = [
  {
    id: "pairing-yangkkochi",
    slug: "yangkkochi",
    foodName: "양꼬치",
    description:
      "한국에서 가장 유명한 백주 짝꿍 음식입니다. 양고기의 기름진 풍미를 백주의 곡물향과 알코올이 깔끔하게 잡아줍니다.",
    recommendedAromaTypes: ["청향형", "농향형"],
    recommendedProductIds: [
      "yantai-gulang",
      "gongfu-jiajiu",
      "erguotou",
      "jiangxiaobai",
    ],
    reason:
      "양꼬치의 기름기와 향신료(쯔란)를 백주가 깔끔하게 정리해 주어, 다음 한 입을 더 맛있게 만들어 줍니다.",
  },
  {
    id: "pairing-maratang",
    slug: "maratang",
    foodName: "마라탕",
    description:
      "얼얼한 마라의 매운맛에는 깔끔한 청향형이나 풍성한 농향형이 잘 어울립니다.",
    recommendedAromaTypes: ["청향형", "농향형"],
    recommendedProductIds: [
      "yantai-gulang",
      "fenjiu",
      "jiangxiaobai",
      "erguotou",
    ],
    reason:
      "마라의 화한 매운맛을 알코올이 한 박자 진정시키고, 곡물의 향이 입안을 가볍게 헹궈줍니다.",
  },
  {
    id: "pairing-huoguo",
    slug: "huoguo",
    foodName: "훠궈",
    description:
      "다양한 재료가 들어가는 훠궈에는 복합적인 풍미의 농향형·겸향형이 어울립니다.",
    recommendedAromaTypes: ["농향형", "겸향형"],
    recommendedProductIds: [
      "luzhou-laojiao",
      "wuliangye",
      "baiyunbian",
      "kouzijiu",
    ],
    reason:
      "기름진 국물과 다양한 식재료의 풍미를 농향형의 풍성한 단맛과 알코올이 균형 있게 잡아줍니다.",
  },
  {
    id: "pairing-tangsuyuk",
    slug: "tangsuyuk",
    foodName: "탕수육",
    description:
      "달콤새콤한 소스가 특징인 탕수육에는 깔끔한 청향형이 베스트입니다.",
    recommendedAromaTypes: ["청향형"],
    recommendedProductIds: ["yantai-gulang", "fenjiu", "jiangxiaobai"],
    reason:
      "튀김의 기름기와 새콤한 소스를 청향형의 맑은 향이 산뜻하게 마무리해 줍니다.",
  },
  {
    id: "pairing-kkanpunggi",
    slug: "kkanpunggi",
    foodName: "깐풍기",
    description:
      "매콤한 깐풍기에는 가볍고 부드러운 백주가 잘 어울립니다.",
    recommendedAromaTypes: ["청향형", "미향형"],
    recommendedProductIds: ["yantai-gulang", "sanhuajiu", "jiangxiaobai"],
    reason:
      "매운맛과 단맛이 공존하는 깐풍기에 깔끔한 청향형이 입안을 산뜻하게 정리해 줍니다.",
  },
  {
    id: "pairing-dongpa",
    slug: "dongpa",
    foodName: "동파육",
    description:
      "기름지고 진한 동파육은 묵직한 장향형이나 깊은 농향형과 환상적인 궁합을 보여줍니다.",
    recommendedAromaTypes: ["장향형", "농향형"],
    recommendedProductIds: ["maotai", "wuliangye", "langjiu", "luzhou-laojiao"],
    reason:
      "기름기와 단짠 풍미가 진한 동파육은 깊고 묵직한 향의 술과 만났을 때 ‘이 술 한 잔이 안 멈춰지는’ 마법을 보여줍니다.",
  },
  {
    id: "pairing-samgyeopsal",
    slug: "samgyeopsal",
    foodName: "삼겹살",
    description:
      "한국식 삼겹살에는 부담 없는 농향형, 장향형 보급 라인이 잘 어울립니다.",
    recommendedAromaTypes: ["농향형", "장향형"],
    recommendedProductIds: [
      "gongfu-jiajiu",
      "maotai-prince",
      "xijiu",
      "haizhilan",
    ],
    reason:
      "삼겹살의 기름기를 백주의 알코올과 향이 가볍게 씻어내며, 다음 한 점을 더 맛있게 해줍니다.",
  },
  {
    id: "pairing-hoesik",
    slug: "hoesik",
    foodName: "회식 안주",
    description:
      "다양한 안주가 함께 나오는 회식 자리에는 균형 잡힌 농향형이나 면유 스타일의 백주가 무난합니다.",
    recommendedAromaTypes: ["농향형", "기타 향형"],
    recommendedProductIds: [
      "haizhilan",
      "tianzhilan",
      "guojiao-1573",
      "shuijingfang",
    ],
    reason:
      "여러 안주와 두루 어울리는 균형감 있는 향이 자리의 분위기를 부드럽게 만들어 줍니다.",
  },
  {
    id: "pairing-gift",
    slug: "gift",
    foodName: "선물용",
    description:
      "고급스러운 케이스와 명성, 깊은 풍미를 갖춘 백주는 좋은 선물이 됩니다.",
    recommendedAromaTypes: ["장향형", "농향형", "기타 향형"],
    recommendedProductIds: [
      "maotai",
      "wuliangye",
      "guojiao-1573",
      "mengzhilan",
      "shuijingfang",
    ],
    reason:
      "받는 분이 ‘이 술 이름은 들어봤다’ 할 만한 인지도와 함께, 묵직하고 고급스러운 풍미가 자리를 빛냅니다.",
  },
];

export function getPairingBySlug(slug: string): Pairing | undefined {
  return pairings.find((p) => p.slug === slug);
}
