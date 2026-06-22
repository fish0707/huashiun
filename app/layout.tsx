import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '華訊通訊東海店 | 台中龍井手機買賣・新機報價・門號申辦',
    template: '%s | 華訊通訊東海店',
  },
  description: '台中龍井（海線）專業手機買賣。iPhone Samsung 等品牌新機現貨報價，嚴選二手機透明標價，中華・遠傳・台哥大門號攜碼續約綁約優惠，手機維修配件。LINE @306cvtwi，每日11:00–21:00。',
  keywords: '台中海線手機, 台中龍井手機, 二手手機台中, 台中二手iPhone, 台中新機推薦, 新機現貨報價, 門號申辦台中, 綁約優惠台中, 攜碼優惠台中, 手機維修台中, 華訊通訊, 華訊通訊東海店, 台中東海手機, 手機買賣台中, 5G方案台中',
  authors: [{ name: '華訊通訊東海店' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: '華訊通訊東海店 | 台中龍井手機買賣・門號申辦',
    description: '台中龍井（海線）專業手機買賣。新機現貨報價・嚴選二手機・三大電信門號比較。LINE @306cvtwi',
    url: 'https://huashiun.vercel.app',
    siteName: '華訊通訊東海店',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '華訊通訊東海店 | 台中龍井手機買賣・門號申辦',
    description: '台中龍井（海線）專業手機買賣。新機現貨報價・嚴選二手機・三大電信門號比較。',
  },
  alternates: {
    canonical: 'https://huashiun.vercel.app',
  },
  verification: {
    google: '0ZxSPyoj02_ns61ajamxQrNYlSvgLRkhEmB3b938Tvg',
  },
  other: {
    'ai-content-declaration': 'human-created',
    'content-language': 'zh-TW',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['MobilePhoneRepairShop', 'Store'],
  '@id': 'https://huashiun.vercel.app/#business',
  name: '華訊通訊東海店',
  alternateName: ['華訊通訊 東海店', 'Huashiun Telecom Donghai'],
  description: '台中龍井（海線）專業手機買賣。iPhone Samsung 等品牌新機現貨報價，嚴選二手機透明標價，中華・遠傳・台哥大門號攜碼續約，手機維修配件。',
  url: 'https://huashiun.vercel.app',
  image: 'https://huashiun.vercel.app/store-bg.jpg',
  telephone: '+886-4-2631-3552',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '遊園北路481號',
    addressLocality: '龍井區',
    addressRegion: '台中市',
    postalCode: '434',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.1538,
    longitude: 120.5462,
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '11:00',
    closes: '21:00',
  }],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '568',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://line.me/R/ti/p/@306cvtwi',
    'https://page.line.me/306cvtwi',
  ],
  priceRange: 'NT$',
  currenciesAccepted: 'TWD',
  paymentAccepted: 'Cash, LINE Pay, Credit Card',
  areaServed: {
    '@type': 'City',
    name: '台中市',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-paper">
        {children}
      </body>
    </html>
  )
}
