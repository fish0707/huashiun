'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, type NewPhone } from '@/lib/supabase'
import Header from '@/components/Header'
import { ChevronLeft, MessageCircle, Shield, Star, Package, Share2 } from 'lucide-react'

export default function NewPhoneDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [phone, setPhone] = useState<NewPhone | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    if (!id) return
    supabase.from('new_phones').select('*').eq('id', id).single()
      .then(({ data }) => {
        setPhone(data)
        setLoading(false)
        if (data) supabase.rpc('increment_new_phone_views', { phone_id: id })
      })
  }, [id])

  const allPhotos = phone ? [phone.cover_image, ...(phone.photos || [])].filter((p): p is string => Boolean(p)) : []

  const lineUrl = phone
    ? `https://line.me/R/ti/p/@306cvtwi?text=${encodeURIComponent(
        `您好，我想詢問【${phone.name}】的相關資訊，請問目前有現貨嗎？`
      )}`
    : '#'

  if (loading) return (
    <div className="min-h-screen"><Header />
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4"><div className="h-8 bg-gray-100 rounded w-3/4" /><div className="h-6 bg-gray-100 rounded w-1/2" /></div>
        </div>
      </div>
    </div>
  )

  if (!phone) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted">
          <p className="text-5xl mb-4">😅</p>
          <p className="font-display text-2xl">找不到此商品</p>
          <Link href="/new-phones" className="mt-4 inline-block text-sm text-accent hover:underline">← 回到新機列表</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <ChevronLeft size={16} />回到新機列表
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Photos */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-3">
              {allPhotos[activePhoto]
                ? <Image src={allPhotos[activePhoto]} alt={phone.name} fill className="object-contain p-6" sizes="50vw" priority />
                : <div className="w-full h-full flex items-center justify-center text-8xl text-gray-200">📱</div>
              }
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">全新正品</div>
            </div>
            {allPhotos.length > 1 && (
              <div className="flex gap-2">
                {allPhotos.map((photo, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activePhoto === i ? 'border-accent' : 'border-transparent'}`}>
                    <Image src={photo} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="animate-fade-up">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-muted mb-1">{phone.brand} · {phone.storage} · {phone.color}</p>
                <h1 className="font-display text-3xl font-semibold text-ink leading-tight">{phone.name}</h1>
              </div>
              <button onClick={() => navigator.share?.({ title: phone.name, url: window.location.href })} className="text-muted hover:text-ink mt-1">
                <Share2 size={18} />
              </button>
            </div>

            <div className="mb-6">
              <p className="font-display text-4xl font-semibold text-ink">NT${phone.price.toLocaleString()}</p>
              {phone.original_price && phone.original_price !== phone.price && (
                <p className="text-sm text-muted line-through mt-0.5">原價 NT${phone.original_price.toLocaleString()}</p>
              )}
            </div>

            {/* Specs */}
            <div className="bg-paper rounded-xl p-4 mb-6 grid grid-cols-2 gap-3 text-sm">
              {[['品牌', phone.brand], ['容量', phone.storage], ['顏色', phone.color], ['狀態', '全新原廠']].map(([l, v]) => (
                <div key={l}><p className="text-muted text-xs mb-0.5">{l}</p><p className="font-medium">{v}</p></div>
              ))}
            </div>

            {/* Description */}
            {phone.description && (
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">商品說明</h3>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{phone.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[[Shield, '原廠保固', '一年保固'], [Star, '台灣公司貨', '正品驗證'], [Package, '全新未拆', '原廠封膜']].map(([Icon, title, sub]) => (
                <div key={String(title)} className="text-center p-3 bg-paper rounded-xl">
                  <Icon size={18} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-xs font-medium">{String(title)}</p>
                  <p className="text-xs text-muted mt-0.5">{String(sub)}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <a href={lineUrl} target="_blank" rel="noopener noreferrer"
                className="bg-[#06C755] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#05b34c] transition-colors">
                <MessageCircle size={18} />LINE 立即詢問 / 訂購
              </a>
              <Link href="/plans"
                className="border border-ink text-ink px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-ink hover:text-white transition-colors">
                搭配門號方案更優惠 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
