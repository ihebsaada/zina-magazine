import {
  type Locale,
} from '@/lib/i18n'
import type { 
  RawAuthor, 
  RawCategory, 
  RawArticle,
  Author,
  Category,
  Article,
  ArticleCard,
  ArticleBlock
} from '@/types/magazine'

// ─── Categories ───────────────────────────────────────────────────────────────

export const mockCategories: Record<string, RawCategory> = {
  culture: {
    _id: 'cat-culture',
    slug: 'culture',
    title: { en: 'Culture', ar: 'ثقافة' },
    color: 'var(--color-oree)',
  },
  architecture: {
    _id: 'cat-architecture',
    slug: 'architecture',
    title: { en: 'Architecture', ar: 'عمارة' },
    color: 'var(--color-sage)',
  },
  society: {
    _id: 'cat-society',
    slug: 'society',
    title: { en: 'Society', ar: 'مجتمع' },
    color: 'var(--color-ink-500)',
  },
  fashion: {
    _id: 'cat-fashion',
    slug: 'fashion',
    title: { en: 'Fashion', ar: 'موضة' },
    color: 'var(--color-blush)',
  },
}

// ─── Authors ──────────────────────────────────────────────────────────────────

export const mockAuthors: Record<string, RawAuthor> = {
  amina: {
    _id: 'auth-amina',
    name: { en: 'Amina Karim', ar: 'أمينة كريم' },
    role: { en: 'Editor in Chief', ar: 'رئيسة التحرير' },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    bio: {
      en: 'Amina writes about the intersection of modern culture, mindful living, and Middle Eastern heritage.',
      ar: 'تكتب أمينة عن تقاطع الثقافة الحديثة، الحياة الواعية، والتراث الشرق أوسطي.',
    },
  },
  david: {
    _id: 'auth-david',
    name: { en: 'David Chen', ar: 'ديفيد تشين' },
    role: { en: 'Architecture Critic', ar: 'ناقد معماري' },
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200&h=200',
  },
}

// ─── Articles Bruts (Sanity simulation) ───────────────────────────────────────

const rawArticles: RawArticle[] = [
  {
    _id: 'art-1',
    slug: 'art-of-slowness',
    category: mockCategories.culture,
    author: mockAuthors.amina,
    publishedAt: '2025-03-12T08:00:00Z',
    readingTime: 6,
    featured: true,
    likes: 342,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&h=900',
    coverImageAlt: 'A solitary window casting a warm geometric shadow on a plaster wall',
    title: {
      en: 'The Art of Slowness: Reclaiming Time in a Connected World',
      ar: 'فن التمهل: استعادة الوقت في عالم مفرط الاتصال',
    },
    excerpt: {
      en: 'In an era defined by endless notifications and instant gratification, a quiet revolution is emerging—one that asks us to pause, breathe, and rediscover the profound elegance of doing less.',
      ar: 'في عصر يغلب عليه الإشعارات اللانهائية والإشباع الفوري، تظهر ثورة هادئة تدعونا للتوقف، التنفس، واكتشاف الأناقة العميقة في فعل القليل.',
    },
    body: {
      en: [
        { _key: '1', _type: 'paragraph', content: 'Content goes here.' }
      ],
      ar: [
        { _key: '1', _type: 'paragraph', content: 'المحتوى هنا.' }
      ]
    }
  },
  {
    _id: 'art-2',
    slug: 'desert-architecture-minimalist-forms',
    category: mockCategories.architecture,
    author: mockAuthors.david,
    publishedAt: '2025-02-28T14:30:00Z',
    readingTime: 8,
    likes: 215,
    coverImage: 'https://plus.unsplash.com/premium_photo-1681400724751-8c32e47ef8c9?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXJjaGl0ZWN0dXJhbCUyMGRldGFpbHxlbnwwfHwwfHx8MA%3D%3D',
    coverImageAlt: 'Modern minimalist house built with mud and clay in a desert landscape',
    title: {
      en: 'Desert Architecture: Finding Beauty in Constraints',
      ar: 'عمارة الصحراء: اكتشاف الجمال في القيود البسيطة',
    },
    excerpt: {
      en: 'How modern architects are turning to ancient vernacular wisdom to create sustainable, strikingly beautiful homes in arid landscapes.',
      ar: 'كيف يتجه المعماريون المعاصرون إلى الحكمة المحلية القديمة لإنشاء منازل مستدامة وجميلة في مساحات قاحلة.',
    },
    body: { en: [], ar: [] }
  },
  {
    _id: 'art-3',
    slug: 'echoes-of-the-souk',
    category: mockCategories.society,
    author: mockAuthors.amina,
    publishedAt: '2025-01-15T09:15:00Z',
    readingTime: 5,
    likes: 189,
    coverImage: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&q=80&w=1600&h=900',
    coverImageAlt: 'A warm, blurry shot of a traditional spice market',
    title: {
      en: 'Echoes of the Souk: Preserving Shared Memories',
      ar: 'أصداء السوق: الحفاظ على الذكريات المشتركة',
    },
    excerpt: {
      en: 'Exploring the intricate social fabric of traditional marketplaces, and what we stand to lose in the era of digital commerce.',
      ar: 'استكشاف النسيج الاجتماعي المعقد للأسواق التقليدية، وما قد نخسره في عصر التجارة الرقمية.',
    },
    body: { en: [], ar: [] }
  },
  {
    _id: 'art-4',
    slug: 'sartorial-silence-quiet-luxury',
    category: mockCategories.fashion,
    author: mockAuthors.amina,
    publishedAt: '2025-03-05T10:00:00Z',
    readingTime: 4,
    likes: 512,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&h=900',
    coverImageAlt: 'Minimalist fashion detail, soft fabrics',
    title: {
      en: 'Sartorial Silence: The Rise of Quiet Luxury',
      ar: 'الصمت الأنيق: صعود الفخامة الهادئة',
    },
    excerpt: {
      en: 'Away from loud logos and fleeting trends, a movement toward understated elegance, superior craftsmanship, and timeless silhouettes is redefining the modern wardrobe.',
      ar: 'بعيداً عن الشعارات الصاخبة والاتجاهات العابرة، هناك حركة نحو الأناقة البسيطة والحرفية العالية التي تعيد تعريف خزانة الملابس الحديثة.',
    },
    body: { en: [], ar: [] }
  },
  {
    _id: 'art-5',
    slug: 'analog-revival',
    category: mockCategories.culture,
    author: mockAuthors.david,
    publishedAt: '2025-02-10T12:00:00Z',
    readingTime: 7,
    likes: 420,
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600&h=900',
    coverImageAlt: 'An old analog camera resting on a wooden table',
    title: {
      en: 'The Analog Revival: Finding Tactility in a Digital Age',
      ar: 'الصحوة التناظرية: البحث عن اللمس في العصر الرقمي',
    },
    excerpt: {
      en: 'Why an increasing number of creatives are returning to film photography, vinyl records, and physical mediums to ground their artistic expression.',
      ar: 'لماذا يعود عدد متزايد من المبدعين إلى التصوير الفوتوغرافي السينمائي، والوسائط المادية لترسيخ تعبيرهم الفني.',
    },
    body: { en: [], ar: [] }
  }
]

// ─── Helpers: Résolution par Locale ───────────────────────────────────────────

function resolveAuthor(raw: RawAuthor, locale: Locale): Author {
  return {
    _id: raw._id,
    avatar: raw.avatar,
    name: raw.name[locale],
    bio: raw.bio?.[locale],
    role: raw.role?.[locale],
  }
}

function resolveCategory(raw: RawCategory, locale: Locale): Category {
  return {
    _id: raw._id,
    slug: raw.slug,
    color: raw.color,
    title: raw.title[locale],
  }
}

function resolveArticle(raw: RawArticle, locale: Locale): Article {
  return {
    _id: raw._id,
    slug: raw.slug,
    publishedAt: raw.publishedAt,
    readingTime: raw.readingTime,
    featured: raw.featured,
    likes: raw.likes,
    comments: raw.comments,
    coverImage: raw.coverImage,
    coverImageAlt: raw.coverImageAlt,
    title: raw.title[locale],
    excerpt: raw.excerpt[locale],
    body: raw.body[locale] as ArticleBlock[],
    category: resolveCategory(raw.category, locale),
    author: resolveAuthor(raw.author, locale),
  }
}

// ─── Exported APIs ────────────────────────────────────────────────────────────

export function getMockArticles(locale: Locale): Article[] {
  return rawArticles.map(art => resolveArticle(art, locale)).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedArticle(locale: Locale): Article | null {
  const articles = getMockArticles(locale)
  return articles.find(art => art.featured) || articles[0] || null
}

export function getLatestArticles(locale: Locale, excludeId?: string, limit: number = 2): Article[] {
  const articles = getMockArticles(locale)
  return articles.filter(art => art._id !== excludeId).slice(0, limit)
}

export function getAllCategories(locale: Locale): Category[] {
  return Object.values(mockCategories).map(cat => resolveCategory(cat, locale))
}

export function getCategoryBySlug(slug: string, locale: Locale): Category | null {
  const raw = Object.values(mockCategories).find(cat => cat.slug === slug)
  if (!raw) return null
  return resolveCategory(raw, locale)
}

export function getArticlesByCategory(categoryId: string, locale: Locale): Article[] {
  return getMockArticles(locale).filter(art => art.category._id === categoryId)
}

export function getArticleBySlug(slug: string, locale: Locale): Article | null {
  const raw = rawArticles.find(art => art.slug === slug)
  if (!raw) return null
  return resolveArticle(raw, locale)
}
