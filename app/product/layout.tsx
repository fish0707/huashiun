import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '二手機商品詳情',
  description: '台中龍井嚴選二手手機，機況透明分級，功能保證，7天保固。歡迎透過 LINE 詢問或留下聯絡資料，我們會盡快與您聯繫。',
  keywords: '台中二手手機, 台中二手iPhone, 嚴選二手機, 二手機保固台中, 手機買賣台中',
  openGraph: {
    title: '二手機商品詳情 | 華訊通訊東海店',
    description: '台中龍井嚴選二手手機，機況透明分級，功能保證，7天保固。',
    url: 'https://huashiun.vercel.app',
  },
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
