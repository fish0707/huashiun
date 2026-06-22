import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '新機現貨報價',
  description: '台中龍井新機現貨報價，每日更新。Apple iPhone、Samsung、ASUS、Sony、Google Pixel 等品牌新機未稅價格一覽，點擊商品可查看詳情，LINE 直接詢問訂購。',
  keywords: '台中新機報價, 台中iPhone現貨, 台中Samsung現貨, 台中手機現貨, 新機推薦台中, 手機未稅價, 台中海線新機, 台中龍井新機',
  alternates: {
    canonical: 'https://huashiun.vercel.app/new-phones',
  },
  openGraph: {
    title: '新機現貨報價 | 華訊通訊東海店',
    description: '台中龍井手機現貨報價，每日更新。多品牌新機未稅價格一覽，LINE 詢問訂購。',
    url: 'https://huashiun.vercel.app/new-phones',
  },
}

export default function NewPhonesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
