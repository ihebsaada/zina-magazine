import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'bo8zo6pg',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: 'skHUJdJSmrok0Cv7HRMURYXqEcfnN3g0TOBSx6Qy10fICeIcDii1y5FJe7ua510iKMzO859M50jAjy9NvOoJQWEAcydz59FkYLO6EheovuqX9p7njhaGcZ4KPxxmdYymb0Kn2qVDcbnx7QJjHGy2mIKbBHZFxmwZGygHlC1Yn7fO9shBeNN2',
  useCdn: false,
})

const parents = [
  {
    _id: 'category-culture',
    _type: 'category',
    name_en: 'Culture',
    name_ar: 'ثقافة',
    slug: { _type: 'slug', current: 'culture' },
  },
  {
    _id: 'category-people',
    _type: 'category',
    name_en: 'People',
    name_ar: 'مشاهير',
    slug: { _type: 'slug', current: 'people' },
  },
  {
    _id: 'category-lifestyle',
    _type: 'category',
    name_en: 'Lifestyle',
    name_ar: 'أسلوب الحياة',
    slug: { _type: 'slug', current: 'lifestyle' },
  },
]

const children = [
  {
    _id: 'category-zoom-culture',
    _type: 'category',
    name_en: 'Zoom Culture',
    name_ar: 'زووم ثقافة',
    slug: { _type: 'slug', current: 'zoom-culture' },
    parent: { _type: 'reference', _ref: 'category-culture' },
  },
  {
    _id: 'category-cinema-theatre',
    _type: 'category',
    name_en: 'Cinema & Theatre',
    name_ar: 'مسرح وسينما',
    slug: { _type: 'slug', current: 'cinema-theatre' },
    parent: { _type: 'reference', _ref: 'category-culture' },
  },
  {
    _id: 'category-arts-visuels',
    _type: 'category',
    name_en: 'Visual Arts',
    name_ar: 'فنون تشكيلية',
    slug: { _type: 'slug', current: 'arts-visuels' },
    parent: { _type: 'reference', _ref: 'category-culture' },
  },
  {
    _id: 'category-litterature',
    _type: 'category',
    name_en: 'Literature',
    name_ar: 'أدب',
    slug: { _type: 'slug', current: 'litterature' },
    parent: { _type: 'reference', _ref: 'category-culture' },
  },
  {
    _id: 'category-agenda-culture',
    _type: 'category',
    name_en: 'Culture Agenda',
    name_ar: 'أجندة الثقافة',
    slug: { _type: 'slug', current: 'agenda-culture' },
    parent: { _type: 'reference', _ref: 'category-culture' },
  },
  {
    _id: 'category-actualite-celebrite',
    _type: 'category',
    name_en: 'Celebrity News',
    name_ar: 'أخبار المشاهير',
    slug: { _type: 'slug', current: 'actualite-celebrite' },
    parent: { _type: 'reference', _ref: 'category-people' },
  },
  {
    _id: 'category-tendance',
    _type: 'category',
    name_en: 'Trending',
    name_ar: 'ترند',
    slug: { _type: 'slug', current: 'tendance' },
    parent: { _type: 'reference', _ref: 'category-lifestyle' },
  },
  {
    _id: 'category-jamali',
    _type: 'category',
    name_en: 'Beauty',
    name_ar: 'جمالي',
    slug: { _type: 'slug', current: 'jamali' },
    parent: { _type: 'reference', _ref: 'category-lifestyle' },
  },
  {
    _id: 'category-matbakhi',
    _type: 'category',
    name_en: 'Food',
    name_ar: 'مطبخي',
    slug: { _type: 'slug', current: 'matbakhi' },
    parent: { _type: 'reference', _ref: 'category-lifestyle' },
  },
]

async function main() {
  for (const doc of [...parents, ...children]) {
    await client.createOrReplace(doc)
    console.log(`Seeded: ${doc.slug.current}`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})