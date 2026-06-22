import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '門號方案比較',
  description: '台中龍井三大電信門號方案比較。中華電信、遠傳、台哥大 4G/5G 月租費、吃到飽、流量型方案一覽。攜碼、新辦、續約最新綁約優惠，直接 LINE 詢問辦理。',
  keywords: '台中門號申辦, 台中綁約優惠, 電信方案比較台中, 5G方案台中, 4G吃到飽台中, 攜碼優惠台中, 中華電信台中, 遠傳台中, 台哥大台中, 台中海線電信',
  alternates: {
    canonical: 'https://huashiun.vercel.app/plans',
  },
  openGraph: {
    title: '門號方案比較 | 華訊通訊東海店',
    description: '台中龍井三大電信門號方案比較，4G/5G 月租費、吃到飽方案，攜碼續約最新綁約優惠。',
    url: 'https://huashiun.vercel.app/plans',
  },
}

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
