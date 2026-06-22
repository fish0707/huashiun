import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '華訊通訊東海店 | 台中手機專賣 · 新機現貨 · 二手機 · 門號申辦',
  description: '台中東海專業手機買賣，提供最新 iPhone、Samsung 現貨報價，嚴選二手機，三大電信門號代辦，手機維修配件。LINE：@306cvtwi',
  keywords: '台中手機, 手機買賣, 二手手機台中, iPhone二手, Samsung二手, 門號申辦台中, 手機維修台中, 華訊通訊, 華訊通訊東海店, 台中東海手機',
  authors: [{ name: '華訊通訊東海店' }],
  robots: 'index, follow',
  openGraph: {
    title: '華訊通訊東海店 | 台中手機專賣',
    description: '台中東海專業手機買賣，新機現貨報價，嚴選二手機，三大電信門號比較。LINE：@306cvtwi',
    url: 'https://huashiun.vercel.app',
    siteName: '華訊通訊東海店',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '華訊通訊東海店 | 台中手機專賣',
    description: '台中東海專業手機買賣，新機現貨報價，嚴選二手機，三大電信門號比較',
  },
  alternates: {
    canonical: 'https://huashiun.vercel.app',
  },
  verification: {
    google: '0ZxSPyoj02_ns61ajamxQrNYlSvgLRkhEmB3b938Tvg',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "華訊通訊東海店",
              "description": "台中東海專業手機買賣，新機現貨，嚴選二手機，三大電信門號代辦，手機維修配件",
              "url": "https://huashiun.vercel.app",
              "image": "https://huashiun.vercel.app/store-bg.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "台中市",
                "addressRegion": "台中",
                "addressCountry": "TW"
              },
              "openingHoursSpecification": [{
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                "opens": "11:00",
                "closes": "21:00"
              }],
              "sameAs": ["https://line.me/R/ti/p/@306cvtwi"],
              "priceRange": "NT$"
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-paper">
        {children}
      </body>
    </html>
  )
}
