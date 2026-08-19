// Future Salon 카테고리 트리 (기획서 §9)
export const CATEGORY_GROUPS = [
  {
    group: 'Future Technology', groupKo: '미래기술',
    items: [
      { slug: 'ai', name: 'Artificial Intelligence', ko: '인공지능' },
      { slug: 'blockchain', name: 'Blockchain & Web3', ko: '블록체인·Web3' },
      { slug: 'quantum', name: 'Quantum Computing', ko: '양자컴퓨팅' },
      { slug: 'robotics', name: 'Robotics', ko: '로보틱스' },
      { slug: 'semiconductor', name: 'Semiconductor', ko: '반도체' },
      { slug: 'bigdata', name: 'Big Data', ko: '빅데이터' },
      { slug: 'cloud', name: 'Cloud', ko: '클라우드' },
      { slug: 'metaverse', name: 'Metaverse', ko: '메타버스' },
      { slug: 'xr', name: 'XR / Spatial Computing', ko: 'XR·공간컴퓨팅' },
      { slug: 'security', name: 'Cyber Security', ko: '사이버보안' },
    ],
  },
  {
    group: 'Future Industry', groupKo: '미래산업',
    items: [
      { slug: 'mobility', name: 'Mobility', ko: '모빌리티' },
      { slug: 'autonomous', name: 'Autonomous Driving', ko: '자율주행' },
      { slug: 'smartcity', name: 'Smart City', ko: '스마트시티' },
      { slug: 'manufacturing', name: 'Future Manufacturing', ko: '미래제조' },
      { slug: 'finance', name: 'Digital Finance', ko: '디지털금융' },
      { slug: 'energy', name: 'Energy', ko: '에너지' },
      { slug: 'climate', name: 'Climate Tech', ko: '기후테크' },
      { slug: 'foodtech', name: 'Food Tech', ko: '푸드테크' },
      { slug: 'agritech', name: 'Agri Tech', ko: '애그리테크' },
    ],
  },
  {
    group: 'Human & Bio', groupKo: '휴먼·바이오',
    items: [
      { slug: 'bio', name: 'Biotechnology', ko: '바이오테크' },
      { slug: 'health', name: 'Digital Health', ko: '디지털헬스' },
      { slug: 'longevity', name: 'Longevity', ko: '항노화' },
      { slug: 'gene', name: 'Gene Technology', ko: '유전자기술' },
      { slug: 'brain', name: 'Brain Science', ko: '뇌과학' },
    ],
  },
  {
    group: 'Space', groupKo: '우주',
    items: [
      { slug: 'space', name: 'Space Technology', ko: '우주기술' },
      { slug: 'satellite', name: 'Satellite', ko: '위성' },
      { slug: 'spaceeconomy', name: 'Space Economy', ko: '우주경제' },
      { slug: 'moonmars', name: 'Moon & Mars', ko: '달·화성' },
    ],
  },
  {
    group: 'Future Society', groupKo: '미래사회',
    items: [
      { slug: 'jobs', name: 'Future Jobs', ko: '미래직업' },
      { slug: 'education', name: 'Future Education', ko: '미래교육' },
      { slug: 'city', name: 'Future City', ko: '미래도시' },
      { slug: 'population', name: 'Population', ko: '인구' },
      { slug: 'aging', name: 'Aging Society', ko: '고령사회' },
      { slug: 'lifestyle', name: 'Future Lifestyle', ko: '미래라이프' },
    ],
  },
]

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.group, groupKo: g.groupKo }))
)

export function getCategory(slug) {
  return ALL_CATEGORIES.find((c) => c.slug === slug) || null
}
